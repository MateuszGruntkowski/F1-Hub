import dayjs from "dayjs";
import type { CircuitDetails } from "../../types/circuit";
import type { RaceBase } from "../../types/race";

type RaceHeaderProps = {
  circuitDetails: CircuitDetails;
  isCompleted: boolean;
  race: RaceBase;
  round?: string;
};

export function RaceHeader({
  circuitDetails,
  isCompleted,
  race,
  round,
}: RaceHeaderProps) {
  return (
    <header className="race-header">
      <div className="page race-header__bar">
        <div className="race-header__tags">
          <span className="round-chip">Round {round}</span>
          <span className={`status-chip ${isCompleted ? "done" : "upcoming"}`}>
            {isCompleted ? "Completed" : "Upcoming"}
          </span>
        </div>
        <h1>{race.raceName}</h1>
        <div className="race-header__facts">
          <div>
            <strong>{circuitDetails.circuitName}</strong>Circuit
          </div>
          <div>
            <strong>{circuitDetails.Location.country}</strong>Location
          </div>
          <div>
            <strong>{dayjs(race.date).format("ddd, D MMM YYYY")}</strong>Race
            day
          </div>
          <div>
            <strong>{race.time?.slice(0, 5) ?? "TBC"} UTC</strong>Lights out
          </div>
        </div>
      </div>
    </header>
  );
}
