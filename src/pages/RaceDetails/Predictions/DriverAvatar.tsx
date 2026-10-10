import { driverImages } from "../../../constants/driverImages";
import { snakeToTitleCase } from "../../../utils/formatUtils";

type DriverAvatarProps = {
  driverId: string;
  code: string | null;
};

export default function DriverAvatar({ driverId, code }: DriverAvatarProps) {
  const src = driverImages[driverId];
  if (src) {
    return (
      <img
        className="pred-podium__photo"
        src={src}
        alt={snakeToTitleCase(driverId)}
      />
    );
  }
  return (
    <div className="pred-podium__photo pred-podium__photo--fallback">
      {code ?? driverId.slice(0, 3).toUpperCase()}
    </div>
  );
}
