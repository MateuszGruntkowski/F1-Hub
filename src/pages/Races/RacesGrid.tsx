import dayjs from "dayjs";
import type { RaceBase } from "../../types/race";
import { useEffect, useState } from "react";
import { getRaceDateTime } from "../Home/dateUtils";
import { getResults } from "../../api/resultsApi";
import type { Result } from "../../types/results";
import { getSeasonWinners } from "../../api/winnersApi";

type RacesGridProps = {
  races: RaceBase[];
};

export function RacesGrid({ races }: RacesGridProps) {
  const [winners, setWinners] = useState<Record<string, Result>>({});
  const season = races[0]?.season;

  useEffect(() => {
    if (!season) return;

    async function fetchWinners() {
      try {
        const data = await getSeasonWinners(season);
        const byRound: Record<string, Result> = {};
        data.forEach((r) => {
          byRound[r.round] = r.Results[0];
        });
        setWinners(byRound);
      } catch (error) {
        console.log(error);
      }
    }
    fetchWinners();
  }, [season]);

  return (
    <div className="races-grid">
      {races.map((race, index) => {
        const winner = winners[race.round];
        return (
          <div key={race.raceName}>
            <div>{index + 1}</div>
            <div>
              <div>{race.raceName}</div>
              <div>{race.Circuit.circuitName}</div>
            </div>
            <div>{dayjs(race.date).format("DD, MMM")}</div>
            {winner && <div>{winner.Driver.familyName} Won</div>}
          </div>
        );
      })}
    </div>
  );
}
