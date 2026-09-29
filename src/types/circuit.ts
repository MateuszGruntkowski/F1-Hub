import { getCircuitStats, type CircuitStats } from "../constants/circuitsStats";

export type CircuitLocation = {
  lat: number;
  long: number;
  locality: string;
  country: string;
};

export type Circuit = {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: CircuitLocation;
};

export type CircuitDetails = Circuit & CircuitStats;

export function getCircuitDetails(
  circuit: Circuit,
): CircuitDetails | undefined {
  const stats = getCircuitStats(circuit.circuitId);
  if (!stats) return undefined;
  return { ...circuit, ...stats };
}
