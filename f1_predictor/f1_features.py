"""Budowa cech i podział czasowy.

Zasada nadrzędna: cechy wyścigu N korzystają WYŁĄCZNIE z informacji dostępnych
przed jego startem, czyli z wyników rund < N oraz z pozycji startowej i kwalifikacji
rundy N. Wszystkie okna kroczące liczone są przez shift(1).
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

# cel -> K (ile pierwszych pozycji obejmuje)
TARGETS: dict[str, int] = {"y_win": 1, "y_podium": 3, "y_top5": 5, "y_top10": 10}

META_COLS = [
    "season", "round", "race_idx", "race_name", "circuit_id", "date",
    "driver_id", "driver_code", "constructor_id",
]

FEATURES = [
    # przed wyścigiem: start i kwalifikacje
    "grid_pos", "quali_pos", "q1_gap_pct", "grid_vs_teammate", "quali_vs_teammate",
    # forma kierowcy (tylko przeszłość)
    "form_pos_3", "form_pos_5", "form_pos_5_rank", "form_pts_5",
    "win_rate_10", "podium_rate_10", "dnf_driver_rate_10", "dnf_mech_rate_10",
    "pos_gain_10", "n_prev_races",
    # tor
    "circuit_avg_finish", "circuit_prev_starts", "circuit_overtaking",
    # siła zespołu
    "team_pts_5", "team_finish_5", "team_grid_5", "team_mech_rate_10",
    # klasyfikacje przed rundą
    "season_pts_before", "season_pts_share", "season_rank_before",
    "team_season_pts_before", "team_season_rank_before",
    # kontekst
    "round_no", "is_sprint_weekend", "reg_era",
]

# cechy zależne od kwalifikacji - dostępne dopiero w sobotę
QUALI_FEATURES = ["grid_pos", "quali_pos", "q1_gap_pct", "grid_vs_teammate", "quali_vs_teammate"]
# model "przed kwalifikacjami": forma, zespół, tor, klasyfikacje, kontekst
PRE_QUALI_FEATURES = [f for f in FEATURES if f not in QUALI_FEATURES]
FEATURE_SETS = {"pre_quali": PRE_QUALI_FEATURES, "full": FEATURES}

_DRIVER_FAULT = "Accident|Collision|Spun off|Disqualified"


# --------------------------------------------------------------------------- pomocnicze
def _past_roll(df: pd.DataFrame, keys, col: str, window: int,
               stat: str = "mean", min_periods: int = 1) -> pd.Series:
    """Statystyka krocząca z `window` POPRZEDNICH wierszy grupy (bez bieżącego)."""
    return df.groupby(keys)[col].transform(
        lambda s: getattr(s.shift(1).rolling(window, min_periods=min_periods), stat)()
    )


def _past_expanding_mean(df: pd.DataFrame, keys, col: str) -> pd.Series:
    return df.groupby(keys)[col].transform(lambda s: s.shift(1).expanding().mean())


def _vs_teammate(df: pd.DataFrame, col: str) -> pd.Series:
    """Różnica wartości kierowcy względem średniej kolegów z zespołu w tym wyścigu."""
    grp = df.groupby(["race_idx", "constructor_id"])[col]
    n = grp.transform("size")
    other_mean = (grp.transform("sum") - df[col]) / (n - 1)
    return (df[col] - other_mean).where(n > 1)


# --------------------------------------------------------------------------- etapy
def _prepare_base(raw: dict[str, pd.DataFrame]) -> pd.DataFrame:
    res, qual, spr = raw["results"], raw["qualifying"], raw["sprint"]
    keys = ["season", "round", "driver_id"]

    df = res.merge(qual[keys + ["quali_pos", "q1_s"]], on=keys, how="left")
    df = df.merge(spr[keys + ["sprint_points"]], on=keys, how="left")
    # puste ramki (np. brak sprintów) dają kolumny typu object -> jawne rzutowanie
    for col in ["quali_pos", "q1_s", "sprint_points", "points"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    sprint_weekends = (
        spr[["season", "round"]].drop_duplicates().assign(is_sprint_weekend=1.0)
    )
    df = df.merge(sprint_weekends, on=["season", "round"], how="left")
    df["is_sprint_weekend"] = df["is_sprint_weekend"].fillna(0.0)

    df = df.sort_values(["season", "round", "driver_id"], kind="stable").reset_index(drop=True)
    df["race_idx"] = df.groupby(["season", "round"]).ngroup()  # chronologiczny numer wyścigu
    df["field_size"] = df.groupby("race_idx")["driver_id"].transform("size")

    # wynik końcowy; brak klasyfikacji -> za ostatnim miejscem
    df["finish_pos"] = pd.to_numeric(df["position"], errors="coerce")
    df["finish_pos"] = df["finish_pos"].fillna(df["field_size"] + 1)
    # start z alei serwisowej (grid == 0) traktujemy jak start z końca stawki
    df["grid_pos"] = df["grid"].where(df["grid"] > 0, df["field_size"])

    status = df["status"].fillna("")
    df["finished"] = status.eq("Finished") | status.str.startswith("+")
    fault = status.str.contains(_DRIVER_FAULT, case=False, regex=True)
    df["dnf_driver"] = (~df["finished"] & fault).astype(float)
    df["dnf_mech"] = (~df["finished"] & ~fault).astype(float)  # przybliżenie: awarie i reszta
    df["pts_total"] = df["points"].fillna(0) + df["sprint_points"].fillna(0)

    for name, k in TARGETS.items():
        df[name] = (df["finish_pos"] <= k).astype(int)
    return df


def _add_pre_race(df: pd.DataFrame) -> pd.DataFrame:
    df["quali_pos"] = df["quali_pos"].fillna(df["grid_pos"])
    q1_best = df.groupby("race_idx")["q1_s"].transform("min")
    df["q1_gap_pct"] = (df["q1_s"] - q1_best) / q1_best * 100
    df["grid_vs_teammate"] = _vs_teammate(df, "grid_pos")
    df["quali_vs_teammate"] = _vs_teammate(df, "quali_pos")
    return df


def _add_driver_form(df: pd.DataFrame) -> pd.DataFrame:
    d = "driver_id"
    df["form_pos_3"] = _past_roll(df, d, "finish_pos", 3)
    df["form_pos_5"] = _past_roll(df, d, "finish_pos", 5)
    df["form_pts_5"] = _past_roll(df, d, "pts_total", 5)
    df["win_rate_10"] = _past_roll(df, d, "y_win", 10, min_periods=3)
    df["podium_rate_10"] = _past_roll(df, d, "y_podium", 10, min_periods=3)
    df["dnf_driver_rate_10"] = _past_roll(df, d, "dnf_driver", 10, min_periods=3)
    df["dnf_mech_rate_10"] = _past_roll(df, d, "dnf_mech", 10, min_periods=3)
    df["pos_gain"] = df["grid_pos"] - df["finish_pos"]
    df["pos_gain_10"] = _past_roll(df, d, "pos_gain", 10, min_periods=3)
    df["n_prev_races"] = df.groupby(d).cumcount()
    df["form_pos_5_rank"] = df.groupby("race_idx")["form_pos_5"].rank(method="average")
    return df


def _add_circuit(df: pd.DataFrame) -> pd.DataFrame:
    dc = ["driver_id", "circuit_id"]
    df["circuit_avg_finish"] = _past_expanding_mean(df, dc, "finish_pos")
    df["circuit_prev_starts"] = df.groupby(dc).cumcount()

    # jak łatwo się wyprzedza: średnia |start - meta| wśród dojeżdżających, z poprzednich edycji toru
    df["abs_gain"] = (df["grid_pos"] - df["finish_pos"]).abs().where(df["finished"])
    race = (
        df.groupby(["race_idx", "circuit_id"], as_index=False)["abs_gain"].mean()
        .sort_values("race_idx", kind="stable")
    )
    race["circuit_overtaking"] = _past_expanding_mean(race, "circuit_id", "abs_gain")
    return df.merge(race[["race_idx", "circuit_overtaking"]], on="race_idx", how="left")


def _add_team_and_standings(df: pd.DataFrame) -> pd.DataFrame:
    # --- kierowcy: klasyfikacja przed rundą
    df["season_pts_before"] = (
        df.groupby(["season", "driver_id"])["pts_total"].cumsum() - df["pts_total"]
    )
    leader = df.groupby("race_idx")["season_pts_before"].transform("max")
    df["season_pts_share"] = (df["season_pts_before"] / leader).where(leader > 0, 0.0)
    df["season_rank_before"] = df.groupby("race_idx")["season_pts_before"].rank(
        ascending=False, method="min"
    )

    # --- zespoły: jeden wiersz = zespół w wyścigu
    team = (
        df.groupby(["race_idx", "season", "round", "constructor_id"], as_index=False)
        .agg(team_pts=("pts_total", "sum"), team_finish=("finish_pos", "mean"),
             team_grid=("grid_pos", "mean"), team_mech=("dnf_mech", "mean"))
        .sort_values("race_idx", kind="stable").reset_index(drop=True)
    )
    c = "constructor_id"
    team["team_pts_5"] = _past_roll(team, c, "team_pts", 5)
    team["team_finish_5"] = _past_roll(team, c, "team_finish", 5)
    team["team_grid_5"] = _past_roll(team, c, "team_grid", 5)
    team["team_mech_rate_10"] = _past_roll(team, c, "team_mech", 10, min_periods=3)
    team["team_season_pts_before"] = (
        team.groupby(["season", c])["team_pts"].cumsum() - team["team_pts"]
    )
    team["team_season_rank_before"] = team.groupby("race_idx")["team_season_pts_before"].rank(
        ascending=False, method="min"
    )
    cols = ["race_idx", c, "team_pts_5", "team_finish_5", "team_grid_5",
            "team_mech_rate_10", "team_season_pts_before", "team_season_rank_before"]
    return df.merge(team[cols], on=["race_idx", c], how="left")


# --------------------------------------------------------------------------- API
def build_dataset(raw: dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Tabela 'kierowca x wyścig': meta + cechy + cele (y_win, y_podium, y_top5, y_top10)."""
    df = _prepare_base(raw)
    df = _add_pre_race(df)
    df = _add_driver_form(df)
    df = _add_circuit(df)
    df = _add_team_and_standings(df)
    df["round_no"] = df["round"]
    # epoka przepisów technicznych: 2014-16, 2017-21, 2022-25, od 2026 nowe przepisy
    s = df["season"]
    df["reg_era"] = np.select([s <= 2016, s <= 2021, s <= 2025], [0, 1, 2], default=3)
    return df[META_COLS + FEATURES + list(TARGETS) + ["finish_pos"]]


