import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  CloudSun,
  Compass,
  Droplets,
  Eye,
  Flame,
  Gauge,
  HeartPulse,
  Info,
  MapPin,
  Moon,
  RadioTower,
  Search,
  Share2,
  ShieldAlert,
  Sliders,
  Smartphone,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  ThermometerSun,
  Users,
  Waves,
  Wind,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CityMap } from "./components/CityMap";
import { ThermalCalculator } from "./components/ThermalCalculator";
import { wards } from "./data/wards";
import { calculateUTCI, classifyDanger, fmt, wetBulbStull } from "./lib/thermal";

type Toast = {
  id: number;
  message: string;
};

type WardRuntime = {
  id: string;
  utci: number;
  wetBulb: number;
  ambient: number;
};

const CITIES = [
  { name: "Bhopal", temp: 39, alert: "Extreme UTCI", active: true },
  { name: "Ahmedabad", temp: 43, alert: "Severe Heat", active: false },
  { name: "Delhi NCR", temp: 41, alert: "Heatwave", active: false },
  { name: "Nagpur", temp: 42, alert: "High Wind", active: false },
  { name: "Kolkata", temp: 36, alert: "84% Humidity", active: false },
];

const HOURLY_FORECAST = [
  { time: "Now", temp: 39, utci: 48, icon: "sun", critical: true },
  { time: "3 PM", temp: 41, utci: 51, icon: "sun", critical: true },
  { time: "4 PM", temp: 40, utci: 49, icon: "sun", critical: true },
  { time: "5 PM", temp: 38, utci: 45, icon: "sun", critical: true },
  { time: "6 PM", temp: 36, utci: 41, icon: "sun", critical: false },
  { time: "7 PM", temp: 34, utci: 38, icon: "sunset", critical: false },
  { time: "8 PM", temp: 33, utci: 36, icon: "moon", critical: false },
  { time: "9 PM", temp: 32, utci: 35, icon: "moon", critical: false },
  { time: "10 PM", temp: 31, utci: 34, icon: "moon", critical: false },
  { time: "11 PM", temp: 30, utci: 33, icon: "moon", critical: false },
  { time: "12 AM", temp: 29, utci: 32, icon: "moon", critical: false },
  { time: "6 AM", temp: 27, utci: 29, icon: "sunrise", critical: false },
];

const DAILY_FORECAST = [
  { day: "Today", date: "Sep 05", high: 41, low: 27, utciMax: 51, label: "Extreme Hazard", pct: 95 },
  { day: "Tomorrow", date: "Sep 06", high: 42, low: 28, utciMax: 52, label: "Extreme Hazard", pct: 98 },
  { day: "Sunday", date: "Sep 07", high: 40, low: 27, utciMax: 49, label: "Very Strong", pct: 86 },
  { day: "Monday", date: "Sep 08", high: 38, low: 26, utciMax: 46, label: "Strong Heat", pct: 74 },
  { day: "Tuesday", date: "Sep 09", high: 36, low: 25, utciMax: 42, label: "Moderate", pct: 58 },
  { day: "Wednesday", date: "Sep 10", high: 35, low: 24, utciMax: 39, label: "Moderate", pct: 45 },
];

