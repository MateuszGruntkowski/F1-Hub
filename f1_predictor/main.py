"""Serwis FastAPI z predykcją następnego wyścigu F1.

Uruchomienie (z katalogu projektu):
    uvicorn main:app --port 8000

Konfiguracja zmiennymi środowiskowymi (w nawiasach wartości domyślne):
    MODEL_PATH       model .joblib zapisany przez run_pipeline.py   (models/pre_quali.joblib)
    RAW_PICKLE       surowe dane; serwis sam je odświeża i zapisuje  (raw.pkl)
    START_SEASON     pierwszy sezon, jeśli trzeba pobrać wszystko    (2013)
    REFRESH_MINUTES  co ile minut odświeżać dane w tle               (60)
    CORS_ORIGINS     originy frontendu, po przecinku                 (http://localhost:5173)

Jak to działa: przy starcie serwis wczytuje model i historię do pamięci. W tle co
REFRESH_MINUTES dociąga bieżący sezon z Jolpica, przelicza predykcję następnego wyścigu
i podmienia gotowy wynik. Request GET /predictions tylko zwraca ten wynik, bez zapytań
do Jolpica i bez liczenia modelu.
"""
from __future__ import annotations

import asyncio
import contextlib
import logging
import os
import pickle
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from f1_data import fetch_next_race, refresh_season
from f1_models import ModelBundle, load_bundle
from f1_predict import predict_race
from run_pipeline import load_raw

log = logging.getLogger("f1_api")

MODEL_PATH = os.environ.get("MODEL_PATH", "models/pre_quali.joblib")
RAW_PICKLE = os.environ.get("RAW_PICKLE", "raw.pkl")
START_SEASON = int(os.environ.get("START_SEASON", "2013"))
REFRESH_MINUTES = float(os.environ.get("REFRESH_MINUTES", "60"))
CORS_ORIGINS = [
    o.strip() for o in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()
]


# --------------------------------------------------------------------------- schematy odpowiedzi
class _Camel(BaseModel):
    """Pola w Pythonie snake_case, w JSON camelCase (wygodnie dla TypeScripta)."""
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class RaceInfo(_Camel):
    season: str          # stringi, tak jak sezon i runda w Jolpica
    round: str
    race_name: str
    circuit_id: str
    date: str
    is_sprint: bool


class ModelInfo(_Camel):
    name: str
    feature_set: str
    trained_through: str  # ostatni wyścig w danych treningowych, np. "2026 R16"


class DriverPrediction(_Camel):
    driver_id: str
    driver_code: str | None
    constructor_id: str
    win: float            # prawdopodobieństwa 0-1
    podium: float
    top5: float
    top10: float


class PredictionsResponse(_Camel):
    race: RaceInfo
    model: ModelInfo
    data_through: str     # ostatni wyścig w danych, z których liczono cechy
    updated_at: str
    warning: str | None   # np. gdy w danych brakuje poprzedniej rundy
    predictions: list[DriverPrediction]


# --------------------------------------------------------------------------- stan w pamięci
class _State:
    bundle: ModelBundle | None = None
    raw: dict[str, pd.DataFrame] | None = None
    snapshot: PredictionsResponse | None = None
    last_attempt: str | None = None
    last_error: str | None = None


state = _State()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _save_raw(raw: dict[str, pd.DataFrame]) -> None:
    """Zapis atomowy: w trakcie zapisu nikt nie zobaczy połowy pliku."""
    tmp = RAW_PICKLE + ".tmp"
    with open(tmp, "wb") as f:
        pickle.dump(raw, f)
    os.replace(tmp, RAW_PICKLE)


