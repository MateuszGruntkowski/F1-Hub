import type { Constructor } from "./constructor";
import type { Driver } from "./driver";

export type Result = {
  number: string;
  position: number;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: { millis: string; time: string };
  FastestLap?: FastestLap;
};

export type FastestLap = {
  rank: string;
  lap: string;
  Time: { time: string };
  AverageSpeed: { units: string; speed: string };
};
