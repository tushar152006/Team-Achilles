export type ThermalInputs = {
  airTemp: number;
  humidity: number;
  windSpeed: number;
  meanRadiantTemp: number;
};

export type DangerLevel = {
  label: string;
  color: string;
  description: string;
  isCritical: boolean;
};

export function wetBulbStull(tempC: number, relativeHumidity: number) {
  const rh = relativeHumidity;
  return (
    tempC * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
    Math.atan(tempC + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035
  );
}

export { calculateUTCI } from "./utci_exact";


export function classifyDanger(utci: number, wetBulb: number): DangerLevel {
  if (wetBulb >= 35 || utci >= 46) {
    return {
      label: "Extreme Danger / Lethal Limit",
      color: "border-crimson bg-crimson/15 text-white",
      description: "Critical thermoregulatory collapse. Evaporative cooling at zero.",
      isCritical: true,
    };
  }
  if (wetBulb >= 32 || utci >= 38) {
    return {
      label: "Very Strong Heat Stress",
      color: "border-crimson/70 bg-crimson/10 text-crimson",
      description: "NDMA heat action protocol active. Outdoor labor restrictions triggered.",
      isCritical: true,
    };
  }
  if (utci >= 32) {
    return {
      label: "Strong Heat Stress",
      color: "border-white/20 bg-white/[0.08] text-white",
      description: "High physiological strain. Mandatory rest periods advised.",
      isCritical: false,
    };
  }
  if (utci >= 26) {
    return {
      label: "Moderate Heat Stress",
      color: "border-white/10 bg-white/[0.04] text-slate-300",
      description: "Advisory active for outdoor workers and elderly populations.",
      isCritical: false,
    };
  }
  return {
    label: "No Thermal Stress",
    color: "border-white/10 bg-white/[0.02] text-slate-400",
    description: "Parameters within baseline physiological comfort bounds.",
    isCritical: false,
  };
}

export function fmt(value: number, digits = 1) {
  return value.toFixed(digits);
}
