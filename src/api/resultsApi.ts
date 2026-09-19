import axios from "axios";

export async function getResults(season?: string, round?: string) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/${round}/results/`,
  );
  return response.data.MRData.RaceTable.Races[0]?.Results ?? [];
}
