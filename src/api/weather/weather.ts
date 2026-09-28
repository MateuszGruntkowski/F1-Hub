import axios from "axios";
import type { Weather } from "../../types/weather";

export async function getWeather(
  latitude: number,
  longitude: number,
  date: string,
): Promise<Weather | undefined> {
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,precipitation_probability`,
  );
  const formattedDate = date.slice(0, 16);

  const dateIndex = response.data.hourly.time.indexOf(formattedDate);
  if (dateIndex === -1) {
    return;
  }
  const temperature_2m = response.data.hourly.temperature_2m.at(dateIndex);
  const wind_speed_10m = response.data.hourly.wind_speed_10m.at(dateIndex);
  const precipitation_probability =
    response.data.hourly.precipitation_probability.at(dateIndex);

  return {
    temperature: temperature_2m,
    wind: wind_speed_10m,
    rainChance: precipitation_probability,
  };
}
