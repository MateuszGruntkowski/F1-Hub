// 0.314 -> "31%"
export const formatPercent = (p: number): string => `${Math.round(p * 100)}%`;

// "max_verstappen" -> "Max Verstappen", "red_bull" -> "Red Bull"
export const snakeToTitleCase = (id: string): string =>
  id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
