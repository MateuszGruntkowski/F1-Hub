import { getTeamColor } from "../../../constants/teamColors";
import type { DriverSeasonStats } from "../../../types/driverStats";

export type SeasonRow = {
  season: string;
  points: number;
  wins: number;
  podiums: number;
  polePositions: number;
  cumulativePoints: number;
};

export type TeamRow = {
  constructorId: string;
  constructorName: string;
  points: number;
  fill: string;
};

export function groupBySeason(stats: DriverSeasonStats[]): SeasonRow[] {
  const bySeason = new Map<string, SeasonRow>();

  for (const s of stats) {
    const row = bySeason.get(s.season) ?? {
      season: s.season,
      points: 0,
      wins: 0,
      podiums: 0,
      polePositions: 0,
      cumulativePoints: 0,
    };
    row.points += s.points;
    row.wins += s.wins;
    row.podiums += s.podiums;
    row.polePositions += s.polePositions;
    bySeason.set(s.season, row);
  }

  const rows = [...bySeason.values()].sort(
    (a, b) => Number(a.season) - Number(b.season),
  );

  let total = 0;
  for (const row of rows) {
    total += row.points;
    row.cumulativePoints = total;
  }

  return rows;
}

export function groupByTeam(stats: DriverSeasonStats[]): TeamRow[] {
  const byTeam = new Map<string, TeamRow>();

  for (const s of stats) {
    const row = byTeam.get(s.constructorId) ?? {
      constructorId: s.constructorId,
      constructorName: s.constructorName,
      points: 0,
      fill: getTeamColor(s.constructorId),
    };
    row.points += s.points;
    byTeam.set(s.constructorId, row);
  }

  return [...byTeam.values()].sort((a, b) => b.points - a.points);
}
