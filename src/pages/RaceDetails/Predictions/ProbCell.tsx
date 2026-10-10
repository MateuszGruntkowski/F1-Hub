import { formatPercent } from "../../../utils/formatUtils";

type ProbCellProps = {
  value: number;
  strong?: boolean;
};

export default function ProbCell({ value, strong = false }: ProbCellProps) {
  return (
    <div className={`pred-prob${strong ? " pred-prob--strong" : ""}`}>
      <span className="pred-prob__value">{formatPercent(value)}</span>
      <span className="pred-prob__bar" aria-hidden="true">
        <span
          className="pred-prob__fill"
          style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
        />
      </span>
    </div>
  );
}
