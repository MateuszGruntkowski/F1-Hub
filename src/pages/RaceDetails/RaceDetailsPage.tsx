import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getRace } from "../../api/racesApi";
import type { RaceBase } from "../../types/race";
import dayjs from "dayjs";
import { getCircuitDetails } from "../../types/circuit";
import type { Result } from "../../types/results";
import { getResults } from "../../api/resultsApi";
import "./RaceDetailsPage.css";
import type { Driver } from "../../types/driver";
import { getRaceDateTime } from "../../utils/dateUtils";

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
    return <div>Loading race...</div>;
  }

  const circuitDetails = getCircuitDetails(race.Circuit);

  if (!circuitDetails) {
    return <div>Loading circuit details...</div>;
  }

  const fastestLap: string | undefined = [...results].sort(
    (a, b) => Number(a.FastestLap?.Time.time) - Number(b.FastestLap?.Time.time),
  )[0]?.FastestLap?.Time.time;

  const fastestDriver: Driver | undefined = [...results].find(
    (r) => r.FastestLap?.Time.time === fastestLap,
  )?.Driver;

  return (
    <>
      <Link to="/races">&larr; Back to races</Link>
      <div>
        <div>Round {round}</div>
        <div>{getRaceDateTime(race) < dayjs() ? "Completed" : "Upcoming"}</div>
      </div>
      <div>
        <div>{race.raceName}</div>
        <div>
          <div>
            <div>{circuitDetails.circuitName}</div>
            <div>Circuit</div>
          </div>
          <div>
            <div>{circuitDetails.Location.country}</div>
            <div>Location</div>
          </div>
          <div>
            <div>{dayjs(race.date).format("ddd, D MMM YYYY")}</div>
            <div>Race day</div>
          </div>
          <div>
            <div>{race.time?.slice(0, 5)} UTC</div>
            <div>Lights out</div>
          </div>
        </div>
      </div>
      <div>
        <img
          src={`${circuitDetails?.image}`}
          width={400}
          alt={circuitDetails.circuitName}
        />
        <div>
          <div>{circuitDetails.circuitName}</div>
          <div>{circuitDetails.circuitLengthKm} km</div>
        </div>
      </div>

      <div>
        <div>Location</div>
        <div>
          <div>Country</div>
          <div>{circuitDetails.Location.country}</div>
        </div>
        <div>
          <div>Locality</div>
          <div>{circuitDetails.Location.locality}</div>
        </div>
        <div>
          <div>Type</div>
          <div>{circuitDetails.type}</div>
        </div>
        <div>
          <div>Dircetion</div>
          <div>{circuitDetails.direction}</div>
        </div>
      </div>

      <div>
        <div>
          <div>Laps</div>
          <div>{circuitDetails.raceLaps}</div>
        </div>
        <div>
          <div>Circuit Length</div>
          <div>{circuitDetails.circuitLengthKm}</div>
        </div>
        <div>
          <div>Race distance</div>
          <div>{circuitDetails.raceDistanceKm}</div>
        </div>
        <div>
          <div>Lap Record</div>
          <div>
            <div>{circuitDetails.lapRecord?.time}</div>
            <div>
              {circuitDetails.lapRecord?.driver}{" "}
              {circuitDetails.lapRecord?.year}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div>Race result</div>
        <div>
          Fastest lap: {fastestLap} -{" "}
          {`${fastestDriver?.givenName} ${fastestDriver?.familyName}`}
        </div>
      </div>

      <div className="results">
        {[...results]
          .sort((a, b) => a.position - b.position)
          .map((result) => {
            const gainedPositions: number = result.grid - result.position;
            return (
              <div key={result.Driver.driverId}>
                <div>{result.position}</div>
                <div>
                  {result.Driver.givenName} {result.Driver.familyName}
                </div>
                <div>{result.Constructor.name}</div>
                <div>
                  <div>{`P${result.grid}`}</div>
                  <div>
                    {gainedPositions > 0
                      ? "strzałka w góre"
                      : gainedPositions < 0
                        ? "strzałka w dół"
                        : "nic"}
                  </div>
                </div>
                <div>{result.FastestLap?.Time.time}</div>
                <div>{result.Time?.time}</div>
                <div>{result.points}</div>
              </div>
            );
          })}
      </div>
    </>
  );
}
