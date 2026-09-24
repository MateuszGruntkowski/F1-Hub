import dayjs from "dayjs";
import { useState, type ChangeEvent } from "react";
import type { RaceBase } from "../../types/race";
import { getRaceDateTime } from "../../utils/dateUtils";
import { DriverStandings } from "./DriverStandings";
import { ConstructorStandings } from "./ConstructorStandings";
import { useDriverStandings } from "../../hooks/useDriverStandings";
import { useConstructorStandings } from "../../hooks/useConstructorStandings";
import "./StandingsPage.css";
import { CURRENT_SEASON, SEASONS } from "../../constants/seasons";

type StandingsPageProps = {
  races: RaceBase[];
};

export function StandingsPage({ races }: StandingsPageProps) {
  const [season, setSeason] = useState<number>(CURRENT_SEASON);
  const driverStandings = useDriverStandings(season);
  const constructorStandings = useConstructorStandings(season);

  const isCurrentSeason = season === CURRENT_SEASON;
  const now = dayjs();
  const completedRacesCount = races.filter((race) =>
    getRaceDateTime(race).isBefore(now),
  ).length;

  function handleSeasonChange(e: ChangeEvent<HTMLSelectElement>) {
    setSeason(Number(e.target.value));
  }

  return (
    <>
      <div className="standings-header">
        <div className="page standings-header__bar">
          <div>
            <h1>Championship Standings</h1>
            <div className="after-round">
              {isCurrentSeason
                ? `Season ${season} · After Round ${completedRacesCount} of ${races.length}`
                : `Season ${season} · Final standings`}
            </div>
          </div>

          <div className="season-select">
            <label htmlFor="season">Season</label>
            <div className="season-select__control">
              <select
                id="season"
                name="season"
                value={season}
                onChange={handleSeasonChange}
              >
                {SEASONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="page">
        <div className="standings-grid">
          <DriverStandings driverStandings={driverStandings} />
          <ConstructorStandings constructorStandings={constructorStandings} />
        </div>
      </div>
    </>
  );
}
