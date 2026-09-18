import axios from "axios";
import type { Standing } from "../types/standing";

export async function getDriverStandings(season: number) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/driverstandings/`,
  );

  const standingsList: Standing[] =
    response.data.MRData.StandingsTable.StandingsLists;

  return standingsList[0]?.DriverStandings ?? [];
}
