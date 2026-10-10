import dayjs from "dayjs";
import type { RaceBase } from "../types/race";

export function getRaceDateTime(race: RaceBase) {
  return dayjs(`${race.date}T${race.time ?? "00:00:00Z"}`);
}

export function getNextRace(races: RaceBase[]): RaceBase | undefined {
  const now = dayjs();
  return [...races]
    .sort((a, b) => getRaceDateTime(a).valueOf() - getRaceDateTime(b).valueOf())
    .find((race) => getRaceDateTime(race).valueOf() >= now.valueOf());
}

export function getLastRace(races: RaceBase[]): RaceBase | undefined {
  const now = dayjs();
  return [...races]
    .sort((a, b) => getRaceDateTime(b).valueOf() - getRaceDateTime(a).valueOf())
    .find((race) => getRaceDateTime(race).valueOf() < now.valueOf());
}

export const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" });
};
