import { Link } from "react-router";
import { driverImages } from "../../constants/driverImages";
import { getTeamColor } from "../../constants/teamColors";
import "./DriversPage.css";
import { useDriverStandings } from "../../hooks/useDriverStandings";

export function DriversPage() {
  const driverStandings = useDriverStandings();
  const sortedDriversByConstructors = [...driverStandings].sort((a, b) => {
    const teamA = a.Constructors.at(-1)?.name ?? "";
    const teamB = b.Constructors.at(-1)?.name ?? "";
    return teamA.localeCompare(teamB);
  });

  return (
    <>
      <div className="breadcrumb page">
        <Link to="/">&larr; Back to home</Link>
      </div>

      <div className="page">
        <div className="drivers-header">
          <h1>Drivers</h1>
          <div className="count">
            <strong>{sortedDriversByConstructors.length}</strong> drivers this
            season
          </div>
        </div>

        <div className="driver-grid">
          {sortedDriversByConstructors.map((standing) => {
            const { Driver, Constructors } = standing;
            const currentTeam = Constructors.at(-1);

            const photo = driverImages[Driver.driverId];

            return (
              <div key={Driver.driverId} className="driver-card">
                <div className="driver-card__photo">
                  {photo ? (
                    <img
                      src={photo}
                      alt={`${Driver.givenName} ${Driver.familyName}`}
                    />
                  ) : (
                    <span className="placeholder-icon" aria-hidden="true">
                      🏎️
                    </span>
                  )}
                  {Driver.permanentNumber && (
                    <span className="driver-card__number">
                      {Driver.permanentNumber}
                    </span>
                  )}
                  {Driver.code && (
                    <span className="driver-card__code">{Driver.code}</span>
                  )}
                </div>

                <div className="driver-card__body">
                  <div className="driver-card__name">
                    {Driver.givenName} {Driver.familyName}
                  </div>
                  <div className="driver-card__nationality">
                    {Driver.nationality}
                  </div>

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

                  <Link
                    to={`/drivers/${Driver.driverId}`}
                    className="driver-card__link"
                  >
                    View profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
