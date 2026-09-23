import dayjs from "dayjs";
import { getRaceDateTime } from "../../utils/dateUtils";
import type { RaceBase } from "../../types/race";

type RacesHeaderProps = {
  races: RaceBase[];
};

export function RacesHeader({ races }: RacesHeaderProps) {
  const now = dayjs();

  const remainingRacesCount = races.filter((race) =>
    getRaceDateTime(race).isAfter(now),
  ).length;
  const completedRacesCount = races.filter((race) =>
    getRaceDateTime(race).isBefore(now),
  ).length;

  return (
    <header className="races-header">
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
    </header>
  );
}