@dataclass
class Split:
    X: pd.DataFrame
    y: pd.DataFrame
    meta: pd.DataFrame


def split_by_season(ds: pd.DataFrame, train_start: int = 2014, train_end: int = 2023,
                    val_end: int = 2024, features: list[str] | None = None) -> dict[str, Split]:
    """Podział czasowy: train [train_start, train_end], val (train_end, val_end], test > val_end.

    Sezony przed `train_start` służą tylko jako rozgrzewka dla cech kroczących.
    `features` - lista kolumn X (domyślnie pełny zestaw FEATURES).
    """
    features = features or FEATURES
    masks = {
        "train": ds["season"].between(train_start, train_end),
        "val": (ds["season"] > train_end) & (ds["season"] <= val_end),
        "test": ds["season"] > val_end,
    }
    out = {}
    for name, m in masks.items():
        if not m.any():
            raise ValueError(f"Zbiór '{name}' jest pusty - sprawdź zakresy sezonów.")
        part = ds.loc[m]
        out[name] = Split(
            X=part[features].reset_index(drop=True),
            y=part[list(TARGETS)].reset_index(drop=True),
            meta=part[META_COLS].reset_index(drop=True),
        )
    return out


# --------------------------------------------------------------------------- przyszły wyścig
def entry_list_from_history(raw: dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Skład stawki = uczestnicy ostatniego rozegranego wyścigu.

    Zmiany w składzie (debiutant, zmiana zespołu) trzeba przekazać ręcznie przez `entries`.
    """
    res = raw["results"]
    last = res[["season", "round"]].drop_duplicates().sort_values(["season", "round"]).iloc[-1]
    m = (res["season"] == last["season"]) & (res["round"] == last["round"])
    return res.loc[m, ["driver_id", "driver_code", "constructor_id"]].reset_index(drop=True)


def build_upcoming(raw: dict[str, pd.DataFrame], race: dict,
                   entries: pd.DataFrame | None = None) -> pd.DataFrame:
    """Cechy dla jeszcze nierozegranego wyścigu.

    Dołącza do historii "puste" wiersze kierowców tego wyścigu (bez wyniku) i przepuszcza całość
    przez build_dataset. Ponieważ każda cecha wyścigu N korzysta tylko z rund < N, brak wyniku
    nie ma znaczenia. Zwraca wiersze tego wyścigu: META_COLS + FEATURES (bez celów).

    race: {"season", "round", "race_name", "circuit_id", "date", "is_sprint"} (z fetch_next_race)
    entries: opcjonalnie DataFrame z kolumnami driver_id, driver_code, constructor_id
    """
    res = raw["results"]
    if ((res["season"] == race["season"]) & (res["round"] == race["round"])).any():
        raise ValueError(
            f"Wyścig {race['season']} R{race['round']} ma już wyniki w danych - to nie jest przyszły wyścig."
        )
    entries = entry_list_from_history(raw) if entries is None else entries
    ph = entries[["driver_id", "driver_code", "constructor_id"]].copy()
    for key in ["season", "round", "race_name", "circuit_id", "date"]:
        ph[key] = race[key]
    ph["grid"], ph["position"], ph["points"], ph["status"], ph["laps"] = 0, "", 0.0, "", 0
    results = pd.concat([res, ph.reindex(columns=res.columns)], ignore_index=True)

    sprint = raw["sprint"]
    if race.get("is_sprint"):  # weekend sprintowy znamy z kalendarza, wyników jeszcze nie ma
        extra = pd.DataFrame([{
            "season": race["season"], "round": race["round"],
            "driver_id": entries["driver_id"].iloc[0], "sprint_pos": "", "sprint_points": 0.0,
        }])
        sprint = extra if sprint.empty else pd.concat(
            [sprint, extra.reindex(columns=sprint.columns)], ignore_index=True)

    ds = build_dataset({"results": results, "qualifying": raw["qualifying"], "sprint": sprint})
    out = ds[(ds["season"] == race["season"]) & (ds["round"] == race["round"])]
    return out.drop(columns=list(TARGETS) + ["finish_pos"]).reset_index(drop=True)
