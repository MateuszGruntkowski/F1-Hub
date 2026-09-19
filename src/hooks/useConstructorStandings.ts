import { useEffect, useState } from "react";
import type { ConstructorStanding } from "../types/constructorStanding";
import { getConstructorStandings } from "../api/constructorStandingsApi";

export function useConstructorStandings() {
  const [constructorStandings, setConstructorStandings] = useState<
    ConstructorStanding[]
  >([]);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const standings = await getConstructorStandings(2026);
        setConstructorStandings(standings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchStandings();
  }, []);

  return constructorStandings;
}
