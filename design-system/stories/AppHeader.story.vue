<script setup lang="ts">
import AppHeader from '@design-system/components/AppHeader.vue';
</script>

<template>
  <Story title="Organisms/AppHeader">
    <Variant title="mobile, anonymous">
      <AppHeader layout="mobile" :authenticated="false" />
    </Variant>
    <Variant title="desktop, anonymous (Mon espace disabled)">
      <AppHeader layout="desktop" :authenticated="false" />
    </Variant>
    <Variant title="desktop, authenticated">
      <AppHeader layout="desktop" :authenticated="true" />
    </Variant>
  </Story>
</template>
