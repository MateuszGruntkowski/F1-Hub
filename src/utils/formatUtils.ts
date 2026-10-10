// 0.314 -> "31%"
export function formatPercent(p: number): string {
  return `${Math.round(p * 100)}%`;
}

// "max_verstappen" -> "Max Verstappen", "red_bull" -> "Red Bull"
export function snakeToTitleCase(id: string): string {
  return id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
