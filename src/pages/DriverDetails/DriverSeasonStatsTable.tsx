import type { DriverTotalStats } from "../../types/driverStats";

type DriverSeasonStatsTableProps = {
  driverStats: DriverTotalStats;
};

export function DriverSeasonStatsTable({
  driverStats,
}: DriverSeasonStatsTableProps) {
  return (
    <div>
      <div className="section-head">
        <h2>Stats by Season</h2>
      </div>
      <div className="season-table">
        <div className="season-legend">
          <div>Season</div>
          <div>Team</div>
          <div className="legend-stat">Wins</div>
          <div className="legend-stat">Podiums</div>
          <div className="legend-stat">Poles</div>
          <div className="legend-stat">Points</div>
        </div>
        {driverStats?.statsBySeason.map((seasonStats) => (
          <div className="season-row" key={seasonStats.season}>
            <div className="season">{seasonStats.season}</div>
            <div className="team">{seasonStats.constructorName}</div>
            <div className="stat-count">{seasonStats.wins}</div>
            <div className="stat-count">{seasonStats.podiums}</div>
            <div className="stat-count">{seasonStats.polePositions}</div>
            <div className="stat-count">{seasonStats.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
