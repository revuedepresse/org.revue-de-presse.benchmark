<template>
  <div class="rdp-spinner" role="status" aria-live="polite" aria-busy="true">
    <span class="rdp-spinner__ring" aria-hidden="true"></span
    ><span class="rdp-spinner__label">{{ label ?? "Chargement…" }}</span
    >
  </div>
</template>

<script setup lang="ts">
type SpinnerProps = {
  label?: string;
};

const props = defineProps<SpinnerProps>();
</script>