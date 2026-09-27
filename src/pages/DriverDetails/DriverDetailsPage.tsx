import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getDriverCareerResults } from "../../api/resultsApi";
import type { RaceWithResults } from "../../types/race";
import type { DriverStats } from "../../types/driverStats";
import type { SeasonStats } from "../../types/season";

export function DriverDetailsPage() {
  const params = useParams();
  const driverId = params.driverId;
  const [driverCareer, setDriverCareer] = useState<RaceWithResults[]>();
  const [driverStats, setDriverStats] = useState<DriverStats>();

  useEffect(() => {
    async function fetchDriverCareer() {
      if (!driverId) {
        return;
      }

      try {
        const data = await getDriverCareerResults(driverId);
        console.log(data);
        setDriverCareer(data);
        console.log(driverCareer);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDriverCareer();
  }, [driverId]);

  function countStats() {
    if (!driverCareer) {
      return;
    }

    const statsBySeasonMap: Record<string, SeasonStats> = {};

    for (const race of driverCareer) {
      const season = race.season;
      if (!season) {
        continue;
      }

      const result = race.Results.at(0);
      const position = Number(result?.position);
      const grid = Number(result?.grid);
      const points = Number(result?.points ?? 0);
      const team = result?.Constructor?.name ?? "Unknown";

      statsBySeasonMap[season] ??= {
        season,
        team,
        wins: 0,
        points: 0,
        podiums: 0,
        polePositions: 0,
      };

      const seasonStats = statsBySeasonMap[season];

      seasonStats.team = team;
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

    setDriverStats({
      totalWins: statsBySeason.reduce((sum, s) => sum + s.wins, 0),
      totalPodiums: statsBySeason.reduce((sum, s) => sum + s.podiums, 0),
      totalPolePositions: statsBySeason.reduce(
        (sum, s) => sum + s.polePositions,
        0,
      ),
      totalPoints: statsBySeason.reduce((sum, s) => sum + s.points, 0),
      statsBySeason,
    });
  }

  return <></>;
}
