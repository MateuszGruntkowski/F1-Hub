"""Modele sklearn: fabryka modeli, trenowanie (po jednym klasyfikatorze na cel), kalibracja."""
from __future__ import annotations

import os
import warnings
from dataclasses import dataclass

import joblib
import pandas as pd
import sklearn
from sklearn.base import clone
from sklearn.calibration import CalibratedClassifierCV
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from f1_features import TARGETS


def get_models(random_state: int = 42,
               baseline_cols: tuple[str, ...] = ("grid_pos",)) -> dict[str, Pipeline]:
    """Modele startowe do późniejszego strojenia hiperparametrów.

    baseline_cols - kolumny prostego modelu odniesienia: pozycja startowa dla zestawu "full",
    a dla "pre_quali" (bez grid_pos) np. ("season_rank_before",), czyli miejsce w klasyfikacji.
    """
    return {
        # punkt odniesienia: logistyczna regresja na kilku najprostszych cechach
        "baseline": Pipeline([
            ("select", ColumnTransformer([("base", "passthrough", list(baseline_cols))])),
            ("clf", LogisticRegression(max_iter=1000)),
        ]),
        "logreg": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(C=1.0, max_iter=2000)),
        ]),
        "random_forest": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", RandomForestClassifier(
                n_estimators=400, min_samples_leaf=10, max_features="sqrt",
                n_jobs=-1, random_state=random_state)),
        ]),
        # HistGradientBoosting sam radzi sobie z NaN (bez imputera)
        "hist_gb": HistGradientBoostingClassifier(
            learning_rate=0.05, max_iter=300, max_depth=3, min_samples_leaf=30,
            l2_regularization=1.0, random_state=random_state),
        "mlp": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", MLPClassifier(
                hidden_layer_sizes=(64, 32), alpha=1e-2, early_stopping=True,
                max_iter=500, random_state=random_state)),
        ]),
    }


def fit_all(models: dict, X_train: pd.DataFrame, y_train: pd.DataFrame) -> dict[str, dict]:
    """Zwraca {nazwa_modelu: {cel: wytrenowany_estymator}} - osobny klasyfikator dla każdego celu."""
    fitted: dict[str, dict] = {}
    for name, model in models.items():
        fitted[name] = {t: clone(model).fit(X_train, y_train[t]) for t in TARGETS}
    return fitted


def predict_all(fitted: dict[str, dict], X: pd.DataFrame) -> dict[str, pd.DataFrame]:
    """{nazwa_modelu: DataFrame z prawdopodobieństwami (kolumny = cele)}."""
    return {
        name: pd.DataFrame(
            {t: est.predict_proba(X)[:, 1] for t, est in per_target.items()}, index=X.index
        )
        for name, per_target in fitted.items()
    }


def calibrate_fitted(per_target: dict, X_val: pd.DataFrame, y_val: pd.DataFrame,
                     method: str = "sigmoid") -> dict:
    """Kalibracja już wytrenowanych estymatorów na zbiorze walidacyjnym.

    'sigmoid' jest stabilniejszy przy małej liczbie pozytywów (np. ~24 zwycięzców/sezon);
    'isotonic' warto sprawdzić dopiero przy większym zbiorze walidacyjnym.
    """
    calibrated = {}
    for t, est in per_target.items():
        try:  # sklearn >= 1.6
            from sklearn.frozen import FrozenEstimator
            cal = CalibratedClassifierCV(FrozenEstimator(est), method=method)
        except ImportError:  # starsze wersje
            cal = CalibratedClassifierCV(est, method=method, cv="prefit")
        calibrated[t] = cal.fit(X_val, y_val[t])
    return calibrated


# --------------------------------------------------------------------------- zapis modelu
@dataclass
class ModelBundle:
    """Wytrenowany model razem z tym, czego potrzeba do poprawnej predykcji."""
    name: str                # np. "hist_gb"
    feature_set: str         # "pre_quali" | "full"
    features: list[str]      # dokładna lista i kolejność kolumn z treningu
    estimators: dict         # cel -> wytrenowany estymator
    first_season: int
    last_race: str           # np. "2026 R17" - ostatni wyścig w danych treningowych
    created_at: str
    sklearn_version: str


def save_bundle(bundle: ModelBundle, path: str) -> None:
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    joblib.dump(bundle, path)


def load_bundle(path: str) -> ModelBundle:
    bundle = joblib.load(path)
    if bundle.sklearn_version != sklearn.__version__:
        warnings.warn(
            f"Model zapisano w scikit-learn {bundle.sklearn_version}, a działa {sklearn.__version__} - "
            "wyniki mogą się różnić; wytrenuj model ponownie."
        )
    return bundle
