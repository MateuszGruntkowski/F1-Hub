"""Trening, ewaluacja i zapis modelu.

Przykłady:
    # model PRZED kwalifikacjami (bez pozycji startowej) - ten używany do predykcji w tygodniu wyścigowym
    python run_pipeline.py --raw-pickle raw.pkl --save-model models/pre_quali.joblib

    # model PO kwalifikacjach (z pozycją startową i czasami Q1) - do wdrożenia później
    python run_pipeline.py --feature-set full --raw-pickle raw.pkl --save-model models/full.joblib
"""
from __future__ import annotations

import argparse
import os
import pickle
from datetime import datetime, timezone

import pandas as pd
import sklearn

from f1_data import fetch_seasons
from f1_eval import evaluate_models, prediction_table
from f1_features import FEATURE_SETS, TARGETS, build_dataset, split_by_season
from f1_models import (ModelBundle, calibrate_fitted, fit_all, get_models, predict_all,
                       save_bundle)


def load_raw(start: int, end: int, pickle_path: str | None) -> dict[str, pd.DataFrame]:
    """Pobiera dane z API; opcjonalnie zapisuje/wczytuje surowe DataFrame'y (limity API!)."""
    if pickle_path and os.path.exists(pickle_path):
        print(f"Wczytuję surowe dane z {pickle_path}")
        with open(pickle_path, "rb") as f:
            return pickle.load(f)
    print(f"Pobieram sezony {start}-{end} z Jolpica...")
    raw = fetch_seasons(range(start, end + 1))
    if pickle_path:
        with open(pickle_path, "wb") as f:
            pickle.dump(raw, f)
    return raw


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--feature-set", choices=list(FEATURE_SETS), default="pre_quali",
                    help="pre_quali = bez cech kwalifikacyjnych; full = z kwalifikacjami")
    ap.add_argument("--start", type=int, default=2013, help="pierwszy pobierany sezon (rozgrzewka cech)")
    ap.add_argument("--end", type=int, default=2026)
    ap.add_argument("--train-start", type=int, default=2014)
    ap.add_argument("--train-end", type=int, default=2023)
    ap.add_argument("--val-end", type=int, default=2024, help="test = sezony po tym roku")
    ap.add_argument("--raw-pickle", default=None, help="plik na surowe dane (unikanie ponownego pobierania)")
    ap.add_argument("--model", default=None, help="wymuś model zamiast wyboru po walidacji")
    ap.add_argument("--save-model", default=None, help="ścieżka .joblib modelu produkcyjnego")
    args = ap.parse_args()

    features = FEATURE_SETS[args.feature_set]
    baseline_cols = ("grid_pos",) if args.feature_set == "full" else ("season_rank_before",)
    models = get_models(baseline_cols=baseline_cols)

    raw = load_raw(args.start, args.end, args.raw_pickle)
    ds = build_dataset(raw)
    splits = split_by_season(ds, args.train_start, args.train_end, args.val_end, features=features)
    print(f"Zestaw cech: {args.feature_set} ({len(features)} cech)")
    for name, s in splits.items():
        print(f"{name:>5}: {len(s.X):5d} wierszy, {s.meta['race_idx'].nunique():3d} wyścigów, "
              f"sezony {s.meta['season'].min()}-{s.meta['season'].max()}")

    fitted = fit_all(models, splits["train"].X, splits["train"].y)

    # --- walidacja: tu porównujemy i stroimy modele
    val_preds = predict_all(fitted, splits["val"].X)
    val_metrics = evaluate_models(val_preds, splits["val"].y, splits["val"].meta)
    pd.set_option("display.width", 160)
    print("\n=== WALIDACJA ===")
    print(val_metrics.round(4))

    candidates = val_metrics[val_metrics.index.get_level_values("model") != "baseline"]
    best = args.model or candidates.groupby(level="model")["log_loss"].mean().idxmin()
    print(f"\nWybrany model (najniższy średni log_loss na walidacji): {best}")

    # --- test: raz, na koniec (bez strojenia pod ten zbiór)
    calibrated = calibrate_fitted(fitted[best], splits["val"].X, splits["val"].y)
    test_preds = predict_all(
        {"baseline": fitted["baseline"], best: fitted[best], f"{best}+calib": calibrated},
        splits["test"].X,
    )
    test_metrics = evaluate_models(test_preds, splits["test"].y, splits["test"].meta)
    print("\n=== TEST ===")
    print(test_metrics.round(4))

    print("\n=== Przykładowa predykcja (ostatni wyścig ze zbioru testowego) ===")
    last = splits["test"].meta.loc[splits["test"].meta["race_idx"].idxmax()]
    print(f"{last['season']} {last['race_name']}")
    print(prediction_table(test_preds[f"{best}+calib"], splits["test"].meta).head(10).to_string(index=False))

    # --- model produkcyjny: ten sam model douczony na WSZYSTKICH danych (też na najnowszych sezonach)
    if args.save_model:
        mask = ds["season"] >= args.train_start
        final = fit_all({best: models[best]}, ds.loc[mask, features], ds.loc[mask, list(TARGETS)])[best]
        last_race = ds.loc[mask, ["season", "round"]].drop_duplicates().sort_values(["season", "round"]).iloc[-1]
        bundle = ModelBundle(
            name=best, feature_set=args.feature_set, features=list(features), estimators=final,
            first_season=int(ds.loc[mask, "season"].min()),
            last_race=f"{last_race['season']} R{last_race['round']}",
            created_at=datetime.now(timezone.utc).isoformat(timespec="seconds"),
            sklearn_version=sklearn.__version__,
        )
        save_bundle(bundle, args.save_model)
        print(f"\nZapisano model produkcyjny ({best}, dane do {bundle.last_race}): {args.save_model}")


if __name__ == "__main__":
    main()
