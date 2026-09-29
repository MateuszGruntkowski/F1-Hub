import axios from "axios";

export async function getDriver(driverId: string) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/`,
  );

  return response.data.MRData.DriverTable.Drivers[0];
}
