import axios from "axios";
import type { DriverStanding } from "../types/standings";
export async function getDriverStandings(season: string) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/driverstandings/`,
  );

  return (
    response.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? []
  );
}

export async function getDriverStandingsForDriver(
  season: string,
  driverId: string,
): Promise<DriverStanding> {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/drivers/${driverId}/driverstandings/`,
  );

  return (
    response.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings[0] ??
    []
  );
}
