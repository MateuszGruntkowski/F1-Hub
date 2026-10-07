"""Pobieranie danych z Jolpica (API kompatybilne z Ergast) do pandas DataFrame.

Każda strona odpowiedzi jest od razu spłaszczana do wierszy, więc wyścig,
którego wyniki rozchodzą się na dwie strony paginacji, nie sprawia problemu.
Dane z kolejnych sezonów są łączone przez pd.concat.
"""
from __future__ import annotations

import time
from typing import Callable, Iterable

import numpy as np
import pandas as pd
import requests

BASE_URL = "https://api.jolpi.ca/ergast/f1"
PAGE_LIMIT = 100       # maksimum wspierane przez API
REQUEST_PAUSE = 1   # s; Jolpica ma limit burst (~4 req/s) i limit godzinowy (~500 req/h)

RESULT_COLS = [
    "season", "round", "race_name", "circuit_id", "date",
    "driver_id", "driver_code", "constructor_id",
    "grid", "position", "points", "status", "laps",
]
QUALI_COLS = ["season", "round", "driver_id", "quali_pos", "q1_s", "q2_s", "q3_s"]
SPRINT_COLS = ["season", "round", "driver_id", "sprint_pos", "sprint_points"]


# --------------------------------------------------------------------------- HTTP
def _get(session: requests.Session, url: str, params: dict, max_retries: int = 6) -> dict:
    for attempt in range(max_retries):
        resp = session.get(url, params=params, timeout=30)
        if resp.status_code == 429:  # rate limit -> czekamy i próbujemy ponownie
            time.sleep(float(resp.headers.get("Retry-After", 2 ** attempt)))
            continue
        resp.raise_for_status()
        return resp.json()["MRData"]
    raise RuntimeError(f"Przekroczono limit zapytań (429) dla {url}")


def _fetch_rows(
    session: requests.Session,
    path: str,
    list_key: str,
    flatten: Callable[[dict, dict], dict],
    columns: list[str],
) -> pd.DataFrame:
    """Pobiera wszystkie strony endpointu i zwraca DataFrame z kolumnami `columns`."""
    rows: list[dict] = []
    offset = 0
    while True:
        data = _get(session, f"{BASE_URL}/{path}.json", {"limit": PAGE_LIMIT, "offset": offset})
        for race in data["RaceTable"]["Races"]:
            for item in race.get(list_key, []):
                rows.append(flatten(race, item))
        offset += PAGE_LIMIT
        if offset >= int(data["total"]):
            break
        time.sleep(REQUEST_PAUSE)
    return pd.DataFrame(rows, columns=columns)


# --------------------------------------------------------------------------- parsowanie
def _lap_to_seconds(value: str | None) -> float:
    """'1:23.456' -> 83.456; brak czasu -> NaN."""
    if not value:
        return np.nan
    try:
        minutes, seconds = value.split(":") if ":" in value else ("0", value)
        return int(minutes) * 60 + float(seconds)
    except ValueError:
        return np.nan


def _race_meta(race: dict) -> dict:
    return {
        "season": int(race["season"]),
        "round": int(race["round"]),
        "race_name": race["raceName"],
        "circuit_id": race["Circuit"]["circuitId"],
        "date": race["date"],
    }


def _flatten_result(race: dict, r: dict) -> dict:
    return {
        **_race_meta(race),
        "driver_id": r["Driver"]["driverId"],
        "driver_code": r["Driver"].get("code"),
        "constructor_id": r["Constructor"]["constructorId"],
        "grid": int(r["grid"]),
        "position": r["position"],          # string; zamiana na liczbę w f1_features
        "points": float(r["points"]),
        "status": r["status"],
        "laps": int(r["laps"]),
    }


