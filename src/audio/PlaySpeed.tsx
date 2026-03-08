import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import type { IntervalPlaybackOptions, ChordPlaybackOptions } from "./audioEngine";

export type PlaySpeed = "normal" | "slow";

interface PlaySpeedContextValue {
  speed: PlaySpeed;
  setSpeed: (speed: PlaySpeed) => void;
}

const PlaySpeedContext = createContext<PlaySpeedContextValue | undefined>(undefined);

export function PlaySpeedProvider({ children }: { children: ReactNode }) {
  const [speed, setSpeed] = useState<PlaySpeed>("normal");
  const value = useMemo(() => ({ speed, setSpeed }), [speed]);
  return <PlaySpeedContext.Provider value={value}>{children}</PlaySpeedContext.Provider>;
}

export function usePlaySpeed(): PlaySpeedContextValue {
  const ctx = useContext(PlaySpeedContext);
  if (!ctx) throw new Error("usePlaySpeed must be used within a PlaySpeedProvider");
  return ctx;
}

export function intervalOptionsForSpeed(speed: PlaySpeed): IntervalPlaybackOptions {
  if (speed === "slow") return { noteDuration: 1.2, gap: 0.5, togetherDuration: 1.5 };
  return {};
}

export function chordOptionsForSpeed(speed: PlaySpeed): ChordPlaybackOptions {
  if (speed === "slow") return { noteDuration: 0.9, gap: 0.35, blockDuration: 2.2 };
  return {};
}
