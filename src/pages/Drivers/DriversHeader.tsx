import type { DriverStanding } from "../../types/standings";

type DriversHeaderProps = {
  sortedDriversByConstructors: DriverStanding[];
};

export function DriversHeader({
  sortedDriversByConstructors,
}: DriversHeaderProps) {
  return (
    <div className="drivers-header">
      <h1>Drivers</h1>
      <div className="count">
        <strong>{sortedDriversByConstructors.length}</strong> drivers this
        season
      </div>
    </div>
  );
}
