"""Predykcja dla jeszcze nierozegranego wyścigu na podstawie zapisanego modelu."""
from __future__ import annotations

import pandas as pd

from f1_eval import normalize_race_probs, prediction_table
from f1_features import TARGETS, build_upcoming
from f1_models import ModelBundle


def predict_race(bundle: ModelBundle, raw: dict[str, pd.DataFrame], race: dict,
                 entries: pd.DataFrame | None = None, normalize: bool = True) -> pd.DataFrame:
    """Prawdopodobieństwa (0-1) dla kierowców następnego wyścigu, posortowane malejąco po P(wygra).

    Kolumny: driver_id, driver_code, constructor_id, y_win, y_podium, y_top5, y_top10.
    Przy normalize=True sumy w wyścigu wynoszą 1, 3, 5 i 10.
    """
    rows = build_upcoming(raw, race, entries)
    X = rows[bundle.features]
    proba = pd.DataFrame(
        {t: est.predict_proba(X)[:, 1] for t, est in bundle.estimators.items()}, index=rows.index
    )[list(TARGETS)]
    if normalize:
        proba = normalize_race_probs(proba, rows["race_idx"])
    out = pd.concat([rows[["driver_id", "driver_code", "constructor_id"]], proba], axis=1)
    return out.sort_values("y_win", ascending=False).reset_index(drop=True)


def format_table(probs: pd.DataFrame) -> pd.DataFrame:
    """Tabela w formacie z aplikacji: Driver | P1 | Podium | Top 5 | Top 10 (wartości w %)."""
    meta = probs[["driver_id", "driver_code"]].assign(race_idx=0)
    return prediction_table(probs[list(TARGETS)], meta, race_idx=0, normalize=False)
