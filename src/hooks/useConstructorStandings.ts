import { useEffect, useState } from "react";
import type { ConstructorStanding } from "../types/constructorStanding";
import { getConstructorStandings } from "../api/constructorStandingsApi";

export function useConstructorStandings(season: number) {
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
