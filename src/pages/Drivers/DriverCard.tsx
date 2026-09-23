import { Link } from "react-router";
import { getTeamColor } from "../../constants/teamColors";
import type { Driver } from "../../types/driver";
import type { Constructor } from "../../types/constructor";

type DriverCardProps = {
  Driver: Driver;
  currentTeam?: Constructor;
  photo: string;
};

export function DriverCard({ Driver, currentTeam, photo }: DriverCardProps) {
  return (
    <div className="driver-card">
      <div className="driver-card__photo">
        {photo ? (
          <img src={photo} alt={`${Driver.givenName} ${Driver.familyName}`} />
        ) : (
          <span className="placeholder-icon" aria-hidden="true">
            🏎️
          </span>
        )}
        {Driver.permanentNumber && (
          <span className="driver-card__number">{Driver.permanentNumber}</span>
        )}
        {Driver.code && (
          <span className="driver-card__code">{Driver.code}</span>
        )}
      </div>

      <div className="driver-card__body">
        <div className="driver-card__name">
          {Driver.givenName} {Driver.familyName}
        </div>
        <div className="driver-card__nationality">{Driver.nationality}</div>

        {currentTeam && (
          <div className="sub">
            <span
              className="team-swatch"
              style={{
                background: getTeamColor(currentTeam.constructorId),
              }}
            />
            {currentTeam.name}
          </div>
        )}

        <Link to={`/drivers/${Driver.driverId}`} className="driver-card__link">
          View profile →
        </Link>
      </div>
    </div>
  );
}
