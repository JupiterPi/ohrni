import { midiToFrequency, CHORD_QUALITIES, type ChordQualityId } from "./musicTheory";

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let pianoInstrument: any | null = null;

const DEFAULT_MASTER_GAIN = 0.8;

async function ensureAudioContext(): Promise<AudioContext> {
  if (typeof window === "undefined") {
    throw new Error("AudioContext is only available in the browser.");
  }

  if (!audioContext) {
    const AC =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) {
      throw new Error("This browser does not support the Web Audio API.");
    }
    const ctx = new AC();
    const gain = ctx.createGain();
    gain.gain.value = DEFAULT_MASTER_GAIN;
    gain.connect(ctx.destination);

    audioContext = ctx;
    masterGain = gain;
  }

  const ctx = audioContext as AudioContext;

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  return ctx;
}

async function ensurePianoInstrument(): Promise<{
  ctx: AudioContext;
  piano: any;
}> {
  const ctx = await ensureAudioContext();
  if (pianoInstrument) {
    return { ctx, piano: pianoInstrument };
  }

  // The SoundFont player defaults to connecting straight to `ctx.destination`.
  // Route it through our `masterGain` so it matches oscillator-based playback volume.
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = DEFAULT_MASTER_GAIN;
    masterGain.connect(ctx.destination);
  }

  // Dynamic import keeps this dependency browser-only.
  // Use `any` to sidestep missing type declarations for the remote module.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod: any = await (globalThis as any).Function(
    "return import('https://esm.sh/soundfont-player')",
  )();
  const Soundfont = (mod as any).default ?? (mod as any);
  pianoInstrument = await Soundfont.instrument(ctx, "acoustic_grand_piano", {
    destination: masterGain,
    gain: 1,
  });
  return { ctx, piano: pianoInstrument };
}

interface ToneOptions {
  duration: number;
  startTime: number;
}

function scheduleTone(
  ctx: AudioContext,
  frequency: number,
  { duration, startTime }: ToneOptions,
) {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = DEFAULT_MASTER_GAIN;
    masterGain.connect(ctx.destination);
  }

  const oscillator = ctx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  const gain = ctx.createGain();
  const attack = 0.02;
  const release = 0.1;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(1, startTime + attack);
  gain.gain.setValueAtTime(1, startTime + Math.max(attack, duration - release));
  gain.gain.linearRampToValueAtTime(
    0.0001,
    startTime + duration + release * 0.25,
  );

  oscillator.connect(gain);
  gain.connect(masterGain);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + release);
}

export interface IntervalPlaybackOptions {
  noteDuration?: number;
  gap?: number;
  togetherDuration?: number;
}

export async function playInterval(
  lowerFreq: number,
  higherFreq: number,
  options: IntervalPlaybackOptions = {},
): Promise<void> {
  const ctx = await ensureAudioContext();
  const noteDuration = options.noteDuration ?? 0.8;
  const gap = options.gap ?? 0.18;
  const togetherDuration = options.togetherDuration ?? 0.9;

  const start = ctx.currentTime + 0.05;
  const lowerFirstStart = start;
  const higherSecondStart = lowerFirstStart + noteDuration + gap;
  const togetherStart = higherSecondStart + noteDuration + gap;

  scheduleTone(ctx, lowerFreq, {
    duration: noteDuration,
    startTime: lowerFirstStart,
  });

  scheduleTone(ctx, higherFreq, {
    duration: noteDuration,
    startTime: higherSecondStart,
  });

  scheduleTone(ctx, lowerFreq, {
    duration: togetherDuration,
    startTime: togetherStart,
  });

  scheduleTone(ctx, higherFreq, {
    duration: togetherDuration,
    startTime: togetherStart,
  });
}

export async function playIntervalByMidi(
  rootMidi: number,
  intervalSemitones: number,
  options?: IntervalPlaybackOptions,
): Promise<void> {
  const lowerMidi = rootMidi;
  const higherMidi = rootMidi + intervalSemitones;

  try {
    const { ctx, piano } = await ensurePianoInstrument();
    const noteDuration = options?.noteDuration ?? 0.8;
    const gap = options?.gap ?? 0.18;
    const togetherDuration = options?.togetherDuration ?? 0.9;

    const start = ctx.currentTime + 0.05;
    const lowerFirstStart = start;
    const higherSecondStart = lowerFirstStart + noteDuration + gap;
    const togetherStart = higherSecondStart + noteDuration + gap;

    piano.play(lowerMidi, lowerFirstStart, { duration: noteDuration });
    piano.play(higherMidi, higherSecondStart, { duration: noteDuration });
    // Trigger both notes as separate voices at the same start time
    piano.play(lowerMidi, togetherStart, { duration: togetherDuration });
    piano.play(higherMidi, togetherStart, { duration: togetherDuration });
  } catch {
    const lowerFreq = midiToFrequency(lowerMidi);
    const higherFreq = midiToFrequency(higherMidi);
    await playInterval(lowerFreq, higherFreq, options);
  }
}

export interface ChordPlaybackOptions {
  noteDuration?: number;
  gap?: number;
  blockDuration?: number;
}

export async function playChordArpeggioThenBlock(
  frequencies: number[],
  options: ChordPlaybackOptions = {},
): Promise<void> {
  if (!frequencies.length) return;

  const ctx = await ensureAudioContext();
  const noteDuration = options.noteDuration ?? 0.6;
  const gap = options.gap ?? 0.12;
  const blockDuration = options.blockDuration ?? 1.4;

  const freqs = [...frequencies].sort((a, b) => a - b);
  const start = ctx.currentTime + 0.05;

  freqs.forEach((freq, index) => {
    const startTime = start + index * (noteDuration + gap);
    scheduleTone(ctx, freq, { duration: noteDuration, startTime });
  });

  const arpeggioTotal = freqs.length * (noteDuration + gap);
  const blockStart = start + arpeggioTotal + 0.16;

  freqs.forEach(freq => {
    scheduleTone(ctx, freq, { duration: blockDuration, startTime: blockStart });
  });
}

export async function playChordByMidi(
  rootMidi: number,
  qualityId: ChordQualityId,
  options?: ChordPlaybackOptions,
): Promise<void> {
  const quality = CHORD_QUALITIES.find(q => q.id === qualityId);
  if (!quality) {
    throw new Error(`Unknown chord quality: ${qualityId}`);
  }
  const midiNotes = quality.semitoneOffsets.map(offset => rootMidi + offset);

  try {
    const { ctx, piano } = await ensurePianoInstrument();
    const noteDuration = options?.noteDuration ?? 0.6;
    const gap = options?.gap ?? 0.12;
    const blockDuration = options?.blockDuration ?? 1.4;

    const sortedNotes = [...midiNotes].sort((a, b) => a - b);
    const start = ctx.currentTime + 0.05;

    sortedNotes.forEach((note, index) => {
      const startTime = start + index * (noteDuration + gap);
      piano.play(note, startTime, { duration: noteDuration });
    });

    const arpeggioTotal = sortedNotes.length * (noteDuration + gap);
    const blockStart = start + arpeggioTotal + 0.16;

    // Trigger each chord tone separately at the same start time
    sortedNotes.forEach(note => {
      piano.play(note, blockStart, { duration: blockDuration });
    });
  } catch {
    const frequencies = midiNotes.map(midiToFrequency);
    await playChordArpeggioThenBlock(frequencies, options);
  }
}
