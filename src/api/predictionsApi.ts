import axios from "axios";

// Adres serwisu z predykcjami (FastAPI). Dla Vite ustaw w .env:
// VITE_PREDICTIONS_API_URL=http://localhost:8000
const PREDICTIONS_API_URL: string =
  import.meta.env.VITE_PREDICTIONS_API_URL ?? "http://localhost:8000";

export interface DriverPrediction {
  driverId: string;
  driverCode: string | null;
  constructorId: string;
  // prawdopodobieństwa 0-1, np. 0.31 = 31%
  win: number;
  podium: number;
  top5: number;
  top10: number;
}

export interface PredictionsResponse {
  race: {
    season: string; // stringi, tak jak w Jolpica
    round: string;
    raceName: string;
    circuitId: string;
    date: string;
    isSprint: boolean;
  };
  model: { name: string; featureSet: string; trainedThrough: string };
  dataThrough: string;
  updatedAt: string;
  warning: string | null; // np. brak poprzedniej rundy w danych
  predictions: DriverPrediction[]; // posortowane malejąco po win
}

export const getPredictions = async (): Promise<PredictionsResponse> => {
  const { data } = await axios.get<PredictionsResponse>(
    `${PREDICTIONS_API_URL}/predictions`,
  );
  return data;
};

// Formatowanie do tabeli: 0.314 -> "31%"
export const formatPercent = (p: number): string => `${Math.round(p * 100)}%`;
