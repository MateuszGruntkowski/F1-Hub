import AchievementsChart from "./AchievementsChart";
import CareerProgressionChart from "./CareerProgressionChart";
import { groupBySeason, groupByTeam } from "./chartData";
import FormTrendChart from "./FormTrendChart";
import PointsByTeamChart from "./PointsByTeamChart";
import PointsPerSeasonChart from "./PointsPerSeasonChart";
import "./DriverCharts.css";
import type { DriverSeasonStats } from "../../../types/driverStats";
import PodiumBreakdownChart from "./PodiumBreakdownChart";

type Props = {
  statsBySeason: DriverSeasonStats[];
};

export default function DriverCharts({ statsBySeason }: Props) {
  if (statsBySeason.length === 0) return null;

  const seasons = groupBySeason(statsBySeason);
  const constructors = groupByTeam(statsBySeason);
  console.log(constructors);

  return (
    <div className="driver-charts">
      <PointsPerSeasonChart data={seasons} />
      <CareerProgressionChart data={seasons} />
      <AchievementsChart data={seasons} />
      <PointsByTeamChart data={constructors} />
      {seasons.length > 1 && <FormTrendChart data={seasons} />}
      <PodiumBreakdownChart data={seasons} />
    </div>
  );
}
