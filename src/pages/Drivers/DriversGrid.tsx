import { driverImages } from "../../constants/driverImages";
import type { DriverStanding } from "../../types/driverStanding";
import { DriverCard } from "./DriverCard";

type DriversGridProps = {
  sortedDriversByConstructors: DriverStanding[];
};

export function DriversGrid({ sortedDriversByConstructors }: DriversGridProps) {
  return (
    <div className="driver-grid">
      {sortedDriversByConstructors.map((standing) => {
        const { Driver, Constructors } = standing;
        const currentTeam = Constructors.at(-1);

        const photo = driverImages[Driver.driverId];

        return (
          <DriverCard
            key={Driver.driverId}
            Driver={Driver}
            currentTeam={currentTeam}
            photo={photo}
          />
        );
      })}
    </div>
  );
}
