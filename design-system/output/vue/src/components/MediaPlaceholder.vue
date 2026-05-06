<template>
  <div
    class="rdp-media-placeholder"
    aria-hidden="true"
    :style="`width:${width ? `${width}px` : '100%'};${
      height ? `height:${height}px;` : ''
    }${aspectRatio ? `aspect-ratio:${aspectRatio};` : ''}`"
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
    ><component :is="'style'">{{
      `
        .rdp-media-placeholder {
          display: block;
          background: #b0c4d4;
          border-radius: var(--radius-default);
          overflow: hidden;
          max-width: 270px;
        }
        .rdp-media-placeholder svg { width: 100%; height: 100%; display: block; }
      `
    }}</component>
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