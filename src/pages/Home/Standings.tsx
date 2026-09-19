import { Link } from "react-router";
import { DriverStandings } from "./DriverStandings";
import { ConstructorStandings } from "./ConstructorStandings";

export function Standings() {
  return (
    <section className="standings-section">
      <div className="section-head">
        <h2>Championship standings</h2>
        <Link to="/standings">Full standings</Link>
      </div>
      <div className="standings">
        <DriverStandings />
        <ConstructorStandings />
      </div>
    </section>
  );
}
