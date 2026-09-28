import axios from "axios";

export async function getResults(season?: string, round?: string) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/${round}/results/`,
  );
  return response.data.MRData.RaceTable.Races[0]?.Results ?? [];
}

type PaginationParams = {
  limit: number;
  offset: number;
};

export async function getDriverResults(
  driverId: string,
  params: PaginationParams,
) {
  const { limit, offset } = params;

  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/results/?limit=${limit}&offset=${offset}`,
  );
  return response.data.MRData;
}

export async function getAllDriverResults(driverId: string) {
  const pageSize = 100;

  const first = await getDriverResults(driverId, {
    limit: pageSize,
    offset: 0,
  });

  const total = Number(first.total);

  const remainingOffsets = [];
  for (let offset = pageSize; offset < total; offset += pageSize) {
    remainingOffsets.push(offset);
  }

  const restPromises = [];
  for (const offset of remainingOffsets) {
    const promise = getDriverResults(driverId, {
      limit: pageSize,
      offset: offset,
    });
    restPromises.push(promise);
  }

  const rest = await Promise.all(restPromises);
  const allPages = [first, ...rest];

  const allResults = [];
  for (const page of allPages) {
    allResults.push(...page.RaceTable.Races);
  }

  return allResults;
}
