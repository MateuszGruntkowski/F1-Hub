import { useEffect, useState } from "react";
import type { ConstructorStanding } from "../../types/constructorStanding";
import { getConstructorStandings } from "../../api/constructorStandingsApi";

export function ConstructorStandings() {
  const [constructorStandings, setConstructorStandings] = useState<
    ConstructorStanding[]
  >([]);

  useEffect(() => {
    async function fetchConstructorStandings() {
      try {
        const constructorStandings = await getConstructorStandings(2026);
        setConstructorStandings(constructorStandings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchConstructorStandings();
  }, []);

  return (
    <div className="standings-panel">
      <div className="panel-title">Constructors</div>
      {constructorStandings
        .slice()
        .sort((a, b) => b.points - a.points)
        .slice(0, 5)
        .map((constructorStanding: ConstructorStanding) => (
          <div
            key={constructorStanding.Constructor.constructorId}
            className={`standings-row${constructorStanding.position === 1 ? " lead" : ""}`}
          >
            <div className="pos">
              {String(constructorStanding.position).padStart(2, "0")}
            </div>
            <div className="who">
              <div className="name">{constructorStanding.Constructor.name}</div>
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
