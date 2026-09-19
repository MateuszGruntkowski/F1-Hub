import type { DriverStanding } from "../../types/driverStanding";
import { useDriverStandings } from "../../hooks/useDriverStandings";

export function DriverStandings() {
  const driverStandings = useDriverStandings();

  return (
    <div className="standings-panel">
      <div className="panel-title">Drivers</div>
      {driverStandings
        .slice()
        .sort((a, b) => a.position - b.position)
        .slice(0, 5)
        .map((driverStanding: DriverStanding) => (
          <div
            key={driverStanding.Driver.driverId}
            className={`standings-row${driverStanding.position === 1 ? " lead" : ""}`}
          >
            <div className="pos">
              {String(driverStanding.position).padStart(2, "0")}
            </div>
            <div className="who">
              <div className="name">
                {driverStanding.Driver.givenName}{" "}
                {driverStanding.Driver.familyName}
              </div>
            </div>
            <div className="pts">
              {driverStanding.points}
              <span>PTS</span>
            </div>
          </div>
        ))}
    </div>
  );
}
