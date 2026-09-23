import type { CircuitDetails } from "../../types/circuit";

type TrackCardProps = {
  circuitDetails: CircuitDetails;
};

export function TrackCard({ circuitDetails }: TrackCardProps) {
  return (
    <div className="track-card">
      {circuitDetails.image ? (
        <img
          className="track-card__image track-card__image--photo"
          src={circuitDetails.image}
          alt={circuitDetails.circuitName}
        />
      ) : (
        <div className="track-card__image">
          <div>
            <span className="placeholder-icon" aria-hidden="true">
              🏁
            </span>
            Track layout unavailable
          </div>
        </div>
      )}
      <div className="track-card__caption">
        <span>{circuitDetails.circuitName}</span>
        <span>{circuitDetails.circuitLengthKm} km</span>
      </div>
    </div>
  );
}
