<template>
  <div
    class="rdp-media-placeholder"
    aria-hidden="true"
    :style="{
      width: width ? `${width}px` : '100%',
      height: height ? `${height}px` : undefined,
      aspectRatio: aspectRatio,
    }"
  >
    <svg viewBox="0 0 100 60" preserveAspectRatio="none">
      <line
        x1="0"
        y1="0"
        x2="100"
        y2="60"
        stroke="var(--color-light-grey)"
        strokeWidth="1"
      ></line>
      <line
        x1="100"
        y1="0"
        x2="0"
        y2="60"
        stroke="var(--color-light-grey)"
        strokeWidth="1"
      ></line></svg
    >
  </div>
</template>

<script setup lang="ts">
type MediaPlaceholderProps = {
  width?: number;
  height?: number;
  aspectRatio?: string;
};

const props = defineProps<MediaPlaceholderProps>();
</script>