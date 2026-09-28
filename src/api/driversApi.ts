import axios from "axios";

export async function getDrivers(season: number) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/drivers/?limit=100`,
  );

  return response.data.MRData.DriverTable.Drivers;
}

export async function getDriver(driverId: string) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/`,
  );

  return response.data.MRData.DriverTable.Drivers[0] ?? {};
}

export async function getCurrentDriverConstructor(driverId: string) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/current/drivers/${driverId}/constructors/`,
  );

  return response.data.MRData.ConstructorTable.Constructors[0] ?? {};
}
