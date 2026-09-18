import type { Circuit } from "./circuit";

export type Race = {
  season: string;
  round: string;
  url: string;
  raceName: string;
  date: string;
  Circuit: Circuit;
};
