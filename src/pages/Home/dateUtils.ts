import dayjs from "dayjs";
import type { RaceBase } from "../../types/race";

export function getRaceDateTime(race: RaceBase) {
  return dayjs(`${race.date}T${race.time ?? "00:00:00Z"}`);
}
