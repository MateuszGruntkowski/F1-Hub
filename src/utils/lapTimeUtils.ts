export function parseLapTimeToMs(time?: string): number | null {
  if (!time) return null;
  const match = time.match(/^(?:(\d+):)?(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const minutes = match[1] ? Number(match[1]) : 0;
  const seconds = Number(match[2]);
  if (Number.isNaN(minutes) || Number.isNaN(seconds)) return null;
  return minutes * 60_000 + seconds * 1000;
}
