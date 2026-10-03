import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getAllDriverResults } from "../../api/resultsApi";
import type { DriverTotalStats } from "../../types/driverStats";
import { getDriver } from "../../api/driversApi";
import type { Driver } from "../../types/driver";
import "./DriverDetailsPage.css";
import { DriverHero } from "./DriverHero";
import { DriverCareerStats } from "./DriverCareerStats";
import { DriverSeasonStatsTable } from "./DriverSeasonStatsTable";
import Spinner from "../../components/Spinner";
import type { Status } from "../../types/status";
import ErrorMessage from "../../components/ErrorMessage";
import DriverCharts from "./Charts/DriverCharts";
import { calculateDriverStats } from "./calculateDriverStats";

export function DriverDetailsPage() {
  const { driverId } = useParams();
  const [driver, setDriver] = useState<Driver>();
  const [driverStats, setDriverStats] = useState<DriverTotalStats>();

  const [driverStatus, setDriverStatus] = useState<Status>("loading");
  const [statsStatus, setStatsStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!driverId) {
      setDriverStatus("error");
      return;
    }

    let ignore = false;

    async function load(id: string) {
      setDriverStatus("loading");
      setStatsStatus("loading");

      try {
        const driverData = await getDriver(id);
        if (ignore) return;
        setDriver(driverData);
        setDriverStatus("success");
      } catch (error) {
        if (ignore) return;
        console.error("getDriver failed:", error);
        setDriverStatus("error");
        return;
      }

      try {
        const results = await getAllDriverResults(id);
        if (ignore) return;
        setDriverStats(calculateDriverStats(results));
        setStatsStatus("success");
      } catch (error) {
        if (ignore) return;
        console.error("getAllDriverResults failed:", error);
        setStatsStatus("error");
      }
    }

    load(driverId);

    return () => {
      ignore = true;
    };
  }, [driverId, attempt]);

  if (driverStatus === "loading") {
    return (
      <section className="page-loading">
        <Spinner />
      </section>
    );
  }

  if (driverStatus === "error" || !driver) {
    return (
      <section className="page-error">
        <ErrorMessage
          message="Couldn't load this driver."
          backTo="/drivers"
          backLabel="← Back to drivers"
        />
      </section>
    );
  }

  return (
    <>
      <div className="breadcrumb page">
        <Link to="/drivers">← Back to drivers</Link>
      </div>

      <DriverHero driver={driver} />

      <section className="page driver-details-content">
        {statsStatus === "loading" && (
          <div className="page-loading">
            <Spinner />
          </div>
        )}

        {statsStatus === "error" && (
          <div className="page-error">
            <ErrorMessage
              message="Couldn't load career stats."
              onRetry={() => setAttempt((n) => n + 1)}
            />
          </div>
        )}

        {statsStatus === "success" && driverStats && (
          <>
            <DriverCareerStats driver={driver} driverStats={driverStats} />
            <div className="stats-section-head">
              <h2>Stats by Season</h2>
            </div>
            <DriverCharts statsBySeason={driverStats.statsBySeason} />
            <DriverSeasonStatsTable driverStats={driverStats} />
          </>
        )}
      </section>
    </>
  );
}
