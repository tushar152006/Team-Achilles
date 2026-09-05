import { Sunrise, Sunset, Moon, Sun } from "lucide-react";
import type { CityData } from "../data/mockData";

type SunMoonCardProps = {
  astronomy: CityData["astronomy"];
};

export function SunMoonCard({ astronomy }: SunMoonCardProps) {
  const markerPos = Math.min(98, Math.max(2, astronomy.currentTimePercent));

  return (
    <article
      aria-label="Sun and Moon Astronomical Timeline"
      className="rounded-2xl border border-subtle bg-white p-6 shadow-figma-card hover:shadow-figma-hover transition-all"
    >
      <div className="flex items-center justify-between border-b border-subtle pb-3.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <Sun className="h-3.5 w-3.5" />
          </div>
          <span>Sun &amp; Lunar Cycle</span>
        </div>
        <span className="text-[11px] font-semibold text-tertiary">
          Noon: {astronomy.solarNoon}
        </span>
      </div>

      {/* 24-Hour Solar Timeline Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-secondary">
          <span className="flex items-center gap-1">
            <Sunrise className="h-3.5 w-3.5 text-amber-500" />
            {astronomy.sunrise}
          </span>
          <span className="rounded-full bg-surfaceSubtle px-2.5 py-0.5 text-[11px] font-bold text-primary">
            Daylight: {astronomy.daylightHours}
          </span>
          <span className="flex items-center gap-1">
            <Sunset className="h-3.5 w-3.5 text-orange-500" />
            {astronomy.sunset}
          </span>
        </div>

        {/* Dynamic Horizon Bar */}
        <div className="relative mt-3.5 h-3 w-full rounded-full bg-gradient-to-r from-indigo-300 via-amber-300 via-yellow-200 to-indigo-300 p-0.5 shadow-inner">
          {/* Active Time Marker Needle */}
          <div
            className="absolute -top-1.5 flex -translate-x-1/2 flex-col items-center transition-all duration-700"
            style={{ left: `${markerPos}%` }}
          >
            <div className="h-6 w-1 rounded-full bg-primary shadow-md" />
            <div className="mt-0.5 rounded bg-primary px-1 py-0.2 text-[8px] font-extrabold uppercase text-white shadow">
              Now
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-between text-[9px] font-bold uppercase text-tertiary">
          <span>00:00 (Night)</span>
          <span>06:00 (Dawn)</span>
          <span>12:00 (Noon)</span>
          <span>18:00 (Dusk)</span>
          <span>24:00 (Night)</span>
        </div>
      </div>

      {/* Moon Phase Section */}
      <div className="mt-5 border-t border-subtle pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-primary">
                {astronomy.moonPhase}
              </div>
              <div className="text-[11px] text-tertiary">
                {astronomy.moonIlluminationPct}% Illumination
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="text-tertiary">
              Rise: <span className="font-mono font-bold text-primary">{astronomy.moonRise}</span>
            </div>
            <div className="text-tertiary">
              Set: <span className="font-mono font-bold text-primary">{astronomy.moonSet}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
