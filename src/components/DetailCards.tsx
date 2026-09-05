import {
  Thermometer,
  Compass,
  Droplets,
  Gauge,
  Eye,
  SunMedium,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import type { CityData } from "../data/mockData";

type DetailCardsProps = {
  cityData: CityData;
  unit: "C" | "F";
};

export function DetailCards({ cityData, unit }: DetailCardsProps) {
  const toUnit = (valC: number) => (unit === "C" ? valC : (valC * 9) / 5 + 32);
  const current = cityData.current;

  return (
    <section aria-label="Detailed Weather Metrics" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
          Atmospheric &amp; Biothermal Metrics
        </h2>
        <span className="text-xs font-semibold text-tertiary">Real-time Surface Telemetry</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Feels Like (Dual Temp: Ambient vs UTCI) */}
        <FeelsLikeCard current={current} unit={unit} toUnit={toUnit} />

        {/* Card 2: Wind Compass (SVG Canvas) */}
        <WindCompassCard current={current} />

        {/* Card 3: Humidity (Radial Progress Ring SVG) */}
        <HumidityRadialCard current={current} unit={unit} toUnit={toUnit} />

        {/* Card 4: Pressure & 24h Trend Sparkline */}
        <PressureSparklineCard current={current} />

        {/* Card 5: Visibility */}
        <VisibilityCard current={current} />

        {/* Card 6: UV Index Segmented Bar */}
        <UVIndexCard current={current} />
      </div>
    </section>
  );
}

