import dayjs from "dayjs";
import { parseLapTimeToMs } from "../../utils/lapTimeUtils";
import type { Driver } from "../../types/driver";
import type { RaceBase } from "../../types/race";
import type { Result } from "../../types/results";

type ResultsProps = {
  isCompleted: boolean;
  race: RaceBase;
  results: Result[];
};

export function Results({ race, isCompleted, results }: ResultsProps) {
  const sortedResults = [...results].sort(
    (a, b) => Number(a.position) - Number(b.position),
  );
  const bestLapResult = [...results]
    .filter((r) => parseLapTimeToMs(r.FastestLap?.Time.time) !== null)
    .sort(
      (a, b) =>
        (parseLapTimeToMs(a.FastestLap?.Time.time) ?? Infinity) -
        (parseLapTimeToMs(b.FastestLap?.Time.time) ?? Infinity),
    )[0];

  const fastestLap = bestLapResult?.FastestLap?.Time.time;
  const fastestDriver: Driver | undefined = bestLapResult?.Driver;

  const leaderLaps = Number(results[0].laps);
  const formatGap = (r: Result) => {
    if (r.status === "Lapped") {
      const behind = leaderLaps - Number(r.laps);
      return `+${behind} ${behind === 1 ? "lap" : "laps"}`;
    }
    return r.Time?.time ?? r.status;
  };

  return (
    <div className="results-section">
      <div className="section-head">
        <h2>Race Results</h2>
        {isCompleted && fastestLap && (
          <div className="fastest-lap">
            Fastest lap <strong>{fastestLap}</strong> —{" "}
            {fastestDriver?.givenName} {fastestDriver?.familyName}
          </div>
        )}
      </div>

      {sortedResults.length > 0 ? (
        <div className="results-table">
          <div className="results-legend">
            <span>POS</span>
            <span>DRIVER</span>
            <span>TEAM</span>
            <span>GRID</span>
            <span>FASTEST LAP</span>
            <span>TIME</span>
            <span>PTS</span>
          </div>

          {sortedResults.map((result, index) => {
            const gained = Number(result.grid) - Number(result.position);
            const isPodium = Number(result.position) <= 3;
            const lapTime = result.FastestLap?.Time.time;
            const isBestLap =
              !!lapTime && lapTime === bestLapResult?.FastestLap?.Time.time;

            return (
              <div
                key={result.Driver.driverId}
                className={`result-row ${isPodium ? "podium" : ""}`}
              >
                <div className="pos">
                  {String(result.position).padStart(2, "0")}
                </div>
                <div className="driver">
                  {result.Driver.givenName} {result.Driver.familyName}
                </div>
                <div className="team">{result.Constructor.name}</div>
                <div className="grid">
                  {`P${result.grid}`}
                  {gained !== 0 && (
                    <span
                      className={`grid-delta ${gained > 0 ? "up" : "down"}`}
                    >
                      {gained > 0 ? "▲" : "▼"}
                      {Math.abs(gained)}
                    </span>
                  )}
                </div>
                <div className={`fastest-lap-cell ${isBestLap ? "best" : ""}`}>
                  {lapTime ?? <span className="tbd">—</span>}
                </div>
                <div
                  className={`time ${result.Time?.time ? "gap" : "retired"}`}
                >
                  {formatGap(result)}
                </div>
                <div className="pts">{result.points}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="results-placeholder">
          <strong>Results not available yet</strong>
          Check back after the race finishes on{" "}
          {dayjs(race.date).format("ddd, D MMM")}.
        </div>
      )}
    </div>
  );
}
