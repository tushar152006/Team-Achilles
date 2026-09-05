export type Ward = {
  id: string;
  name: string;
  profile: string;
  density: string;
  vulnerability: number;
  anomaly: number;
  solarDelta: number;
  population: string;
  forecast: number[];
  coordinates: [number, number][];
};

export const wards: Ward[] = [
  {
    id: "mandideep",
    name: "Mandideep Industrial Belt",
    profile: "Dense industrial zone",
    density: "18,200 / km2",
    vulnerability: 81,
    anomaly: 3.7,
    solarDelta: 8,
    population: "1.26 lakh",
    forecast: [39.1, 40.4, 38.8],
    coordinates: [
      [23.215, 77.392],
      [23.226, 77.445],
      [23.19, 77.468],
      [23.17, 77.425],
    ],
  },
  {
    id: "tin-shelter",
    name: "Arera Tin-Roof Settlement",
    profile: "Concrete slum area",
    density: "32,700 / km2",
    vulnerability: 94,
    anomaly: 4.2,
    solarDelta: 12,
    population: "86,000",
    forecast: [41.6, 43.2, 42.4],
    coordinates: [
      [23.245, 77.405],
      [23.264, 77.45],
      [23.235, 77.477],
      [23.215, 77.433],
    ],
  },
  {
    id: "mp-nagar",
    name: "MP Nagar Commercial Core",
    profile: "Transit and market district",
    density: "24,500 / km2",
    vulnerability: 76,
    anomaly: 2.8,
    solarDelta: 9,
    population: "1.72 lakh",
    forecast: [38.2, 39.7, 38.9],
    coordinates: [
      [23.235, 77.395],
      [23.258, 77.391],
      [23.274, 77.421],
      [23.25, 77.438],
    ],
  },
  {
    id: "upper-lake",
    name: "Upper Lake Green Buffer",
    profile: "Green lake park",
    density: "4,100 / km2",
    vulnerability: 31,
    anomaly: -1.6,
    solarDelta: 2,
    population: "28,000",
    forecast: [31.7, 32.3, 31.2],
    coordinates: [
      [23.27, 77.31],
      [23.303, 77.347],
      [23.287, 77.389],
      [23.246, 77.365],
    ],
  },
  {
    id: "kolar",
    name: "Kolar Residential Suburb",
    profile: "Residential suburb",
    density: "10,800 / km2",
    vulnerability: 48,
    anomaly: 1.4,
    solarDelta: 5,
    population: "2.08 lakh",
    forecast: [34.6, 35.2, 34.1],
    coordinates: [
      [23.168, 77.39],
      [23.196, 77.371],
      [23.219, 77.397],
      [23.191, 77.429],
    ],
  },
  {
    id: "railway",
    name: "Habibganj Transit Corridor",
    profile: "Rail, bus and delivery hub",
    density: "21,900 / km2",
    vulnerability: 69,
    anomaly: 2.3,
    solarDelta: 10,
    population: "94,000",
    forecast: [37.4, 38.6, 37.9],
    coordinates: [
      [23.226, 77.432],
      [23.255, 77.443],
      [23.253, 77.481],
      [23.219, 77.474],
    ],
  },
];
