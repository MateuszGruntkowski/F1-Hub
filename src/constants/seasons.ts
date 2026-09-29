import dayjs from "dayjs";

const FIRST_SEASON_YEAR = 2000;
const CURRENT_SEASON_YEAR = dayjs().year();

export const FIRST_SEASON = String(FIRST_SEASON_YEAR);
export const CURRENT_SEASON = String(CURRENT_SEASON_YEAR);

function createSeasons(firstYear: number, currentYear: number): string[] {
  const seasons: string[] = [];

  for (let year = currentYear; year >= firstYear; year--) {
    seasons.push(String(year));
  }

  return seasons;
}

export const SEASONS: string[] = createSeasons(
  FIRST_SEASON_YEAR,
  CURRENT_SEASON_YEAR,
);
