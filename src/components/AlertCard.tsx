import { useState } from "react";
import { AlertOctagon, ChevronDown, CheckCircle2 } from "lucide-react";
import type { WeatherAlert } from "../data/mockData";

type AlertCardProps = {
  alerts: WeatherAlert[];
};

export function AlertCard({ alerts }: AlertCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    alerts.length > 0 ? alerts[0].id : null
  );

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isExpanded = expandedId === alert.id;
        const isDanger = alert.severity === "danger";

        return (
          <article
            key={alert.id}
            aria-label="Severe Weather Alert"
            className={`rounded-2xl border p-5 shadow-figma-card transition-all ${
              isDanger
                ? "border-rose-200 bg-rose-50/40 border-l-4 border-l-rose-500"
                : "border-amber-200 bg-amber-50/40 border-l-4 border-l-amber-500"
            }`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              aria-expanded={isExpanded}
              className="flex w-full items-start justify-between gap-3 text-left"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isDanger ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}>
                  <AlertOctagon className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                        isDanger
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isDanger ? "IMD RED ALERT" : "IMD ADVISORY"}
                    </span>
                    <span className="text-xs text-tertiary">{alert.effective}</span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                    {alert.headline}
                  </h3>
                  <div className="text-[11px] text-tertiary">{alert.source}</div>
                </div>
              </div>

              <ChevronDown
                className={`h-4 w-4 shrink-0 text-tertiary transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="mt-4 border-t border-rose-200/60 pt-3 text-xs leading-relaxed text-secondary space-y-3">
                <p>{alert.description}</p>

                {alert.instructions && alert.instructions.length > 0 && (
                  <div className="rounded-xl bg-white p-3.5 border border-rose-200/80 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-2">
                      NDMA Disaster Management Directives
                    </div>
                    <ul className="space-y-1.5">
                      {alert.instructions.map((inst, i) => (
                        <li key={i} className="flex items-start gap-2 text-secondary">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
