type MetricCardProps = {
  label: string;
  value: string;
  accent: string;
  caption: string;
};

export function MetricCard({ label, value, accent, caption }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-line bg-slate-900/72 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className={`mt-2 text-3xl font-black ${accent}`}>{value}</div>
      <div className="mt-1 text-sm text-slate-400">{caption}</div>
    </div>
  );
}
