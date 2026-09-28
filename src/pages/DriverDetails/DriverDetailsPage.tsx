import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getAllDriverResults } from "../../api/resultsApi";
import type { RaceWithResults } from "../../types/race";
import type { DriverStats } from "../../types/driverStats";
import dayjs from "dayjs";
import type { SeasonStats } from "../../types/season";
import { getCurrentDriverConstructor, getDriver } from "../../api/driversApi";
import type { Constructor } from "../../types/constructor";
import type { Driver } from "../../types/driver";
import { driverImages } from "../../constants/driverImages";
import { getDriverCountryFlag } from "../../constants/countryCodes";
import "./DriverDetailsPage.css";

export function DriverDetailsPage() {
  const params = useParams();
  const driverId = params.driverId;
  const [driver, setDriver] = useState<Driver>();
  const [currentConstructor, setCurrentConstructor] = useState<Constructor>();
  const [driverStats, setDriverStats] = useState<DriverStats>();

  useEffect(() => {
    async function fetchDriver() {
      if (!driverId) {
        return;
      }

      try {
        const data = await getDriver(driverId);
        setDriver(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDriver();
  }, [driverId]);

  useEffect(() => {
    async function fetchAllDriverResults() {
      if (!driverId) {
        return;
      }

      try {
        const data = await getAllDriverResults(driverId);
        countStats(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllDriverResults();
  }, [driverId]);

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

  function countStats(career: RaceWithResults[]) {
    const statsBySeasonMap: Record<string, SeasonStats> = {};

    for (const race of career) {
      const season = race.season;
      if (!season) {
        continue;
      }

      const result = race.Results.at(0);
      const position = Number(result?.position);
      const grid = Number(result?.grid);
      const points = Number(result?.points ?? 0);
      const team = result?.Constructor?.name ?? "Unknown";

      statsBySeasonMap[season] ??= {
        season,
        team,
        wins: 0,
        points: 0,
        podiums: 0,
        polePositions: 0,
      };

      const seasonStats = statsBySeasonMap[season];

      seasonStats.team = team;
      seasonStats.points += points;
      if (position === 1) {
        seasonStats.wins++;
      }
      if (position <= 3) {
        seasonStats.podiums++;
      }
      if (grid === 1) {
        seasonStats.polePositions++;
      }
    }

    const statsBySeason = Object.values(statsBySeasonMap).sort((a, b) =>
      a.season.localeCompare(b.season),
    );

    setDriverStats({
      totalWins: statsBySeason.reduce((sum, s) => sum + s.wins, 0),
      totalPodiums: statsBySeason.reduce((sum, s) => sum + s.podiums, 0),
      totalPolePositions: statsBySeason.reduce(
        (sum, s) => sum + s.polePositions,
        0,
      ),
      totalPoints: statsBySeason.reduce((sum, s) => sum + s.points, 0),
      statsBySeason,
    });
  }

  function countAge(birthday: string | undefined) {
    if (!birthday) {
      return;
    }

    const today = dayjs();
    const convertedBirthday = dayjs(birthday);
    let age = today.year() - convertedBirthday.year();

    if (
      convertedBirthday.month() > today.month() ||
      (convertedBirthday.month() === today.month() &&
        convertedBirthday.date() > today.date())
    ) {
      age--;
    }
    return age;
  }

  if (!driver) {
    return (
      <section className="page driver-details-content">
        <div>Cannot load driver</div>
      </section>
    );
  }

  return (
    <>
      <div className="breadcrumb page">
        <Link to="/drivers">← Back to drivers</Link>
      </div>

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

      <section className="page driver-details-content">
        <div className="quick-facts">
          <div className="quick-fact">
            <div className="label">AGE</div>
            <div className="value">{countAge(driver.dateOfBirth)}</div>
          </div>
          <div className="quick-fact">
            <div className="label">BORN</div>
            <div className="value">
              {dayjs(driver.dateOfBirth).format("D MMM YYYY")}
            </div>
          </div>
          <div className="quick-fact">
            <div className="label">TOTAL WINS</div>
            <div className="value">{driverStats?.totalWins}</div>
          </div>
          <div className="quick-fact">
            <div className="label">PODIUMS</div>
            <div className="value">{driverStats?.totalPodiums}</div>
          </div>
          <div className="quick-fact">
            <div className="label">POLE POSITIONS</div>
            <div className="value">{driverStats?.totalPolePositions}</div>
          </div>
        </div>

        <div>
          <div className="section-head">
            <h2>Stats by Season</h2>
          </div>
          <div className="season-table">
            <div className="season-legend">
              SEASON · TEAM · WINS · PODIUMS · POLES · POINTS
            </div>
            {driverStats?.statsBySeason.map((seasonStats) => (
              <div className="season-row" key={seasonStats.season}>
                <div className="season">{seasonStats.season}</div>
                <div className="team">{seasonStats.team}</div>
                <div className="stat-count">{seasonStats.wins}</div>
                <div className="stat-count">{seasonStats.podiums}</div>
                <div className="stat-count">{seasonStats.polePositions}</div>
                <div className="stat-count">{seasonStats.points}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
