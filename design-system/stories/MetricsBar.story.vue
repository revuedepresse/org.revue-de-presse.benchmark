<script setup lang="ts">
import MetricsBar from '@design-system/components/MetricsBar.vue';
</script>

<template>
  <Story title="Molecules/MetricsBar">
    <Variant title="default"><MetricsBar :replies="182" :reposts="36000" :likes="35200" locale="fr-FR" /></Variant>
    <Variant title="en-GB"><MetricsBar :replies="182" :reposts="36000" :likes="35200" locale="en-GB" /></Variant>
  </Story>
</template>
