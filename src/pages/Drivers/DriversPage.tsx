import { Link } from "react-router";
import "./DriversPage.css";
import { useDriverStandings } from "../../hooks/useDriverStandings";
import { DriversHeader } from "./DriversHeader";
import { DriversGrid } from "./DriversGrid";
import { CURRENT_SEASON } from "../../constants/seasons";

export function DriversPage() {
  const driverStandings = useDriverStandings(CURRENT_SEASON);
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
        <DriversHeader
          sortedDriversByConstructors={sortedDriversByConstructors}
        />

        <DriversGrid
          sortedDriversByConstructors={sortedDriversByConstructors}
        />
      </div>
    </>
  );
}
