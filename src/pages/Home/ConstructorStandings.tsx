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
    <div className="constructor-standings">
      <div>Constructors</div>
      {constructorStandings
        .slice()
        .sort((a, b) => b.points - a.points)
        .slice(0, 5)
        .map((constructorStanding: ConstructorStanding) => {
          return (
            <div
              key={constructorStanding.Constructor.constructorId}
              className="constructor"
            >
              <div>{constructorStanding.position}</div>
              <div>{constructorStanding.Constructor.name}</div>
              <div>{constructorStanding.points}PTS</div>
            </div>
          );
        })}
    </div>
  );
}
