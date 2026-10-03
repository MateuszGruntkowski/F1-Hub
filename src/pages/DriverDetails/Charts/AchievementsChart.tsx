import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
  LEGEND_STYLE,
  TOOLTIP_PROPS,
} from "./Charttheme";

type Props = {
  data: SeasonRow[];
};

export default function AchievementsChart({ data }: Props) {
  return (
    <ChartCard
      title="Wins, podiums & pole positions"
      subtitle="Season-by-season comparison"
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid
            stroke={COLORS.border}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis dataKey="season" {...AXIS_PROPS} />
          <YAxis allowDecimals={false} {...AXIS_PROPS} />
          <Tooltip {...TOOLTIP_PROPS} cursor={BAR_CURSOR} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={LEGEND_STYLE} />
          <Bar
            dataKey="wins"
            name="Wins"
            fill={COLORS.accent}
            radius={[3, 3, 0, 0]}
            maxBarSize={14}
          />
          <Bar
            dataKey="podiums"
            name="Podiums"
            fill={COLORS.flag}
            radius={[3, 3, 0, 0]}
            maxBarSize={14}
          />
          <Bar
            dataKey="polePositions"
            name="Pole positions"
            fill={COLORS.blue}
            radius={[3, 3, 0, 0]}
            maxBarSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
