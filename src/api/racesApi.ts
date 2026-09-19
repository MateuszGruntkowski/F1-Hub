import axios from "axios";
import type { RaceBase } from "../types/race";

export async function getRaces(season: number): Promise<RaceBase[]> {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/races/`,
  );
  return response.data.MRData.RaceTable.Races;
}