// 1. Feels Like Card
function FeelsLikeCard({
  current,
  unit,
  toUnit,
}: {
  current: CityData["current"];
  unit: "C" | "F";
  toUnit: (v: number) => number;
}) {
  const ambient = Math.round(toUnit(current.tempC));
  const utci = Math.round(toUnit(current.utciC));
  const feelsLike = Math.round(toUnit(current.feelsLikeC));

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-subtle bg-white p-6 shadow-figma-card hover:shadow-figma-hover hover:-translate-y-0.5 transition-all">
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-accent">
              <Thermometer className="h-3.5 w-3.5" />
            </div>
            Feels Like &bull; UTCI
          </span>
          <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 font-mono text-xs font-bold text-rose-700">
            {utci}°{unit}
          </span>
        </div>

        <div className="mt-4">
          <div className="font-mono text-4xl font-bold tracking-tight text-primary">
            {feelsLike}°{unit}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-secondary">
            Biothermal heat index under direct solar exposure. Relative humidity severely limits sweat evaporation.
          </p>
        </div>
      </div>

      {/* Dual Comparative Progress Bars */}
      <div className="mt-5 space-y-2.5 border-t border-subtle pt-4 text-xs">
        <div>
          <div className="flex justify-between text-[11px] text-tertiary">
            <span>Ambient Thermometer</span>
            <span className="font-mono font-bold text-primary">{ambient}°{unit}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-surfaceSubtle overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400"
              style={{ width: `${Math.min(100, Math.max(15, ((ambient - 20) / 30) * 100))}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-tertiary">
            <span>UTCI Physiological Stress</span>
            <span className="font-mono font-bold text-rose-600">{utci}°{unit}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-surfaceSubtle overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-600 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(15, ((utci - 20) / 35) * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Wind Compass Card (Pure SVG Canvas with Rotating Arrow)
function WindCompassCard({ current }: { current: CityData["current"] }) {
  const deg = current.windDirectionDeg;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-subtle bg-white p-6 shadow-figma-card hover:shadow-figma-hover hover:-translate-y-0.5 transition-all">
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Compass className="h-3.5 w-3.5" />
            </div>
            Wind Direction &amp; Gusts
          </span>
          <span className="font-mono text-xs font-bold text-primary">
            {current.windSpeedKmh} km/h
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-mono text-3xl font-bold tracking-tight text-primary">
              {current.windDirectionText}
            </div>
            <div className="text-xs text-tertiary mt-0.5">
              Gusts up to <strong className="text-primary">{current.windGustKmh} km/h</strong>
            </div>
            <div className="mt-2 text-xs text-secondary leading-snug">
              Moderate dry breeze from {current.windDirectionText} ({deg}°).
            </div>
          </div>

          {/* SVG Compass with Figma Styling */}
          <div className="relative h-24 w-24 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {/* Outer Ring */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="2" />
              <circle cx="50" cy="50" r="36" fill="#F8FAFC" />

              {/* Cardinal Labels */}
              <text x="50" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#64748B">N</text>
              <text x="88" y="53" textAnchor="middle" fontSize="9" fontWeight="800" fill="#64748B">E</text>
              <text x="50" y="90" textAnchor="middle" fontSize="9" fontWeight="800" fill="#64748B">S</text>
              <text x="12" y="53" textAnchor="middle" fontSize="9" fontWeight="800" fill="#64748B">W</text>

              {/* Rotating Arrow Needle */}
              <g
                transform={`rotate(${deg} 50 50)`}
                className="transition-transform duration-700 ease-out"
              >
                {/* Pointer */}
                <polygon points="50,20 44,50 50,44 56,50" fill="#2563EB" />
                {/* Tail */}
                <polygon points="50,80 44,50 50,44 56,50" fill="#94A3B8" />
                {/* Center Pivot */}
                <circle cx="50" cy="50" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-subtle pt-3 text-[11px] text-tertiary">
        Continuous anemometer sampling &bull; 10m surface layer
      </div>
    </div>
  );
}

// 3. Humidity Radial Progress Ring
function HumidityRadialCard({
  current,
  unit,
  toUnit,
}: {
  current: CityData["current"];
  unit: "C" | "F";
  toUnit: (v: number) => number;
}) {
  const pct = current.humidity;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-subtle bg-white p-6 shadow-figma-card hover:shadow-figma-hover hover:-translate-y-0.5 transition-all">
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Droplets className="h-3.5 w-3.5" />
            </div>
            Humidity &amp; Moisture
          </span>
          <span className="font-mono text-xs font-bold text-primary">
            {pct}%
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-tertiary">Dew Point</div>
            <div className="font-mono text-3xl font-bold tracking-tight text-primary">
              {Math.round(toUnit(current.dewPointC))}°{unit}
            </div>
            <p className="mt-1.5 text-xs text-secondary leading-snug">
              Elevated moisture suppresses human sweat evaporation.
            </p>
          </div>

          {/* Radial SVG Ring */}
          <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
            <svg className="h-20 w-20 -rotate-90 transform" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="#E2E8F0"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="#0284C7"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-sm font-bold text-primary">{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-subtle pt-3 text-[11px] text-tertiary">
        Moisture Assessment: <strong className="text-secondary font-semibold">{pct > 60 ? "Oppressive Trap" : "Moderate"}</strong>
      </div>
    </div>
  );
}

// 4. Pressure Card with 24h Trend Sparkline & Gradient Area Fill
function PressureSparklineCard({ current }: { current: CityData["current"] }) {
  const points = [1012, 1011, 1010, 1009, 1009, 1008, 1008, 1009, 1010, 1009, 1009, current.pressureHpa];
  const minP = Math.min(...points) - 1;
  const maxP = Math.max(...points) + 1;
  const svgWidth = 140;
  const svgHeight = 42;

  const linePath = points
    .map((p, idx) => {
      const x = (idx / (points.length - 1)) * svgWidth;
      const y = svgHeight - ((p - minP) / (maxP - minP)) * (svgHeight - 8) - 4;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPath = `${linePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-subtle bg-white p-6 shadow-figma-card hover:shadow-figma-hover hover:-translate-y-0.5 transition-all">
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Gauge className="h-3.5 w-3.5" />
            </div>
            Barometric Pressure
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
            {current.pressureTrend === "rising" ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            ) : current.pressureTrend === "falling" ? (
              <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span className="capitalize">{current.pressureTrend}</span>
          </span>
        </div>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold tracking-tight text-primary">
            {current.pressureHpa}
          </span>
          <span className="text-sm font-semibold text-tertiary">hPa</span>
        </div>

        {/* 24-hr Mini SVG Sparkline with Area Fill */}
        <div className="mt-3">
          <div className="text-[10px] uppercase font-bold text-tertiary">24h Barometric Trend</div>
          <div className="mt-1 h-11 w-full overflow-hidden">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="h-full w-full">
              <defs>
                <linearGradient id="pressureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#pressureGrad)" />
              <path d={linePath} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle
                cx={svgWidth}
                cy={svgHeight - ((current.pressureHpa - minP) / (maxP - minP)) * (svgHeight - 8) - 4}
                r="3.5"
                fill="#2563EB"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-subtle pt-3 text-[11px] text-tertiary">
        Standard Mean Sea Level: 1013.25 hPa
      </div>
    </div>
  );
}

// 5. Visibility Card
function VisibilityCard({ current }: { current: CityData["current"] }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-subtle bg-white p-6 shadow-figma-card hover:shadow-figma-hover hover:-translate-y-0.5 transition-all">
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Eye className="h-3.5 w-3.5" />
            </div>
            Horizontal Visibility
          </span>
          <span className="font-mono text-xs font-bold text-primary">
            {current.visibilityKm} km
          </span>
        </div>

        <div className="mt-4">
          <div className="font-mono text-3xl font-bold tracking-tight text-primary">
            {current.visibilityKm} <span className="text-lg font-normal text-tertiary">km</span>
          </div>
          <div className="mt-1.5 inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            {current.visibilityKm >= 9 ? "Clear Horizon" : "Light Thermal Haze"}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-secondary">
            Atmospheric optical range is optimal. No dust storm obstruction detected across the district.
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-subtle pt-3 text-[11px] text-tertiary">
        Cloud Cover: <strong className="text-primary font-semibold">{current.cloudCoverPct}%</strong>
      </div>
    </div>
  );
}

// 6. UV Index Segmented Bar Card
function UVIndexCard({ current }: { current: CityData["current"] }) {
  const uv = current.uvIndex;
  const segments = [
    { label: "Low", range: "0-2", color: "#059669" },
    { label: "Mod", range: "3-5", color: "#D97706" },
    { label: "High", range: "6-7", color: "#EA580C" },
    { label: "V.High", range: "8-10", color: "#E11D48" },
    { label: "Ext", range: "11+", color: "#881337" },
  ];

  const markerPct = Math.min(100, Math.max(5, (uv / 12) * 100));

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-subtle bg-white p-6 shadow-figma-card hover:shadow-figma-hover hover:-translate-y-0.5 transition-all">
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <SunMedium className="h-3.5 w-3.5" />
            </div>
            Solar UV Radiation
          </span>
          <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 font-mono text-xs font-bold text-rose-700">
            {uv} {current.uvLevel}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-primary">{uv}</span>
            <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
              {current.uvLevel}
            </span>
          </div>

          {/* Segmented Color Bar */}
          <div className="relative mt-3">
            <div className="flex h-2.5 w-full gap-1 overflow-hidden rounded-full bg-surfaceSubtle">
              {segments.map((s) => (
                <div
                  key={s.label}
                  className="h-full flex-1 rounded-sm"
                  style={{ backgroundColor: s.color }}
                />
              ))}
            </div>

            {/* Indicator Marker */}
            <div
              className="absolute -top-1 h-4.5 w-1.5 rounded-full border border-white bg-slate-900 shadow-sm transition-all duration-500"
              style={{ left: `calc(${markerPct}% - 3px)` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[9px] font-bold uppercase text-tertiary">
            <span>Low (0)</span>
            <span>Mod (3)</span>
            <span>High (6)</span>
            <span>Extreme (11+)</span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-subtle pt-3 text-xs text-secondary">
        Protection: <strong className="text-primary font-semibold">SPF 50+, UV glasses &amp; wide-brim hat</strong>.
      </div>
    </div>
  );
}
