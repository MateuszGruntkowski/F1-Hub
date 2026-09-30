import { useDriverStandings } from "../../hooks/useDriverStandings";
import { CURRENT_SEASON } from "../../constants/seasons";
import type { DriverStanding } from "../../types/standings";
import { Link } from "react-router";

export function DriverStandings() {
  const driverStandings = useDriverStandings(CURRENT_SEASON);

  return (
    <div className="standings-panel">
      <div className="panel-title">Drivers</div>
      {driverStandings
        .slice()
        .sort((a, b) => Number(a.position) - Number(b.position))
        .slice(0, 5)
        .map((driverStanding: DriverStanding) => (
          <Link
            to={`/drivers/${driverStanding.Driver.driverId}`}
            key={driverStanding.Driver.driverId}
            className={`standings-row${Number(driverStanding.position) === 1 ? " lead" : ""}`}
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
          </Link>
        ))}
    </div>
  );
}
