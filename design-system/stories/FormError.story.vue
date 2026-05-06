<script setup lang="ts">
import FormError from '@design-system/components/FormError.vue';
</script>
<template>
  <Story title="Atoms/FormError">
    <Variant title="single">
      <FormError :errors="[{ key: 'errors.auth.invalid-credentials' }]" />
    </Variant>
    <Variant title="multiple">
      <FormError :errors="[
        { key: 'errors.password.too-short', vars: { min: 15 } },
        { key: 'errors.tos.not-accepted' }
      ]" />
    </Variant>
  </Story>
</template>
