<script setup lang="ts">
import BannerAbout from '@design-system/components/BannerAbout.vue';
</script>

<template>
  <Story title="Organisms/BannerAbout">
    <Variant title="default"><BannerAbout /></Variant>
    <Variant title="dismissible"><BannerAbout :dismissible="true" /></Variant>
  </Story>
</template>
