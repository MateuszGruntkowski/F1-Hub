import type { CircuitDetails } from "../../types/circuit";

type TrackStatsProps = {
  circuitDetails: CircuitDetails;
};

export function TrackStats({ circuitDetails }: TrackStatsProps) {
  return (
    <div className="track-quick-facts">
      <div className="track-quick-fact">
        <div className="label">LAPS</div>
        <div className="value">{circuitDetails.raceLaps}</div>
      </div>
      <div className="track-quick-fact">
        <div className="label">RACE DISTANCE</div>
        <div className="value">{circuitDetails.raceDistanceKm} km</div>
      </div>
      <div className="track-quick-fact">
        <div className="label">CIRCUIT LENGTH</div>
        <div className="value">{circuitDetails.circuitLengthKm} km</div>
      </div>
      <div className="track-quick-fact">
        <div className="label">LAP RECORD</div>
        <div className="value">
          {circuitDetails.lapRecord?.time ?? "—"}
          {circuitDetails.lapRecord && (
            <small>
              {circuitDetails.lapRecord.driver}, {circuitDetails.lapRecord.year}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
