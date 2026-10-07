"""Predykcja następnego wyścigu: odświeżenie danych -> cechy -> model -> tabela prawdopodobieństw.

Przykład:
    python predict_next.py --model models/pre_quali.joblib --raw-pickle raw.pkl --json predictions.json
"""
from __future__ import annotations

import argparse
import os
import pickle

from f1_data import fetch_next_race, refresh_season
from f1_models import load_bundle
from f1_predict import format_table, predict_race
from run_pipeline import load_raw


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True, help="plik .joblib zapisany przez run_pipeline.py")
    ap.add_argument("--raw-pickle", default=None, help="plik z surowymi danymi (przy użyciu odświeżany)")
    ap.add_argument("--start", type=int, default=2013, help="pierwszy sezon, gdy trzeba pobrać wszystko")
    ap.add_argument("--no-refresh", action="store_true", help="nie odświeżaj bieżącego sezonu")
    ap.add_argument("--json", default=None, help="zapisz wynik (prawdopodobieństwa 0-1) do pliku JSON")
    args = ap.parse_args()

    bundle = load_bundle(args.model)
    race = fetch_next_race()

    cached = bool(args.raw_pickle) and os.path.exists(args.raw_pickle)
    raw = load_raw(args.start, race["season"], args.raw_pickle)
    if cached and not args.no_refresh:
        print(f"Odświeżam dane sezonu {race['season']}...")
        raw = refresh_season(raw, race["season"])
        with open(args.raw_pickle, "wb") as f:
            pickle.dump(raw, f)

    # czy w danych są wszystkie wyścigi poprzedzające przewidywany?
    last = raw["results"][["season", "round"]].drop_duplicates().sort_values(["season", "round"]).iloc[-1]
    complete = (last["season"] == race["season"] and last["round"] == race["round"] - 1) or (
        race["round"] == 1 and last["season"] == race["season"] - 1)
    if not complete:
        print(f"UWAGA: ostatni wyścig w danych to {last['season']} R{last['round']}, "
              f"a przewidujemy {race['season']} R{race['round']} - cechy mogą być niepełne.")

    probs = predict_race(bundle, raw, race)

    print(f"\n{race['season']} R{race['round']} {race['race_name']} ({race['date']})"
          f"{' - weekend sprintowy' if race['is_sprint'] else ''}")
    print(f"Model: {bundle.name} [{bundle.feature_set}], wytrenowany na danych do {bundle.last_race}\n")
    print(format_table(probs).to_string(index=False))

    if args.json:
        probs.to_json(args.json, orient="records", indent=2)
        print(f"\nZapisano: {args.json}")


if __name__ == "__main__":
    main()
