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

export function RaceDetailsPage() {
  const params = useParams();
  const { season, round } = params;

  const [race, setRace] = useState<RaceBase>();
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    async function fetchRaceData() {
      try {
        const raceDetails = await getRace(Number(season), Number(round));
        setRace(raceDetails);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRaceData();
  }, [season, round]);

  useEffect(() => {
    async function fetchResults() {
      try {
        const results = await getResults(season, round);
        setResults(results);
      } catch (error) {
        console.log(error);
      }
    }
    fetchResults();
  }, [season, round]);

  if (!race) {
    return <div className="page state-message">Loading race...</div>;
  }

  const circuitDetails = getCircuitDetails(race.Circuit);

  if (!circuitDetails) {
    return <div className="page state-message">Loading circuit details...</div>;
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
          <Weather />
        </div>

        <Results race={race} isCompleted={isCompleted} results={results} />
      </section>
    </>
  );
}
