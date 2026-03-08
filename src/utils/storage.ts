type StreakKey = "intervals" | "chords";

const PREFIX = "ohrni";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getBestStreak(mode: StreakKey): number {
  const storage = getStorage();
  if (!storage) return 0;
  const raw = storage.getItem(`${PREFIX}-${mode}-best-streak`);
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function updateBestStreak(mode: StreakKey, streak: number): number {
  if (streak <= 0) return 0;
  const storage = getStorage();
  const current = getBestStreak(mode);
  const next = Math.max(current, streak);
  if (storage && next !== current) {
    try {
      storage.setItem(`${PREFIX}-${mode}-best-streak`, String(next));
    } catch {
      // ignore
    }
  }
  return next;
}

