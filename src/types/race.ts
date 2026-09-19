import type { Circuit } from "./circuit";

export type Race = {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time: string;
  Circuit: Circuit;
};
