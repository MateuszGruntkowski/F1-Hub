import dayjs from "dayjs";
import type { RaceBase } from "../../types/race";
import { RacesGrid } from "./RacesGrid";
import "./RacesPages.css";
import { getRaceDateTime } from "../../utils/dateUtils";

type RacesPageProps = {
  races: RaceBase[];
};

export function RacesPage({ races }: RacesPageProps) {
  const now = dayjs();

  const remainingRacesCount = races.filter((race) =>
    getRaceDateTime(race).isAfter(now),
  ).length;
  const completedRacesCount = races.filter((race) =>
    getRaceDateTime(race).isBefore(now),
  ).length;

  return (
    <>
      <div className="races-header">
        <div className="page races-header__bar">
          <h1 className="race-calendar">Race Calendar</h1>
          <div className="season-meta">
            <div>
              <strong>{races.length}</strong> Rounds
            </div>
            <div>
              <strong>{completedRacesCount}</strong> Completed
            </div>
            <div>
              <strong>{remainingRacesCount}</strong> Remaining
            </div>
          </div>
        </div>
      </div>

      <div className="page">
        <RacesGrid races={races} />
      </div>
    </>
  );
}
