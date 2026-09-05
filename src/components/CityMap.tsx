import { BarChart3, Layers, MapPin, Radar, TrendingUp } from "lucide-react";
import { MapContainer, Polygon, Popup, TileLayer } from "react-leaflet";
import type { Ward } from "../data/wards";
import { calculateUTCI, classifyDanger, fmt, wetBulbStull } from "../lib/thermal";

type CityMapProps = {
  wards: Ward[];
  selectedWard: Ward;
  setSelectedWard: (ward: Ward) => void;
  mapMode: "ambient" | "utci";
  setMapMode: (mode: "ambient" | "utci") => void;
  airTemp: number;
  humidity: number;
  windSpeed: number;
  meanRadiantTemp: number;
};

export function CityMap(props: CityMapProps) {
  const rankedWards = props.wards
    .map((ward) => ({
      ward,
      runtime: getWardRuntime(ward, props.airTemp, props.humidity, props.windSpeed, props.meanRadiantTemp),
    }))
    .sort((a, b) => b.runtime.utci - a.runtime.utci);

  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div>
          <div className="eyebrow">
            <Radar className="h-3.5 w-3.5 text-slate-400" />
            Bhopal pilot grid &bull; 1km resolution
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">Ward Heat Intelligence Map</h2>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.06] p-1 text-xs">
          <button
            className={`rounded-full px-4 py-1.5 font-medium transition-all ${
              props.mapMode === "ambient" ? "bg-white font-semibold text-black shadow-sm" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => props.setMapMode("ambient")}
          >
            Ambient
          </button>
          <button
            className={`rounded-full px-4 py-1.5 font-medium transition-all ${
              props.mapMode === "utci" ? "bg-white font-semibold text-black shadow-sm" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => props.setMapMode("utci")}
          >
            UTCI Stress
          </button>
        </div>
      </div>

      <div className="grid min-h-[570px] lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="relative min-h-[520px]">
          <MapContainer center={[23.235, 77.412]} zoom={12} scrollWheelZoom={false} className="h-full min-h-[520px] w-full bg-[#050505]">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {props.wards.map((ward) => {
              const runtime = getWardRuntime(ward, props.airTemp, props.humidity, props.windSpeed, props.meanRadiantTemp);
              const danger = classifyDanger(runtime.utci, runtime.wetBulb);
              const value = props.mapMode === "ambient" ? runtime.ambient : runtime.utci;
              const fillColor = colorFor(value, props.mapMode);

              return (
                <Polygon
                  key={ward.id}
                  pathOptions={{
                    color: props.selectedWard.id === ward.id ? "#ffffff" : "rgba(255,255,255,0.25)",
                    fillColor,
                    fillOpacity: props.selectedWard.id === ward.id ? 0.85 : 0.6,
                    weight: props.selectedWard.id === ward.id ? 2.5 : 1,
                  }}
                  positions={ward.coordinates}
                  eventHandlers={{ click: () => props.setSelectedWard(ward) }}
                >
                  <Popup>
                    <div className="w-60 font-sans">
                      <strong className="text-white text-sm">{ward.name}</strong>
                      <p>{ward.profile}</p>
                      <p>Density: {ward.density}</p>
                      <p>UHI delta: {ward.anomaly >= 0 ? "+" : ""}{fmt(ward.anomaly)} &deg;C</p>
                      <p>UTCI index: {fmt(runtime.utci)} &deg;C</p>
                      <p className="font-semibold text-white">{danger.label}</p>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}
          </MapContainer>

          <div className="pointer-events-none absolute left-4 top-4 z-[450] rounded-xl border border-white/10 bg-[#0c0e12]/90 p-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <Layers className="h-3.5 w-3.5" />
              {props.mapMode === "utci" ? "UTCI + UHI Downscaling" : "Standard Ambient Temp"}
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              {["#22c55e", "#f59e0b", "#f97316", "#ef4444", "#991b1b"].map((color) => (
                <span key={color} className="h-1.5 w-7 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              <span>Safe</span>
              <span>Lethal</span>
            </div>
          </div>
        </div>

        <aside className="border-t border-white/[0.08] bg-[#0c0e12] p-4 lg:border-l lg:border-t-0">
          <WardPanel ward={props.selectedWard} airTemp={props.airTemp} humidity={props.humidity} windSpeed={props.windSpeed} meanRadiantTemp={props.meanRadiantTemp} />

          <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <BarChart3 className="h-4 w-4 text-slate-400" />
              Hotspot Priority Stack
            </div>
            <div className="mt-3 space-y-2">
              {rankedWards.map(({ ward, runtime }, index) => {
                const isSelected = props.selectedWard.id === ward.id;
                return (
                  <button
                    key={ward.id}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? "border-white/30 bg-white/[0.08]"
                        : "border-white/[0.06] bg-black/40 hover:border-white/15 hover:bg-white/[0.03]"
                    }`}
                    onClick={() => props.setSelectedWard(ward)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-white">
                        {index + 1}. {ward.name}
                      </span>
                      <span className={`text-xs font-bold ${runtime.utci >= 38 ? "text-crimson" : "text-white"}`}>
                        {fmt(runtime.utci)} &deg;C
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className={`h-full rounded-full transition-all ${
                          runtime.utci >= 38 ? "bg-crimson" : "bg-white/60"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(12, ((runtime.utci - 26) / 24) * 100))}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function WardPanel({ ward, airTemp, humidity, windSpeed, meanRadiantTemp }: { ward: Ward; airTemp: number; humidity: number; windSpeed: number; meanRadiantTemp: number }) {
  const runtime = getWardRuntime(ward, airTemp, humidity, windSpeed, meanRadiantTemp);
  const danger = classifyDanger(runtime.utci, runtime.wetBulb);

  return (
    <div className="rounded-xl border border-white/[0.08] bg-panel/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slateMuted">Active Ward Focus</div>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-white">{ward.name}</h3>
          <p className="mt-0.5 text-xs text-graphite">{ward.profile}</p>
        </div>
        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
      </div>

      <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${danger.color}`}>
        {danger.label}
      </span>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <WardStat label="Population" value={ward.population} />
        <WardStat label="Density" value={ward.density} />
        <WardStat label="Vulnerability" value={`${ward.vulnerability}/100`} />
        <WardStat label="UHI Anomaly" value={`${ward.anomaly >= 0 ? "+" : ""}${fmt(ward.anomaly)} °C`} />
      </div>

      <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/40 p-3">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <TrendingUp className="h-3.5 w-3.5" />
          3-Day UTCI Projection
        </div>
        <div className="mt-3 flex h-24 items-end gap-3">
          {ward.forecast.map((value, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`w-full rounded-t transition-all ${
                  value >= 38 ? "bg-crimson" : "bg-white/40"
                }`}
                style={{ height: `${Math.max(16, (value - 26) * 4.5)}px` }}
              />
              <span className="text-[10px] font-medium text-slate-400">D+{index + 1}</span>
              <span className="text-[10px] font-semibold text-white">{fmt(value, 0)}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-slateMuted">{label}</div>
      <div className="mt-0.5 text-xs font-bold tracking-tight text-white">{value}</div>
    </div>
  );
}

function getWardRuntime(ward: Ward, airTemp: number, humidity: number, windSpeed: number, meanRadiantTemp: number) {
  const ambient = airTemp + ward.anomaly;
  const wetBulb = wetBulbStull(ambient, humidity);
  const utci = calculateUTCI({
    airTemp: ambient,
    humidity,
    windSpeed,
    meanRadiantTemp: meanRadiantTemp + ward.solarDelta,
  });

  return { ambient, wetBulb, utci };
}

function colorFor(value: number, mode: "ambient" | "utci") {
  if (mode === "ambient") {
    if (value >= 43) return "#be123c";
    if (value >= 39) return "#f97316";
    if (value >= 35) return "#facc15";
    return "#22c55e";
  }
  if (value >= 46) return "#881337";
  if (value >= 38) return "#dc2626";
  if (value >= 32) return "#f97316";
  if (value >= 26) return "#facc15";
  return "#22c55e";
}
