export type TrainingMode = "intervals" | "chords";

interface ModeToggleProps {
  mode: TrainingMode;
  onChange: (mode: TrainingMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
          Training mode
        </h2>
        <p className="mt-1 text-xs text-slate-400 md:text-sm">
          Start with intervals, then level up to four-note chords.
        </p>
      </div>
      <div className="inline-flex rounded-full border border-slate-700/80 bg-slate-900/80 p-1 text-sm shadow-inner">
        <button
          type="button"
          className={`relative min-w-[7rem] cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition ${
            mode === "intervals"
              ? "bg-emerald-500 text-slate-950 shadow-sm"
              : "text-slate-300 hover:text-slate-100"
          }`}
          onClick={() => onChange("intervals")}
        >
          Intervals
        </button>
        <button
          type="button"
          className={`relative min-w-[7rem] cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition ${
            mode === "chords"
              ? "bg-emerald-500 text-slate-950 shadow-sm"
              : "text-slate-300 hover:text-slate-100"
          }`}
          onClick={() => onChange("chords")}
        >
          Chords
        </button>
      </div>
    </div>
  );
}

