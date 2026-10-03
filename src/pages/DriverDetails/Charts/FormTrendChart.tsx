import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "./ChartCard";
import type { SeasonRow } from "./chartData";
import {
  AXIS_PROPS,
  CHART_HEIGHT,
  CHART_MARGIN,
  COLORS,
  LEGEND_STYLE,
  TOOLTIP_PROPS,
} from "./chartTheme";

type Props = {
  data: SeasonRow[];
};

export default function FormTrendChart({ data }: Props) {
  return (
    <ChartCard title="Form trend" subtitle="Wins and podiums over the years">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid
            stroke={COLORS.border}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis dataKey="season" {...AXIS_PROPS} />
          <YAxis allowDecimals={false} {...AXIS_PROPS} />
          <Tooltip {...TOOLTIP_PROPS} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={LEGEND_STYLE} />
          <Line
            type="monotone"
            dataKey="podiums"
            name="Podiums"
            stroke={COLORS.flag}
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS.flag, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="wins"
            name="Wins"
            stroke={COLORS.accent}
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS.accent, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