export function App() {
  const [airTemp, setAirTemp] = useState(39);
  const [humidity, setHumidity] = useState(62);
  const [windSpeed, setWindSpeed] = useState(1.7);
  const [meanRadiantTemp, setMeanRadiantTemp] = useState(54);
  const [mapMode, setMapMode] = useState<"ambient" | "utci">("utci");
  const [selectedWard, setSelectedWard] = useState(wards[1]);
  const [selectedCity, setSelectedCity] = useState("Bhopal");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [actions, setActions] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showSimLab, setShowSimLab] = useState(false);

  const toUnit = (valC: number) => (unit === "C" ? valC : (valC * 9) / 5 + 32);
  const unitSuffix = `°${unit}`;

  const wetBulb = useMemo(() => wetBulbStull(airTemp, humidity), [airTemp, humidity]);
  const utci = useMemo(
    () => calculateUTCI({ airTemp, humidity, windSpeed, meanRadiantTemp }),
    [airTemp, humidity, windSpeed, meanRadiantTemp]
  );
  const danger = classifyDanger(utci, wetBulb);

  const wardRuntime = useMemo<WardRuntime[]>(
    () =>
      wards.map((ward) => {
        const ambient = airTemp + ward.anomaly;
        const wardWetBulb = wetBulbStull(ambient, humidity);
        const wardUtci = calculateUTCI({
          airTemp: ambient,
          humidity,
          windSpeed,
          meanRadiantTemp: meanRadiantTemp + ward.solarDelta,
        });

        return { id: ward.id, ambient, wetBulb: wardWetBulb, utci: wardUtci };
      }),
    [airTemp, humidity, meanRadiantTemp, windSpeed]
  );

  const activeRuntime = wardRuntime.find((ward) => ward.id === selectedWard.id) ?? wardRuntime[0];
  const triggeredWards = wardRuntime.filter((ward) => ward.utci > 38 || ward.wetBulb > 32).length;
  const protocolTriggered = activeRuntime.utci > 38 || activeRuntime.wetBulb > 32;

  function triggerAction(action: string, message: string) {
    if (!actions.includes(action)) {
      setActions((current) => [...current, action]);
    }
    const toast = { id: Date.now(), message };
    setToasts((current) => [toast, ...current].slice(0, 3));
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== toast.id)), 3600);
  }

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white font-sans selection:bg-rose-500 selection:text-white">
      <div className="weather-backdrop" />

      {/* MSN-style Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0c1424]/90 px-4 py-2.5 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-sky-600 via-rose-500 to-amber-400 shadow-md">
              <Sun className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">TAP-MAN Weather</span>
                <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400">MoES Pilot</span>
              </div>
              <p className="text-[11px] text-slate-400">Ministry of Earth Sciences &bull; NCMRWF Heat Decision System</p>
            </div>
          </div>

          {/* MSN Location Quick-Chips */}
          <div className="hidden items-center gap-1.5 md:flex">
            {CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCity(c.name)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  selectedCity === c.name
                    ? "border-sky-400/50 bg-sky-500/15 text-white shadow-sm"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08]"
                }`}
              >
                <span>{c.name}</span>
                <span className="font-bold text-white">{fmt(toUnit(c.temp), 0)}°</span>
                <span className="rounded-full bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-bold text-rose-400">
                  {c.alert}
                </span>
              </button>
            ))}
          </div>

          {/* Unit Toggle & Live Status */}
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-xs font-semibold">
              <button
                onClick={() => setUnit("C")}
                className={`rounded px-2.5 py-1 transition ${unit === "C" ? "bg-sky-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit("F")}
                className={`rounded px-2.5 py-1 transition ${unit === "F" ? "bg-sky-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                °F
              </button>
            </div>

            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Live Radar
            </span>
          </div>
        </div>
      </header>

      {/* MSN Severe Warning Strip */}
      <div className="border-b border-rose-500/30 bg-rose-950/40 px-4 py-2 text-xs sm:px-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-rose-200">
            <AlertOctagon className="h-4 w-4 shrink-0 text-rose-400 animate-bounce" />
            <span className="font-bold text-white uppercase tracking-wider">Lethal Heatwave Warning:</span>
            <span>
              {selectedWard.name} has crossed physiological safety thresholds (Wet-Bulb {fmt(wetBulb)}°C / UTCI {fmt(utci)}°C).
              Evaporative cooling compromised.
            </span>
          </div>
          <span className="hidden text-[11px] font-medium text-rose-300 underline underline-offset-2 sm:inline">
            Active NDMA Protocol &rarr;
          </span>
        </div>
      </div>

      {/* Main MSN-Style Dashboard Body */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* City Title & Metadata Strip */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
              <MapPin className="h-3.5 w-3.5" />
              {selectedCity}, Madhya Pradesh &bull; Ward Microclimate Grid
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {selectedWard.name}
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              As of 2:30 PM IST &bull; NCMRWF Unified Model 12km &bull; High-resolution Landsat Downscaling
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSimLab(!showSimLab)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              <Sliders className="h-4 w-4 text-sky-400" />
              {showSimLab ? "Hide Exposure Simulator" : "Open Biophysical Simulator"}
            </button>
          </div>
        </div>

        {/* MSN HERO MODULE: Split Current Weather + Radar Map */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Left Hero: Current Biothermal State Card */}
          <div className="msn-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current Physiological State
                </span>
                <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-400">
                  {danger.label}
                </span>
              </div>

              {/* Huge MSN-Style Temperature Display */}
              <div className="mt-5 flex flex-wrap items-center gap-6">
                <div className="relative grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-white/10">
                  <Flame className="h-14 w-14 text-rose-500 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black tracking-tighter text-white sm:text-7xl">
                      {fmt(toUnit(airTemp), 0)}
                    </span>
                    <span className="text-3xl font-bold text-slate-400">{unitSuffix}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-base font-bold text-slate-200">Humid Heat Trap</span>
                    <span className="rounded-md bg-rose-500 px-2 py-0.5 text-xs font-extrabold text-white shadow-sm">
                      Feels Like (UTCI): {fmt(toUnit(utci), 1)}{unitSuffix}
                    </span>
                  </div>
                </div>
              </div>

              {/* MSN Narrative Summary Text */}
              <p className="mt-5 text-sm leading-relaxed text-slate-300">
                Lethal combination of <strong className="text-white">{fmt(airTemp)}°C</strong> ambient air temperature and{" "}
                <strong className="text-white">{humidity}%</strong> relative humidity. High atmospheric moisture eliminates
                evaporative sweat cooling, causing core body temperature to spike dangerously past 40°C.
              </p>
            </div>

            {/* MSN 6-Stat Bottom Grid */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 border-t border-white/[0.08] pt-5 sm:grid-cols-6">
              <StatItem label="Wet-Bulb" value={`${fmt(toUnit(wetBulb), 1)}${unitSuffix}`} icon={<Droplets className="text-sky-400" />} alert />
              <StatItem label="Humidity" value={`${humidity}%`} icon={<CloudSun className="text-amber-400" />} />
              <StatItem label="Wind Speed" value={`${fmt(windSpeed)} m/s`} icon={<Wind className="text-teal-400" />} />
              <StatItem label="Solar MRT" value={`${fmt(toUnit(meanRadiantTemp), 0)}${unitSuffix}`} icon={<Sun className="text-orange-400" />} />
              <StatItem label="Slum UHI" value={`+${fmt(selectedWard.anomaly)}°C`} icon={<Flame className="text-rose-400" />} />
              <StatItem label="Air Quality" value="114 AQI" icon={<Activity className="text-emerald-400" />} />
            </div>
          </div>

          {/* Right Hero: Interactive Radar & Heat Hazard Map */}
          <div className="msn-card overflow-hidden p-5 flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-sky-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Hyper-Local Heat Hazard Map
                </h2>
              </div>
              <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setMapMode("utci")}
                  className={`rounded px-3 py-1 transition ${mapMode === "utci" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  UTCI Bio-Stress
                </button>
                <button
                  onClick={() => setMapMode("ambient")}
                  className={`rounded px-3 py-1 transition ${mapMode === "ambient" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Ambient Air
                </button>
              </div>
            </div>

            {/* Embedded Map Container */}
            <div className="relative min-h-[300px] flex-1 rounded-xl overflow-hidden border border-white/10">
              <CityMap
                wards={wards}
                selectedWard={selectedWard}
                setSelectedWard={setSelectedWard}
                mapMode={mapMode}
                setMapMode={setMapMode}
                airTemp={airTemp}
                humidity={humidity}
                windSpeed={windSpeed}
                meanRadiantTemp={meanRadiantTemp}
              />
            </div>
          </div>
        </div>

        {/* SIMULATOR DRAWER (If toggled by evaluator) */}
        {showSimLab && (
          <div className="msn-card p-6 border-sky-500/30">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-sky-400" />
                  Interactive Biophysical Thermal Exposure Lab
                </h3>
                <p className="text-xs text-slate-400">
                  Slide weather variables in real time to see mathematical changes in Wet-Bulb &amp; UTCI.
                </p>
              </div>
              <button onClick={() => setShowSimLab(false)} className="text-xs font-semibold text-slate-400 hover:text-white">
                Close &times;
              </button>
            </div>
            <div className="mt-4">
              <ThermalCalculator
                airTemp={airTemp}
                humidity={humidity}
                windSpeed={windSpeed}
                meanRadiantTemp={meanRadiantTemp}
                wetBulb={wetBulb}
                utci={utci}
                setAirTemp={setAirTemp}
                setHumidity={setHumidity}
                setWindSpeed={setWindSpeed}
                setMeanRadiantTemp={setMeanRadiantTemp}
              />
            </div>
          </div>
        )}

        {/* MSN SIGNATURE COMPONENT: 24-Hour Thermal Curve & Multi-Day Forecast */}
        <div className="msn-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Biometeorological Forecast
              </span>
              <h2 className="text-xl font-bold text-white">24-Hour Diurnal Heat Stress Progression</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="h-4 w-4 text-sky-400" />
              <span>Critical Curfew Window: <strong>11:00 AM &ndash; 4:00 PM</strong></span>
            </div>
          </div>

          {/* Diurnal Timeline / Hourly Cards (Signature MSN Pattern) */}
          <div className="mt-5 horizontal-scroll gap-3 pb-3">
            {HOURLY_FORECAST.map((hour) => (
              <div
                key={hour.time}
                className={`flex w-24 shrink-0 flex-col items-center rounded-xl border p-3 text-center transition ${
                  hour.critical
                    ? "border-rose-500/40 bg-rose-500/10 shadow-sm"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <span className="text-xs font-semibold text-slate-400">{hour.time}</span>
                <div className="my-2.5">
                  {hour.icon === "sun" ? (
                    <Sun className={`h-6 w-6 ${hour.critical ? "text-rose-500 animate-pulse" : "text-amber-400"}`} />
                  ) : hour.icon === "sunset" ? (
                    <Sunset className="h-6 w-6 text-orange-400" />
                  ) : hour.icon === "sunrise" ? (
                    <Sunrise className="h-6 w-6 text-amber-300" />
                  ) : (
                    <Moon className="h-6 w-6 text-indigo-300" />
                  )}
                </div>
                <span className="text-base font-black text-white">{fmt(toUnit(hour.temp), 0)}°</span>
                <span className={`mt-1 text-[11px] font-bold ${hour.critical ? "text-rose-400" : "text-slate-400"}`}>
                  UTCI {fmt(toUnit(hour.utci), 0)}°
                </span>
                {hour.critical && (
                  <span className="mt-1 rounded bg-rose-500/30 px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-tight text-rose-300">
                    Curfew
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* MSN Multi-Day Heatwave Horizon List */}
          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              5-Day Severe Heatwave Outlook &bull; NCMRWF Lead Prediction
            </h3>
            <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
              {DAILY_FORECAST.map((d) => (
                <div
                  key={d.day}
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 hover:border-white/20 transition"
                >
                  <div>
                    <div className="text-sm font-bold text-white">{d.day}</div>
                    <div className="text-[11px] text-slate-400">{d.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">
                        {fmt(toUnit(d.high), 0)}° / {fmt(toUnit(d.low), 0)}°
                      </div>
                      <div className="text-[10px] font-semibold text-rose-400">Peak UTCI {fmt(toUnit(d.utciMax), 0)}°</div>
                    </div>
                    <div className="w-16">
                      <div className="temp-range-bar" style={{ opacity: d.pct / 100 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MSN "LIFE INDEX" & MUNICIPAL ACTION PROTOCOLS */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Municipal Action Command */}
          <ActionCenter
            protocolTriggered={protocolTriggered}
            wardName={selectedWard.name}
            wardUtci={activeRuntime.utci}
            wardWetBulb={activeRuntime.wetBulb}
            actions={actions}
            onTrigger={triggerAction}
            unitSuffix={unitSuffix}
            toUnit={toUnit}
          />

          {/* Citizen Lifeline & Worker Timer */}
          <CitizenAlert
            wardName={selectedWard.name}
            utci={activeRuntime.utci}
            wetBulb={activeRuntime.wetBulb}
            unitSuffix={unitSuffix}
            toUnit={toUnit}
          />
        </div>
      </main>

      {/* Toast Feed */}
      <ToastStack toasts={toasts} />
    </div>
  );
}

function StatItem({
  label,
  value,
  icon,
  alert = false,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  alert?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-2.5 text-center transition ${alert ? "border-rose-500/30 bg-rose-500/5" : "border-white/[0.06] bg-white/[0.02]"}`}>
      <div className="flex justify-center text-slate-400 [&>svg]:h-4 [&>svg]:w-4">{icon}</div>
      <div className="mt-1 text-[10px] uppercase font-semibold text-slate-400">{label}</div>
      <div className={`mt-0.5 text-xs font-bold ${alert ? "text-rose-400" : "text-white"}`}>{value}</div>
    </div>
  );
}

function ActionCenter({
  protocolTriggered,
  wardName,
  wardUtci,
  wardWetBulb,
  actions,
  onTrigger,
  unitSuffix,
  toUnit,
}: {
  protocolTriggered: boolean;
  wardName: string;
  wardUtci: number;
  wardWetBulb: number;
  actions: string[];
  onTrigger: (action: string, message: string) => void;
  unitSuffix: string;
  toUnit: (v: number) => number;
}) {
  const actionList = [
    {
      id: "tankers",
      icon: <RadioTower className="h-5 w-5 text-sky-400" />,
      title: "Auto-route 15 water tankers",
      status: "GPS routes assigned to thermal hotspots. ETA 22-34 min.",
      meta: "Water Logistics",
    },
    {
      id: "labor-ban",
      icon: <ShieldAlert className="h-5 w-5 text-rose-400" />,
      title: "Enforce 12 PM - 4 PM outdoor labor ban",
      status: "Advisory pushed to labor dept, contractors and gig platforms.",
      meta: "Legal Trigger",
    },
    {
      id: "cooling",
      icon: <CloudSun className="h-5 w-5 text-amber-400" />,
      title: "Activate 8 cooling centers & cool roofs",
      status: "Schools, PHCs and community halls switched to cooling mode.",
      meta: "Relief Network",
    },
  ];

  return (
    <div className="msn-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              NDMA Heat Action Protocol
            </span>
            <h2 className="text-xl font-bold text-white">Municipal Emergency Command</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTrigger("all", "All emergency SOPs dispatched to municipal teams.")}
              className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition-all hover:bg-neutral-200"
            >
              Dispatch All Protocols
            </button>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              protocolTriggered ? "border-rose-500/60 bg-rose-500/10 text-rose-400" : "border-white/10 bg-white/[0.04] text-slate-400"
            }`}>
              {protocolTriggered ? "SOP Active" : "Monitoring"}
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {actionList.map((act) => {
            const active = actions.includes(act.id);
            return (
              <button
                key={act.id}
                onClick={() => onTrigger(act.id, act.status)}
                className={`flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-sky-400/50 bg-sky-500/10 shadow-sm"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">{act.icon}</div>
                    {active ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
                  </div>
                  <div className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{act.meta}</div>
                  <div className="mt-1 text-sm font-bold leading-snug text-white">{act.title}</div>
                </div>
                <div className="mt-4 text-[11px] font-medium text-slate-400">
                  {active ? <span className="text-emerald-400 font-bold">Dispatched</span> : "Tap to Authorize"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/30 p-3.5">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Bell className="h-3.5 w-3.5 text-sky-400" />
          Live Municipal Operations Feed
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {actions.length === 0 ? (
            <p>Awaiting commissioner dispatch. Protocols are ready for {wardName} (UTCI {fmt(toUnit(wardUtci), 1)}{unitSuffix}).</p>
          ) : (
            actions.map((a, i) => (
              <p key={a} className="text-slate-200">
                &bull; Step #{i + 1}: {actionList.find((x) => x.id === a)?.status}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CitizenAlert({
  wardName,
  utci,
  wetBulb,
  unitSuffix,
  toUnit,
}: {
  wardName: string;
  utci: number;
  wetBulb: number;
  unitSuffix: string;
  toUnit: (v: number) => number;
}) {
  const minutes = Math.max(12, Math.round(95 - (utci - 32) * 5 - Math.max(0, wetBulb - 30) * 7));

  return (
    <div className="msn-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Citizen &amp; Gig Worker Lifeline
            </span>
            <h2 className="text-xl font-bold text-white">Automated Mobile Warning</h2>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
            Push Active
          </span>
        </div>

        {/* WhatsApp Simulation Box */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-[#0c1424] p-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs text-slate-400">
            <span className="font-bold text-white">WhatsApp &bull; MoES Alert</span>
            <span>Just Now</span>
          </div>

          <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-200">
            <div className="rounded-lg bg-white/[0.05] p-2.5 border border-white/[0.06]">
              🚨 <strong>Extreme Heat Alert ({wardName}):</strong> UTCI reached {fmt(toUnit(utci), 1)}{unitSuffix}.
              Avoid direct sun. Evaporative cooling failing. Nearest cooling center: <strong>Govt School Hall (650m)</strong>.
            </div>
            <div className="rounded-lg bg-white/[0.05] p-2.5 border border-white/[0.06]">
              ⚠️ <strong>चेतावनी:</strong> {wardName} में जानलेवा गर्मी (UTCI {fmt(toUnit(utci), 0)}{unitSuffix})। काम रोकें, पानी पिएं और नजदीकी शेल्टर जाएं।
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Rider Safety Work Duration Timer */}
      <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-950/20 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">
            Outdoor Delivery Work Timer
          </span>
          <Clock className="h-4 w-4 text-rose-400" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-black tracking-tight text-white">{minutes}</span>
          <span className="text-sm font-semibold text-rose-300">minutes continuous max</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Recommended maximum continuous outdoor exposure before mandatory 15-minute hydration break.
        </p>
      </div>
    </div>
  );
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-[5000] w-[min(380px,calc(100vw-2rem))] space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="rounded-xl border border-sky-400/30 bg-[#0f172a]/95 p-4 text-xs font-semibold text-white shadow-2xl backdrop-blur">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
