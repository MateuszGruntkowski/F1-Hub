import { getCircuitStats, type CircuitStats } from "../constants/circuitsStats";
import type { Location } from "./location";

export type Circuit = {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Location;
};

export type CircuitDetails = Circuit & CircuitStats;

export function getCircuitDetails(
  circuit: Circuit,
): CircuitDetails | undefined {
  const stats = getCircuitStats(circuit.circuitId);
  if (!stats) return undefined;
  return { ...circuit, ...stats };
}
