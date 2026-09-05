import { Wind, Gauge, Droplets, Eye, Cloud, Thermometer } from "lucide-react";
import type { CityData } from "../data/mockData";

type CurrentConditionsCardProps = {
  cityData: CityData;
  unit: "C" | "F";
};

export function CurrentConditionsCard({ cityData, unit }: CurrentConditionsCardProps) {
  const current = cityData.current;
  const toUnit = (valC: number) => (unit === "C" ? valC : (valC * 9) / 5 + 32);

  const metrics = [
    {
      label: "Wind Velocity",
      value: `${current.windDirectionText} ${current.windSpeedKmh} km/h`,
      icon: <Wind className="h-4 w-4 text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      label: "Barometer",
      value: `${current.pressureHpa} hPa`,
      icon: <Gauge className="h-4 w-4 text-slate-600" />,
      bg: "bg-slate-100",
    },
    {
      label: "Relative Humidity",
      value: `${current.humidity}%`,
      icon: <Droplets className="h-4 w-4 text-sky-600" />,
      bg: "bg-sky-50",
    },
    {
      label: "Visibility",
      value: `${current.visibilityKm} km`,
      icon: <Eye className="h-4 w-4 text-teal-600" />,
      bg: "bg-teal-50",
    },
    {
      label: "Dew Point",
      value: `${Math.round(toUnit(current.dewPointC))}°${unit}`,
      icon: <Thermometer className="h-4 w-4 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      label: "Cloud Cover",
      value: `${current.cloudCoverPct}%`,
      icon: <Cloud className="h-4 w-4 text-slate-500" />,
      bg: "bg-slate-100",
    },
  ];

  return (
    <article
      aria-label="Current Weather Conditions Summary"
      className="rounded-2xl border border-subtle bg-white p-6 shadow-figma-card hover:shadow-figma-hover transition-all"
    >
      <div className="border-b border-subtle pb-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-tertiary">
          Atmospheric Snapshot
        </h3>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-base font-bold text-primary">Surface Observation</span>
          <span className="font-mono text-xs font-semibold text-accent">
            {cityData.elevation}
          </span>
        </div>
      </div>

      <div className="divide-y divide-subtle/70">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between py-2.5 text-xs first:pt-3 last:pb-0"
          >
            <div className="flex items-center gap-2.5">
              <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${m.bg}`}>
                {m.icon}
              </div>
              <span className="font-medium text-secondary">{m.label}</span>
            </div>
            <span className="font-mono font-bold text-primary">{m.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
