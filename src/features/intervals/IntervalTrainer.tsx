import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { StatsPanel } from "../../components/StatsPanel";
import {
  INTERVALS,
  type IntervalDefinition,
  type IntervalId,
  type IntervalQuestion,
  createRandomIntervalQuestion,
} from "../../audio/musicTheory";
import { playIntervalByMidi } from "../../audio/audioEngine";
import { getBestStreak, updateBestStreak } from "../../utils/storage";

export function IntervalTrainer() {
  const [current, setCurrent] = useState<IntervalQuestion | null>(null);
  const [selected, setSelected] = useState<IntervalId | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const answerable = !!current && !isPlaying;

  const correctDefinition = useMemo<IntervalDefinition | null>(
    () =>
      current
        ? INTERVALS.find(i => i.semitones === current.intervalSemitones) ?? null
        : null,
    [current],
  );

  const playCurrent = useCallback(async () => {
    if (!current) return;
    try {
      setIsPlaying(true);
      await playIntervalByMidi(current.rootMidi, current.intervalSemitones);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsPlaying(false);
    }
  }, [current]);

  const startNewQuestion = useCallback(
    async (playImmediately: boolean) => {
      const q = createRandomIntervalQuestion();
      setCurrent(q);
      setSelected(null);
      setIsCorrect(null);
      setHasStarted(true);

      if (playImmediately) {
        try {
          setIsPlaying(true);
          await playIntervalByMidi(q.rootMidi, q.intervalSemitones);
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

  const handleAnswer = (interval: IntervalDefinition) => {
    if (!current || isPlaying || isCorrect !== null) return;

    const correctNow = interval.semitones === current.intervalSemitones;
    setSelected(interval.semitones);
    setIsCorrect(correctNow);
    setTotal(prev => prev + 1);

    if (correctNow) {
      setCorrect(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        setBestStreak(currentBest =>
          next > currentBest ? updateBestStreak("intervals", next) : currentBest,
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
    setCurrent(null);
    setSelected(null);
    setIsCorrect(null);
    setIsPlaying(false);
    setHasStarted(false);
    setTotal(0);
    setCorrect(0);
    setStreak(0);
  };

  useEffect(() => {
    setBestStreak(getBestStreak("intervals"));
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
            Interval practice
          </h2>
          <p className="mt-1 text-xs text-slate-300 md:text-sm">
            You&apos;ll hear two notes: low, high, then together. Name the
            interval between them.
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
                    Interval between two notes in a two-octave range
                  </span>
                </div>
                <p className="text-sm text-slate-100">
                  Listen, then choose the interval you hear.
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
                    Next interval
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-300">
                Press{" "}
                <span className="font-semibold text-emerald-300">
                  Start session
                </span>{" "}
                to begin hearing random intervals across a two-octave span.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/60 px-3 py-3 md:px-4 md:py-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Choose the interval
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs md:grid-cols-4 md:text-sm">
              {INTERVALS.map(interval => {
                const isSelected = selected === interval.semitones;
                const isTheCorrect =
                  current &&
                  interval.semitones === current.intervalSemitones &&
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

                return (
                  <Button
                    key={interval.id}
                    size="sm"
                    variant={variant}
                    disabled={!answerable}
                    onClick={() => handleAnswer(interval)}
                  >
                    <span className="font-mono text-[0.8rem] md:text-xs">
                      {interval.shortLabel}
                    </span>
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
                  After you answer, you&apos;ll see whether you were right and
                  what the interval was.
                </p>
              ) : isCorrect ? (
                <p className="text-emerald-300">
                  Nice! That was a{" "}
                  <span className="font-semibold">
                    {correctDefinition?.label} ({correctDefinition?.shortLabel})
                  </span>
                  .
                </p>
              ) : (
                <p className="text-rose-300">
                  Not quite. It was a{" "}
                  <span className="font-semibold">
                    {correctDefinition?.label} ({correctDefinition?.shortLabel})
                  </span>
                  .
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


