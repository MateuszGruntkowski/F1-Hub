export type DriverTotalStats = {
  totalWins: number;
  totalPodiums: number;
  totalPolePositions: number;
  totalPoints: number;
  statsBySeason: DriverSeasonStats[];
};

export type DriverSeasonStats = {
  season: string;
  team: string;
  wins: number;
  points: number;
  podiums: number;
  polePositions: number;
};
