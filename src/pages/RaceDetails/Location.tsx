import { getRaceCountryFlag } from "../../constants/countryCodes";
import type { CircuitDetails } from "../../types/circuit";

type LocationProps = {
  circuitDetails: CircuitDetails;
};

export function Location({ circuitDetails }: LocationProps) {
  const country = circuitDetails.Location.country;
  const flag = getRaceCountryFlag(country);

  return (
    <div className="info-card">
      <h3>Location</h3>
      <div className="info-row">
        <span className="k">Country</span>
        <span className="v info-row__country">
          {flag && <img src={flag} alt={country} className="info-row__flag" />}
          {country}
        </span>
      </div>
      <div className="info-row">
        <span className="k">Locality</span>
        <span className="v">{circuitDetails.Location.locality}</span>
      </div>
      <div className="info-row">
        <span className="k">Type</span>
        <span className="v">{circuitDetails.type}</span>
      </div>
      <div className="info-row">
        <span className="k">Direction</span>
        <span className="v">{circuitDetails.direction}</span>
      </div>
    </div>
  );
}
