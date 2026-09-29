import axios from "axios";

export async function getConstructorStandings(season: string) {
  const response = await axios.get(
    `https://api.jolpi.ca/ergast/f1/${season}/constructorstandings/`,
  );

  return (
    response.data.MRData.StandingsTable.StandingsLists[0]
      ?.ConstructorStandings ?? []
  );
}
