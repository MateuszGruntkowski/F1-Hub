export const TEAM_COLORS: Record<string, string> = {
  mclaren: "#F58020",
  red_bull: "#3671C6",
  ferrari: "#E8002D",
  mercedes: "#27F4D2",
  aston_martin: "#229971",
  williams: "#0093CC",
  alpine: "#00A3E0",
  haas: "#B6BABD",
  rb: "#6C98FF",
  sauber: "#52C41A",
};

export function getTeamColor(constructorId: string): string {
  return TEAM_COLORS[constructorId] ?? "#565c68";
}
