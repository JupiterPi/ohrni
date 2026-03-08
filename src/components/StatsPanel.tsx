interface StatsPanelProps {
  total: number;
  correct: number;
  streak: number;
}

export function StatsPanel({ total, correct, streak }: StatsPanelProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="mt-3 grid gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/80 px-3 py-3 text-xs text-slate-200 md:grid-cols-3 md:px-4 md:py-3">
      <div className="flex items-center justify-between md:flex-col md:items-start">
        <span className="text-slate-400">Questions</span>
        <span className="font-semibold text-slate-100 md:mt-0.5">{total}</span>
      </div>
      <div className="flex items-center justify-between md:flex-col md:items-start">
        <span className="text-slate-400">Accuracy</span>
        <span className="font-semibold text-emerald-300 md:mt-0.5">
          {accuracy}%
        </span>
      </div>
      <div className="flex items-center justify-between md:flex-col md:items-start">
        <span className="text-slate-400">Streak</span>
        <span className="font-semibold text-sky-300 md:mt-0.5">
          {streak}
          <span className="ml-1 text-[0.7rem] text-slate-400">correct</span>
        </span>
      </div>
    </div>
  );
}

