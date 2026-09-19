import { useEffect, useState } from "react";
import type { RaceBase } from "../../types/race";
import { getRaceDateTime } from "./dateUtils";
import dayjs from "dayjs";
import type { Result } from "../../types/results";
import { getResults } from "../../api/resultsApi";

type LastRaceProps = {
  races: RaceBase[];
};

export function LastRace({ races }: LastRaceProps) {
  const [results, setResults] = useState<Result[]>([]);

  const lastRace: RaceBase | undefined = [...races]
    .sort((a, b) => getRaceDateTime(b).valueOf() - getRaceDateTime(a).valueOf())
    .find((race) => getRaceDateTime(race).valueOf() < dayjs().valueOf());
  const lastSeason = lastRace?.season;
  const lastRound = lastRace?.round;

  useEffect(() => {
    if (!lastSeason || !lastRound) return;

    async function fetchResults() {
      try {
        const results = await getResults(lastSeason, lastRound);
        setResults(results);
      } catch (error) {
        console.log(error);
      }
    }
    fetchResults();
  }, [lastSeason, lastRound]);

  if (!lastRace) {
    return <div>No previous Races.</div>;
  }

  return (
    <div className="last-race">
      <div>Last Race - {lastRace.raceName}</div>
      <div>
        {lastRace.Circuit.Location.country} &#183;{" "}
        {dayjs(lastRace.date).format("D MMM")}
      </div>

      {[...results]
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
  );
}
