import type { DriverSeasonStats } from "../../types/driverStats";
import type { RaceWithResults } from "../../types/race";

export function calculateDriverStats(career: RaceWithResults[]) {
  const statsBySeasonMap: Record<string, DriverSeasonStats> = {};

  for (const race of career) {
    const season = race.season;
    if (!season) {
      continue;
    }

    const result = race.Results.at(0);
    const position = Number(result?.position);
    const grid = Number(result?.grid);
    const points = Number(result?.points ?? 0);
    const constructorName = result?.Constructor?.name ?? "Unknown";
    const constructorId = result?.Constructor?.constructorId ?? "unknown";

    statsBySeasonMap[season] ??= {
      season,
      constructorName,
      constructorId,
      wins: 0,
      points: 0,
      podiums: 0,
      polePositions: 0,
    };

    const seasonStats = statsBySeasonMap[season];

    seasonStats.constructorName = constructorName;
    seasonStats.constructorId = constructorId;
    seasonStats.points += points;
    if (position === 1) {
      seasonStats.wins++;
    }
    if (position <= 3) {
      seasonStats.podiums++;
    }
    if (grid === 1) {
      seasonStats.polePositions++;
    }
  }

  const statsBySeason = Object.values(statsBySeasonMap).sort((a, b) =>
    a.season.localeCompare(b.season),
  );

  return {
    totalWins: statsBySeason.reduce((sum, s) => sum + s.wins, 0),
    totalPodiums: statsBySeason.reduce((sum, s) => sum + s.podiums, 0),
    totalPolePositions: statsBySeason.reduce(
      (sum, s) => sum + s.polePositions,
      0,
    ),
    totalPoints: statsBySeason.reduce((sum, s) => sum + s.points, 0),
    statsBySeason,
  };
}
