import {
  Area,
  AreaChart,
  CartesianGrid,
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
  TOOLTIP_PROPS,
} from "./chartTheme";

type Props = {
  data: SeasonRow[];
};

export default function CareerProgressionChart({ data }: Props) {
  return (
    <ChartCard
      title="Career progression"
      subtitle="Cumulative points over the years"
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart data={data} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="careerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.45} />
              <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke={COLORS.border}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis dataKey="season" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} />
          <Tooltip {...TOOLTIP_PROPS} />
          <Area
            type="monotone"
            dataKey="cumulativePoints"
            name="Total points"
            stroke={COLORS.accent}
            strokeWidth={2.5}
            fill="url(#careerGradient)"
            dot={{ r: 3, fill: COLORS.accent, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: COLORS.flag, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
