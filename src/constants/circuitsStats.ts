export type LapRecord = {
  time: string;
  driver: string;
  year: number;
};

// this is just the static data bag, not yet merged with the API's Circuit shape.
export type CircuitStats = {
  type: string;
  direction: "Clockwise" | "Anti-clockwise";
  circuitLengthKm: number;
  raceLaps: number;
  raceDistanceKm: number;
  lapRecord: LapRecord | null;
  image: string;
};

const circuitStats: Record<string, CircuitStats> = {
  albert_park: {
    type: "Street circuit",
    direction: "Clockwise",
    circuitLengthKm: 5.278,
    raceLaps: 58,
    raceDistanceKm: 306.124,
    lapRecord: { time: "1:19.813", driver: "C. Leclerc", year: 2024 },
    image: "/circuits/Albert_Park.avif",
  },
  shanghai: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 5.451,
    raceLaps: 56,
    raceDistanceKm: 305.066,
    lapRecord: { time: "1:32.238", driver: "M. Schumacher", year: 2004 },
    image: "/circuits/Shanghai.avif",
  },
  suzuka: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 5.807,
    raceLaps: 53,
    raceDistanceKm: 307.471,
    lapRecord: { time: "1:30.965", driver: "K. Antonelli", year: 2025 },
    image: "/circuits/Suzuka.avif",
  },
  sepang: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 5.412,
    raceLaps: 57,
    raceDistanceKm: 308.238,
    lapRecord: { time: "1:31.447", driver: "P. de la Rosa", year: 2005 },
    image: "/circuits/Bahrain.avif",
  },
  jeddah: {
    type: "Street circuit",
    direction: "Clockwise",
    circuitLengthKm: 6.174,
    raceLaps: 50,
    raceDistanceKm: 308.45,
    lapRecord: { time: "1:30.734", driver: "L. Hamilton", year: 2021 },
    image: "/circuits/Jeddah.avif",
  },
  miami: {
    type: "Street circuit",
    direction: "Clockwise",
    circuitLengthKm: 5.412,
    raceLaps: 57,
    raceDistanceKm: 308.326,
    lapRecord: { time: "1:29.708", driver: "M. Verstappen", year: 2023 },
    image: "/circuits/Miami.avif",
  },
  villeneuve: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 4.361,
    raceLaps: 70,
    raceDistanceKm: 305.27,
    lapRecord: { time: "1:13.078", driver: "V. Bottas", year: 2019 },
    image: "/circuits/Villeneuve.avif",
  },
  monaco: {
    type: "Street circuit",
    direction: "Clockwise",
    circuitLengthKm: 3.337,
    raceLaps: 78,
    raceDistanceKm: 260.286,
    lapRecord: { time: "1:12.909", driver: "L. Hamilton", year: 2021 },
    image: "/circuits/Monaco.avif",
  },
  catalunya: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 4.657,
    raceLaps: 66,
    raceDistanceKm: 307.236,
    lapRecord: { time: "1:15.743", driver: "O. Piastri", year: 2025 },
    image: "/circuits/Catalunya.avif",
  },
  red_bull_ring: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 4.318,
    raceLaps: 71,
    raceDistanceKm: 306.452,
    lapRecord: { time: "1:07.924", driver: "O. Piastri", year: 2025 },
    image: "/circuits/Red_Bull_Ring.avif",
  },
  silverstone: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 5.891,
    raceLaps: 52,
    raceDistanceKm: 306.198,
    lapRecord: { time: "1:27.097", driver: "M. Verstappen", year: 2020 },
    image: "/circuits/Silverstone.avif",
  },
  spa: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 7.004,
    raceLaps: 44,
    raceDistanceKm: 308.052,
    lapRecord: { time: "1:44.701", driver: "S. Pérez", year: 2024 },
    image: "/circuits/Spa.avif",
  },
  hungaroring: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 4.381,
    raceLaps: 70,
    raceDistanceKm: 306.63,
    lapRecord: { time: "1:16.627", driver: "L. Hamilton", year: 2020 },
    image: "/circuits/Hungaroring.avif",
  },
  zandvoort: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 4.259,
    raceLaps: 72,
    raceDistanceKm: 306.648,
    lapRecord: { time: "1:11.097", driver: "L. Hamilton", year: 2021 },
    image: "/circuits/Zandvoort.avif",
  },
  monza: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 5.793,
    raceLaps: 53,
    raceDistanceKm: 306.72,
    lapRecord: { time: "1:20.901", driver: "L. Norris", year: 2025 },
    image: "/circuits/Monza.avif",
  },
  madring: {
    type: "Street circuit",
    direction: "Clockwise",
    circuitLengthKm: 5.474,
    raceLaps: 57,
    raceDistanceKm: 308.5,
    lapRecord: null,
    image: "/circuits/Madring.avif",
  },
  baku: {
    type: "Street circuit",
    direction: "Clockwise",
    circuitLengthKm: 6.003,
    raceLaps: 51,
    raceDistanceKm: 306.049,
    lapRecord: { time: "1:43.009", driver: "C. Leclerc", year: 2019 },
    image: "/circuits/Baku.avif",
  },
  marina_bay: {
    type: "Street circuit",
    direction: "Anti-clockwise",
    circuitLengthKm: 4.927,
    raceLaps: 62,
    raceDistanceKm: 305.337,
    lapRecord: { time: "1:33.808", driver: "L. Hamilton", year: 2025 },
    image: "/circuits/Marina_Bay.avif",
  },
  americas: {
    type: "Race circuit",
    direction: "Anti-clockwise", // verify
    circuitLengthKm: 5.513,
    raceLaps: 56,
    raceDistanceKm: 308.405,
    lapRecord: { time: "1:36.169", driver: "C. Leclerc", year: 2019 },
    image: "/circuits/Americas.avif",
  },
  rodriguez: {
    type: "Race circuit",
    direction: "Clockwise",
    circuitLengthKm: 4.304,
    raceLaps: 71,
    raceDistanceKm: 305.354,
    lapRecord: { time: "1:17.774", driver: "V. Bottas", year: 2021 },
    image: "/circuits/Rodriguez.avif",
  },
  interlagos: {
    type: "Race circuit",
    direction: "Anti-clockwise",
    circuitLengthKm: 4.309,
    raceLaps: 71,
    raceDistanceKm: 305.909,
    lapRecord: { time: "1:10.540", driver: "V. Bottas", year: 2018 },
    image: "/circuits/Interlagos.avif",
  },
  las_vegas: {
    type: "Street circuit",
    direction: "Clockwise", // verify
    circuitLengthKm: 6.201,
    raceLaps: 50,
    raceDistanceKm: 309.958,
    lapRecord: { time: "1:33.365", driver: "M. Verstappen", year: 2025 },
    image: "/circuits/Las_Vegas.avif",
  },
  lusail: {
    type: "Race circuit",
    direction: "Clockwise", // verify
    circuitLengthKm: 5.419,
    raceLaps: 57,
    raceDistanceKm: 308.611,
    lapRecord: { time: "1:22.384", driver: "L. Norris", year: 2024 },
    image: "/circuits/Lusail.avif",
  },
  yas_marina: {
    type: "Race circuit",
    direction: "Anti-clockwise", // verify
    circuitLengthKm: 5.281,
    raceLaps: 58,
    raceDistanceKm: 306.183,
    lapRecord: { time: "1:26.725", driver: "C. Leclerc", year: 2025 },
    image: "/circuits/Yas_Marina.avif",
  },
};

export function getCircuitStats(circuitId: string): CircuitStats | undefined {
  return circuitStats[circuitId];
}
