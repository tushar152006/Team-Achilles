import { useState } from "react";
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Cloud,
  Droplets,
  Wind,
  ChevronDown,
} from "lucide-react";
import type { DailyForecast as DailyItem } from "../data/mockData";

type DailyForecastProps = {
  daily: DailyItem[];
  unit: "C" | "F";
};

export function DailyForecast({ daily, unit }: DailyForecastProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toUnit = (valC: number) => (unit === "C" ? valC : (valC * 9) / 5 + 32);

  // Find min and max for range bar calculation
  const allLows = daily.map((d) => d.lowC);
  const allHighs = daily.map((d) => d.highC);
  const minRange = Math.min(...allLows);
  const maxRange = Math.max(...allHighs);
  const totalSpan = Math.max(1, maxRange - minRange);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section
      aria-label="10-Day Weather Forecast"
      className="overflow-hidden rounded-2xl border border-subtle bg-white shadow-figma-card transition-all"
    >
      <div className="flex items-center justify-between border-b border-subtle px-6 py-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
            10-Day Extended Heat Outlook
          </h2>
          <span className="text-xs text-tertiary">
            NCMRWF Unified Prediction &bull; Heatwave Vulnerability Index
          </span>
        </div>
        <span className="rounded-full border border-subtle bg-surfaceSubtle px-3 py-1 text-xs font-semibold text-tertiary">
          10 Days
        </span>
      </div>

      {/* Desktop Data Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-subtle bg-surfaceSubtle/70 text-[11px] font-bold uppercase tracking-wider text-tertiary">
              <th scope="col" className="py-3 pl-6 pr-3">Day &amp; Date</th>
              <th scope="col" className="px-3 py-3">Atmospheric Condition</th>
              <th scope="col" className="px-3 py-3">Precip</th>
              <th scope="col" className="px-3 py-3 min-w-[220px]">Temperature Span (High / Low)</th>
              <th scope="col" className="px-3 py-3">Wind</th>
              <th scope="col" className="py-3 pl-3 pr-6">Humidity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle/80 text-sm">
            {daily.map((item) => {
              const high = Math.round(toUnit(item.highC));
              const low = Math.round(toUnit(item.lowC));
              const utciMax = Math.round(toUnit(item.utciMaxC));

              // Relative positioning
              const leftPercent = ((item.lowC - minRange) / totalSpan) * 100;
              const barWidth = Math.max(14, ((item.highC - item.lowC) / totalSpan) * 100);

              return (
                <tr
                  key={item.day}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  {/* Day & Date */}
                  <td className="py-3.5 pl-6 pr-3">
                    <div className="font-bold text-primary">{item.day}</div>
                    <div className="text-xs text-tertiary">{item.date}</div>
                  </td>

                  {/* Condition & Icon */}
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {getConditionIcon(item.icon)}
                      <span className="font-medium text-secondary">
                        {item.condition}
                      </span>
                    </div>
                  </td>

                  {/* Precip % */}
                  <td className="px-3 py-3.5">
                    {item.precipChance > 0 ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-sky-600">
                        <Droplets className="h-3 w-3" />
                        {item.precipChance}%
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">&ndash;</span>
                    )}
                  </td>

                  {/* High/Low with Modern Figma Thermometer Bar */}
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-7 text-right font-mono text-xs font-semibold text-tertiary">
                        {low}°
                      </span>
                      <div className="relative h-2 flex-1 rounded-full bg-surfaceSubtle overflow-hidden">
                        <div
                          className="absolute top-0 bottom-0 rounded-full shadow-sm"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${barWidth}%`,
                            background:
                              item.highC >= 40
                                ? "linear-gradient(90deg, #FBBF24, #F97316, #E11D48)"
                                : "linear-gradient(90deg, #38BDF8, #FBBF24)",
                          }}
                        />
                      </div>
                      <span className="w-7 font-mono text-xs font-bold text-primary">
                        {high}°
                      </span>
                      <span className="rounded-md border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                        UTCI {utciMax}°
                      </span>
                    </div>
                  </td>

                  {/* Wind */}
                  <td className="px-3 py-3.5 text-xs text-secondary">
                    <span className="font-semibold text-primary">{item.windDir}</span>{" "}
                    <span className="font-mono text-tertiary">{item.windKmh} km/h</span>
                  </td>

                  {/* Humidity */}
                  <td className="py-3.5 pl-3 pr-6 text-xs font-mono font-semibold text-secondary">
                    {item.humidity}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Accordion Card View */}
      <div className="divide-y divide-subtle md:hidden">
        {daily.map((item, idx) => {
          const high = Math.round(toUnit(item.highC));
          const low = Math.round(toUnit(item.lowC));
          const isExpanded = expandedIndex === idx;

          return (
            <div key={item.day} className="p-4">
              <button
                onClick={() => toggleExpand(idx)}
                aria-expanded={isExpanded}
                className="flex w-full items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {getConditionIcon(item.icon)}
                  <div>
                    <span className="font-bold text-primary">{item.day}</span>
                    <span className="ml-1.5 text-xs text-tertiary">
                      {item.date}
                    </span>
                    <div className="text-xs text-secondary">{item.condition}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-primary">
                      {high}° <span className="font-normal text-tertiary">/ {low}°</span>
                    </div>
                    {item.precipChance > 0 && (
                      <div className="text-[10px] text-sky-600 font-bold">
                        {item.precipChance}% Rain
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-tertiary transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Expandable Accordion Body */}
              {isExpanded && (
                <div className="mt-3 rounded-xl border border-subtle bg-surfaceSubtle p-3.5 text-xs text-secondary space-y-2">
                  <p>{item.summary}</p>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-subtle text-[11px]">
                    <div>
                      <span className="text-tertiary">Peak UTCI:</span>{" "}
                      <strong className="text-rose-600 font-mono">
                        {Math.round(toUnit(item.utciMaxC))}°{unit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-tertiary">Wind:</span>{" "}
                      <span className="font-mono">
                        {item.windDir} {item.windKmh} km/h
                      </span>
                    </div>
                    <div>
                      <span className="text-tertiary">Humidity:</span>{" "}
                      <span className="font-mono">{item.humidity}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getConditionIcon(icon: string) {
  switch (icon) {
    case "sunny":
      return <Sun className="h-5 w-5 text-amber-500" />;
    case "partly-cloudy":
      return <CloudSun className="h-5 w-5 text-sky-500" />;
    case "cloudy":
      return <Cloud className="h-5 w-5 text-slate-400" />;
    case "rainy":
      return <CloudRain className="h-5 w-5 text-sky-600" />;
    case "stormy":
      return <CloudLightning className="h-5 w-5 text-indigo-500" />;
    default:
      return <Sun className="h-5 w-5 text-amber-500" />;
  }
}
