import { useEffect, useState } from "react";
import type { RaceBase } from "../../types/race";
import dayjs from "dayjs";
import type { Result } from "../../types/results";
import { getResults } from "../../api/resultsApi";
import { getLastRace } from "../../utils/dateUtils";

type LastRaceProps = {
  races: RaceBase[];
};

export function LastRace({ races }: LastRaceProps) {
  const [results, setResults] = useState<Result[]>([]);

  const lastRace = getLastRace(races);
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
    return <div className="last-race last-race--empty">No previous Races.</div>;
  }

  return (
    <div className="last-race">
      <div className="last-race__header">
        <div className="last-race__name">Last Race — {lastRace.raceName}</div>
        <div className="last-race__date">
          {lastRace.Circuit.Location.country} &#183;{" "}
          {dayjs(lastRace.date).format("D MMM")}
        </div>
      </div>

      <div className="podium">
        {[...results]
          .sort((a, b) => a.position - b.position)
          .slice(0, 3)
          .map((result) => (
            <div
              key={result.Driver.driverId}
              className={`podium-card podium-card--p${result.position}`}
            >
              <div className="podium-card__pos">P{result.position}</div>
              <div className="podium-card__driver">
                <div>{result.Driver.givenName}</div>
                <div>{result.Driver.familyName}</div>
              </div>
              <div className="podium-card__team">{result.Constructor.name}</div>
              <div className="podium-card__time">{result.Time?.time}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
