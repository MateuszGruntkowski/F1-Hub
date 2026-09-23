import { Link, NavLink } from "react-router";
import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="page header__bar">
        <Link to="/">
          <div className="header__brand">
            <span className="header__dot" />
            F1 Hub
          </div>
        </Link>
        <nav className="header__nav">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/races" className="nav-link">
            Races
          </NavLink>
          <NavLink to="/drivers" className="nav-link">
            Drivers
          </NavLink>
          <NavLink to="/standings" className="nav-link">
            Standings
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
