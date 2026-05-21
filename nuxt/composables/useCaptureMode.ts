export function useCaptureMode() {
  const route = useRoute();
  const mode = computed(() => String(route.query.capture ?? ''));
  const isCaptureModeActive = computed(() => mode.value !== '');
  return { mode, isCaptureModeActive };
}