def _flatten_quali(race: dict, r: dict) -> dict:
    return {
        "season": int(race["season"]),
        "round": int(race["round"]),
        "driver_id": r["Driver"]["driverId"],
        "quali_pos": int(r["position"]),
        "q1_s": _lap_to_seconds(r.get("Q1")),
        "q2_s": _lap_to_seconds(r.get("Q2")),
        "q3_s": _lap_to_seconds(r.get("Q3")),
    }


def _flatten_sprint(race: dict, r: dict) -> dict:
    return {
        "season": int(race["season"]),
        "round": int(race["round"]),
        "driver_id": r["Driver"]["driverId"],
        "sprint_pos": r["position"],
        "sprint_points": float(r["points"]),
    }


# --------------------------------------------------------------------------- publiczne API
def fetch_season(session: requests.Session, season: int) -> dict[str, pd.DataFrame]:
    """Wyniki wyścigów, kwalifikacje i sprinty jednego sezonu."""
    out = {
        "results": _fetch_rows(session, f"{season}/results", "Results", _flatten_result, RESULT_COLS),
        "qualifying": _fetch_rows(
            session, f"{season}/qualifying", "QualifyingResults", _flatten_quali, QUALI_COLS
        ),
    }
    time.sleep(REQUEST_PAUSE)
    # sprinty istnieją od 2021; dla wcześniejszych sezonów endpoint zwraca pustą listę
    out["sprint"] = _fetch_rows(session, f"{season}/sprint", "SprintResults", _flatten_sprint, SPRINT_COLS)
    return out


_COLUMNS = {"results": RESULT_COLS, "qualifying": QUALI_COLS, "sprint": SPRINT_COLS}


def _concat(dfs: list[pd.DataFrame], columns: list[str]) -> pd.DataFrame:
    """Skleja niepuste ramki (puste ramki psują typy kolumn przy konkatenacji)."""
    non_empty = [d for d in dfs if not d.empty]
    if not non_empty:
        return pd.DataFrame(columns=columns)
    return pd.concat(non_empty, ignore_index=True)


def fetch_next_race(session: requests.Session | None = None) -> dict:
    """Następny wyścig z kalendarza: sezon, runda, nazwa, tor, data, czy weekend sprintowy."""
    own = session is None
    session = session or requests.Session()
    try:
        data = _get(session, f"{BASE_URL}/current/next.json", {})
    finally:
        if own:
            session.close()
    races = data["RaceTable"]["Races"]
    if not races:
        raise RuntimeError("Brak następnej rundy w kalendarzu (koniec sezonu?)")
    race = races[0]
    return {**_race_meta(race), "is_sprint": "Sprint" in race}


def refresh_season(raw: dict[str, pd.DataFrame], season: int) -> dict[str, pd.DataFrame]:
    """Podmienia dane jednego sezonu na świeże (kilka zapytań) i zwraca nowy komplet DataFrame'ów."""
    with requests.Session() as session:
        session.headers["User-Agent"] = "f1-predictor/0.1"
        fresh = fetch_season(session, season)
    return {
        key: _concat([raw[key][raw[key]["season"] != season], fresh[key]], _COLUMNS[key])
        for key in raw
    }


def fetch_seasons(seasons: Iterable[int], verbose: bool = True) -> dict[str, pd.DataFrame]:
    """Pobiera kolejne sezony i skleja je w jeden DataFrame na typ danych."""
    parts: dict[str, list[pd.DataFrame]] = {"results": [], "qualifying": [], "sprint": []}
    with requests.Session() as session:
        session.headers["User-Agent"] = "f1-predictor/0.1"
        for season in seasons:
            data = fetch_season(session, season)
            for key, df in data.items():
                parts[key].append(df)
            if verbose:
                print(
                    f"  {season}: {len(data['results'])} wyników, "
                    f"{len(data['qualifying'])} kwalifikacji, {len(data['sprint'])} sprintów"
                )
            time.sleep(REQUEST_PAUSE)
    return {key: _concat(dfs, _COLUMNS[key]) for key, dfs in parts.items()}
