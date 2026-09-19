import { useEffect, useState } from "react";
import type { DriverStanding } from "../types/driverStanding";
import { getDriverStandings } from "../api/driverStandingsApi";

export function useDriverStandings() {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);

  useEffect(() => {
    async function fetchDriverStandings() {
      try {
        const driverStandings = await getDriverStandings(2026);
        setDriverStandings(driverStandings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDriverStandings();
  }, []);

  return driverStandings;
}
