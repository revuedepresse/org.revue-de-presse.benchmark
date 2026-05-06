<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from '@design-system/components/Checkbox.vue';
const checked = ref(false);
</script>
<template>
  <Story title="Atoms/Checkbox">
    <Variant title="default">
      <Checkbox name="example" :checked="checked" @change="checked = $event" label-key="auth.remember-me" />
    </Variant>
    <Variant title="disabled">
      <Checkbox name="x" :checked="false" disabled label="Disabled" />
    </Variant>
  </Story>
</template>
