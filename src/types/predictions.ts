export type DriverPrediction = {
  driverId: string;
  driverCode: string | null;
  constructorId: string;
  // e.g. 0.31 = 31%
  win: number;
  podium: number;
  top5: number;
  top10: number;
};

export type PredictionsResponse = {
  race: {
    season: string;
    round: string;
    raceName: string;
    circuitId: string;
    date: string;
    isSprint: boolean;
  };
  model: { name: string; featureSet: string; trainedThrough: string };
  dataThrough: string;
  updatedAt: string;
  warning: string | null;
  predictions: DriverPrediction[];
};
