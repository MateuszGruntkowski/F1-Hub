import { useConstructorStandings } from "../../hooks/useConstructorStandings";
import type { ConstructorStanding } from "../../types/constructorStanding";
import { getTeamColor } from "../../constants/teamColors";

export function ConstructorStandings() {
  const constructorStandings = useConstructorStandings();

  return (
    <div className="standings-panel">
      <div className="panel-title">
        Constructors
        <span className="count">{constructorStandings.length} teams</span>
      </div>
      <div className="col-labels">
        <span>POS</span>
        <span>TEAM</span>
        <span className="pts-col">PTS</span>
      </div>
      {constructorStandings
        .slice()
        .sort((a, b) => b.points - a.points)
        .map((constructorStanding: ConstructorStanding) => (
          <div
            key={constructorStanding.Constructor.constructorId}
            className={`standings-row${constructorStanding.position <= 3 ? " top3" : ""}`}
          >
            <div className="pos">
              {String(constructorStanding.position).padStart(2, "0")}
            </div>
            <div className="who">
              <div className="name">
                <span
                  className="team-swatch"
                  style={{
                    background: getTeamColor(
                      constructorStanding.Constructor.constructorId,
                    ),
                  }}
                />
                {constructorStanding.Constructor.name}
              </div>
            </div>
            <div className="pts">
              {constructorStanding.points}
              <span>PTS</span>
            </div>
          </div>
        ))}
    </div>
  );
}
