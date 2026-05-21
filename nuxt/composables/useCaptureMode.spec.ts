import { describe, it, expect, vi, beforeEach } from 'vitest';
import { computed } from 'vue';

const useRouteMock = vi.fn();

// Nuxt auto-imports — stub them on globalThis so the composable file (no explicit imports) finds them.
beforeEach(() => {
  (globalThis as Record<string, unknown>).useRoute = useRouteMock;
  (globalThis as Record<string, unknown>).computed = computed;
  useRouteMock.mockReset();
});

async function loadComposable() {
  // Re-import after each setup so the module sees the latest globals.
  const mod = await import('./useCaptureMode' + `?t=${Date.now()}`);
  return mod.useCaptureMode;
}

describe('useCaptureMode', () => {
  it('returns isCaptureModeActive=false and mode="" when ?capture is absent', async () => {
    useRouteMock.mockReturnValue({ query: {} });
    const useCaptureMode = await loadComposable();
    const { isCaptureModeActive, mode } = useCaptureMode();
    expect(isCaptureModeActive.value).toBe(false);
    expect(mode.value).toBe('');
  });

  it('returns isCaptureModeActive=true and mode="tiktok" when ?capture=tiktok', async () => {
    useRouteMock.mockReturnValue({ query: { capture: 'tiktok' } });
    const useCaptureMode = await loadComposable();
    const { isCaptureModeActive, mode } = useCaptureMode();
    expect(isCaptureModeActive.value).toBe(true);
    expect(mode.value).toBe('tiktok');
  });

  it('treats any non-empty capture value as active', async () => {
    useRouteMock.mockReturnValue({ query: { capture: 'instagram' } });
    const useCaptureMode = await loadComposable();
    const { isCaptureModeActive, mode } = useCaptureMode();
    expect(isCaptureModeActive.value).toBe(true);
    expect(mode.value).toBe('instagram');
  });

  it('stringifies array query values', async () => {
    useRouteMock.mockReturnValue({ query: { capture: ['tiktok', 'extra'] } });
    const useCaptureMode = await loadComposable();
    const { isCaptureModeActive, mode } = useCaptureMode();
    expect(isCaptureModeActive.value).toBe(true);
    expect(mode.value.length).toBeGreaterThan(0);
  });
});
