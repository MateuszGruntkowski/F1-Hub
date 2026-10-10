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

// "2026-10-10T12:22:00Z" -> "10 Oct 2026, 14:22"
export function formatDateTime(iso: string): string {
  const d = dayjs(iso);
  return d.isValid() ? d.format("D MMM YYYY, HH:mm") : iso;
}
