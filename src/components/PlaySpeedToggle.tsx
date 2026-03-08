import { usePlaySpeed } from "../audio/PlaySpeed";

export function PlaySpeedToggle() {
  const { speed, setSpeed } = usePlaySpeed();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/80 px-2 py-1 text-[0.7rem] text-slate-300 shadow-inner">
      <span className="hidden text-[0.68rem] uppercase tracking-[0.16em] text-slate-500 sm:inline">
        Speed
      </span>
      <div className="inline-flex rounded-full bg-slate-900/80 p-0.5">
        <button
          type="button"
          className={`min-w-[2.8rem] rounded-full px-2 py-0.5 text-center font-semibold ${
            speed === "normal"
              ? "bg-emerald-500 text-slate-950"
              : "text-slate-300 hover:text-slate-100"
          }`}
          onClick={() => setSpeed("normal")}
        >
          Normal
        </button>
        <button
          type="button"
          className={`min-w-[2.8rem] rounded-full px-2 py-0.5 text-center font-semibold ${
            speed === "slow"
              ? "bg-emerald-500 text-slate-950"
              : "text-slate-300 hover:text-slate-100"
          }`}
          onClick={() => setSpeed("slow")}
        >
          Slow
        </button>
      </div>
    </div>
  );
}
