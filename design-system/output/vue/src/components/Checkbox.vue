<template>
  <label class="rdp-checkbox"
    ><input
      type="checkbox"
      :name="name"
      :checked="checked ?? false"
      :disabled="disabled"
      @change="async (event) => onChange?.(event.target.checked)"
    /><span class="rdp-checkbox__label">
      <template v-if="labelKey">{{ t(labelKey) }}</template>

      <template v-else>{{ label ?? "" }}</template>
      {{ labelChildren }}</span
    ></label
  >
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";

type CheckboxProps = {
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labelKey?: string;
  label?: string;
  labelChildren?: any;
  disabled?: boolean;
};

const props = defineProps<CheckboxProps>();
</script>