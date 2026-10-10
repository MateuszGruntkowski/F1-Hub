import axios from "axios";
import type { PredictionsResponse } from "../types/predictions";

// VITE_PREDICTIONS_API_URL=http://localhost:8000
const PREDICTIONS_API_URL: string =
  import.meta.env.VITE_PREDICTIONS_API_URL ?? "http://localhost:8000";

export const getPredictions = async (): Promise<PredictionsResponse> => {
  const { data } = await axios.get<PredictionsResponse>(
    `${PREDICTIONS_API_URL}/predictions`,
  );
  return data;
};
