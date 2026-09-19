import type { Circuit } from "./circuit";
import type { Session } from "./session";

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
