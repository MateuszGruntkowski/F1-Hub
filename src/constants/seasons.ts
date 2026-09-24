import dayjs from "dayjs";

export const FIRST_SEASON = 2000;
export const CURRENT_SEASON = dayjs().year();

function createSeasons(firstSeason: number, currentSeason: number) {
  const seasons: number[] = [];

  for (let season = currentSeason; season >= firstSeason; season--) {
    seasons.push(season);
  }

  return seasons;
}

export const SEASONS: number[] = createSeasons(FIRST_SEASON, CURRENT_SEASON);
