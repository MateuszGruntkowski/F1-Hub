export function Weather() {
  return (
    <div className="info-card weather-card">
      <h3>Weather</h3>
      <div className="weather-metrics">
        <div className="weather-metric">
          <div className="label">AIR TEMP</div>
          <div className="value">—</div>
        </div>
        <div className="weather-metric">
          <div className="label">TRACK TEMP</div>
          <div className="value">—</div>
        </div>
        <div className="weather-metric">
          <div className="label">RAIN CHANCE</div>
          <div className="value">—</div>
        </div>
        <div className="weather-metric">
          <div className="label">WIND</div>
          <div className="value">—</div>
        </div>
      </div>
      <div className="weather-card__note">Forecast not connected yet</div>
    </div>
  );
}
