import { Activity, Info } from "lucide-react";
import type { CityData } from "../data/mockData";

type AQICardProps = {
  cityData: CityData;
};

export function AQICard({ cityData }: AQICardProps) {
  const { airQualityIndex, aqiCategory } = cityData.current;
  const pollutants = cityData.pollutants;

  // Determine dynamic Figma status color based on AQI
  const aqiTheme =
    airQualityIndex <= 50
      ? { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" }
      : airQualityIndex <= 100
      ? { color: "#0284C7", bg: "#F0F9FF", border: "#BAE6FD" }
      : airQualityIndex <= 200
      ? { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" }
      : { color: "#E11D48", bg: "#FFF1F2", border: "#FECDD3" };

  const radius = 54;
  const arcLength = Math.PI * radius;
  const clampedAQI = Math.min(500, Math.max(0, airQualityIndex));
  const strokeDashoffset = arcLength - (clampedAQI / 500) * arcLength;

  return (
    <article
      aria-label="Air Quality Index Module"
      className="rounded-2xl border border-subtle bg-white p-6 shadow-figma-card hover:shadow-figma-hover transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-subtle pb-3.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <span>Air Quality Index (AQI)</span>
        </div>
        <button
          title="CPCB / WHO Air Quality Standard"
          className="text-tertiary hover:text-primary transition"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Large Semi-Circular SVG Gauge */}
      <div className="mt-4 flex flex-col items-center">
        <div className="relative flex h-28 w-44 items-end justify-center overflow-hidden">
          <svg className="h-36 w-36 overflow-visible" viewBox="0 0 120 70">
            {/* Background Arch Track */}
            <path
              d="M 10 65 A 50 50 0 0 1 110 65"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Colored Progress Arc */}
            <path
              d="M 10 65 A 50 50 0 0 1 110 65"
              fill="none"
              stroke={aqiTheme.color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central Values */}
          <div className="absolute bottom-1 flex flex-col items-center">
            <span className="font-mono text-3xl font-black tracking-tight text-primary">
              {airQualityIndex}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: aqiTheme.bg,
                color: aqiTheme.color,
                border: `1px solid ${aqiTheme.border}`,
              }}
            >
              {aqiCategory}
            </span>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-secondary leading-snug">
          Atmospheric thermal inversion traps surface particulates.
        </p>
      </div>

      {/* Pollutants Breakdown Grid */}
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-subtle pt-4">
        {pollutants.map((p) => (
          <div
            key={p.name}
            className="rounded-xl border border-subtle bg-surfaceSubtle/60 p-2.5 text-left"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-primary">{p.name}</span>
              <span
                className="font-bold text-[10px]"
                style={{ color: p.color }}
              >
                {p.status}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-mono text-xs font-bold text-secondary">
                {p.value}
              </span>
              <span className="text-[9px] text-tertiary">{p.unit}</span>
            </div>
            {/* Micro bar */}
            <div className="mt-1.5 h-1 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (p.value / 150) * 100)}%`,
                  backgroundColor: p.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
