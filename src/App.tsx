import { useMemo, useState } from "react";
import {
  AlertOctagon,
  Sliders,
  MapPin,
  Flame,
} from "lucide-react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HourlyCarousel } from "./components/HourlyCarousel";
import { DailyForecast } from "./components/DailyForecast";
import { DetailCards } from "./components/DetailCards";
import { AQICard } from "./components/AQICard";
import { SunMoonCard } from "./components/SunMoonCard";
import { AlertCard } from "./components/AlertCard";
import { CurrentConditionsCard } from "./components/CurrentConditionsCard";
import { ActionCenter } from "./components/ActionCenter";
import { CitizenAlert } from "./components/CitizenAlert";
import { CityMap } from "./components/CityMap";
import { ThermalCalculator } from "./components/ThermalCalculator";
import { CITIES_DATA } from "./data/mockData";
import { wards } from "./data/wards";
import { calculateUTCI, classifyDanger, fmt, wetBulbStull } from "./lib/thermal";

type Toast = {
  id: number;
  message: string;
};

export function App() {
  const [selectedCityKey, setSelectedCityKey] = useState<string>("Hadgaon");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [showSimLab, setShowSimLab] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [selectedWard, setSelectedWard] = useState(wards[1]);
  const [mapMode, setMapMode] = useState<"ambient" | "utci">("utci");

  // City Data
  const cityData = CITIES_DATA[selectedCityKey] || CITIES_DATA["Hadgaon"];

  // Thermal parameters (synced with active city)
  const [airTemp, setAirTemp] = useState(cityData.current.tempC);
  const [humidity, setHumidity] = useState(cityData.current.humidity);
  const [windSpeed, setWindSpeed] = useState(cityData.current.windSpeedKmh / 3.6);
  const [meanRadiantTemp, setMeanRadiantTemp] = useState(54);

  const toUnit = (valC: number) => (unit === "C" ? valC : (valC * 9) / 5 + 32);
  const unitSuffix = `°${unit}`;

  const wetBulb = useMemo(() => wetBulbStull(airTemp, humidity), [airTemp, humidity]);
  const utci = useMemo(
    () => calculateUTCI({ airTemp, humidity, windSpeed, meanRadiantTemp }),
    [airTemp, humidity, windSpeed, meanRadiantTemp]
  );
  const danger = classifyDanger(utci, wetBulb);

  const wardRuntime = useMemo(
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

  const activeWardRuntime =
    wardRuntime.find((w) => w.id === selectedWard.id) ?? wardRuntime[0];
  const protocolTriggered = activeWardRuntime.utci > 38 || activeWardRuntime.wetBulb > 32;

  const handleCitySelect = (cityName: string) => {
    setSelectedCityKey(cityName);
    const newCity = CITIES_DATA[cityName];
    if (newCity) {
      setAirTemp(newCity.current.tempC);
      setHumidity(newCity.current.humidity);
      setWindSpeed(newCity.current.windSpeedKmh / 3.6);
    }
  };

  const handleShare = () => {
    const text = `${cityData.name}, ${cityData.state}: ${Math.round(toUnit(cityData.current.tempC))}°${unit}, ${cityData.current.condition} (UTCI: ${Math.round(toUnit(cityData.current.utciC))}°${unit})`;
    if (navigator.share) {
      navigator
        .share({
          title: `Weather in ${cityData.name}`,
          text,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      showToast("Forecast copied to clipboard!");
    }
  };

  const showToast = (message: string) => {
    const toast = { id: Date.now(), message };
    setToasts((cur) => [toast, ...cur].slice(0, 3));
    setTimeout(() => {
      setToasts((cur) => cur.filter((t) => t.id !== toast.id));
    }, 3500);
  };

  const triggerAction = (action: string, message: string) => {
    if (!actions.includes(action)) {
      setActions((cur) => [...cur, action]);
    }
    showToast(message);
  };

  return (
    <div className="relative min-h-screen bg-canvas font-sans text-primary selection:bg-accent selection:text-white">
      {/* Figma Atmospheric Ambient Background Mesh */}
      <div className="atmospheric-mesh" />

      {/* 1. Header Navigation Bar */}
      <Header
        selectedCity={selectedCityKey}
        onSelectCity={handleCitySelect}
        unit={unit}
        onToggleUnit={setUnit}
        onShare={handleShare}
      />

      {/* 2. Severe Heat Warning Banner */}
      <div className="relative z-10 border-b border-rose-200/80 bg-rose-50/70 px-4 py-2.5 text-xs backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-rose-800">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-rose-200/80 text-rose-700">
              <AlertOctagon className="h-3.5 w-3.5 animate-bounce" />
            </span>
            <span className="font-extrabold uppercase tracking-wider text-rose-900">
              Lethal Heatwave Advisory:
            </span>
            <span className="font-medium text-rose-800">
              {cityData.name} ({cityData.state}) has crossed safe biometeorological limits (Wet-Bulb {fmt(wetBulb)}°C / UTCI {fmt(utci)}°C). High core heat exhaustion risk.
            </span>
          </div>
          <span className="hidden text-[11px] font-bold text-rose-700 underline underline-offset-2 sm:inline cursor-pointer">
            NDMA Municipal SOP Active &rarr;
          </span>
        </div>
      </div>

      {/* 3. Main Dashboard Layout Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* City Quick-Chips Bar */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2">
            {Object.keys(CITIES_DATA).map((cityName) => {
              const c = CITIES_DATA[cityName];
              const isSelected = selectedCityKey === cityName;
              const temp = Math.round(toUnit(c.current.tempC));

              return (
                <button
                  key={cityName}
                  onClick={() => handleCitySelect(cityName)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "border-accent bg-accent text-white shadow-md font-bold shadow-accent/20"
                      : "border-subtle bg-white text-secondary hover:border-borderDefault hover:bg-slate-50"
                  }`}
                >
                  <MapPin className={`h-3 w-3 ${isSelected ? "text-white" : "text-tertiary"}`} />
                  <span>{c.name}</span>
                  <span className="font-mono font-bold">{temp}°</span>
                  <span
                    className={`rounded-md px-1.5 py-0.2 text-[9px] font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-surfaceSubtle text-tertiary"
                    }`}
                  >
                    {c.current.uvLevel}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowSimLab(!showSimLab)}
            className="hidden sm:flex shrink-0 items-center gap-1.5 rounded-xl border border-subtle bg-white px-3.5 py-1.5 text-xs font-semibold text-secondary hover:bg-slate-50 hover:text-primary transition shadow-sm"
          >
            <Sliders className="h-3.5 w-3.5 text-accent" />
            <span>{showSimLab ? "Hide Simulator" : "Biophysical Simulator"}</span>
          </button>
        </div>

        {/* Simulator Drawer (If toggled) */}
        {showSimLab && (
          <div className="rounded-2xl border border-accent/40 bg-white p-6 shadow-figma-elev animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-subtle pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-accent" />
                  Interactive Biophysical Thermal Exposure Lab
                </h3>
                <p className="text-xs text-tertiary">
                  Slide weather parameters in real time to calculate live changes in Wet-Bulb &amp; UTCI.
                </p>
              </div>
              <button
                onClick={() => setShowSimLab(false)}
                className="text-xs font-bold text-tertiary hover:text-primary transition"
              >
                Close &times;
              </button>
            </div>
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
        )}

        {/* 2-COLUMN MAIN GRID (8 cols Left / 4 cols Right Sticky Sidebar) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* PRIMARY COLUMN (Left - 8 cols with min-w-0 to prevent any overflow) */}
          <div className="min-w-0 space-y-6 lg:col-span-8">
            {/* 1. Hero Summary Card */}
            <Hero
              cityData={cityData}
              unit={unit}
              onOpenSimLab={() => setShowSimLab(true)}
            />

            {/* 2. Hourly Forecast Module (24h/48h Snap Scroller) */}
            <HourlyCarousel
              hourly={cityData.hourly}
              unit={unit}
            />

            {/* 3. 10-Day Forecast Module (Data Table + Mobile Accordion) */}
            <DailyForecast
              daily={cityData.daily}
              unit={unit}
            />

            {/* 4. Details Grid Module (6 Polymorphic Cards) */}
            <DetailCards
              cityData={cityData}
              unit={unit}
            />

            {/* 5. 1km Microclimate Ward Radar & Heat Hazard Map */}
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
              unit={unit}
            />

            {/* 6. NDMA Municipal Emergency Command */}
            <ActionCenter
              protocolTriggered={protocolTriggered}
              wardName={selectedWard.name}
              wardUtci={activeWardRuntime.utci}
              wardWetBulb={activeWardRuntime.wetBulb}
              actions={actions}
              onTrigger={triggerAction}
              unitSuffix={unitSuffix}
              toUnit={toUnit}
            />
          </div>

          {/* SECONDARY COLUMN (Right - 4 cols Sticky Sidebar) */}
          <aside className="min-w-0 space-y-5 lg:col-span-4 lg:sticky lg:top-20 lg:h-fit">
            {/* 1. Weather Alerts (Conditional) */}
            <AlertCard alerts={cityData.alerts} />

            {/* 2. Current Conditions Card */}
            <CurrentConditionsCard
              cityData={cityData}
              unit={unit}
            />

            {/* 3. Air Quality Index (AQI) Card */}
            <AQICard cityData={cityData} />

            {/* 4. Sun & Moon Timeline Card */}
            <SunMoonCard astronomy={cityData.astronomy} />

            {/* 5. Citizen & Gig Worker WhatsApp Lifeline */}
            <CitizenAlert
              wardName={selectedWard.name}
              utci={activeWardRuntime.utci}
              wetBulb={activeWardRuntime.wetBulb}
              unitSuffix={unitSuffix}
              toUnit={toUnit}
            />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-subtle bg-white/80 py-8 text-center text-xs text-tertiary">
        <div className="mx-auto max-w-7xl px-4 space-y-2">
          <p className="font-bold text-secondary">
            TAP-MAN Weather Decision Platform &bull; Ministry of Earth Sciences (MoES) &bull; National Disaster Management Authority (NDMA)
          </p>
          <p className="text-tertiary">
            Data sources: India Meteorological Department (IMD) &bull; NCMRWF High-Res Unified Model &bull; CARTO / OpenStreetMap &bull; Biophysical Fiala UTCI Solver
          </p>
        </div>
      </footer>

      {/* Toast Feed */}
      <ToastStack toasts={toasts} />
    </div>
  );
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-[5000] w-[min(380px,calc(100vw-2rem))] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-subtle bg-white/95 p-4 text-xs font-bold text-primary shadow-figma-elev backdrop-blur-md"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
