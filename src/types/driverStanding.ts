import type { Constructor } from "./constructor";
import type { Driver } from "./driver";

export type DriverStanding = {
  position: number;
  points: number;
  wins: number;
  Driver: Driver;
  Constructors: Constructor[];
};
