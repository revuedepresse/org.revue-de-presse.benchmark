<script setup lang="ts">
import { ref } from 'vue';
import EmailField from '@design-system/components/EmailField.vue';
const value = ref('');
</script>
<template>
  <Story title="Atoms/EmailField">
    <Variant title="default"><EmailField name="e" :value="value" @change="value = $event" /></Variant>
    <Variant title="error"><EmailField name="e" value="malformed" error /></Variant>
  </Story>
</template>
