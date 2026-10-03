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
import type { TeamRow } from "./chartData";
import {
  AXIS_PROPS,
  BAR_CURSOR,
  CHART_HEIGHT,
  COLORS,
  TOOLTIP_PROPS,
} from "./chartTheme";

type Props = {
  data: TeamRow[];
};

export default function PointsByTeamChart({ data }: Props) {
  const height = Math.max(CHART_HEIGHT, data.length * 44 + 40);

  return (
    <ChartCard
      title="Points by team"
      subtitle="Points scored with each constructor"
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            stroke={COLORS.border}
            strokeDasharray="3 3"
            horizontal={false}
          />
          <XAxis type="number" {...AXIS_PROPS} />
          <YAxis
            type="category"
            dataKey="constructorName"
            width={110}
            {...AXIS_PROPS}
          />
          <Tooltip {...TOOLTIP_PROPS} cursor={BAR_CURSOR} />
          <Bar
            dataKey="points"
            name="Points"
            fill={COLORS.textDim2}
            radius={[0, 4, 4, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
