import { NavLink } from "react-router";
import "./Header.css";

export function Header() {
  return (
    <>
      <div className="header">
        <div>F1 Hub</div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/races">Races</NavLink>
        <NavLink to="/drivers">Drivers</NavLink>
        <NavLink to="/standings">Standings</NavLink>
        <div>2026 season</div>
      </div>
    </>
  );
}
