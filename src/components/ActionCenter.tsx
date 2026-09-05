import { CheckCircle2, ChevronRight, RadioTower, ShieldAlert, CloudSun, Bell } from "lucide-react";
import { fmt } from "../lib/thermal";

type ActionCenterProps = {
  protocolTriggered: boolean;
  wardName: string;
  wardUtci: number;
  wardWetBulb: number;
  actions: string[];
  onTrigger: (action: string, message: string) => void;
  unitSuffix: string;
  toUnit: (v: number) => number;
};

export function ActionCenter({
  protocolTriggered,
  wardName,
  wardUtci,
  actions,
  onTrigger,
  unitSuffix,
  toUnit,
}: ActionCenterProps) {
  const actionList = [
    {
      id: "tankers",
      icon: <RadioTower className="h-5 w-5 text-accent" />,
      bg: "bg-blue-50",
      title: "Auto-route 15 emergency water tankers",
      status: "GPS routes assigned to thermal hotspots. ETA 22-34 min.",
      meta: "Water Logistics",
    },
    {
      id: "labor-ban",
      icon: <ShieldAlert className="h-5 w-5 text-rose-600" />,
      bg: "bg-rose-50",
      title: "Enforce 12 PM - 4 PM outdoor labor ban",
      status: "Advisory pushed to labor dept, contractors and gig platforms.",
      meta: "Legal Trigger",
    },
    {
      id: "cooling",
      icon: <CloudSun className="h-5 w-5 text-amber-600" />,
      bg: "bg-amber-50",
      title: "Activate 8 cooling shelters & cool roofs",
      status: "Schools, PHCs and community halls switched to cooling mode.",
      meta: "Relief Network",
    },
  ];

  return (
    <article
      aria-label="Municipal Emergency Action Center"
      className="flex flex-col justify-between rounded-2xl border border-subtle bg-white p-6 shadow-figma-card transition-all"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tertiary">
              NDMA Heat Action Plan &bull; SOP Framework
            </span>
            <h2 className="text-lg font-bold text-primary sm:text-xl">
              Municipal Emergency Command Center
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onTrigger("all", "All emergency heatwave SOPs dispatched to municipal squads.")
              }
              className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-all"
            >
              Dispatch All SOPs
            </button>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                protocolTriggered
                  ? "border border-rose-200 bg-rose-50 text-rose-700"
                  : "border border-subtle bg-surfaceSubtle text-tertiary"
              }`}
            >
              {protocolTriggered ? "SOP Active" : "Monitoring"}
            </span>
          </div>
        </div>

        {/* 3 SOP Action Buttons */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {actionList.map((act) => {
            const active = actions.includes(act.id);
            return (
              <button
                key={act.id}
                onClick={() => onTrigger(act.id, act.status)}
                className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-accent bg-accent/5 shadow-sm"
                    : "border-subtle bg-surfaceSubtle/50 hover:border-borderDefault hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl border border-subtle p-2 shadow-sm ${act.bg}`}>
                      {act.icon}
                    </div>
                    {active ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-tertiary" />
                    )}
                  </div>
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                    {act.meta}
                  </div>
                  <div className="mt-1 text-xs font-bold leading-snug text-primary">
                    {act.title}
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-medium">
                  {active ? (
                    <span className="font-bold text-emerald-600">Dispatched</span>
                  ) : (
                    <span className="text-tertiary">Tap to Authorize</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Operations Feed Box */}
      <div className="mt-5 rounded-xl border border-subtle bg-surfaceSubtle/60 p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-primary">
          <Bell className="h-3.5 w-3.5 text-accent" />
          <span>Live Municipal Operations Dispatch Feed</span>
        </div>
        <div className="mt-2 space-y-1 text-xs text-secondary">
          {actions.length === 0 ? (
            <p className="text-tertiary">
              Awaiting commissioner dispatch. SOP protocols ready for {wardName} (UTCI{" "}
              {fmt(toUnit(wardUtci), 1)}{unitSuffix}).
            </p>
          ) : (
            actions.map((a, i) => (
              <p key={a} className="flex items-start gap-1.5">
                <span className="font-bold text-accent">&bull; Step #{i + 1}:</span>
                <span>{actionList.find((x) => x.id === a)?.status}</span>
              </p>
            ))
          )}
        </div>
      </div>
    </article>
  );
}
