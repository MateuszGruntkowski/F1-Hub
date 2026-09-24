import { useEffect, useState } from "react";
import { getWeather } from "../../api/weather/weather";
import type { Location } from "../../types/location";
import { getRaceDateTime } from "../../utils/dateUtils";
import type { RaceBase } from "../../types/race";
import type { Weather } from "../../types/weather";

type WeatherProps = {
  Location: Location;
  race: RaceBase;
};

export function Weather({ Location, race }: WeatherProps) {
  const [weather, setWeather] = useState<Weather | undefined>();
  const latitude = Location.lat;
  const longitude = Location.long;
  const raceDateTime = getRaceDateTime(race);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const data = await getWeather(
          latitude,
          longitude,
          raceDateTime.toISOString(),
        );
        setWeather(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchWeather();
  }, []);

  return (
    weather && (
      <div className="info-card weather-card">
        <h3>Weather</h3>
        <div className="weather-metrics">
          <div className="weather-metric">
            <div className="label">AIR TEMP</div>
            <div className="value">{weather?.temperature} &#x2103;</div>
          </div>
          <div className="weather-metric">
            <div className="label">RAIN CHANCE</div>
            <div className="value">{weather?.rainChance}%</div>
          </div>
          <div className="weather-metric">
            <div className="label">WIND</div>
            <div className="value">{weather?.wind} km/h</div>
          </div>
        </div>
        <div className="weather-card__note">Powered by Open Meteo</div>
      </div>
    )
  );
}
