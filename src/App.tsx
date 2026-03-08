import "./index.css";

import { useState } from "react";
import { Header } from "./components/Header";
import { ModeToggle, type TrainingMode } from "./components/ModeToggle";
import { IntervalTrainer } from "./features/intervals/IntervalTrainer";
import { ChordTrainer } from "./features/chords/ChordTrainer";
import { LabelLanguageProvider } from "./labels/LabelLanguage";
import { PlaySpeedProvider } from "./audio/PlaySpeed";

export function App() {
  const [mode, setMode] = useState<TrainingMode>("intervals");

  return (
    <PlaySpeedProvider>
    <LabelLanguageProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 md:px-6 md:py-10">
          <Header />

          <main className="mt-6 flex flex-1 flex-col gap-6 md:mt-10">
            <ModeToggle mode={mode} onChange={setMode} />

            <section className="ohrni-card flex-1 px-4 py-5 md:px-6 md:py-7">
              {mode === "intervals" ? <IntervalTrainer /> : <ChordTrainer />}
            </section>
          </main>
        </div>
      </div>
    </LabelLanguageProvider>
    </PlaySpeedProvider>
  );
}

export default App;
