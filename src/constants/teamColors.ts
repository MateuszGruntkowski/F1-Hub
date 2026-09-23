export const TEAM_COLORS: Record<string, string> = {
  mclaren: "#F58000",
  red_bull: "#3671C6",
  ferrari: "#E8002D",
  mercedes: "#27F4D2",
  aston_martin: "#229971",
  williams: "#1868db",
  alpine: "#00A1E8",
  haas: "#dee1e2",
  rb: "#6692ff",
  sauber: "#52C41A",
  audi: "#ff2d00",
  cadillac: "#aaaaad",
};

export function getTeamColor(constructorId: string): string {
  return TEAM_COLORS[constructorId] ?? "#565c68";
}
