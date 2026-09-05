import { useRef, useState } from "react";
import {
  Sun,
  Moon,
  CloudSun,
  CloudRain,
  CloudLightning,
  Droplets,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import type { HourlyForecast } from "../data/mockData";

type HourlyCarouselProps = {
  hourly: HourlyForecast[];
  unit: "C" | "F";
};

export function HourlyCarousel({ hourly, unit }: HourlyCarouselProps) {
  const [viewCount, setViewCount] = useState<24 | 48>(24);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const toUnit = (valC: number) => (unit === "C" ? valC : (valC * 9) / 5 + 32);
  const displayedHourly = hourly.slice(0, viewCount);

  const scrollByAmount = (delta: number) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  const jumpToNow = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      scrollByAmount(-200);
    } else if (e.key === "ArrowRight") {
      scrollByAmount(200);
    }
  };

  return (
    <section
      aria-label="Hourly Forecast Carousel"
      className="rounded-2xl border border-subtle bg-white p-6 shadow-figma-card transition-all"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
            Hourly Biometeorological Forecast
          </h2>
          <span className="text-xs text-tertiary">
            24-Hour Diurnal Progression &bull; NCMRWF High-Res Model
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 24h / 48h Toggle */}
          <div
            role="radiogroup"
            aria-label="Hourly range toggle"
            className="flex rounded-xl border border-subtle bg-surfaceSubtle p-0.5 text-xs font-semibold"
          >
            <button
              role="radio"
              aria-checked={viewCount === 24}
              onClick={() => setViewCount(24)}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                viewCount === 24
                  ? "bg-accent text-white shadow-sm font-bold"
                  : "text-secondary hover:text-primary"
              }`}
            >
              24h
            </button>
            <button
              role="radio"
              aria-checked={viewCount === 48}
              onClick={() => setViewCount(48)}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                viewCount === 48
                  ? "bg-accent text-white shadow-sm font-bold"
                  : "text-secondary hover:text-primary"
              }`}
            >
              48h
            </button>
          </div>

          {/* Jump to Now Button */}
          <button
            onClick={jumpToNow}
            aria-label="Jump to current hour"
            className="flex items-center gap-1.5 rounded-xl border border-subtle bg-surfaceSubtle px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-white hover:text-primary transition shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5 text-accent" />
            <span className="hidden sm:inline">Now</span>
          </button>

          {/* Nav Arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scrollByAmount(-240)}
              aria-label="Scroll left"
              className="rounded-lg border border-subtle bg-white p-1.5 text-tertiary hover:border-borderDefault hover:text-primary transition shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollByAmount(240)}
              aria-label="Scroll right"
              className="rounded-lg border border-subtle bg-white p-1.5 text-tertiary hover:border-borderDefault hover:text-primary transition shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroller Track */}
      <div
        ref={scrollerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="region"
        aria-label="Hourly Forecast"
        aria-roledescription="carousel"
        className="hourly-scroller -mx-2 mt-4 px-2 pb-2 focus-visible:outline-none"
      >
        {displayedHourly.map((hour, index) => {
          const temp = Math.round(toUnit(hour.tempC));
          const utci = Math.round(toUnit(hour.utciC));

          return (
            <div
              key={`${hour.time}-${index}`}
              className={`hourly-card flex w-[84px] flex-col items-center rounded-xl border p-3.5 text-center transition-all ${
                hour.isCurfew
                  ? "border-rose-200 bg-rose-50/40"
                  : "border-subtle bg-white hover:border-borderDefault"
              }`}
            >
              {/* Hour Label */}
              <span className="text-xs font-semibold text-tertiary">
                {hour.time}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5 flex h-8 w-8 items-center justify-center">
                {getHourlyIcon(hour.icon, hour.isCurfew)}
              </div>

              {/* Precip Chance */}
              <div className="h-4">
                {hour.precipChance > 0 ? (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-sky-600">
                    <Droplets className="h-2.5 w-2.5" />
                    {hour.precipChance}%
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-300">&ndash;</span>
                )}
              </div>

              {/* Temperature */}
              <span className="mt-1 font-mono text-base font-bold text-primary tabular-nums">
                {temp}°
              </span>

              {/* UTCI Bio-Stress tag */}
              <span
                className={`mt-1 text-[10px] font-mono font-bold ${
                  hour.utciC >= 46
                    ? "text-rose-600"
                    : hour.utciC >= 38
                    ? "text-amber-600"
                    : "text-tertiary"
                }`}
              >
                UTCI {utci}°
              </span>

              {/* Curfew Pill */}
              {hour.isCurfew ? (
                <span className="mt-2 rounded-full bg-rose-100 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-tight text-rose-700">
                  Curfew
                </span>
              ) : (
                <span className="mt-2 text-[8px] text-transparent select-none">
                  Safe
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getHourlyIcon(icon: string, isCurfew?: boolean) {
  switch (icon) {
    case "sunny":
      return (
        <Sun
          className={`h-6 w-6 ${
            isCurfew ? "text-amber-500 animate-pulse" : "text-amber-400"
          }`}
        />
      );
    case "night":
      return <Moon className="h-5 w-5 text-indigo-500" />;
    case "partly-cloudy":
      return <CloudSun className="h-6 w-6 text-sky-500" />;
    case "rainy":
      return <CloudRain className="h-6 w-6 text-sky-600" />;
    case "stormy":
      return <CloudLightning className="h-6 w-6 text-indigo-600" />;
    default:
      return <Sun className="h-6 w-6 text-amber-400" />;
  }
}
