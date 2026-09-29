import { useConstructorStandings } from "../../hooks/useConstructorStandings";
import { getTeamColor } from "../../constants/teamColors";
import { CURRENT_SEASON } from "../../constants/seasons";
import type { ConstructorStanding } from "../../types/standings";

export function ConstructorStandings() {
  const constructorStandings = useConstructorStandings(CURRENT_SEASON);

  return (
    <div className="standings-panel">
      <div className="panel-title">Constructors</div>
      {constructorStandings
        .slice()
        .sort((a, b) => Number(b.points) - Number(a.points))
        .slice(0, 5)
        .map((constructorStanding: ConstructorStanding) => (
          <div
            key={constructorStanding.Constructor.constructorId}
            className={`standings-row${Number(constructorStanding.position) === 1 ? " lead" : ""}`}
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
