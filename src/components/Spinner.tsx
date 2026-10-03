import "./Spinner.css";

type SpinnerProps = {
  size?: number;
  thickness?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
};

export default function Spinner({
  size = 40,
  thickness = 4,
  label = "Ładowanie…",
  showLabel = false,
  className,
}: SpinnerProps) {
  const stroke = (thickness / size) * 100;
  const radius = 50 - stroke / 2 - 4;

  return (
    <span
      role="status"
      aria-live="polite"
      className={className ? `spinner ${className}` : "spinner"}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="spinner__svg"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--border, #262b34)"
          strokeWidth={stroke}
        />

        <g className="spinner__rotor">
          <circle
            className="spinner__arc"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--accent, #e4002b)"
            strokeWidth={stroke}
            strokeLinecap="round"
            pathLength={100}
          />
        </g>

        <g className="spinner__flag">
          <circle
            cx="50"
            cy={50 - radius}
            r={stroke * 0.55}
            fill="var(--flag, #c8ff3d)"
          />
        </g>
      </svg>

      <span className={showLabel ? undefined : "spinner__sr-only"}>
        {label}
      </span>
    </span>
  );
}
