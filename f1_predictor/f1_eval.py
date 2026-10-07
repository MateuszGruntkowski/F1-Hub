"""Ewaluacja: normalizacja prawdopodobieństw w wyścigu, metryki, kalibracja, tabela wyników."""
from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.metrics import brier_score_loss, log_loss, roc_auc_score

from f1_features import TARGETS


# --------------------------------------------------------------------------- normalizacja
def _shift_to_sum(p: np.ndarray, k: int, iters: int = 60) -> np.ndarray:
    """Przesuwa logity o stałą b tak, aby suma prawdopodobieństw wyniosła k (bisekcja)."""
    if k >= len(p):
        return np.ones(len(p))
    p = np.clip(p, 1e-6, 1 - 1e-6)
    logit = np.log(p / (1 - p))
    lo, hi = -20.0, 20.0
    for _ in range(iters):
        mid = (lo + hi) / 2
        if (1 / (1 + np.exp(-(logit + mid)))).sum() > k:
            hi = mid
        else:
            lo = mid
    return 1 / (1 + np.exp(-(logit + (lo + hi) / 2)))


def normalize_race_probs(proba: pd.DataFrame, race_idx: pd.Series,
                         enforce_order: bool = True, rounds: int = 5) -> pd.DataFrame:
    """Spójne prawdopodobieństwa w obrębie wyścigu.

    1. Sumy po kierowcach: P(wygra)=1, P(podium)=3, P(top5)=5, P(top10)=10 (wartości zostają w [0,1]).
    2. enforce_order: dla każdego kierowcy P(wygra) <= P(podium) <= P(top5) <= P(top10). Niezależne
       klasyfikatory potrafią to złamać. Kroki 1 i 2 powtarzane są kilka razy; po ostatnim
       wymuszeniu porządku sumy mogą być odrobinę większe od K (zwykle o ułamek procenta).
    """
    cols = [c for c in TARGETS if c in proba.columns]  # kolejność TARGETS: rosnące K
    ks = [TARGETS[c] for c in cols]
    out = proba.copy()
    race_idx = pd.Series(np.asarray(race_idx), index=proba.index)
    for rows in race_idx.groupby(race_idx).groups.values():
        block = proba.loc[rows, cols].to_numpy(dtype=float).copy()
        for _ in range(rounds if enforce_order else 1):
            for j, k in enumerate(ks):
                block[:, j] = _shift_to_sum(block[:, j], k)
            if enforce_order:
                block = np.maximum.accumulate(block, axis=1)
        out.loc[rows, cols] = block
    return out


# --------------------------------------------------------------------------- kalibracja
def calibration_table(y_true, y_prob, n_bins: int = 10) -> pd.DataFrame:
    """Tabela kalibracji z przedziałami kwantylowymi (rozkład prawdopodobieństw jest mocno skośny)."""
    df = pd.DataFrame({"y": np.asarray(y_true), "p": np.asarray(y_prob)})
    df["bin"] = pd.qcut(df["p"], q=n_bins, duplicates="drop")
    tab = df.groupby("bin", observed=True).agg(
        mean_pred=("p", "mean"), frac_pos=("y", "mean"), count=("y", "size")
    )
    return tab.reset_index(drop=True)


def expected_calibration_error(y_true, y_prob, n_bins: int = 10) -> float:
    tab = calibration_table(y_true, y_prob, n_bins)
    w = tab["count"] / tab["count"].sum()
    return float((w * (tab["mean_pred"] - tab["frac_pos"]).abs()).sum())


def plot_calibration(y_true, y_prob, ax=None, label: str | None = None, n_bins: int = 10):
    """Wykres kalibracji (wymaga matplotlib)."""
    import matplotlib.pyplot as plt

    ax = ax or plt.gca()
    tab = calibration_table(y_true, y_prob, n_bins)
    ax.plot([0, 1], [0, 1], "--", color="gray", label="idealna")
    ax.plot(tab["mean_pred"], tab["frac_pos"], "o-", label=label)
    ax.set_xlabel("przewidywane prawdopodobieństwo")
    ax.set_ylabel("odsetek trafień")
    ax.legend()
    return ax


# --------------------------------------------------------------------------- metryki
def _hit_rate(race_idx: np.ndarray, p: np.ndarray, y: np.ndarray, k: int) -> float:
    """Średni odsetek faktycznych top-K, który trafił do top-K wskazanych przez model w wyścigu."""
    df = pd.DataFrame({"r": race_idx, "p": p, "y": y})
    df["rank"] = df.groupby("r")["p"].rank(ascending=False, method="first")
    hits = df[df["rank"] <= k].groupby("r")["y"].sum()
    return float((hits / k).mean())


def evaluate(y_true: pd.DataFrame, proba: pd.DataFrame, meta: pd.DataFrame,
             normalize: bool = True) -> pd.DataFrame:
    """Metryki dla każdego celu (wiersze) jednego modelu.

    log_loss, brier, ece - jakość prawdopodobieństw (im mniej tym lepiej)
    roc_auc               - rozróżnianie kierowców (im więcej tym lepiej)
    hit_rate              - np. dla y_podium: ilu z 3 faktycznych podiumowiczów jest w 3 typach modelu
                            (dla y_win to po prostu trafność typu na zwycięzcę)
    """
    race_idx = meta["race_idx"].to_numpy()
    if normalize:
        proba = normalize_race_probs(proba.reset_index(drop=True), race_idx)
    rows = {}
    for t, k in TARGETS.items():
        y = y_true[t].to_numpy()
        p = np.clip(proba[t].to_numpy(), 1e-6, 1 - 1e-6)
        rows[t] = {
            "log_loss": log_loss(y, p, labels=[0, 1]),
            "brier": brier_score_loss(y, p),
            "ece": expected_calibration_error(y, p),
            "roc_auc": roc_auc_score(y, p) if len(np.unique(y)) > 1 else np.nan,
            "hit_rate": _hit_rate(race_idx, p, y, k),
        }
    out = pd.DataFrame(rows).T
    out.index.name = "target"
    out.attrs["n_races"] = int(meta["race_idx"].nunique())
    return out


def evaluate_models(preds: dict[str, pd.DataFrame], y_true: pd.DataFrame, meta: pd.DataFrame,
                    normalize: bool = True) -> pd.DataFrame:
    """Metryki wszystkich modeli: indeks (model, target)."""
    return pd.concat(
        {name: evaluate(y_true, proba, meta, normalize) for name, proba in preds.items()},
        names=["model"],
    )


def prediction_table(proba: pd.DataFrame, meta: pd.DataFrame, race_idx: int | None = None,
                     normalize: bool = True) -> pd.DataFrame:
    """Tabela jak w aplikacji: Driver | P1 | Podium | Top 5 | Top 10 (dla jednego wyścigu)."""
    proba = proba.reset_index(drop=True)
    meta = meta.reset_index(drop=True)
    race_idx = meta["race_idx"].max() if race_idx is None else race_idx
    if normalize:
        proba = normalize_race_probs(proba, meta["race_idx"])
    m = (meta["race_idx"] == race_idx).to_numpy()
    sub = proba.loc[m].copy()
    sub.insert(0, "Driver", meta.loc[m, "driver_code"].fillna(meta.loc[m, "driver_id"]).to_numpy())
    sub = sub.sort_values("y_win", ascending=False)
    names = {"y_win": "P1", "y_podium": "Podium", "y_top5": "Top 5", "y_top10": "Top 10"}
    for col, new in names.items():
        sub[new] = (sub[col] * 100).round().astype(int).astype(str) + "%"
    return sub[["Driver", *names.values()]].reset_index(drop=True)
