<script setup lang="ts">
import { ref } from 'vue';
import PasswordField from '@design-system/components/PasswordField.vue';
const value = ref('');
</script>
<template>
  <Story title="Atoms/PasswordField">
    <Variant title="login"><PasswordField name="p" :value="value" @change="value = $event" mode="login" /></Variant>
    <Variant title="new (with helper)"><PasswordField name="p" :value="value" @change="value = $event" mode="new" /></Variant>
    <Variant title="error"><PasswordField name="p" value="short" mode="new" error /></Variant>
  </Story>
</template>
