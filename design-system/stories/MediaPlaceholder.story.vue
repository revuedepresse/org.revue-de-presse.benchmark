<script setup lang="ts">
import MediaPlaceholder from '@design-system/components/MediaPlaceholder.vue';
</script>
<template>
  <Story title="Atoms/MediaPlaceholder">
    <Variant title="270x160"><MediaPlaceholder :width="270" :height="160" /></Variant>
    <Variant title="aspect 16/9"><MediaPlaceholder aspect-ratio="16 / 9" /></Variant>
  </Story>
</template>
