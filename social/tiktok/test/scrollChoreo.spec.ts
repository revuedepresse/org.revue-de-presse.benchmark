import { describe, expect, it } from 'vitest';
import {
  buildSteps,
  CHOREO_TOTAL_MS,
  HOLD_TOP_MS,
  SCROLL_MS,
  HOLD_END_MS,
} from '../src/render/scrollChoreo.ts';

describe('buildSteps', () => {
  const targetY = 3000;
  const steps = buildSteps(targetY);

  it('starts at (0, 0)', () => {
    expect(steps[0]).toEqual({ atMs: 0, scrollY: 0 });
  });

  it('CHOREO_TOTAL_MS = HOLD_TOP_MS + SCROLL_MS + HOLD_END_MS = 23500', () => {
    expect(CHOREO_TOTAL_MS).toBe(HOLD_TOP_MS + SCROLL_MS + HOLD_END_MS);
    expect(CHOREO_TOTAL_MS).toBe(23_500);
  });

  it('ends at total = 23500 ms and scrollY = targetY', () => {
    expect(steps[steps.length - 1]?.atMs).toBe(CHOREO_TOTAL_MS);
    expect(steps[steps.length - 1]?.scrollY).toBe(targetY);
  });

  it('exits the top hold at scrollY === 0', () => {
    const exitHoldTop = steps.find((s) => s.atMs === HOLD_TOP_MS);
    expect(exitHoldTop?.scrollY).toBe(0);
  });

  it('reaches scrollY === targetY at the end of the scroll region', () => {
    const endScroll = steps.find((s) => s.atMs === HOLD_TOP_MS + SCROLL_MS);
    expect(endScroll?.scrollY).toBe(targetY);
  });

  it('is monotonic non-decreasing in scrollY', () => {
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i]!.scrollY).toBeGreaterThanOrEqual(steps[i - 1]!.scrollY);
    }
  });

  it('has approximately constant velocity inside the scroll region', () => {
    const inside = steps.filter(
      (s) => s.atMs > HOLD_TOP_MS && s.atMs < HOLD_TOP_MS + SCROLL_MS,
    );
    const diffs: number[] = [];
    for (let i = 1; i < inside.length; i++) {
      diffs.push(
        (inside[i]!.scrollY - inside[i - 1]!.scrollY) /
          (inside[i]!.atMs - inside[i - 1]!.atMs),
      );
    }
    const min = Math.min(...diffs);
    const max = Math.max(...diffs);
    expect(max - min).toBeLessThan(0.01);
  });
});
