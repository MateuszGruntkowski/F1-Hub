import { useEffect, useState } from "react";
import type { ConstructorStanding } from "../types/standings";
import { getConstructorStandings } from "../api/f1-jolpica/constructorStandingsApi";

export function useConstructorStandings(season: string) {
  const [constructorStandings, setConstructorStandings] = useState<
    ConstructorStanding[]
  >([]);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const standings = await getConstructorStandings(season);
        setConstructorStandings(standings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchStandings();
  }, [season]);

  return constructorStandings;
}
