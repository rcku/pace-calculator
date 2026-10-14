export const MILE_KM = 1.609344;
export type Race = readonly [name: string, distanceKm: number];
export type Unit = "km" | "mi";
export const races: readonly Race[] = [
  ["200 m", 0.2],
  ["400 m", 0.4],
  ["600 m", 0.6],
  ["800 m", 0.8],
  ["1 km", 1],
  ["1 mile", MILE_KM],
  ["2 km", 2],
  ["3 km", 3],
  ["4 km", 4],
  ["5 km", 5],
  ["10 km", 10],
  ["15 km", 15],
  ["20 km", 20],
  ["Half marathon", 21.0975],
  ["25 km", 25],
  ["30 km", 30],
  ["35 km", 35],
  ["Marathon", 42.195],
];

export const raceDistances = races.filter(([, km]) => km >= 5);
export const equivalentRaces = races.filter(([, km]) =>
  [5, 10, 21.0975, 42.195].includes(km),
);
export const milesText = (km: number) => `${(km / MILE_KM).toFixed(2)} mi`;
export const unitLabel = (unit: Unit) => (unit === "mi" ? "mile" : "km");
