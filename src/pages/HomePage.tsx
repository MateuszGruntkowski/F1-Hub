import dayjs from "dayjs";
import type { Race } from "../types/race";
import { useEffect, useState } from "react";
import { getDriverStandings } from "../api/driverStandingsApi";
import type { DriverStanding } from "../types/driverStanding";
import { getConstructorStandings } from "../api/constructorStandingsApi";
import type { ConstructorStanding } from "../types/constructorStanding";
import "./HomePage.css";
import { Link } from "react-router";

type HomePageProps = {
  races: Race[];
};

export function HomePage({ races }: HomePageProps) {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<
    ConstructorStanding[]
  >([]);

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

  useEffect(() => {
    async function fetchConstructorStandings() {
      try {
        const constructorStandings = await getConstructorStandings(2026);
        console.log(constructorStandings);
        setConstructorStandings(constructorStandings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchConstructorStandings();
  }, []);

  const now = dayjs();
  const nextRace: Race | undefined = [...races]
    .sort((a, b) => {
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

      <div className="standings">
        <div className="driver-standings">
          <div>DRIVER STANDINGS</div>
          {driverStandings
            .slice()
            .sort((a, b) => a.position - b.position)
            .slice(0, 5)
            .map((driverStanding: DriverStanding) => {
              return (
                <div key={driverStanding.Driver.driverId} className="driver">
                  <div>Position: {driverStanding.position}</div>
                  <div>
                    Name:{" "}
                    {`${driverStanding.Driver.givenName} ${driverStanding.Driver.familyName}`}
                  </div>
                  <div>Points: {driverStanding.points}</div>
                </div>
              );
            })}
          <Link to="/standings">View All</Link>
        </div>

        <div className="constructor-standings">
          <div>Constructor Standings</div>
          {constructorStandings
            .slice()
            .sort((a, b) => b.points - a.points)
            .slice(0, 5)
            .map((constructorStanding: ConstructorStanding) => {
              return (
                <div
                  key={constructorStanding.Constructor.constructorId}
                  className="constructor"
                >
                  <div>Position: {constructorStanding.position}</div>
                  <div>Name: {constructorStanding.Constructor.name}</div>
                  <div>Points: {constructorStanding.points}</div>
                </div>
              );
            })}
          <Link to="/standings">View All</Link>
        </div>
      </div>
    </>
  );
}
