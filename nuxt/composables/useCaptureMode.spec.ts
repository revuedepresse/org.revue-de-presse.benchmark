import { describe, it, expect, vi } from 'vitest';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
}));

import { useRoute } from 'vue-router';
import { useCaptureMode } from './useCaptureMode';

const mockedUseRoute = useRoute as unknown as ReturnType<typeof vi.fn>;

describe('useCaptureMode', () => {
  it('returns isCaptureModeActive=false and mode="" when ?capture is absent', () => {
    mockedUseRoute.mockReturnValue({ query: {} });
    const { isCaptureModeActive, mode } = useCaptureMode();
    expect(isCaptureModeActive.value).toBe(false);
    expect(mode.value).toBe('');
  });

  it('returns isCaptureModeActive=true and mode="tiktok" when ?capture=tiktok', () => {
    mockedUseRoute.mockReturnValue({ query: { capture: 'tiktok' } });
    const { isCaptureModeActive, mode } = useCaptureMode();
    expect(isCaptureModeActive.value).toBe(true);
    expect(mode.value).toBe('tiktok');
  });

  it('treats any non-empty capture value as active', () => {
    mockedUseRoute.mockReturnValue({ query: { capture: 'instagram' } });
    const { isCaptureModeActive, mode } = useCaptureMode();
    expect(isCaptureModeActive.value).toBe(true);
    expect(mode.value).toBe('instagram');
  });

  it('stringifies array query values (Vue Router can give arrays)', () => {
    mockedUseRoute.mockReturnValue({ query: { capture: ['tiktok', 'extra'] } });
    const { isCaptureModeActive, mode } = useCaptureMode();
    expect(isCaptureModeActive.value).toBe(true);
    // Array → String() yields "tiktok,extra"; we just assert it is non-empty (active).
    expect(mode.value.length).toBeGreaterThan(0);
  });
});
