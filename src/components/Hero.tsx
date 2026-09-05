import type { ReactNode } from "react";
import {
  MapPin,
  Clock,
  Droplets,
  Wind,
  Sun,
  Activity,
  Flame,
  CloudSun,
  ShieldAlert,
  Sliders,
} from "lucide-react";
import type { CityData } from "../data/mockData";

type HeroProps = {
  cityData: CityData;
  unit: "C" | "F";
  onOpenSimLab?: () => void;
};

export function Hero({ cityData, unit, onOpenSimLab }: HeroProps) {
  const toUnit = (valC: number) => (unit === "C" ? valC : (valC * 9) / 5 + 32);
  const current = cityData.current;
  const temp = Math.round(toUnit(current.tempC));
  const feelsLike = Math.round(toUnit(current.feelsLikeC));
  const utci = Math.round(toUnit(current.utciC));
  const high = Math.round(toUnit(current.highC));
  const low = Math.round(toUnit(current.lowC));
  const wetBulb = Math.round(toUnit(current.wetBulbC) * 10) / 10;

  return (
    <section
      aria-label="Current Weather Summary"
      className="relative overflow-hidden rounded-2xl border border-subtle bg-white p-6 shadow-figma-card transition-all md:p-8"
    >
      {/* Figma Luminous Atmospheric Mesh Gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 85% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 grid gap-6 md:grid-cols-12 md:items-center">
        {/* Left Column: Metrics & Narrative (7 cols) */}
        <div className="md:col-span-7">
          {/* Location & Timestamp Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-tertiary">
            <span className="flex items-center gap-1.5 font-bold text-accent">
              <MapPin className="h-3.5 w-3.5" />
              {cityData.name}, {cityData.state}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-tertiary">
              <Clock className="h-3.5 w-3.5" />
              {cityData.updatedAt}
            </span>
            <span>&bull;</span>
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 shadow-sm">
              UTCI {utci}°{unit} Severe Thermal Strain
            </span>
          </div>

          {/* Temperature & Visual Condition */}
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-sans text-6xl font-light tracking-tight text-primary tabular-nums sm:text-7xl lg:text-8xl">
              {temp}
            </span>
            <span className="text-3xl font-light text-tertiary sm:text-4xl">
              °{unit}
            </span>
          </div>

          {/* Condition Title & Feels-like Pills */}
          <div className="mt-2">
            <h1 className="text-xl font-bold capitalize text-primary sm:text-2xl">
              {current.condition}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-tertiary">
              <span className="rounded-md bg-surfaceSubtle px-2 py-1 font-semibold text-secondary">
                Feels like <strong className="text-primary">{feelsLike}°{unit}</strong>
              </span>
              <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 font-bold text-rose-700">
                Biothermal UTCI: {utci}°{unit}
              </span>
              <span className="rounded-md bg-surfaceSubtle px-2 py-1 font-medium text-secondary">
                High <strong>{high}°</strong> &bull; Low <strong>{low}°</strong>
              </span>
            </div>
          </div>

          {/* Narrative Summary Text */}
          <p className="mt-4 text-sm leading-relaxed text-secondary max-w-xl">
            {current.narrative}
          </p>

          {onOpenSimLab && (
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onOpenSimLab}
                className="flex items-center gap-2 rounded-xl border border-subtle bg-surfaceSubtle px-3.5 py-2 text-xs font-semibold text-secondary hover:bg-white hover:border-borderDefault hover:text-primary transition shadow-sm"
              >
                <Sliders className="h-3.5 w-3.5 text-accent" />
                <span>Open Biophysical Thermal Simulator</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: High-Fidelity Animated Solar Graphic (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
          <div className="relative flex h-48 w-48 items-center justify-center">
            {/* Luminous Warm Glow */}
            <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-tr from-amber-400/25 to-yellow-300/35 blur-xl" />

            {/* Figma-Style Modern Sun SVG */}
            <svg
              className="h-40 w-40 drop-shadow-md"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Solar Irradiance Graphic"
            >
              {/* Rotating ray crown */}
              <g className="origin-center animate-[spin_30s_linear_infinite]">
                <line x1="60" y1="12" x2="60" y2="24" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="60" y1="96" x2="60" y2="108" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="12" y1="60" x2="24" y2="60" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="96" y1="60" x2="108" y2="60" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="26" y1="26" x2="35" y2="35" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <line x1="85" y1="85" x2="94" y2="94" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <line x1="26" y1="94" x2="35" y2="85" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <line x1="85" y1="35" x2="94" y2="26" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              </g>

              {/* Sun Body Radial Gradient */}
              <defs>
                <radialGradient id="figmaSun" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </radialGradient>
              </defs>
              <circle cx="60" cy="60" r="30" fill="url(#figmaSun)" />
            </svg>
          </div>

          <div className="mt-1 flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-3 py-1 text-[11px] font-bold text-amber-800">
            <span>Severe Solar Radiation &bull; UV {current.uvIndex}</span>
          </div>
        </div>
      </div>

      {/* 6-Stat Bottom Grid with Soft Colored Icon Bubbles */}
      <div className="mt-6 grid grid-cols-2 gap-2.5 border-t border-subtle pt-5 sm:grid-cols-3 lg:grid-cols-6">
        <HeroStatItem
          label="Wet-Bulb Limit"
          value={`${wetBulb}°${unit}`}
          icon={<Droplets className="h-4 w-4 text-sky-600" />}
          bubbleBg="bg-sky-50"
          alert={current.wetBulbC >= 30}
        />
        <HeroStatItem
          label="Humidity"
          value={`${current.humidity}%`}
          icon={<CloudSun className="h-4 w-4 text-amber-600" />}
          bubbleBg="bg-amber-50"
        />
        <HeroStatItem
          label="Wind Velocity"
          value={`${current.windSpeedKmh} km/h ${current.windDirectionText}`}
          icon={<Wind className="h-4 w-4 text-indigo-600" />}
          bubbleBg="bg-indigo-50"
        />
        <HeroStatItem
          label="Dew Point"
          value={`${Math.round(toUnit(current.dewPointC))}°${unit}`}
          icon={<Droplets className="h-4 w-4 text-cyan-600" />}
          bubbleBg="bg-cyan-50"
        />
        <HeroStatItem
          label="Barometer"
          value={`${current.pressureHpa} hPa`}
          icon={<Activity className="h-4 w-4 text-slate-600" />}
          bubbleBg="bg-slate-100"
        />
        <HeroStatItem
          label="Air Quality"
          value={`${current.airQualityIndex} AQI`}
          icon={<ShieldAlert className="h-4 w-4 text-orange-600" />}
          bubbleBg="bg-orange-50"
          alert={current.airQualityIndex > 100}
        />
      </div>
    </section>
  );
}

function HeroStatItem({
  label,
  value,
  icon,
  bubbleBg,
  alert = false,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  bubbleBg: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center transition-all ${
        alert
          ? "border-rose-200 bg-rose-50/50"
          : "border-subtle bg-surfaceSubtle/60 hover:bg-white hover:border-borderDefault hover:shadow-sm"
      }`}
    >
      <div className="flex justify-center">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bubbleBg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-tertiary">
        {label}
      </div>
      <div
        className={`mt-0.5 font-mono text-xs font-bold ${
          alert ? "text-rose-600" : "text-primary"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
