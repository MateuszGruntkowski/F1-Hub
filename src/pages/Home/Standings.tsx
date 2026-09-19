import { Link } from "react-router";
import { DriverStandings } from "./DriverStandings";
import { ConstructorStandings } from "./ConstructorStandings";

export function Standings() {
  return (
    <div>
      <div>
        <div>Championship standings</div>
        <Link to="/standings">Full standings</Link>
      </div>
      <div className="standings">
        <DriverStandings />
        <ConstructorStandings />
      </div>
    </div>
  );
}
