import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "./ChartCard";
import type { SeasonRow } from "./Chartdata";
import {
  AXIS_PROPS,
  BAR_CURSOR,
  CHART_HEIGHT,
  CHART_MARGIN,
  COLORS,
  TOOLTIP_PROPS,
} from "./Charttheme";

type Props = {
  data: SeasonRow[];
};

export default function PointsPerSeasonChart({ data }: Props) {
  const bestPoints = Math.max(...data.map((s) => s.points));
  const chartData = data.map((s) => ({
    ...s,
    fill: s.points === bestPoints ? COLORS.flag : COLORS.accent,
  }));

  return (
    <ChartCard
      title="Points per season"
      subtitle="Total points scored in each year (best season highlighted)"
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={chartData} margin={CHART_MARGIN}>
          <CartesianGrid
            stroke={COLORS.border}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis dataKey="season" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} />
          <Tooltip {...TOOLTIP_PROPS} cursor={BAR_CURSOR} />
          <Bar
            dataKey="points"
            name="Points"
            fill={COLORS.accent}
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
