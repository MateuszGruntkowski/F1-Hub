import dayjs from "dayjs";
import type { RaceBase } from "../../types/race";
import { getRaceDateTime } from "../../utils/dateUtils";
import { DriverStandings } from "./DriverStandings";
import { ConstructorStandings } from "./ConstructorStandings";
import "./StandingsPage.css";

type StandingsPageProps = {
  races: RaceBase[];
};

export function StandingsPage({ races }: StandingsPageProps) {
  const now = dayjs();
  const completedRacesCount = races.filter((race) =>
    getRaceDateTime(race).isBefore(now),
  ).length;

  return (
    <>
      <div className="standings-header">
        <div className="page standings-header__bar">
          <h1>Championship Standings</h1>
          <div className="after-round">
            Season 2026 &#183; After Round {completedRacesCount} of{" "}
            {races.length}
          </div>
        </div>
      </div>

      <div className="page">
        <div className="standings-grid">
          <DriverStandings />
          <ConstructorStandings />
        </div>
      </div>
    </>
  );
}
