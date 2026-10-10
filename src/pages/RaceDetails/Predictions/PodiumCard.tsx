import type { DriverPrediction } from "../../../types/predictions";
import { formatPercent, snakeToTitleCase } from "../../../utils/formatUtils";
import DriverAvatar from "./DriverAvatar";

type PodiumCardProps = {
  driver: DriverPrediction;
  place: number;
};

export default function PodiumCard({ driver, place }: PodiumCardProps) {
  return (
    <div className={`pred-podium pred-podium--p${place}`}>
      <span className="pred-podium__place">P{place}</span>
      <DriverAvatar driverId={driver.driverId} code={driver.driverCode} />
      <div className="pred-podium__name">
        {snakeToTitleCase(driver.driverId)}
      </div>
      <div className="pred-podium__team">
        {snakeToTitleCase(driver.constructorId)}
      </div>
      <div className="pred-podium__stats">
        <div>
          <span className="label">Win</span>
          <span className="value">{formatPercent(driver.win)}</span>
        </div>
        <div>
          <span className="label">Podium</span>
          <span className="value">{formatPercent(driver.podium)}</span>
        </div>
      </div>
    </div>
  );
}
