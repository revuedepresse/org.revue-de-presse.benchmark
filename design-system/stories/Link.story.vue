<script setup lang="ts">
import Link from '@design-system/components/Link.vue';
</script>
<template>
  <Story title="Atoms/Link">
    <Variant title="underline"><Link href="#" label="mot de passe oublié ?" /></Variant>
    <Variant title="inline"><Link href="#" label="conditions d'utilisation" variant="inline" /></Variant>
    <Variant title="external"><Link href="https://revue-de-presse.org" external label="revue-de-presse.org" /></Variant>
  </Story>
</template>
