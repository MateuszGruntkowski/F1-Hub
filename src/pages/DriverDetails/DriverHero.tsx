import { useEffect, useState } from "react";
import { getDriverCountryFlag } from "../../constants/countryCodes";
import { driverImages } from "../../constants/driverImages";
import { CURRENT_SEASON } from "../../constants/seasons";
import type { Driver } from "../../types/driver";
import type { Constructor } from "../../types/constructor";
import type { DriverStanding } from "../../types/standings";
import type { Status } from "../../types/status";
import { getCurrentDriverConstructor } from "../../api/constructorsApi";

type DriverHeroProps = {
  driver: Driver;
  standing?: DriverStanding;
  standingStatus: Status;
};

export function DriverHero({
  driver,
  standing,
  standingStatus,
}: DriverHeroProps) {
  const [currentConstructor, setCurrentConstructor] = useState<Constructor>();
  const driverId = driver.driverId;

  useEffect(() => {
    async function fetchCurrentDriverConstructor() {
      if (!driverId) {
        return;
      }

      try {
        const data = await getCurrentDriverConstructor(driverId);
        setCurrentConstructor(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCurrentDriverConstructor();
  }, [driverId]);

  const isLeader = standing?.position === "1";

  return (
    <header className="driver-hero">
      <div className="page driver-hero__bar">
        <div className="driver-hero__photo">
          <img
            src={driverImages[driver.driverId]}
            alt={`${driver.givenName} ${driver.familyName}`}
          />
        </div>
        <div>
          <div className="driver-hero__tags">
            <span className="chip number">{driver.permanentNumber}</span>
            <span className="chip code">{driver.code}</span>
            <span className="chip nationality">
              <img
                className="flag-icon"
                src={getDriverCountryFlag(driver.nationality)}
                alt={driver.nationality}
              />
              {driver.nationality}
            </span>
          </div>
          <h1>{`${driver.givenName} ${driver.familyName}`}</h1>
          <div className="driver-hero__meta">
            <div className="team-badge">
              <span className="swatch"></span>
              Currently at <strong>{currentConstructor?.name}</strong>
            </div>

            {standingStatus === "loading" && (
              <span
                className="standing-badge standing-badge--skeleton"
                aria-hidden="true"
              />
            )}

            {standingStatus === "success" && standing && (
              <div
                className={`standing-badge${isLeader ? " standing-badge--leader" : ""}`}
              >
                <span className="standing-badge__pos">
                  P{standing.position}
                </span>
                <span className="standing-badge__meta">
                  {CURRENT_SEASON} · {standing.points} pts
                </span>
              </div>
            )}

            <a
              className="wiki-link"
              href={driver.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia profile →
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
