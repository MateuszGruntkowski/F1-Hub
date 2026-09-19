import { NavLink } from "react-router";
import "./Header.css";

export function Header() {
  return (
    <>
      <div className="header">
        <div className="left-section">F1 Hub</div>
        <div className="right-section">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/races">Races</NavLink>
          <NavLink to="/drivers">Drivers</NavLink>
          <NavLink to="/standings">Standings</NavLink>
        </div>
      </div>
    </>
  );
}
