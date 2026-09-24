import { useEffect, useState } from "react";
import type { DriverStanding } from "../types/driverStanding";
import { getDriverStandings } from "../api/driverStandingsApi";

export function useDriverStandings(season: number) {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);

  useEffect(() => {
    async function fetchDriverStandings() {
      try {
        const driverStandings = await getDriverStandings(season);
        setDriverStandings(driverStandings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDriverStandings();
  }, [season]);

  return driverStandings;
}
