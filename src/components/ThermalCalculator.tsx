import type { ReactElement } from "react";
import { Activity, Droplets, SunMedium, ThermometerSun, Wind } from "lucide-react";
import { classifyDanger, fmt } from "../lib/thermal";

type CalculatorProps = {
  airTemp: number;
  humidity: number;
  windSpeed: number;
  meanRadiantTemp: number;
  wetBulb: number;
  utci: number;
  setAirTemp: (value: number) => void;
  setHumidity: (value: number) => void;
  setWindSpeed: (value: number) => void;
  setMeanRadiantTemp: (value: number) => void;
};

export function ThermalCalculator(props: CalculatorProps) {
  const danger = classifyDanger(props.utci, props.wetBulb);

  return (
    <section className="rounded-xl border border-subtle bg-base p-5 shadow-elev-1">
      <div className="flex items-start justify-between gap-3 border-b border-subtle pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-tertiary">
            <ThermometerSun className="h-4 w-4 text-accent" />
            <span>Fiala Mathematical Polynomial Solver &bull; UTCI</span>
          </div>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-primary sm:text-xl">
            Biophysical Thermal Exposure Lab
          </h2>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            danger.isCritical
              ? "bg-semantic-danger/10 text-semantic-danger border border-semantic-danger/30"
              : "bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/30"
          }`}
        >
          {danger.label}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-subtle bg-canvas p-4">
        <div className="grid grid-cols-3 gap-2">
          <ScienceMetric label="Ambient Temp" value={`${fmt(props.airTemp)} °C`} />
          <ScienceMetric label="Wet-Bulb Limit" value={`${fmt(props.wetBulb)} °C`} tone="text-semantic-info" />
          <ScienceMetric
            label="UTCI Bio-Stress"
            value={`${fmt(props.utci)} °C`}
            tone={danger.isCritical ? "text-semantic-danger font-black" : "text-primary"}
          />
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-borderSubtle">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              danger.isCritical ? "bg-semantic-danger" : "bg-accent"
            }`}
            style={{ width: `${Math.min(100, Math.max(8, ((props.utci - 18) / 32) * 100))}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-tertiary">
          <span>Safe (&lt;26°C)</span>
          <span>Moderate (&gt;32°C)</span>
          <span className="text-semantic-danger font-bold">Lethal Limit (&gt;46°C)</span>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="mt-4 space-y-3">
        <Slider
          label="Air Temperature"
          min={20}
          max={50}
          step={0.5}
          value={props.airTemp}
          unit="°C"
          onChange={props.setAirTemp}
          icon={<ThermometerSun className="h-4 w-4 text-[#FFAB00]" />}
        />
        <Slider
          label="Relative Humidity"
          min={10}
          max={95}
          step={1}
          value={props.humidity}
          unit="%"
          onChange={props.setHumidity}
          icon={<Droplets className="h-4 w-4 text-semantic-info" />}
        />
        <Slider
          label="Wind Velocity"
          min={0.5}
          max={10}
          step={0.1}
          value={props.windSpeed}
          unit="m/s"
          onChange={props.setWindSpeed}
          icon={<Wind className="h-4 w-4 text-secondary" />}
        />
        <Slider
          label="Mean Radiant Temp (Solar MRT)"
          min={22}
          max={70}
          step={0.5}
          value={props.meanRadiantTemp}
          unit="°C"
          onChange={props.setMeanRadiantTemp}
          icon={<SunMedium className="h-4 w-4 text-[#FF8C00]" />}
        />
      </div>

      <div className="mt-4 rounded-xl border border-subtle bg-canvas p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-tertiary">
          <Activity className="h-3.5 w-3.5 text-accent" />
          <span>Physiological Impact Assessment</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-secondary">{danger.description}</p>
      </div>
    </section>
  );
}

function ScienceMetric({
  label,
  value,
  tone = "text-primary",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-subtle bg-base p-3 text-center shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">{label}</div>
      <div className={`mt-1 font-mono text-base font-bold tracking-tight ${tone}`}>{value}</div>
    </div>
  );
}

type SliderProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  icon: ReactElement;
  onChange: (value: number) => void;
};

function Slider({ label, min, max, step, value, unit, icon, onChange }: SliderProps) {
  return (
    <label className="block rounded-lg border border-subtle bg-canvas p-3 transition hover:border-borderDefault">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="flex items-center gap-2 font-medium text-secondary">
          {icon}
          {label}
        </span>
        <span className="font-mono text-xs font-bold text-primary">
          {fmt(value, step < 1 ? 1 : 0)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-borderSubtle accent-accent focus:outline-none"
      />
    </label>
  );
}
