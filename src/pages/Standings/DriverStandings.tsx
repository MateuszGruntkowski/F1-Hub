import type { DriverStanding } from "../../types/driverStanding";
import { getTeamColor } from "../../constants/teamColors";

type DriverStandingsProps = {
  driverStandings: DriverStanding[];
};

export function DriverStandings({ driverStandings }: DriverStandingsProps) {
  return (
    <div className="standings-panel">
      <div className="panel-title">
        Drivers
        <span className="count">{driverStandings.length} drivers</span>
      </div>
      <div className="col-labels">
        <span>POS</span>
        <span>DRIVER</span>
        <span className="pts-col">PTS</span>
      </div>
      {driverStandings
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((driverStanding: DriverStanding) => {
          const team = driverStanding.Constructors[0];
          return (
            <div
              key={driverStanding.Driver.driverId}
              className={`standings-row${driverStanding.position <= 3 ? " top3" : ""}`}
            >
              <div className="pos">
                {String(driverStanding.position).padStart(2, "0")}
              </div>
              <div className="who">
                <div className="name">
                  {driverStanding.Driver.givenName}{" "}
                  {driverStanding.Driver.familyName}
                </div>
                {team && (
                  <div className="sub">
                    <span
                      className="team-swatch"
                      style={{ background: getTeamColor(team.constructorId) }}
                    />
                    {team.name}
                  </div>
                )}
              </div>
              <div className="pts">
                {driverStanding.points}
                <span>PTS</span>
              </div>
            </div>
          );
        })}
    </div>
  );
}
