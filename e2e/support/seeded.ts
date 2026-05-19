// Deterministic PRNG for reproducible random tests. Override seed via E2E_SEED.

export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRandomDates(
  rng: () => number,
  n: number,
  min: Date,
  max: Date,
): Date[] {
  const span = max.getTime() - min.getTime();
  return Array.from({ length: n }, () => {
    const t = min.getTime() + rng() * span;
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

export function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function yesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
