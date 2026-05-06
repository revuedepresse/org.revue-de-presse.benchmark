<script setup lang="ts">
import Logo from '@design-system/components/Logo.vue';
</script>

<template>
  <Story title="Atoms/Logo">
    <Variant title="default"><Logo /></Variant>
    <Variant title="with wordmark"><Logo show-wordmark /></Variant>
    <Variant title="small"><Logo size="sm" show-wordmark /></Variant>
    <Variant title="large"><Logo size="lg" show-wordmark /></Variant>
  </Story>
</template>
