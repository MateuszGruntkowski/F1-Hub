import { useEffect, useState } from "react";
import type { DriverStanding } from "../types/standings";
import { getDriverStandings } from "../api/driverStandingsApi";

export function useDriverStandings(season: string) {
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
