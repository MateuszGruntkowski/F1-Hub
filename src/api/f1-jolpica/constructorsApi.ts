import axios from "axios";

export async function getCurrentDriverConstructor(driverId: string) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/current/drivers/${driverId}/constructors/`,
  );

  return response.data.MRData.ConstructorTable.Constructors[0] ?? {};
}
