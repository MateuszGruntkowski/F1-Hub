import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getRace } from "../../api/racesApi";
import type { RaceBase } from "../../types/race";
import dayjs from "dayjs";
import { getCircuitDetails } from "../../types/circuit";
import type { Result } from "../../types/results";
import { getResults } from "../../api/resultsApi";
import "./RaceDetailsPage.css";
import type { Driver } from "../../types/driver";
import { getRaceDateTime } from "../../utils/dateUtils";
import { parseLapTimeToMs } from "../../utils/lapTimeUtils";

export function RaceDetailsPage() {
  const params = useParams();
  const { season, round } = params;

  const [race, setRace] = useState<RaceBase>();
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    async function fetchRaceData() {
      try {
        const raceDetails = await getRace(Number(season), Number(round));
        setRace(raceDetails);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRaceData();
  }, [season, round]);

  useEffect(() => {
    async function fetchResults() {
      try {
        const results = await getResults(season, round);
        setResults(results);
      } catch (error) {
        console.log(error);
      }
    }
    fetchResults();
  }, [season, round]);

  if (!race) {
    return <div className="page state-message">Loading race...</div>;
  }

  const circuitDetails = getCircuitDetails(race.Circuit);

  if (!circuitDetails) {
    return <div className="page state-message">Loading circuit details...</div>;
  }

  const isCompleted = getRaceDateTime(race) < dayjs();

  const sortedResults = [...results].sort((a, b) => a.position - b.position);

  // Rank by parsed lap time, not the raw string — a plain Number(a.Time.time)
  // comparison returns NaN for "1:35.867"-style times and silently breaks.
  const bestLapResult = [...results]
    .filter((r) => parseLapTimeToMs(r.FastestLap?.Time.time) !== null)
    .sort(
      (a, b) =>
        (parseLapTimeToMs(a.FastestLap?.Time.time) ?? Infinity) -
        (parseLapTimeToMs(b.FastestLap?.Time.time) ?? Infinity),
    )[0];

  const fastestLap = bestLapResult?.FastestLap?.Time.time;
  const fastestDriver: Driver | undefined = bestLapResult?.Driver;

  return (
    <>
      <div className="breadcrumb page">
        <Link to="/races">&larr; Back to races</Link>
      </div>

      <header className="race-header">
        <div className="page race-header__bar">
          <div className="race-header__tags">
            <span className="round-chip">Round {round}</span>
            <span
              className={`status-chip ${isCompleted ? "done" : "upcoming"}`}
            >
              {isCompleted ? "Completed" : "Upcoming"}
            </span>
          </div>
          <h1>{race.raceName}</h1>
          <div className="race-header__facts">
            <div>
              <strong>{circuitDetails.circuitName}</strong>Circuit
            </div>
            <div>
              <strong>{circuitDetails.Location.country}</strong>Location
            </div>
            <div>
              <strong>{dayjs(race.date).format("ddd, D MMM YYYY")}</strong>Race
              day
            </div>
            <div>
              <strong>{race.time?.slice(0, 5) ?? "TBC"} UTC</strong>Lights out
            </div>
          </div>
        </div>
      </header>

      <section className="page content">
        <div>
          <div className="track-card">
            {circuitDetails.image ? (
              <img
                className="track-card__image track-card__image--photo"
                src={circuitDetails.image}
                alt={circuitDetails.circuitName}
              />
            ) : (
              <div className="track-card__image">
                <div>
                  <span className="placeholder-icon" aria-hidden="true">
                    🏁
                  </span>
                  Track layout unavailable
                </div>
              </div>
            )}
            <div className="track-card__caption">
              <span>{circuitDetails.circuitName}</span>
              <span>{circuitDetails.circuitLengthKm} km</span>
            </div>
          </div>

          <div className="quick-facts">
            <div className="quick-fact">
              <div className="label">LAPS</div>
              <div className="value">{circuitDetails.raceLaps}</div>
            </div>
            <div className="quick-fact">
              <div className="label">RACE DISTANCE</div>
              <div className="value">{circuitDetails.raceDistanceKm} km</div>
            </div>
            <div className="quick-fact">
              <div className="label">CIRCUIT LENGTH</div>
              <div className="value">{circuitDetails.circuitLengthKm} km</div>
            </div>
            <div className="quick-fact">
              <div className="label">LAP RECORD</div>
              <div className="value">
                {circuitDetails.lapRecord?.time ?? "—"}
                {circuitDetails.lapRecord && (
                  <small>
                    {circuitDetails.lapRecord.driver},{" "}
                    {circuitDetails.lapRecord.year}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-stack">
          <div className="info-card">
            <h3>Location</h3>
            <div className="info-row">
              <span className="k">Country</span>
              <span className="v">{circuitDetails.Location.country}</span>
            </div>
            <div className="info-row">
              <span className="k">Locality</span>
              <span className="v">{circuitDetails.Location.locality}</span>
            </div>
            <div className="info-row">
              <span className="k">Type</span>
              <span className="v">{circuitDetails.type}</span>
            </div>
            <div className="info-row">
              <span className="k">Direction</span>
              <span className="v">{circuitDetails.direction}</span>
            </div>
          </div>

          {/* Placeholder — swap these dashes for a real forecast fetch later */}
          <div className="info-card weather-card">
            <h3>Weather</h3>
            <div className="weather-metrics">
              <div className="weather-metric">
                <div className="label">AIR TEMP</div>
                <div className="value">—</div>
              </div>
              <div className="weather-metric">
                <div className="label">TRACK TEMP</div>
                <div className="value">—</div>
              </div>
              <div className="weather-metric">
                <div className="label">RAIN CHANCE</div>
                <div className="value">—</div>
              </div>
              <div className="weather-metric">
                <div className="label">WIND</div>
                <div className="value">—</div>
              </div>
            </div>
            <div className="weather-card__note">Forecast not connected yet</div>
          </div>
        </div>

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

              {sortedResults.map((result) => {
                const gained = result.grid - result.position;
                const isPodium = result.position <= 3;
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
                    <div
                      className={`fastest-lap-cell ${isBestLap ? "best" : ""}`}
                    >
                      {lapTime ?? <span className="tbd">—</span>}
                    </div>
                    <div className={`time ${result.Time ? "gap" : "retired"}`}>
                      {result.Time?.time ?? "Retired"}
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
      </section>
    </>
  );
}
