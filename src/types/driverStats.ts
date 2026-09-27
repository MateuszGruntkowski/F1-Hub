import type { SeasonStats } from "./season";

export type DriverStats = {
  totalWins: number;
  totalPodiums: number;
  totalPolePositions: number;
  totalPoints: number;
  statsBySeason: SeasonStats[];
};
