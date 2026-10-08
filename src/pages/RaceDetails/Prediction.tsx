import { useEffect, useState } from "react";
import {
  formatPercent,
  getPredictions,
  type DriverPrediction,
  type PredictionsResponse,
} from "../../api/predictionsApi";
import { driverImages } from "../../constants/driverImages";
import "./Prediction.css";

interface PredictionProps {
  // Opcjonalnie: wyścig wyświetlany na stronie. Jeśli podasz,
  // komponent sprawdzi, czy predykcje dotyczą właśnie tej rundy.
  season?: string;
  round?: string;
}

// "max_verstappen" -> "Max Verstappen", "red_bull" -> "Red Bull"
const prettify = (id: string): string =>
  id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" });
};

function DriverAvatar({
  driverId,
  code,
}: {
  driverId: string;
  code: string | null;
}) {
  const src = driverImages[driverId];
  if (src) {
    return (
      <img className="pred-podium__photo" src={src} alt={prettify(driverId)} />
    );
  }
  return (
    <div className="pred-podium__photo pred-podium__photo--fallback">
      {code ?? driverId.slice(0, 3).toUpperCase()}
    </div>
  );
}

function ProbCell({
  value,
  strong = false,
}: {
  value: number;
  strong?: boolean;
}) {
  return (
    <div className={`pred-prob${strong ? " pred-prob--strong" : ""}`}>
      <span className="pred-prob__value">{formatPercent(value)}</span>
      <span className="pred-prob__bar" aria-hidden="true">
        <span
          className="pred-prob__fill"
          style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
        />
      </span>
    </div>
  );
}

function PodiumCard({
  driver,
  place,
}: {
  driver: DriverPrediction;
  place: number;
}) {
  return (
    <div className={`pred-podium pred-podium--p${place}`}>
      <span className="pred-podium__place">P{place}</span>
      <DriverAvatar driverId={driver.driverId} code={driver.driverCode} />
      <div className="pred-podium__name">{prettify(driver.driverId)}</div>
      <div className="pred-podium__team">{prettify(driver.constructorId)}</div>
      <div className="pred-podium__stats">
        <div>
          <span className="label">Win</span>
          <span className="value">{formatPercent(driver.win)}</span>
        </div>
        <div>
          <span className="label">Podium</span>
          <span className="value">{formatPercent(driver.podium)}</span>
        </div>
      </div>
    </div>
  );
}

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
    return <p className="state-message">Ładowanie predykcji…</p>;
  }

  if (error || !data) {
    return (
      <div className="results-placeholder">
        <strong>Predykcje niedostępne</strong>
        Nie udało się połączyć z serwisem predykcji.
      </div>
    );
  }

  // Predykcje dotyczą innego wyścigu niż wyświetlany
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
              {prettify(d.driverId)}
              {d.driverCode && (
                <small className="pred-code">{d.driverCode}</small>
              )}
            </span>
            <span className="team pred-hide-sm">
              {prettify(d.constructorId)}
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
        {formatDate(data.dataThrough)}; update {formatDate(data.updatedAt)}.
        This is an estimate, not a guarantee of the result.
      </p>
    </section>
  );
}
