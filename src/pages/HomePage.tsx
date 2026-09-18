import dayjs from "dayjs";
import type { Race } from "../types/race";

type HomePageProps = {
  races: Race[];
};

export function HomgePage({ races }: HomePageProps) {
  const now = dayjs();
  const nextRace: Race | undefined = [...races]
    .sort((a: Race, b: Race) => {
      return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
    })
    .find((race) => dayjs(race.date).valueOf() >= now.valueOf());

  if (!nextRace) {
    return <div>No upcoming Races.</div>;
  }

  return (
    <>
      <div>NEXT RACE:</div>
      <div>{nextRace.raceName}</div>
      <div>{dayjs(nextRace.date).format("YYYY-MM-DD")}</div>
    </>
  );
}
