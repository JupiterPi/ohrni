import { useLabelLanguage } from "../labels/LabelLanguage";

export function LabelLanguageToggle() {
  const { language, setLanguage } = useLabelLanguage();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/80 px-2 py-1 text-[0.7rem] text-slate-300 shadow-inner">
      <span className="hidden text-[0.68rem] uppercase tracking-[0.16em] text-slate-500 sm:inline">
        Labels
      </span>
      <div className="inline-flex rounded-full bg-slate-900/80 p-0.5">
        <button
          type="button"
          className={`min-w-[2.2rem] rounded-full px-2 py-0.5 text-center font-semibold ${
            language === "en"
              ? "bg-emerald-500 text-slate-950"
              : "text-slate-300 hover:text-slate-100"
          }`}
          onClick={() => setLanguage("en")}
        >
          EN
        </button>
        <button
          type="button"
          className={`min-w-[2.2rem] rounded-full px-2 py-0.5 text-center font-semibold ${
            language === "de"
              ? "bg-emerald-500 text-slate-950"
              : "text-slate-300 hover:text-slate-100"
          }`}
          onClick={() => setLanguage("de")}
        >
          DE
        </button>
      </div>
    </div>
  );
}

