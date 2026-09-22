import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { RaceBase } from "../../types/race";
import type { Result } from "../../types/results";
import { getSeasonWinners } from "../../api/winnersApi";
import { getNextRace, getRaceDateTime } from "../../utils/dateUtils";
import { Link } from "react-router";

type RacesGridProps = {
  races: RaceBase[];
};

export function RacesGrid({ races }: RacesGridProps) {
  const [winners, setWinners] = useState<Record<string, Result>>({});
  const season = races[0]?.season;
  const now = dayjs();

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

  const nextRound = getNextRace(races)?.round;

  return (
    <>
      <div className="races-grid-legend">
        <span>RD</span>
        <span>Grand Prix</span>
        <span>Result</span>
        <span>Date</span>
      </div>
      <div className="races-grid">
        {races.map((race, index) => {
          const winner = winners[race.round];
          const isNext = race.round === nextRound;
          const isDone = getRaceDateTime(race).isBefore(now);

          return (
            <Link
              key={race.round}
              to={`/races/${race.season}/${race.round}`}
              className={`race-row${isNext ? " is-next" : ""}${isDone ? " is-done" : ""}`}
            >
              <div className="round">{String(index + 1).padStart(2, "0")}</div>
              <div className="race-main">
                <div className="gp-name">{race.raceName}</div>
                <div className="circuit">{race.Circuit.circuitName}</div>
              </div>
              <div className="race-result">
                {winner ? (
                  <span className="winner">
                    {winner.Driver.givenName[0]}. {winner.Driver.familyName}{" "}
                    <span style={{ color: "var(--text-dim)" }}>won</span>
                  </span>
                ) : isNext ? (
                  <span className="tbd">Next race</span>
                ) : (
                  <span className="tbd">—</span>
                )}
              </div>
              <div className="race-date">
                {dayjs(race.date).format("DD MMM")}
              </div>
              <span className="status-dot" />
            </Link>
          );
        })}
      </div>
    </>
  );
}
