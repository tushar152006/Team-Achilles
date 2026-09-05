import { useState, useRef, useEffect } from "react";
import { Search, Sun, MapPin, Share2, Check, Sparkles } from "lucide-react";
import { CITIES_DATA } from "../data/mockData";

type HeaderProps = {
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
  unit: "C" | "F";
  onToggleUnit: (unit: "C" | "F") => void;
  onShare: () => void;
};

export function Header({
  selectedCity,
  onSelectCity,
  unit,
  onToggleUnit,
  onShare,
}: HeaderProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cityKeys = Object.keys(CITIES_DATA);
  const filteredCities = cityKeys.filter(
    (c) =>
      c.toLowerCase().includes(query.toLowerCase()) ||
      CITIES_DATA[c].state.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShareClick = () => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toUnit = (valC: number) => (unit === "C" ? valC : (valC * 9) / 5 + 32);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-subtle/80 bg-white/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 shadow-sm shadow-amber-500/20">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-primary">TAP-MAN Weather</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                <Sparkles className="h-2.5 w-2.5" />
                Figma Light
              </span>
            </div>
            <span className="text-[11px] font-medium text-tertiary">
              Ministry of Earth Sciences &bull; Extreme Heat Decision System
            </span>
          </div>
        </div>

        {/* Search Bar with Autocomplete */}
        <div ref={searchRef} className="relative hidden w-full max-w-sm md:block">
          <div className="flex items-center rounded-xl border border-subtle bg-surfaceSubtle px-3.5 py-2 transition-all focus-within:border-accent focus-within:bg-white focus-within:ring-4 focus-within:ring-accent/10">
            <Search className="mr-2 h-4 w-4 text-tertiary" />
            <input
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-label="Search location"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search district or ward (e.g. Hadgaon, Bhopal)..."
              className="w-full bg-transparent text-sm text-primary placeholder:text-disabled focus:outline-none"
            />
          </div>

          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-subtle bg-white py-1.5 shadow-figma-elev z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-tertiary">
                Indian Districts &amp; Thermal Hotspots
              </div>
              {filteredCities.length > 0 ? (
                filteredCities.map((c) => {
                  const city = CITIES_DATA[c];
                  const temp = toUnit(city.current.tempC);
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        onSelectCity(c);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm hover:bg-hover transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <div>
                          <span className="font-semibold text-primary">{city.name}</span>
                          <span className="text-xs text-tertiary">, {city.state}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-primary">
                          {Math.round(temp)}°{unit}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${city.current.aqiColor}15`,
                            color: city.current.aqiColor,
                          }}
                        >
                          {city.current.condition}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-3.5 py-2 text-xs text-tertiary">No matching Indian locations found</div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Unit Toggle & Share & Live Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unit Toggle (°C / °F) */}
          <div
            role="radiogroup"
            aria-label="Temperature unit selection"
            className="flex rounded-xl border border-subtle bg-surfaceSubtle p-0.5 text-xs font-semibold"
          >
            <button
              role="radio"
              aria-checked={unit === "C"}
              onClick={() => onToggleUnit("C")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                unit === "C"
                  ? "bg-accent text-white shadow-sm font-bold"
                  : "text-secondary hover:text-primary"
              }`}
            >
              °C
            </button>
            <button
              role="radio"
              aria-checked={unit === "F"}
              onClick={() => onToggleUnit("F")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                unit === "F"
                  ? "bg-accent text-white shadow-sm font-bold"
                  : "text-secondary hover:text-primary"
              }`}
            >
              °F
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShareClick}
            aria-label="Share forecast"
            className="flex items-center gap-1.5 rounded-xl border border-subtle bg-white px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-hover hover:text-primary transition shadow-sm"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-semantic-success" /> : <Share2 className="h-3.5 w-3.5 text-tertiary" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
          </button>

          {/* Live Radar Badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Live Radar</span>
          </div>
        </div>
      </div>
    </header>
  );
}
