export type Pollutant = {
  name: string;
  value: number;
  unit: string;
  status: "Good" | "Moderate" | "Poor" | "Hazardous";
  color: string;
};

export type HourlyForecast = {
  time: string;
  timestamp: number;
  tempC: number;
  feelsLikeC: number;
  utciC: number;
  condition: string;
  icon: "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "stormy" | "night";
  precipChance: number;
  windSpeedKmh: number;
  humidity: number;
  isCurfew?: boolean;
};

export type DailyForecast = {
  day: string;
  date: string;
  condition: string;
  icon: "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "stormy";
  precipChance: number;
  highC: number;
  lowC: number;
  utciMaxC: number;
  windKmh: number;
  windDir: string;
  humidity: number;
  summary: string;
};

export type WeatherAlert = {
  id: string;
  severity: "danger" | "warning" | "info";
  headline: string;
  source: string;
  effective: string;
  description: string;
  instructions: string[];
};

export type CityData = {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  elevation: string;
  updatedAt: string;
  current: {
    tempC: number;
    condition: string;
    feelsLikeC: number;
    utciC: number;
    highC: number;
    lowC: number;
    wetBulbC: number;
    humidity: number;
    windSpeedKmh: number;
    windGustKmh: number;
    windDirectionDeg: number;
    windDirectionText: string;
    pressureHpa: number;
    pressureTrend: "rising" | "falling" | "steady";
    dewPointC: number;
    visibilityKm: number;
    uvIndex: number;
    uvLevel: "Low" | "Moderate" | "High" | "Very High" | "Extreme";
    cloudCoverPct: number;
    airQualityIndex: number;
    aqiCategory: "Good" | "Moderate" | "Unhealthy for Sensitive" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
    aqiColor: string;
    narrative: string;
  };
  pollutants: Pollutant[];
  astronomy: {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    daylightHours: string;
    currentTimePercent: number; // 0-100 for 24-hr slider
    moonPhase: string;
    moonIlluminationPct: number;
    moonRise: string;
    moonSet: string;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
};

export const CITIES_DATA: Record<string, CityData> = {
  "Hadgaon": {
    id: "hadgaon",
    name: "Hadgaon",
    state: "Maharashtra",
    country: "India",
    lat: 19.498,
    lon: 77.658,
    elevation: "414m MSL",
    updatedAt: "2:30 PM IST",
    current: {
      tempC: 38.5,
      condition: "Humid Heat Trap & Clear Sky",
      feelsLikeC: 45.8,
      utciC: 48.4,
      highC: 41.2,
      lowC: 27.4,
      wetBulbC: 30.6,
      humidity: 58,
      windSpeedKmh: 14,
      windGustKmh: 22,
      windDirectionDeg: 315, // NW
      windDirectionText: "NW",
      pressureHpa: 1009,
      pressureTrend: "steady",
      dewPointC: 22.8,
      visibilityKm: 9.5,
      uvIndex: 11,
      uvLevel: "Extreme",
      cloudCoverPct: 15,
      airQualityIndex: 122,
      aqiCategory: "Unhealthy for Sensitive",
      aqiColor: "#B46A00",
      narrative:
        "Dangerous daytime thermal stress across Marathwada. High ambient heat combined with elevated dew point significantly limits perspiration evaporation, causing UTCI thermal stress to exceed 48°C.",
    },
    pollutants: [
      { name: "PM2.5", value: 46.2, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
      { name: "PM10", value: 88.4, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
      { name: "O₃", value: 68.1, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
      { name: "NO₂", value: 24.5, unit: "µg/m³", status: "Good", color: "#107C10" },
      { name: "SO₂", value: 12.8, unit: "µg/m³", status: "Good", color: "#107C10" },
      { name: "CO", value: 580, unit: "µg/m³", status: "Good", color: "#107C10" },
    ],
    astronomy: {
      sunrise: "06:06 AM",
      sunset: "06:38 PM",
      solarNoon: "12:22 PM",
      daylightHours: "12h 32m",
      currentTimePercent: 60.4, // ~14:30
      moonPhase: "Waxing Gibbous",
      moonIlluminationPct: 79,
      moonRise: "04:15 PM",
      moonSet: "03:45 AM",
    },
    hourly: [
      { time: "Now", timestamp: 14.5, tempC: 38.5, feelsLikeC: 45.8, utciC: 48.4, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 14, humidity: 58, isCurfew: true },
      { time: "3 PM", timestamp: 15, tempC: 40.2, feelsLikeC: 48.1, utciC: 50.8, condition: "Intense Sun", icon: "sunny", precipChance: 0, windSpeedKmh: 16, humidity: 54, isCurfew: true },
      { time: "4 PM", timestamp: 16, tempC: 39.8, feelsLikeC: 47.4, utciC: 49.5, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 15, humidity: 56, isCurfew: true },
      { time: "5 PM", timestamp: 17, tempC: 38.1, feelsLikeC: 44.6, utciC: 45.2, condition: "Sunny", icon: "sunny", precipChance: 5, windSpeedKmh: 13, humidity: 60, isCurfew: false },
      { time: "6 PM", timestamp: 18, tempC: 36.0, feelsLikeC: 41.5, utciC: 41.0, condition: "Clear Dusk", icon: "sunny", precipChance: 5, windSpeedKmh: 11, humidity: 64, isCurfew: false },
      { time: "7 PM", timestamp: 19, tempC: 34.2, feelsLikeC: 38.8, utciC: 37.5, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 10, humidity: 68, isCurfew: false },
      { time: "8 PM", timestamp: 20, tempC: 33.1, feelsLikeC: 37.2, utciC: 35.8, condition: "Clear Night", icon: "night", precipChance: 0, windSpeedKmh: 9, humidity: 71, isCurfew: false },
      { time: "9 PM", timestamp: 21, tempC: 32.0, feelsLikeC: 36.0, utciC: 34.5, condition: "Clear Night", icon: "night", precipChance: 0, windSpeedKmh: 8, humidity: 74, isCurfew: false },
      { time: "10 PM", timestamp: 22, tempC: 31.2, feelsLikeC: 35.1, utciC: 33.8, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 8, humidity: 76, isCurfew: false },
      { time: "11 PM", timestamp: 23, tempC: 30.5, feelsLikeC: 34.2, utciC: 33.0, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 7, humidity: 78, isCurfew: false },
      { time: "12 AM", timestamp: 24, tempC: 29.8, feelsLikeC: 33.5, utciC: 32.2, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 6, humidity: 80, isCurfew: false },
      { time: "1 AM", timestamp: 25, tempC: 29.2, feelsLikeC: 32.8, utciC: 31.5, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 6, humidity: 82, isCurfew: false },
      { time: "2 AM", timestamp: 26, tempC: 28.6, feelsLikeC: 32.0, utciC: 30.8, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 5, humidity: 84, isCurfew: false },
      { time: "3 AM", timestamp: 27, tempC: 28.0, feelsLikeC: 31.4, utciC: 30.0, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 5, humidity: 85, isCurfew: false },
      { time: "4 AM", timestamp: 28, tempC: 27.5, feelsLikeC: 30.8, utciC: 29.4, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 5, humidity: 86, isCurfew: false },
      { time: "5 AM", timestamp: 29, tempC: 27.1, feelsLikeC: 30.2, utciC: 28.8, condition: "Dawn", icon: "night", precipChance: 0, windSpeedKmh: 6, humidity: 87, isCurfew: false },
      { time: "6 AM", timestamp: 30, tempC: 27.4, feelsLikeC: 30.5, utciC: 29.2, condition: "Sunrise", icon: "sunny", precipChance: 0, windSpeedKmh: 7, humidity: 86, isCurfew: false },
      { time: "7 AM", timestamp: 31, tempC: 29.0, feelsLikeC: 32.4, utciC: 32.0, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 8, humidity: 81, isCurfew: false },
      { time: "8 AM", timestamp: 32, tempC: 31.5, feelsLikeC: 35.8, utciC: 36.2, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 10, humidity: 74, isCurfew: false },
      { time: "9 AM", timestamp: 33, tempC: 34.0, feelsLikeC: 39.2, utciC: 41.5, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 11, humidity: 68, isCurfew: false },
      { time: "10 AM", timestamp: 34, tempC: 36.2, feelsLikeC: 42.4, utciC: 45.0, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 13, humidity: 62, isCurfew: false },
      { time: "11 AM", timestamp: 35, tempC: 38.0, feelsLikeC: 45.0, utciC: 48.0, condition: "Extreme Sun", icon: "sunny", precipChance: 0, windSpeedKmh: 14, humidity: 57, isCurfew: true },
      { time: "12 PM", timestamp: 36, tempC: 39.5, feelsLikeC: 47.0, utciC: 50.2, condition: "Extreme Sun", icon: "sunny", precipChance: 0, windSpeedKmh: 15, humidity: 53, isCurfew: true },
      { time: "1 PM", timestamp: 37, tempC: 40.5, feelsLikeC: 48.6, utciC: 51.5, condition: "Peak Heat", icon: "sunny", precipChance: 0, windSpeedKmh: 16, humidity: 50, isCurfew: true },
    ],
    daily: [
      { day: "Today", date: "Sep 05", condition: "Sunny / Severe Heat", icon: "sunny", precipChance: 5, highC: 41.2, lowC: 27.4, utciMaxC: 51.5, windKmh: 16, windDir: "NW", humidity: 58, summary: "Dangerous daytime biothermal strain. Severe UV 11+." },
      { day: "Sat", date: "Sep 06", condition: "Blistering Sun", icon: "sunny", precipChance: 0, highC: 42.0, lowC: 28.0, utciMaxC: 52.4, windKmh: 18, windDir: "WNW", humidity: 54, summary: "Peak heatwave surge. Mandatory afternoon work curfews advised." },
      { day: "Sun", date: "Sep 07", condition: "Humid Heatwave", icon: "partly-cloudy", precipChance: 15, highC: 40.8, lowC: 27.8, utciMaxC: 50.1, windKmh: 14, windDir: "W", humidity: 62, summary: "High humidity amplifies heat discomfort. Wet-bulb stays near 31°C." },
      { day: "Mon", date: "Sep 08", condition: "Partly Cloudy", icon: "partly-cloudy", precipChance: 25, highC: 38.5, lowC: 26.5, utciMaxC: 46.8, windKmh: 15, windDir: "WSW", humidity: 68, summary: "Slight respite in ambient temps, but humidity keeps UTCI elevated." },
      { day: "Tue", date: "Sep 09", condition: "Thunderstorm Threat", icon: "stormy", precipChance: 60, highC: 36.2, lowC: 25.0, utciMaxC: 42.5, windKmh: 24, windDir: "SW", humidity: 76, summary: "Pre-monsoon gusty winds and isolated convection showers." },
      { day: "Wed", date: "Sep 10", condition: "Scattered Rain", icon: "rainy", precipChance: 70, highC: 34.0, lowC: 24.2, utciMaxC: 38.0, windKmh: 20, windDir: "SW", humidity: 82, summary: "Significant cooling from cloud cover and afternoon rainfall." },
      { day: "Thu", date: "Sep 11", condition: "Overcast", icon: "cloudy", precipChance: 40, highC: 33.5, lowC: 24.0, utciMaxC: 37.2, windKmh: 18, windDir: "S", humidity: 80, summary: "Moderate thermal comfort under persistent cloud cover." },
      { day: "Fri", date: "Sep 12", condition: "Partly Cloudy", icon: "partly-cloudy", precipChance: 20, highC: 35.0, lowC: 24.8, utciMaxC: 39.5, windKmh: 16, windDir: "SE", humidity: 74, summary: "Warm and humid with occasional sunbreaks." },
      { day: "Sat", date: "Sep 13", condition: "Mostly Sunny", icon: "sunny", precipChance: 10, highC: 36.5, lowC: 25.4, utciMaxC: 42.0, windKmh: 14, windDir: "E", humidity: 68, summary: "Gradual warming trend resuming across eastern Maharashtra." },
      { day: "Sun", date: "Sep 14", condition: "Sunny", icon: "sunny", precipChance: 10, highC: 37.4, lowC: 26.0, utciMaxC: 44.2, windKmh: 13, windDir: "NE", humidity: 64, summary: "Strong afternoon sunshine with high solar radiation load." },
    ],
    alerts: [
      {
        id: "alert-imd-hadgaon",
        severity: "danger",
        headline: "IMD RED ALERT: Severe Heatwave & Physiological Trap",
        source: "India Meteorological Department (Pune / Nanded Division)",
        effective: "Valid until Sep 07, 18:00 IST",
        description:
          "High confidence of lethal heat conditions across Hadgaon and Nanded district. Wet-bulb temperatures exceeding 30.5°C with UTCI equivalent heat stress of 48.4°C–52.4°C. High probability of heat exhaustion, heat stroke, and dehydration for all age groups, especially outdoor gig workers and elderly citizens.",
        instructions: [
          "Avoid direct sun exposure between 11:00 AM and 4:30 PM.",
          "Drink oral rehydration solutions (ORS), buttermilk, and water at 20-minute intervals.",
          "Municipal command has authorized emergency water tanker deployment and cool shelters.",
          "Employers are legally obligated to enforce outdoor labor cessation during peak hours.",
        ],
      },
    ],
  },
  "Bhopal": {
    id: "bhopal",
    name: "Bhopal",
    state: "Madhya Pradesh",
    country: "India",
    lat: 23.2599,
    lon: 77.4126,
    elevation: "527m MSL",
    updatedAt: "2:30 PM IST",
    current: {
      tempC: 39.0,
      condition: "Urban Heat Island Stress",
      feelsLikeC: 46.2,
      utciC: 48.8,
      highC: 41.5,
      lowC: 27.2,
      wetBulbC: 31.0,
      humidity: 62,
      windSpeedKmh: 12,
      windGustKmh: 19,
      windDirectionDeg: 270,
      windDirectionText: "W",
      pressureHpa: 1008,
      pressureTrend: "falling",
      dewPointC: 24.2,
      visibilityKm: 8.0,
      uvIndex: 10,
      uvLevel: "Very High",
      cloudCoverPct: 20,
      airQualityIndex: 142,
      aqiCategory: "Unhealthy for Sensitive",
      aqiColor: "#B46A00",
      narrative:
        "High urban heat island effect across Arera slum belts and commercial centers. Concrete trap and high solar MRT elevate core physiological stress.",
    },
    pollutants: [
      { name: "PM2.5", value: 54.1, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
      { name: "PM10", value: 98.2, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
      { name: "O₃", value: 72.4, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
      { name: "NO₂", value: 31.0, unit: "µg/m³", status: "Good", color: "#107C10" },
      { name: "SO₂", value: 14.5, unit: "µg/m³", status: "Good", color: "#107C10" },
      { name: "CO", value: 620, unit: "µg/m³", status: "Good", color: "#107C10" },
    ],
    astronomy: {
      sunrise: "06:04 AM",
      sunset: "06:36 PM",
      solarNoon: "12:20 PM",
      daylightHours: "12h 32m",
      currentTimePercent: 60.4,
      moonPhase: "Waxing Gibbous",
      moonIlluminationPct: 79,
      moonRise: "04:12 PM",
      moonSet: "03:42 AM",
    },
    hourly: [
      { time: "Now", timestamp: 14.5, tempC: 39.0, feelsLikeC: 46.2, utciC: 48.8, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 12, humidity: 62, isCurfew: true },
      { time: "3 PM", timestamp: 15, tempC: 40.5, feelsLikeC: 48.5, utciC: 51.2, condition: "Extreme Sun", icon: "sunny", precipChance: 0, windSpeedKmh: 14, humidity: 58, isCurfew: true },
      { time: "4 PM", timestamp: 16, tempC: 40.0, feelsLikeC: 47.8, utciC: 50.0, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 13, humidity: 60, isCurfew: true },
      { time: "5 PM", timestamp: 17, tempC: 38.5, feelsLikeC: 45.0, utciC: 46.2, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 12, humidity: 63, isCurfew: false },
      { time: "6 PM", timestamp: 18, tempC: 36.2, feelsLikeC: 42.0, utciC: 42.1, condition: "Dusk", icon: "sunny", precipChance: 0, windSpeedKmh: 10, humidity: 67, isCurfew: false },
      { time: "7 PM", timestamp: 19, tempC: 34.5, feelsLikeC: 39.4, utciC: 38.2, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 9, humidity: 71, isCurfew: false },
      { time: "8 PM", timestamp: 20, tempC: 33.2, feelsLikeC: 37.8, utciC: 36.4, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 8, humidity: 74, isCurfew: false },
      { time: "9 PM", timestamp: 21, tempC: 32.1, feelsLikeC: 36.5, utciC: 35.0, condition: "Clear", icon: "night", precipChance: 0, windSpeedKmh: 7, humidity: 77, isCurfew: false },
    ],
    daily: [
      { day: "Today", date: "Sep 05", condition: "Extreme Heat", icon: "sunny", precipChance: 0, highC: 41.5, lowC: 27.2, utciMaxC: 51.2, windKmh: 14, windDir: "W", humidity: 62, summary: "High heat hazard in industrial and slum pockets." },
      { day: "Sat", date: "Sep 06", condition: "Hot & Humid", icon: "sunny", precipChance: 10, highC: 42.0, lowC: 28.0, utciMaxC: 52.0, windKmh: 15, windDir: "NW", humidity: 59, summary: "Sustained high temperatures with minimal nighttime cooling." },
      { day: "Sun", date: "Sep 07", condition: "Partly Cloudy", icon: "partly-cloudy", precipChance: 20, highC: 39.8, lowC: 26.8, utciMaxC: 48.5, windKmh: 13, windDir: "W", humidity: 65, summary: "Scattered cloud cover with persistent thermal load." },
    ],
    alerts: [
      {
        id: "alert-bhopal",
        severity: "danger",
        headline: "Municipal Red Alert: Acute Slum Heatwave",
        source: "Bhopal Municipal Corporation & NDMA",
        effective: "Valid until Sep 06, 20:00 IST",
        description: "Severe physiological thermal stress across Arera and Mandideep zones. Outdoor labor prohibition active.",
        instructions: ["Access nearest cooling center", "Hydrate frequently", "Follow labor department curfew"],
      },
    ],
  },
  "Ahmedabad": {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    lat: 23.0225,
    lon: 72.5714,
    elevation: "53m MSL",
    updatedAt: "2:30 PM IST",
    current: {
      tempC: 43.1,
      condition: "Severe Arid Heatwave",
      feelsLikeC: 47.5,
      utciC: 49.8,
      highC: 44.0,
      lowC: 29.0,
      wetBulbC: 28.4,
      humidity: 32,
      windSpeedKmh: 20,
      windGustKmh: 31,
      windDirectionDeg: 290,
      windDirectionText: "WNW",
      pressureHpa: 1006,
      pressureTrend: "steady",
      dewPointC: 18.5,
      visibilityKm: 7.0,
      uvIndex: 12,
      uvLevel: "Extreme",
      cloudCoverPct: 5,
      airQualityIndex: 168,
      aqiCategory: "Unhealthy",
      aqiColor: "#D13438",
      narrative: "Dry, furnace-like blast winds with blistering direct solar irradiance. AMC Heat Action Plan Phase 3 active.",
    },
    pollutants: [
      { name: "PM2.5", value: 78.4, unit: "µg/m³", status: "Poor", color: "#D13438" },
      { name: "PM10", value: 142.1, unit: "µg/m³", status: "Poor", color: "#D13438" },
      { name: "O₃", value: 84.0, unit: "µg/m³", status: "Poor", color: "#D13438" },
      { name: "NO₂", value: 42.5, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
      { name: "SO₂", value: 18.2, unit: "µg/m³", status: "Good", color: "#107C10" },
      { name: "CO", value: 890, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
    ],
    astronomy: {
      sunrise: "06:22 AM",
      sunset: "06:55 PM",
      solarNoon: "12:38 PM",
      daylightHours: "12h 33m",
      currentTimePercent: 60.4,
      moonPhase: "Waxing Gibbous",
      moonIlluminationPct: 79,
      moonRise: "04:30 PM",
      moonSet: "04:00 AM",
    },
    hourly: [
      { time: "Now", timestamp: 14.5, tempC: 43.1, feelsLikeC: 47.5, utciC: 49.8, condition: "Blistering", icon: "sunny", precipChance: 0, windSpeedKmh: 20, humidity: 32, isCurfew: true },
      { time: "3 PM", timestamp: 15, tempC: 44.0, feelsLikeC: 48.6, utciC: 51.0, condition: "Blistering", icon: "sunny", precipChance: 0, windSpeedKmh: 22, humidity: 30, isCurfew: true },
      { time: "4 PM", timestamp: 16, tempC: 43.5, feelsLikeC: 48.0, utciC: 50.2, condition: "Sunny", icon: "sunny", precipChance: 0, windSpeedKmh: 21, humidity: 31, isCurfew: true },
    ],
    daily: [
      { day: "Today", date: "Sep 05", condition: "Severe Heatwave", icon: "sunny", precipChance: 0, highC: 44.0, lowC: 29.0, utciMaxC: 51.0, windKmh: 22, windDir: "WNW", humidity: 32, summary: "Extreme heat warning under AMC Plan." },
      { day: "Sat", date: "Sep 06", condition: "Furnace Wind", icon: "sunny", precipChance: 0, highC: 44.5, lowC: 29.5, utciMaxC: 51.8, windKmh: 24, windDir: "W", humidity: 29, summary: "Severe daytime exposure risks." },
    ],
    alerts: [
      {
        id: "alert-amd",
        severity: "danger",
        headline: "AMC Red Alert: Heat Action Plan Phase 3",
        source: "Ahmedabad Municipal Corporation",
        effective: "Valid until Sep 07, 19:00 IST",
        description: "Temperatures surpassing 43°C. All public gardens opened as cooling stations with free chilled drinking water.",
        instructions: ["Stay indoors", "Drink salted lime water", "Report heat stroke to 108"],
      },
    ],
  },
  "Delhi NCR": {
    id: "delhi",
    name: "Delhi NCR",
    state: "Delhi",
    country: "India",
    lat: 28.6139,
    lon: 77.209,
    elevation: "216m MSL",
    updatedAt: "2:30 PM IST",
    current: {
      tempC: 41.2,
      condition: "Hazy & Oppressive Heat",
      feelsLikeC: 48.9,
      utciC: 50.4,
      highC: 42.0,
      lowC: 28.5,
      wetBulbC: 31.8,
      humidity: 64,
      windSpeedKmh: 10,
      windGustKmh: 16,
      windDirectionDeg: 110,
      windDirectionText: "ESE",
      pressureHpa: 1004,
      pressureTrend: "falling",
      dewPointC: 25.8,
      visibilityKm: 4.5,
      uvIndex: 9,
      uvLevel: "Very High",
      cloudCoverPct: 35,
      airQualityIndex: 215,
      aqiCategory: "Very Unhealthy",
      aqiColor: "#881337",
      narrative: "Dense thermal smog and severe humidity create a dangerous biothermal blanket over the national capital.",
    },
    pollutants: [
      { name: "PM2.5", value: 112.5, unit: "µg/m³", status: "Hazardous", color: "#881337" },
      { name: "PM10", value: 210.0, unit: "µg/m³", status: "Hazardous", color: "#881337" },
      { name: "O₃", value: 92.4, unit: "µg/m³", status: "Poor", color: "#D13438" },
      { name: "NO₂", value: 68.0, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
      { name: "SO₂", value: 22.1, unit: "µg/m³", status: "Moderate", color: "#B46A00" },
      { name: "CO", value: 1450, unit: "µg/m³", status: "Poor", color: "#D13438" },
    ],
    astronomy: {
      sunrise: "06:01 AM",
      sunset: "06:37 PM",
      solarNoon: "12:19 PM",
      daylightHours: "12h 36m",
      currentTimePercent: 60.4,
      moonPhase: "Waxing Gibbous",
      moonIlluminationPct: 79,
      moonRise: "04:10 PM",
      moonSet: "03:40 AM",
    },
    hourly: [
      { time: "Now", timestamp: 14.5, tempC: 41.2, feelsLikeC: 48.9, utciC: 50.4, condition: "Haze & Heat", icon: "sunny", precipChance: 5, windSpeedKmh: 10, humidity: 64, isCurfew: true },
      { time: "3 PM", timestamp: 15, tempC: 42.0, feelsLikeC: 50.2, utciC: 52.0, condition: "Oppressive", icon: "sunny", precipChance: 5, windSpeedKmh: 11, humidity: 61, isCurfew: true },
    ],
    daily: [
      { day: "Today", date: "Sep 05", condition: "Hazy Heatwave", icon: "sunny", precipChance: 5, highC: 42.0, lowC: 28.5, utciMaxC: 52.0, windKmh: 11, windDir: "ESE", humidity: 64, summary: "Combined heat & pollution hazard." },
    ],
    alerts: [
      {
        id: "alert-delhi",
        severity: "danger",
        headline: "IMD Orange Alert: Oppressive Heatwave & High AQI",
        source: "IMD Mausam Bhavan Delhi",
        effective: "Valid until Sep 06, 23:59 IST",
        description: "Heatwave condition with severe atmospheric stagnant inversion. Exercise extreme caution.",
        instructions: ["Wear N95 if outdoors", "Stay hydrated", "Avoid strenuous physical activity"],
      },
    ],
  },
};
