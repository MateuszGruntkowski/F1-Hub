import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "./ChartCard";
import type { SeasonRow } from "./chartData";
import { COLORS, TOOLTIP_PROPS } from "./chartTheme";
import "./ChartCard.css";

type Props = {
  data: SeasonRow[];
};

export default function PodiumBreakdownChart({ data }: Props) {
  const wins = data.reduce((sum, s) => sum + s.wins, 0);
  const podiums = data.reduce((sum, s) => sum + s.podiums, 0);

  if (podiums === 0) return null;

  const slices = [
    { name: "Wins", value: wins, fill: COLORS.accent },
    { name: "Other podiums", value: podiums - wins, fill: COLORS.flag },
  ];
  const winShare = Math.round((wins / podiums) * 100);

  return (
    <ChartCard
      title="Podium breakdown"
      subtitle="How many career podiums ended in a win"
    >
      <div className="podium-donut">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Tooltip {...TOOLTIP_PROPS} />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={slices.every((s) => s.value > 0) ? 3 : 0}
              stroke="none"
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="podium-donut__center">
          <span className="podium-donut__value">{winShare}%</span>
          <span className="podium-donut__label">of podiums</span>
          <span className="podium-donut__label">were wins</span>
        </div>
      </div>

      <div className="podium-legend">
        {slices.map((s) => (
          <div key={s.name} className="podium-legend__item">
            <span
              className="podium-legend__dot"
              style={{ background: s.fill }}
            />
            <span>{s.name}</span>
            <span className="podium-legend__value">{s.value}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
