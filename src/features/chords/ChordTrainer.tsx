import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/Button";
import { StatsPanel } from "../../components/StatsPanel";
import {
  CHORD_QUALITIES,
  type ChordQuality,
  type ChordQualityId,
  type ChordQuestion,
  createRandomChordQuestion,
  midiToNoteName,
} from "../../audio/musicTheory";
import { playChordByMidi } from "../../audio/audioEngine";
import { getBestStreak, updateBestStreak } from "../../utils/storage";
import { useLabelLanguage } from "../../labels/LabelLanguage";

const GERMAN_CHORD_CODES: Record<string, string> = {
  maj: "D",
  min: "M",
  aug: "ü",
  dim7: "v7",
  maj7: "Dmaj7",
  7: "D7",
  add6: "D6",
  min7: "M7",
  min6: "M6",
};

export function ChordTrainer() {
  const [current, setCurrent] = useState<ChordQuestion | null>(null);
  const [selectedId, setSelectedId] = useState<ChordQualityId | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const { language } = useLabelLanguage();

  const prevRootMidiRef = useRef<number | undefined>(undefined);

  const answerable = !!current && !isPlaying;

  const spelledChord = useMemo(() => {
    if (!current) return "";
    const notes = current.noteMidis.map(midiToNoteName);
    return `${notes.join("–")}`;
  }, [current]);

  const playCurrent = useCallback(async () => {
    if (!current) return;
    try {
      setIsPlaying(true);
      await playChordByMidi(current.rootMidi, current.quality.id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsPlaying(false);
    }
  }, [current]);

  const startNewQuestion = useCallback(
    async (playImmediately: boolean) => {
      const q = createRandomChordQuestion(prevRootMidiRef.current);
      prevRootMidiRef.current = q.rootMidi;
      setCurrent(q);
      setSelectedId(null);
      setIsCorrect(null);
      setHasStarted(true);

      if (playImmediately) {
        try {
          setIsPlaying(true);
          await playChordByMidi(q.rootMidi, q.quality.id);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } finally {
          setIsPlaying(false);
        }
      }
    },
    [],
  );

  const handleStartSession = () => {
    void startNewQuestion(true);
  };

  const handleReplay = () => {
    void playCurrent();
  };

  const handleAnswer = (quality: ChordQuality) => {
    if (!current || isPlaying || isCorrect !== null) return;

    const correctNow = quality.id === current.quality.id;
    setSelectedId(quality.id);
    setIsCorrect(correctNow);
    setTotal(prev => prev + 1);

    if (correctNow) {
      setCorrect(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        setBestStreak(currentBest =>
          next > currentBest ? updateBestStreak("chords", next) : currentBest,
        );
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = useCallback(() => {
    if (!hasStarted) return;
    void startNewQuestion(true);
  }, [hasStarted, startNewQuestion]);

  const handleEndSession = () => {
    prevRootMidiRef.current = undefined;
    setCurrent(null);
    setSelectedId(null);
    setIsCorrect(null);
    setIsPlaying(false);
    setHasStarted(false);
    setTotal(0);
    setCorrect(0);
    setStreak(0);
  };

  useEffect(() => {
    setBestStreak(getBestStreak("chords"));
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!hasStarted) return;
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        handleReplay();
      } else if (event.key === "Enter" && isCorrect !== null) {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasStarted, handleReplay, handleNext, isCorrect]);

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">
            Chord practice
          </h2>
          <p className="mt-1 text-xs text-slate-300 md:text-sm">
            Hear four-note voicings: first as an arpeggio, then together. Decide
            which chord quality you&apos;re hearing.
          </p>
        </div>
        <div className="mt-2 flex gap-2 md:mt-0">
          {!hasStarted ? (
            <Button size="sm" onClick={handleStartSession}>
              Start session
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleReplay}
                disabled={!current}
              >
                {isPlaying ? "Playing…" : "Replay"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEndSession}
              >
                End session
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="mt-1 grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/40 px-4 py-4 text-sm text-slate-200">
            {current ? (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                    Current question
                  </span>
                  <span className="text-[0.7rem] text-slate-500">
                    Four-note chord (triads, 6ths, 7ths, dim7, aug)
                  </span>
                </div>
                <p className="text-sm text-slate-100">
                  Listen to the arpeggio and the block chord, then pick the
                  chord quality.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleReplay}
                    disabled={!current}
                  >
                    {isPlaying ? "Playing…" : "Play again"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleNext}
                    disabled={isCorrect === null}
                  >
                    Next chord
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-300">
                Press{" "}
                <span className="font-semibold text-emerald-300">
                  Start session
                </span>{" "}
                to begin hearing four-note voicings across a comfortable range.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/60 px-3 py-3 md:px-4 md:py-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Choose the chord quality
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs md:grid-cols-3 md:text-sm">
              {CHORD_QUALITIES.map(quality => {
                const isSelected = selectedId === quality.id;
                const isTheCorrect =
                  current &&
                  quality.id === current.quality.id &&
                  isCorrect === false;
                const isCorrectSelected = isSelected && isCorrect;

                let variant: "primary" | "secondary" | "ghost" = "secondary";
                if (isCorrectSelected) {
                  variant = "primary";
                } else if (isTheCorrect) {
                  variant = "primary";
                } else if (isSelected) {
                  variant = "ghost";
                }

                const germanCode = GERMAN_CHORD_CODES[quality.id] ?? "";
                const labelToShow =
                  language === "de" && germanCode
                    ? germanCode
                    : quality.label;

                return (
                  <Button
                    key={quality.id}
                    size="md"
                    variant={variant}
                    disabled={!answerable}
                    onClick={() => handleAnswer(quality)}
                  >
                    <span className="text-xs md:text-sm">{labelToShow}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/60 px-4 py-3 text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Feedback
            </h3>
            <div className="mt-2 text-sm">
              {isCorrect === null || !current ? (
                <p className="text-slate-300">
                  Once you answer, you&apos;ll see whether you were right and
                  how the chord is spelled.
                </p>
              ) : isCorrect ? (
                <p className="text-emerald-300">
                  Beautiful! That was a{" "}
                  <span className="font-semibold">
                    {current.quality.label}
                    {language === "de" &&
                      GERMAN_CHORD_CODES[current.quality.id] &&
                      ` (${GERMAN_CHORD_CODES[current.quality.id]})`}
                  </span>{" "}
                  chord:
                  <br />
                  <span className="font-mono text-emerald-200">
                    {spelledChord}
                  </span>
                </p>
              ) : (
                <p className="text-rose-300">
                  This time it was a{" "}
                  <span className="font-semibold">
                    {current.quality.label}
                    {language === "de" &&
                      GERMAN_CHORD_CODES[current.quality.id] &&
                      ` (${GERMAN_CHORD_CODES[current.quality.id]})`}
                  </span>{" "}
                  chord:
                  <br />
                  <span className="font-mono text-rose-100">
                    {spelledChord}
                  </span>
                </p>
              )}
            </div>
          </div>

          <StatsPanel total={total} correct={correct} streak={streak} />
          <p className="mt-1 text-[0.7rem] text-slate-500">
            Best streak on this device:{" "}
            <span className="font-semibold text-slate-200">{bestStreak}</span>
          </p>
        </div>
      </div>
    </div>
  );
}


