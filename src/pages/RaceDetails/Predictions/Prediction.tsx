import { useEffect, useState } from "react";
import { getPredictions } from "../../../api/predictions/predictionsApi";
import "./Prediction.css";
import { formatDateTime } from "../../../utils/dateUtils";
import { snakeToTitleCase } from "../../../utils/formatUtils";
import type { PredictionsResponse } from "../../../types/predictions";
import PodiumCard from "./PodiumCard";
import ProbCell from "./ProbCell";

type PredictionProps = {
  season?: string;
  round?: string;
};

export default function Prediction({ season, round }: PredictionProps) {
  const [data, setData] = useState<PredictionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    getPredictions()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="state-message">Loading predictions…</p>;
  }

  if (error || !data) {
    return (
      <div className="results-placeholder">
        <strong>Predictions unavailable</strong>
        Failed to connect to the prediction service.
      </div>
    );
  }

  const mismatch =
    (round !== undefined && data.race.round !== round) ||
    (season !== undefined && data.race.season !== season);
  if (mismatch) {
    return (
      <div className="results-placeholder">
        <strong>No prediction for this race</strong>
        The available predictions concern: {data.race.raceName} (round{" "}
        {data.race.round}).
      </div>
    );
  }

  const podium = data.predictions.slice(0, 3);

  return (
    <section className="pred">
      <div className="section-head">
        <h2>Results Prediction</h2>
        <span className="fastest-lap">
          Model: <strong>{data.model.name}</strong>
          {data.race.isSprint ? " · sprint weekend" : ""}
        </span>
      </div>

      {data.warning && <div className="pred-warning">{data.warning}</div>}

      <div className="pred-podiums">
        {podium.map((d, i) => (
          <PodiumCard key={d.driverId} driver={d} place={i + 1} />
        ))}
      </div>

      <div className="results-table">
        <div className="pred-legend">
          <span>#</span>
          <span>Driver</span>
          <span className="pred-hide-sm">Team</span>
          <span>Win</span>
          <span>Podium</span>
          <span>Top 5</span>
          <span>Top 10</span>
        </div>

        {data.predictions.map((d, i) => (
          <div key={d.driverId} className={`pred-row${i < 3 ? " podium" : ""}`}>
            <span className="pos">{i + 1}</span>
            <span className="driver">
              {snakeToTitleCase(d.driverId)}
              {d.driverCode && (
                <small className="pred-code">{d.driverCode}</small>
              )}
            </span>
            <span className="team pred-hide-sm">
              {snakeToTitleCase(d.constructorId)}
            </span>
            <ProbCell value={d.win} strong />
            <ProbCell value={d.podium} />
            <ProbCell value={d.top5} />
            <ProbCell value={d.top10} />
          </div>
        ))}
      </div>

      <p className="weather-card__note pred-note">
        Model-generated probabilities based on data for{" "}
        {formatDateTime(data.dataThrough)}; update{" "}
        {formatDateTime(data.updatedAt)}. This is an estimate, not a guarantee
        of the result.
      </p>
    </section>
  );
}
