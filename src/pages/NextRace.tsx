import dayjs from "dayjs";
import type { RaceBase } from "../types/race";
import { getRaceDateTime } from "./dateUtils";
import { useCountdown } from "../hooks/useCountdown";

type NextRaceProps = {
  races: RaceBase[];
};

export function NextRace({ races }: NextRaceProps) {
  const nextRace: RaceBase | undefined = [...races]
    .sort((a, b) => getRaceDateTime(a).valueOf() - getRaceDateTime(b).valueOf())
    .find((race) => getRaceDateTime(race).valueOf() >= dayjs().valueOf());

  const { days, hours, minutes, seconds } = useCountdown(
    nextRace?.date,
    nextRace?.time,
  );

  if (!nextRace) {
    return <div>No upcoming Races.</div>;
  }

  return (
    <div className="next-race">
      <div>Next race</div>
      <div>Round: {nextRace.round}</div>
      <div>{nextRace.raceName}</div>
      <div>
        {nextRace.Circuit.circuitName} - {nextRace.Circuit.Location.country},{" "}
        {nextRace.Circuit.Location.locality}
      </div>
      <div>{dayjs(nextRace.date).format("ddd, D MMM")}</div>
      <div>{nextRace.time?.slice(0, 5)}</div>

      <div>Time to lights out</div>
      <div>
        <div>{days} Days</div>
        <div>{hours} Hours</div>
        <div>{minutes} Min</div>
        <div>{seconds} Sec</div>
      </div>
    </div>
  );
}
