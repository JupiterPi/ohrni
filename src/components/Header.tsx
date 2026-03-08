import { Logo } from "./Logo";
import { LabelLanguageToggle } from "./LabelLanguageToggle";
import { PlaySpeedToggle } from "./PlaySpeedToggle";

export function Header() {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 md:gap-4">
        <Logo />
        <div>
          <div className="ohrni-badge mb-2">Ear Training · Intervals · Chords</div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Ohrni
            <span className="ml-2 text-sm font-normal text-emerald-300/80 md:text-base">
              a tiny ear gym
            </span>
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-300 md:text-[0.95rem]">
            Listen closely, then name what you hear&mdash;from tight seconds to lush sevenths.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-start gap-2 md:justify-end">
        <PlaySpeedToggle />
        <LabelLanguageToggle />
      </div>
    </header>
  );
}

