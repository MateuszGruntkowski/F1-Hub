import dayjs from "dayjs";
import type { RaceBase } from "../../types/race";
import { useCountdown } from "../../hooks/useCountdown";
import { getNextRace } from "../../utils/dateUtils";
import { Link } from "react-router";

type NextRaceProps = {
  races: RaceBase[];
};

export function NextRace({ races }: NextRaceProps) {
  const nextRace = getNextRace(races);

  const { days, hours, minutes, seconds } = useCountdown(
    nextRace?.date,
    nextRace?.time,
  );

  if (!nextRace) {
    return <div className="next-race next-race--empty">No upcoming Races.</div>;
  }

  return (
    <div className="next-race">
      <div className="page next-race__inner">
        <div className="next-race__eyebrow">
          <span className="round-chip">Round {nextRace.round}</span>
          <Link
            to={`/races/${nextRace.season}/${nextRace.round}`}
            className="next-label"
          >
            Next race
          </Link>
        </div>

        <div className="next-race__body">
          <div className="next-race__info">
            <h2 className="next-race__name">{nextRace.raceName}</h2>
            <div className="next-race__location">
              {nextRace.Circuit.circuitName} —{" "}
              {nextRace.Circuit.Location.country},{" "}
              {nextRace.Circuit.Location.locality}
            </div>
            <div className="next-race__meta">
              <div>
                <strong>{dayjs(nextRace.date).format("ddd, D MMM")}</strong>Race
                day
              </div>
              <div>
                <strong>{nextRace.time?.slice(0, 5)} UTC</strong>Lights out
              </div>
            </div>
          </div>

          <div className="countdown-card">
            <div className="countdown-card__label">Time to lights out</div>
            <div className="countdown">
              <div>
                <div className="countdown__num">{days}</div>
                <div className="countdown__unit">Days</div>
              </div>
              <div>
                <div className="countdown__num">{hours}</div>
                <div className="countdown__unit">Hours</div>
              </div>
              <div>
                <div className="countdown__num">{minutes}</div>
                <div className="countdown__unit">Min</div>
              </div>
              <div>
                <div className="countdown__num">{seconds}</div>
                <div className="countdown__unit">Sec</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
