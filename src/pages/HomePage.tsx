import dayjs from "dayjs";
import type { Race } from "../types/race";
import { useEffect, useState } from "react";
import { getDriverStandings } from "../api/driverStandingsApi";
import type { DriverStanding } from "../types/driverStanding";

type HomePageProps = {
  races: Race[];
};

export function HomePage({ races }: HomePageProps) {
  const now = dayjs();
  const nextRace: Race | undefined = [...races]
    .sort((a, b) => {
      return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
    })
    .find((race) => dayjs(race.date).valueOf() >= now.valueOf());

  if (!nextRace) {
    return <div>No upcoming Races.</div>;
  }

  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);

  useEffect(() => {
    async function fetchDriverStandings() {
      try {
        const driverStandings = await getDriverStandings(2026);
        console.log(driverStandings);
        setDriverStandings(driverStandings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDriverStandings();
  }, []);

  return (
    <>
      <div>NEXT RACE:</div>
      <div>{nextRace.raceName}</div>
      <div>{dayjs(nextRace.date).format("YYYY-MM-DD")}</div>

      <div>DRIVER STANDINGS</div>
      {driverStandings
        .slice()
        .sort((a, b) => a.position - b.position)
        .slice(0, 3)
        .map((driverStanding: DriverStanding) => {
          return (
            <div key={driverStanding.Driver.givenName}>
              <div>Position: {driverStanding.position}</div>
              <div>
                Name:{" "}
                {`${driverStanding.Driver.givenName} ${driverStanding.Driver.familyName}`}
              </div>
              <div>Points: {driverStanding.points}</div>
            </div>
          );
        })}
    </>
  );
}
