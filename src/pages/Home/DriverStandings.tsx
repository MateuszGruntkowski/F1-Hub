import { useEffect, useState } from "react";
import type { DriverStanding } from "../../types/driverStanding";
import { getDriverStandings } from "../../api/driverStandingsApi";

export function DriverStandings() {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);

  useEffect(() => {
    async function fetchDriverStandings() {
      try {
        const driverStandings = await getDriverStandings(2026);
        setDriverStandings(driverStandings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDriverStandings();
  }, []);

  return (
    <div className="driver-standings">
      <div>Drivers</div>
      {driverStandings
        .slice()
        .sort((a, b) => a.position - b.position)
        .slice(0, 5)
        .map((driverStanding: DriverStanding) => {
          return (
            <div key={driverStanding.Driver.driverId} className="driver">
              <div>{driverStanding.position}</div>
              <div>
                {`${driverStanding.Driver.givenName} ${driverStanding.Driver.familyName}`}
              </div>
              <div>{driverStanding.points} PTS</div>
            </div>
          );
        })}
    </div>
  );
}
