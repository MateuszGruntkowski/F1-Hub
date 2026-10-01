import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getAllDriverResults } from "../../api/resultsApi";
import type { RaceWithResults } from "../../types/race";
import type {
  DriverSeasonStats,
  DriverTotalStats,
} from "../../types/driverStats";
import { getDriver } from "../../api/driversApi";
import type { Driver } from "../../types/driver";
import "./DriverDetailsPage.css";
import { DriverHero } from "./DriverHero";
import { DriverCareerStats } from "./DriverCareerStats";
import { DriverSeasonStatsTable } from "./DriverSeasonStatsTable";

function calculateDriverStats(career: RaceWithResults[]) {
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

export function DriverDetailsPage() {
  const params = useParams();
  const driverId = params.driverId;
  const [driver, setDriver] = useState<Driver>();
  const [driverStats, setDriverStats] = useState<DriverTotalStats>();

  useEffect(() => {
    async function fetchDriver() {
      if (!driverId) {
        return;
      }

      try {
        const data = await getDriver(driverId);
        setDriver(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDriver();
  }, [driverId]);

  useEffect(() => {
    async function fetchAllDriverResults() {
      if (!driverId) {
        return;
      }

      try {
        const data = await getAllDriverResults(driverId);
        setDriverStats(calculateDriverStats(data));
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllDriverResults();
  }, [driverId]);

  if (!driver) {
    return (
      <section className="page driver-details-content">
        <div>Cannot load driver</div>
      </section>
    );
  }

  if (!driverStats) {
    return (
      <section className="page driver-details-content">
        <div>Cannot load driver</div>
      </section>
    );
  }

  return (
    <>
      <div className="breadcrumb page">
        <Link to="/drivers">← Back to drivers</Link>
      </div>

      <DriverHero driver={driver} />

      <section className="page driver-details-content">
        <DriverCareerStats driver={driver} driverStats={driverStats} />
        <DriverSeasonStatsTable driverStats={driverStats} />
      </section>
    </>
  );
}
