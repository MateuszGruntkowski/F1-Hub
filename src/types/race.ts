import type { Circuit } from "./circuit";
import type { Result } from "./results";

export type RaceBase = {
  season: string;
  round: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time?: string;
};

export type RaceSchedule = RaceBase & {
  FirstPractice?: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  Qualifying?: Session;
  Sprint?: Session;
  SprintQualifying?: Session;
  SprintShootout?: Session;
};

export type RaceWithResults = RaceBase & {
  Results: Result[];
};

export type Session = {
  date: string;
  time?: string;
};
