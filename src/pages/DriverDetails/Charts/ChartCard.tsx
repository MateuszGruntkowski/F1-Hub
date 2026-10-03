import type { ReactNode } from "react";
import "./ChartCard.css";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function ChartCard({ title, subtitle, children }: Props) {
  return (
    <section className="chart-card">
      <h3 className="chart-card__title">{title}</h3>
      {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}
