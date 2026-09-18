import axios from "axios";
export async function getDriverStandings(season: number) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/driverstandings/`,
  );

  return (
    response.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? []
  );
}
