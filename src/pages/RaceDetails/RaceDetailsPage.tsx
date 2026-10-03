import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getRace } from "../../api/racesApi";
import type { RaceBase } from "../../types/race";
import dayjs from "dayjs";
import { getCircuitDetails } from "../../types/circuit";
import type { Result } from "../../types/results";
import { getResults } from "../../api/resultsApi";
import "./RaceDetailsPage.css";
import { getRaceDateTime } from "../../utils/dateUtils";
import { RaceHeader } from "./RaceHeader";
import { Results } from "./Results";
import { TrackCard } from "./TrackCard";
import { TrackStats } from "./TrackStats";
import { Weather } from "./Weather";
import { Location } from "./Location";
import Spinner from "../../components/Spinner";
import type { Status } from "../../types/status";
import ErrorMessage from "../../components/ErrorMessage";

export function RaceDetailsPage() {
  const { season, round } = useParams();

  const [race, setRace] = useState<RaceBase>();
  const [results, setResults] = useState<Result[]>([]);
  const [raceStatus, setRaceStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!season || !round) {
      setRaceStatus("error");
      return;
    }

    let ignore = false;

    async function load(seasonParam: string, roundParam: string) {
      setRaceStatus("loading");

      try {
        const raceDetails = await getRace(seasonParam, roundParam);
        if (ignore) return;
        setRace(raceDetails);
        setRaceStatus("success");
      } catch (error) {
        if (ignore) return;
        console.error("getRace failed:", error);
        setRaceStatus("error");
        return;
      }

      try {
        const data = await getResults(seasonParam, roundParam);
        if (ignore) return;
        setResults(data);
      } catch (error) {
        if (ignore) return;
        console.error("getResults failed:", error);
      }
    }

    load(season, round);

    return () => {
      ignore = true;
    };
  }, [season, round]);

  if (raceStatus === "loading") {
    return (
      <section className="page-loading">
        <Spinner />
      </section>
    );
  }

  if (raceStatus === "error" || !race) {
    return (
      <section className="page-error">
        <ErrorMessage
          message="Couldn't load this race."
          backTo="/races"
          backLabel="← Back to races"
        />
      </section>
    );
  }

  const circuitDetails = getCircuitDetails(race.Circuit);

  if (!circuitDetails) {
    return (
      <section className="page-error">
        <ErrorMessage
          message="No circuit details available for this race."
          backTo="/races"
          backLabel="&larr; Back to races"
        />
      </section>
    );
  }

  const isCompleted = getRaceDateTime(race) < dayjs();

  return (
    <>
      <div className="breadcrumb page">
        <Link to="/races">&larr; Back to races</Link>
      </div>

      <RaceHeader
        circuitDetails={circuitDetails}
        isCompleted={isCompleted}
        race={race}
        round={round}
      />

      <section className="page content">
        <div>
          <TrackCard circuitDetails={circuitDetails} />
          <TrackStats circuitDetails={circuitDetails} />
        </div>

        <div className="sidebar-stack">
          <Location circuitDetails={circuitDetails} />
          <Weather Location={circuitDetails.Location} race={race} />
        </div>

        <Results race={race} isCompleted={isCompleted} results={results} />
      </section>
    </>
  );
}
