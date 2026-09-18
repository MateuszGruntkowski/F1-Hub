import type { DriverStanding } from "./driverStanding";

export type Standing = {
  season: number;
  round: number;
  DriverStandings: DriverStanding[];
};
