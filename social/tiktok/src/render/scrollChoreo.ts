export const HOLD_TOP_MS = 1_000;
export const SCROLL_MS = 20_000;
export const HOLD_END_MS = 2_500;
export const CHOREO_TOTAL_MS = HOLD_TOP_MS + SCROLL_MS + HOLD_END_MS; // 23_500
const TICK_MS = 16;

export interface ChoreoStep {
  atMs: number;
  scrollY: number;
}

export function buildSteps(targetY: number): ChoreoStep[] {
  const steps: ChoreoStep[] = [{ atMs: 0, scrollY: 0 }];
  steps.push({ atMs: HOLD_TOP_MS, scrollY: 0 });
  for (let t = TICK_MS; t < SCROLL_MS; t += TICK_MS) {
    steps.push({
      atMs: HOLD_TOP_MS + t,
      scrollY: Math.round((t / SCROLL_MS) * targetY * 1000) / 1000,
    });
  }
  steps.push({ atMs: HOLD_TOP_MS + SCROLL_MS, scrollY: targetY });
  steps.push({ atMs: CHOREO_TOTAL_MS, scrollY: targetY });
  return steps;
}
