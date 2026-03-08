export const A4_MIDI = 69;
export const A4_FREQ = 440;

export function midiToFrequency(midi: number): number {
  return A4_FREQ * Math.pow(2, (midi - A4_MIDI) / 12);
}

export const INTERVAL_MIN_MIDI = 48; // C3
export const INTERVAL_MAX_MIDI = 72; // C5

export type IntervalId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface IntervalDefinition {
  id: IntervalId;
  semitones: IntervalId;
  label: string;
  shortLabel: string;
}

export const INTERVALS: IntervalDefinition[] = [
  { id: 0, semitones: 0, label: "Perfect unison", shortLabel: "P1" },
  { id: 1, semitones: 1, label: "Minor second", shortLabel: "m2" },
  { id: 2, semitones: 2, label: "Major second", shortLabel: "M2" },
  { id: 3, semitones: 3, label: "Minor third", shortLabel: "m3" },
  { id: 4, semitones: 4, label: "Major third", shortLabel: "M3" },
  { id: 5, semitones: 5, label: "Perfect fourth", shortLabel: "P4" },
  { id: 6, semitones: 6, label: "Tritone", shortLabel: "TT" },
  { id: 7, semitones: 7, label: "Perfect fifth", shortLabel: "P5" },
  { id: 8, semitones: 8, label: "Minor sixth", shortLabel: "m6" },
  { id: 9, semitones: 9, label: "Major sixth", shortLabel: "M6" },
  { id: 10, semitones: 10, label: "Minor seventh", shortLabel: "m7" },
  { id: 11, semitones: 11, label: "Major seventh", shortLabel: "M7" },
  { id: 12, semitones: 12, label: "Perfect octave", shortLabel: "P8" },
];

export interface IntervalQuestion {
  rootMidi: number;
  intervalSemitones: IntervalId;
  definition: IntervalDefinition;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pitchClass(midi: number): number {
  return ((midi % 12) + 12) % 12;
}

// History-window randomizer: excludes the last ~half of all options from the
// pool, so nothing repeats too soon, but the pool always has multiple candidates
// making it impossible to predict what comes next.

const INTERVAL_HISTORY_SIZE = Math.floor(INTERVALS.length / 2); // 6
let intervalHistory: IntervalDefinition[] = [];

export function getRandomIntervalDefinition(): IntervalDefinition {
  const excluded = new Set(intervalHistory);
  const pool = INTERVALS.filter(i => !excluded.has(i));
  const chosen = pool[getRandomInt(0, pool.length - 1)]!;
  intervalHistory.push(chosen);
  if (intervalHistory.length > INTERVAL_HISTORY_SIZE) intervalHistory.shift();
  return chosen;
}

export function createRandomIntervalQuestion(previousRootMidi?: number): IntervalQuestion {
  const def = getRandomIntervalDefinition();
  const highestAllowedRoot = INTERVAL_MAX_MIDI - def.semitones;

  const prevPC = previousRootMidi !== undefined ? pitchClass(previousRootMidi) : -1;
  const validRoots: number[] = [];
  for (let midi = INTERVAL_MIN_MIDI; midi <= highestAllowedRoot; midi++) {
    if (pitchClass(midi) !== prevPC) validRoots.push(midi);
  }
  const pool = validRoots.length > 0 ? validRoots :
    Array.from({ length: highestAllowedRoot - INTERVAL_MIN_MIDI + 1 }, (_, i) => INTERVAL_MIN_MIDI + i);
  const rootMidi = pool[getRandomInt(0, pool.length - 1)]!;

  return {
    rootMidi,
    intervalSemitones: def.semitones,
    definition: def,
  };
}

export type ChordQualityId =
  | "maj"
  | "min"
  | "dim7"
  | "aug"
  | "maj7"
  | "7"
  | "add6"
  | "min7"
  | "min6";

export interface ChordQuality {
  id: ChordQualityId;
  label: string;
  description: string;
  semitoneOffsets: number[];
}

export const CHORD_QUALITIES: ChordQuality[] = [
  {
    id: "maj",
    label: "Major",
    description: "1–3–5 with the root doubled an octave up",
    semitoneOffsets: [0, 4, 7, 12],
  },
  {
    id: "min",
    label: "Minor",
    description: "1–♭3–5 with the root doubled an octave up",
    semitoneOffsets: [0, 3, 7, 12],
  },
  {
    id: "dim7",
    label: "Diminished 7",
    description: "1–♭3–♭5–𝄫7 (fully diminished seventh)",
    semitoneOffsets: [0, 3, 6, 9],
  },
  {
    id: "aug",
    label: "Augmented",
    description: "1–3–♯5 with the root doubled an octave up",
    semitoneOffsets: [0, 4, 8, 12],
  },
  {
    id: "maj7",
    label: "Major 7",
    description: "1–3–5–7",
    semitoneOffsets: [0, 4, 7, 11],
  },
  {
    id: "7",
    label: "Dominant 7",
    description: "1–3–5–♭7",
    semitoneOffsets: [0, 4, 7, 10],
  },
  {
    id: "add6",
    label: "Add 6",
    description: "1–3–5–6",
    semitoneOffsets: [0, 4, 7, 9],
  },
  {
    id: "min7",
    label: "Minor 7",
    description: "1–♭3–5–♭7",
    semitoneOffsets: [0, 3, 7, 10],
  },
  {
    id: "min6",
    label: "Minor 6",
    description: "1–♭3–5–6",
    semitoneOffsets: [0, 3, 7, 9],
  },
];

const CHORD_MIN_MIDI = 48; // C3
const CHORD_MAX_MIDI = 72; // C5

export interface ChordQuestion {
  rootMidi: number;
  quality: ChordQuality;
  noteMidis: number[];
}

const CHORD_HISTORY_SIZE = Math.floor(CHORD_QUALITIES.length / 2); // 4
let chordHistory: ChordQuality[] = [];

export function getRandomChordQuality(): ChordQuality {
  const excluded = new Set(chordHistory);
  const pool = CHORD_QUALITIES.filter(q => !excluded.has(q));
  const chosen = pool[getRandomInt(0, pool.length - 1)]!;
  chordHistory.push(chosen);
  if (chordHistory.length > CHORD_HISTORY_SIZE) chordHistory.shift();
  return chosen;
}

export function createRandomChordQuestion(previousRootMidi?: number): ChordQuestion {
  const quality = getRandomChordQuality();
  const maxOffset = Math.max(...quality.semitoneOffsets);
  const highestAllowedRoot = CHORD_MAX_MIDI - maxOffset;

  const prevPC = previousRootMidi !== undefined ? pitchClass(previousRootMidi) : -1;
  const validRoots: number[] = [];
  for (let midi = CHORD_MIN_MIDI; midi <= highestAllowedRoot; midi++) {
    if (pitchClass(midi) !== prevPC) validRoots.push(midi);
  }
  const pool = validRoots.length > 0 ? validRoots :
    Array.from({ length: highestAllowedRoot - CHORD_MIN_MIDI + 1 }, (_, i) => CHORD_MIN_MIDI + i);
  const rootMidi = pool[getRandomInt(0, pool.length - 1)]!;
  const noteMidis = quality.semitoneOffsets.map(offset => rootMidi + offset);

  return {
    rootMidi,
    quality,
    noteMidis,
  };
}

const NOTE_NAMES_SHARP = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

export function midiToNoteName(midi: number): string {
  const pitchClass = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES_SHARP[pitchClass]}${octave}`;
}