def _build_snapshot(raw: dict[str, pd.DataFrame], race: dict, bundle: ModelBundle) -> PredictionsResponse:
    probs = predict_race(bundle, raw, race)

    last = raw["results"][["season", "round"]].drop_duplicates().sort_values(["season", "round"]).iloc[-1]
    complete = (last["season"] == race["season"] and last["round"] == race["round"] - 1) or (
        race["round"] == 1 and last["season"] == race["season"] - 1
    )
    warning = None if complete else (
        f"W danych brakuje wyścigów między {last['season']} R{last['round']} "
        f"a {race['season']} R{race['round']}; cechy mogą być niepełne."
    )

    return PredictionsResponse(
        race=RaceInfo(
            season=str(race["season"]), round=str(race["round"]), race_name=race["race_name"],
            circuit_id=race["circuit_id"], date=race["date"], is_sprint=bool(race["is_sprint"]),
        ),
        model=ModelInfo(name=bundle.name, feature_set=bundle.feature_set, trained_through=bundle.last_race),
        data_through=f"{last['season']} R{last['round']}",
        updated_at=_now(),
        warning=warning,
        predictions=[
            DriverPrediction(
                driver_id=r.driver_id,
                driver_code=r.driver_code if pd.notna(r.driver_code) else None,
                constructor_id=r.constructor_id,
                win=float(r.y_win), podium=float(r.y_podium),
                top5=float(r.y_top5), top10=float(r.y_top10),
            )
            for r in probs.itertuples()
        ],
    )


def refresh() -> None:
    """Odświeża bieżący sezon i przelicza predykcję. Przy błędzie zostaje poprzedni wynik."""
    state.last_attempt = _now()
    try:
        race = fetch_next_race()
        raw = refresh_season(state.raw, race["season"])
        state.raw = raw  # podmiana całej tabeli, nie modyfikacja w miejscu
        _save_raw(raw)
        state.snapshot = _build_snapshot(raw, race, state.bundle)
        state.last_error = None
        log.info("Predykcja odświeżona: %s R%s", race["season"], race["round"])
    except Exception as exc:  # noqa: BLE001 - serwis ma przetrwać chwilową awarię API
        state.last_error = f"{type(exc).__name__}: {exc}"
        log.exception("Odświeżanie nieudane, zostaje poprzednia predykcja")


async def _refresh_loop() -> None:
    while True:
        await asyncio.to_thread(refresh)  # blokujące zapytania HTTP poza pętlą zdarzeń
        await asyncio.sleep(REFRESH_MINUTES * 60)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.basicConfig(level=logging.INFO)
    bundle = load_bundle(MODEL_PATH)
    if bundle.feature_set != "pre_quali":
        raise RuntimeError(
            f"Serwis potrzebuje modelu 'pre_quali', a {MODEL_PATH} to '{bundle.feature_set}'. "
            "Wytrenuj go: python run_pipeline.py --raw-pickle raw.pkl --save-model models/pre_quali.joblib"
        )
    state.bundle = bundle
    # z pliku RAW_PICKLE albo, jeśli go nie ma, pełne pobranie (kilka minut)
    state.raw = await asyncio.to_thread(load_raw, START_SEASON, datetime.now(timezone.utc).year, RAW_PICKLE)
    task = asyncio.create_task(_refresh_loop())  # pierwsze odświeżenie od razu, w tle
    yield
    task.cancel()
    with contextlib.suppress(asyncio.CancelledError):
        await task


# --------------------------------------------------------------------------- API
app = FastAPI(title="F1 predictions API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware, allow_origins=CORS_ORIGINS, allow_methods=["GET"], allow_headers=["*"],
)


@app.get("/predictions", response_model=PredictionsResponse)
def get_predictions() -> PredictionsResponse:
    """Prawdopodobieństwa P1 / podium / top 5 / top 10 dla następnego wyścigu."""
    if state.snapshot is None:
        raise HTTPException(
            status_code=503, detail="Predykcja jest jeszcze przygotowywana, spróbuj za chwilę.",
            headers={"Retry-After": "15"},
        )
    return state.snapshot


@app.get("/health")
def health() -> dict:
    snap = state.snapshot
    return {
        "status": "ok" if snap else "starting",
        "updatedAt": snap.updated_at if snap else None,
        "lastAttempt": state.last_attempt,
        "lastError": state.last_error,
    }
