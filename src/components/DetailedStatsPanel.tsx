export interface ItemStat {
  id: string;
  label: string;
  shortLabel: string;
  correct: number;
  total: number;
  confusedWith: Array<{ label: string; shortLabel: string; count: number }>;
}

interface Props {
  heading: string;
  items: ItemStat[];
}

export function DetailedStatsPanel({ heading, items }: Props) {
  const attempted = items.filter(i => i.total > 0);
  if (attempted.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 px-3 py-3 text-xs md:px-4 md:py-3">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {heading}
      </h3>
      <div className="flex flex-col divide-y divide-slate-800/60">
        {attempted.map(item => {
          const pct = Math.round((item.correct / item.total) * 100);
          const color =
            pct >= 80
              ? "text-emerald-300"
              : pct >= 50
                ? "text-amber-300"
                : "text-rose-300";
          return (
            <div key={item.id} className="py-1.5 first:pt-0 last:pb-0">
              <div className="flex items-baseline gap-2">
                <span className="w-10 shrink-0 font-mono text-[0.7rem] text-slate-400">
                  {item.shortLabel}
                </span>
                <span className="flex-1 text-slate-300">{item.label}</span>
                <span className={`font-semibold tabular-nums ${color}`}>
                  {pct}%
                </span>
                <span className="w-10 text-right tabular-nums text-slate-500">
                  {item.correct}/{item.total}
                </span>
              </div>
              {item.confusedWith.length > 0 && (
                <p className="ml-12 mt-0.5 text-[0.68rem] leading-snug text-slate-500">
                  {"confused with: "}
                  {item.confusedWith.map((c, idx) => (
                    <span key={c.shortLabel}>
                      {idx > 0 && ", "}
                      <span className="text-slate-400">{c.shortLabel}</span>
                      {" \xd7"}
                      {c.count}
                    </span>
                  ))}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
