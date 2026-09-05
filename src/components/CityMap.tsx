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
  unit?: "C" | "F";
};

export function CityMap(props: CityMapProps) {
  const toUnit = (valC: number) => (props.unit === "F" ? (valC * 9) / 5 + 32 : valC);
  const unitSuffix = `°${props.unit ?? "C"}`;

  const rankedWards = props.wards
    .map((ward) => ({
      ward,
      runtime: getWardRuntime(ward, props.airTemp, props.humidity, props.windSpeed, props.meanRadiantTemp),
    }))
    .sort((a, b) => b.runtime.utci - a.runtime.utci);

  return (
    <section className="overflow-hidden rounded-xl border border-subtle bg-base shadow-elev-1 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle px-5 py-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-tertiary">
            <Radar className="h-3.5 w-3.5 text-accent" />
            <span>High-Resolution Microclimate Radar &bull; 1km Grid</span>
          </div>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight text-primary sm:text-xl">
            Ward Heat Hazard &amp; Urban Heat Island Map
          </h2>
        </div>
        <div className="inline-flex rounded-lg border border-subtle bg-canvas p-0.5 text-xs font-semibold">
          <button
            className={`rounded px-3 py-1 transition-all ${
              props.mapMode === "ambient"
                ? "bg-accent text-white shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
            onClick={() => props.setMapMode("ambient")}
          >
            Ambient Air
          </button>
          <button
            className={`rounded px-3 py-1 transition-all ${
              props.mapMode === "utci"
                ? "bg-accent text-white shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
            onClick={() => props.setMapMode("utci")}
          >
            UTCI Bio-Stress
          </button>
        </div>
      </div>

      <div className="grid min-h-[480px] lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Leaflet Light Map */}
        <div className="relative min-h-[440px]">
          <MapContainer
            center={[23.235, 77.412]}
            zoom={12}
            scrollWheelZoom={false}
            className="h-full min-h-[440px] w-full bg-[#F3F3F3]"
          >
            {/* CARTO Light Basemap Tile Layer */}
            <TileLayer
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {props.wards.map((ward) => {
              const runtime = getWardRuntime(
                ward,
                props.airTemp,
                props.humidity,
                props.windSpeed,
                props.meanRadiantTemp
              );
              const danger = classifyDanger(runtime.utci, runtime.wetBulb);
              const value = props.mapMode === "ambient" ? runtime.ambient : runtime.utci;
              const fillColor = colorFor(value, props.mapMode);

              return (
                <Polygon
                  key={ward.id}
                  pathOptions={{
                    color: props.selectedWard.id === ward.id ? "#0067B8" : "#6E6E6E",
                    fillColor,
                    fillOpacity: props.selectedWard.id === ward.id ? 0.75 : 0.45,
                    weight: props.selectedWard.id === ward.id ? 3 : 1.5,
                  }}
                  positions={ward.coordinates}
                  eventHandlers={{ click: () => props.setSelectedWard(ward) }}
                >
                  <Popup>
                    <div className="w-56 font-sans text-xs">
                      <strong className="text-sm font-bold text-primary">{ward.name}</strong>
                      <p className="text-secondary mt-1">{ward.profile}</p>
                      <div className="mt-2 space-y-1 text-tertiary">
                        <div>Density: <strong className="text-primary">{ward.density}</strong></div>
                        <div>UHI Delta: <strong className="text-primary">{ward.anomaly >= 0 ? "+" : ""}{fmt(ward.anomaly)}°C</strong></div>
                        <div>UTCI Index: <strong className="text-semantic-danger">{fmt(toUnit(runtime.utci), 1)}{unitSuffix}</strong></div>
                      </div>
                      <div className="mt-2 rounded bg-semantic-danger/10 px-1.5 py-0.5 font-bold text-semantic-danger">
                        {danger.label}
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}
          </MapContainer>

          {/* Floating Map Legend Pill */}
          <div className="pointer-events-none absolute left-3 top-3 z-[450] rounded-lg border border-subtle bg-base/95 p-2.5 shadow-elev-2 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-tertiary">
              <Layers className="h-3 w-3 text-accent" />
              <span>{props.mapMode === "utci" ? "UTCI Bio-Thermal Downscaling" : "Standard Ambient Temp"}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              {["#107C10", "#B46A00", "#FF8C00", "#D13438", "#881337"].map((color) => (
                <span key={color} className="h-1.5 w-6 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[9px] font-semibold uppercase tracking-wider text-tertiary">
              <span>Safe</span>
              <span>Lethal</span>
            </div>
          </div>
        </div>

        {/* Sidebar: Selected Ward Info & Hotspot Stack */}
        <aside className="border-t border-subtle bg-canvas p-4 lg:border-l lg:border-t-0">
          <WardPanel
            ward={props.selectedWard}
            airTemp={props.airTemp}
            humidity={props.humidity}
            windSpeed={props.windSpeed}
            meanRadiantTemp={props.meanRadiantTemp}
            toUnit={toUnit}
            unitSuffix={unitSuffix}
          />

          <div className="mt-4 rounded-xl border border-subtle bg-base p-3.5 shadow-elev-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-tertiary">
              <BarChart3 className="h-3.5 w-3.5 text-accent" />
              <span>Ward Thermal Vulnerability Stack</span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              {rankedWards.map(({ ward, runtime }, index) => {
                const isSelected = props.selectedWard.id === ward.id;
                const utci = toUnit(runtime.utci);

                return (
                  <button
                    key={ward.id}
                    className={`w-full rounded-lg border p-2 text-left transition-all ${
                      isSelected
                        ? "border-accent bg-accent/5 shadow-sm"
                        : "border-subtle bg-canvas hover:bg-hover hover:border-borderDefault"
                    }`}
                    onClick={() => props.setSelectedWard(ward)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-primary truncate">
                        {index + 1}. {ward.name}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold shrink-0 ${
                          runtime.utci >= 38 ? "text-semantic-danger" : "text-primary"
                        }`}
                      >
                        {fmt(utci, 0)}{unitSuffix}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-borderSubtle">
                      <div
                        className={`h-full rounded-full transition-all ${
                          runtime.utci >= 38 ? "bg-semantic-danger" : "bg-accent"
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(12, ((runtime.utci - 26) / 24) * 100))}%`,
                        }}
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

function WardPanel({
  ward,
  airTemp,
  humidity,
  windSpeed,
  meanRadiantTemp,
  toUnit,
  unitSuffix,
}: {
  ward: Ward;
  airTemp: number;
  humidity: number;
  windSpeed: number;
  meanRadiantTemp: number;
  toUnit: (v: number) => number;
  unitSuffix: string;
}) {
  const runtime = getWardRuntime(ward, airTemp, humidity, windSpeed, meanRadiantTemp);
  const danger = classifyDanger(runtime.utci, runtime.wetBulb);

  return (
    <div className="rounded-xl border border-subtle bg-base p-4 shadow-elev-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">
            Active Ward Focus
          </div>
          <h3 className="mt-0.5 text-base font-bold tracking-tight text-primary">
            {ward.name}
          </h3>
          <p className="mt-0.5 text-xs text-secondary">{ward.profile}</p>
        </div>
        <MapPin className="h-4 w-4 shrink-0 text-accent" />
      </div>

      <div className="mt-2.5">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            danger.isCritical
              ? "bg-semantic-danger/10 text-semantic-danger border border-semantic-danger/30"
              : "bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/30"
          }`}
        >
          {danger.label}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <WardStat label="Population" value={ward.population} />
        <WardStat label="Density" value={ward.density} />
        <WardStat label="Vulnerability" value={`${ward.vulnerability}/100`} />
        <WardStat label="UHI Anomaly" value={`${ward.anomaly >= 0 ? "+" : ""}${fmt(ward.anomaly)}°C`} />
      </div>

      <div className="mt-3 rounded-lg border border-subtle bg-canvas p-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-tertiary">
          <TrendingUp className="h-3 w-3 text-accent" />
          <span>3-Day Peak UTCI Outlook</span>
        </div>
        <div className="mt-2 flex h-16 items-end gap-2">
          {ward.forecast.map((value, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`w-full rounded-t transition-all ${
                  value >= 38 ? "bg-semantic-danger" : "bg-accent"
                }`}
                style={{ height: `${Math.max(12, (value - 26) * 3.5)}px` }}
              />
              <span className="text-[9px] font-medium text-tertiary">D+{index + 1}</span>
              <span className="text-[10px] font-mono font-bold text-primary">
                {fmt(toUnit(value), 0)}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-subtle bg-canvas p-2">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-tertiary">{label}</div>
      <div className="mt-0.5 text-xs font-mono font-bold tracking-tight text-primary">{value}</div>
    </div>
  );
}

function getWardRuntime(
  ward: Ward,
  airTemp: number,
  humidity: number,
  windSpeed: number,
  meanRadiantTemp: number
) {
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
    if (value >= 43) return "#D13438";
    if (value >= 39) return "#FF8C00";
    if (value >= 35) return "#B46A00";
    return "#107C10";
  }
  if (value >= 46) return "#881337";
  if (value >= 38) return "#D13438";
  if (value >= 32) return "#FF8C00";
  if (value >= 26) return "#B46A00";
  return "#107C10";
}
