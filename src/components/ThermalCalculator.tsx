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
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow">
            <ThermometerSun className="h-3.5 w-3.5 text-slate-400" />
            Biophysical Fiala Model &bull; UTCI
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">Thermal Exposure Lab</h2>
        </div>
        <div className={`rounded-full border px-3 py-1 text-right text-[10px] font-semibold uppercase tracking-wider ${danger.color}`}>
          {danger.label}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/40 p-4">
        <div className="grid grid-cols-3 gap-2">
          <ScienceMetric label="Ambient Temp" value={`${fmt(props.airTemp)} °C`} />
          <ScienceMetric label="Wet-Bulb" value={`${fmt(props.wetBulb)} °C`} tone="text-white" />
          <ScienceMetric label="UTCI Stress" value={`${fmt(props.utci)} °C`} tone={danger.isCritical ? "text-crimson" : "text-white"} />
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              danger.isCritical ? "bg-crimson" : "bg-white/70"
            }`}
            style={{ width: `${Math.min(100, Math.max(6, ((props.utci - 18) / 32) * 100))}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[9px] font-semibold uppercase tracking-wider text-slateMuted">
          <span>Safe (&lt;26°)</span>
          <span>Moderate (&gt;32°)</span>
          <span className="text-crimson font-bold">Lethal Limit (&gt;46°)</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Slider label="Air Temperature" min={20} max={50} step={0.5} value={props.airTemp} unit="°C" onChange={props.setAirTemp} icon={<ThermometerSun />} />
        <Slider label="Relative Humidity" min={10} max={95} step={1} value={props.humidity} unit="%" onChange={props.setHumidity} icon={<Droplets />} />
        <Slider label="Wind Velocity" min={0.5} max={10} step={0.1} value={props.windSpeed} unit="m/s" onChange={props.setWindSpeed} icon={<Wind />} />
        <Slider label="Mean Radiant Temp (Solar)" min={22} max={70} step={0.5} value={props.meanRadiantTemp} unit="°C" onChange={props.setMeanRadiantTemp} icon={<SunMedium />} />
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/40 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Activity className="h-3.5 w-3.5 text-slate-400" />
          Physiological Assessment
        </div>
        <p className="mt-2 text-xs leading-relaxed text-graphite">{danger.description}</p>
      </div>
    </section>
  );
}

function ScienceMetric({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-panel/80 p-3 text-center">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-slateMuted">{label}</div>
      <div className={`mt-1 text-base font-bold tracking-tight ${tone}`}>{value}</div>
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
    <label className="block rounded-xl border border-white/[0.08] bg-panel/60 p-3 transition hover:border-white/15">
      <div className="mb-2.5 flex items-center justify-between gap-3 text-xs">
        <span className="flex min-w-0 items-center gap-2 font-medium text-slate-200">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-slate-300 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
          {label}
        </span>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-xs font-semibold text-white">
          {fmt(value)} {unit}
        </span>
      </div>
      <input
        className="tap-slider"
        min={min}
        max={max}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
