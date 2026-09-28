import type { Result } from "../types/results";

export async function getSeasonWinners(season: string) {
  const res = await fetch(
    `https://api.jolpi.ca/ergast/f1/${season}/results/1.json?limit=100`,
  );
  const data = await res.json();
  return data.MRData.RaceTable.Races as Array<{
    round: string;
    Results: Result[];
  }>;
}
