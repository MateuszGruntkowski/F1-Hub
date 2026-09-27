import axios from "axios";

export async function getDrivers(season: number) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/drivers/?limit=100`,
  );

  return response.data.MRData.DriverTable.Drivers;
}

export async function getDriverSeasons(driverId: string) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/seasons/`,
  );

  return response.data.MRData.SeasonTable.Seasons;
}
