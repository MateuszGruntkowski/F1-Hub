import dayjs from "dayjs";
import type { RaceBase } from "../../types/race";
import { getRaceDateTime } from "../Home/dateUtils";
import { RacesGrid } from "./RacesGrid";

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
      <div className="race-callendar">Race Callendar</div>
      <div>
        <div> {races.length} Rounds</div>
        <div> {completedRacesCount} Completed</div>
        <div> {remainingRacesCount} Remaining</div>
      </div>

      <RacesGrid races={races} />
    </>
  );
}
