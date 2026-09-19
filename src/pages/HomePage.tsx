import dayjs from "dayjs";
import type { RaceBase } from "../types/race";
import { useEffect, useState } from "react";
import { getDriverStandings } from "../api/driverStandingsApi";
import type { DriverStanding } from "../types/driverStanding";
import { getConstructorStandings } from "../api/constructorStandingsApi";
import type { ConstructorStanding } from "../types/constructorStanding";
import "./HomePage.css";
import { Link } from "react-router";
import { getResults } from "../api/resultsApi";
import type { Result } from "../types/results";

type HomePageProps = {
  races: RaceBase[];
};

export function HomePage({ races }: HomePageProps) {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<
    ConstructorStanding[]
  >([]);

  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    async function fetchDriverStandings() {
      try {
        const driverStandings = await getDriverStandings(2026);
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
        setConstructorStandings(constructorStandings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchConstructorStandings();
  }, []);

  useEffect(() => {
    async function fetchResults() {
      try {
        const results = await getResults(2026, 10);
        console.log(results);
        setResults(results);
      } catch (error) {
        console.log(error);
      }
    }

    fetchResults();
  }, []);

  const now = dayjs();
  const nextRace: RaceBase | undefined = [...races]
    .sort((a, b) => {
      return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
    })
    .find((race) => dayjs(race.date).valueOf() >= now.valueOf());

  if (!nextRace) {
    return <div>No upcoming Races.</div>;
  }

  const lastRace: RaceBase | undefined = [...races]
    .sort((a, b) => {
      return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
    })
    .find((race) => dayjs(race.date).valueOf() < now.valueOf());

  if (!lastRace) {
    return <div>No previous Races.</div>;
  }

  return (
    <>
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
      </div>

      <div className="last-race">
        <div>Last Race - {lastRace.raceName}</div>
        <div>
          {lastRace.Circuit.Location.country} &#183;{" "}
          {dayjs(lastRace.date).format("D MMM")}
        </div>

        {results
          .sort((a, b) => a.position - b.position)
          .slice(0, 3)
          .map((result) => {
            return (
              <div key={result.Driver.driverId}>
                P{result.position}
                <div>
                  <div>{result.Driver.givenName}</div>
                  <div>{result.Driver.familyName}</div>
                </div>
                <div>{result.Constructor.name}</div>
                <div>{result.Time?.time}</div>
              </div>
            );
          })}
      </div>

      <div>
        <div>Championship standings</div>
        <Link to="/standings">Full standings</Link>
      </div>
      <div className="standings">
        <div className="driver-standings">
          <div>Drivers</div>
          {driverStandings
            .slice()
            .sort((a, b) => a.position - b.position)
            .slice(0, 5)
            .map((driverStanding: DriverStanding) => {
              return (
                <div key={driverStanding.Driver.driverId} className="driver">
                  <div>{driverStanding.position}</div>
                  <div>
                    {`${driverStanding.Driver.givenName} ${driverStanding.Driver.familyName}`}
                  </div>
                  <div>{driverStanding.points} PTS</div>
                </div>
              );
            })}
        </div>

        <div className="constructor-standings">
          <div>Constructors</div>
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
                  <div>{constructorStanding.position}</div>
                  <div>{constructorStanding.Constructor.name}</div>
                  <div>{constructorStanding.points}PTS</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
