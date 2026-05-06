<script setup lang="ts">
import { ref } from 'vue';
import TextField from '@design-system/components/TextField.vue';
const value = ref('');
</script>
<template>
  <Story title="Atoms/TextField">
    <Variant title="default"><TextField name="t" :value="value" @change="value = $event" label="email" placeholder="prenom.nom@email.com" /></Variant>
    <Variant title="error"><TextField name="t" value="malformed" error label="email" /></Variant>
  </Story>
</template>
