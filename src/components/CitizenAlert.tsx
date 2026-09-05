import { Clock, MessageSquare } from "lucide-react";
import { fmt } from "../lib/thermal";

type CitizenAlertProps = {
  wardName: string;
  utci: number;
  wetBulb: number;
  unitSuffix: string;
  toUnit: (v: number) => number;
};

export function CitizenAlert({
  wardName,
  utci,
  wetBulb,
  unitSuffix,
  toUnit,
}: CitizenAlertProps) {
  const minutes = Math.max(12, Math.round(95 - (utci - 32) * 5 - Math.max(0, wetBulb - 30) * 7));

  return (
    <article
      aria-label="Citizen WhatsApp and Worker Safety Lifeline"
      className="flex flex-col justify-between rounded-2xl border border-subtle bg-white p-6 shadow-figma-card transition-all"
    >
      <div>
        <div className="flex items-center justify-between border-b border-subtle pb-3.5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tertiary">
              Citizen &amp; Gig Worker Lifeline
            </span>
            <h2 className="text-base font-bold text-primary">
              Automated Mobile Advisory
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
            Push Active
          </span>
        </div>

        {/* WhatsApp Simulation Box */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-[#EFEAE2]/60 p-3.5">
          <div className="flex items-center justify-between border-b border-slate-300/40 pb-2 text-xs text-tertiary">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
              <span>WhatsApp &bull; MoES National Disaster Alert</span>
            </div>
            <span>Just Now</span>
          </div>

          <div className="mt-2.5 space-y-2 text-xs leading-relaxed text-secondary">
            <div className="rounded-lg bg-white p-3 shadow-sm border border-slate-200/60">
              🚨 <strong>Extreme Heat Alert ({wardName}):</strong> UTCI reached{" "}
              <strong className="text-rose-600">{fmt(toUnit(utci), 1)}{unitSuffix}</strong>. Avoid direct sun. Evaporative cooling failing. Nearest cooling center:{" "}
              <strong>Govt School Hall (650m)</strong>.
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm border border-slate-200/60">
              ⚠️ <strong>चेतावनी:</strong> {wardName} में जानलेवा गर्मी (UTCI {fmt(toUnit(utci), 0)}{unitSuffix})। काम रोकें, पानी पिएं और नजदीकी शेल्टर जाएं।
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Rider Exposure Timer */}
      <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
            Outdoor Delivery Exposure Timer
          </span>
          <Clock className="h-4 w-4 text-rose-600" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-black tracking-tight text-primary">
            {minutes}
          </span>
          <span className="text-xs font-bold text-rose-700">
            minutes continuous max
          </span>
        </div>
        <p className="mt-1 text-xs text-tertiary">
          Maximum continuous outdoor exposure before mandatory 15-minute rehydration break.
        </p>
      </div>
    </article>
  );
}
