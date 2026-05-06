<template>
  <label class="rdp-checkbox"
    ><input
      type="checkbox"
      :name="name"
      :checked="checked ?? false"
      :disabled="disabled"
      @change="async (event) => onChange?.(event.target.checked)"
    /><span class="rdp-checkbox__label">
      <template v-if="labelKey">
        {{ t(labelKey) }}
      </template>

      <template v-else>
        {{ label ?? "" }}
      </template>
      {{ labelChildren }}</span
    ><component :is="'style'">{{
      `
        .rdp-checkbox {
          display: inline-flex;
          align-items: center;
          gap: var(--separation-1);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
          color: var(--color-content-text);
          cursor: pointer;
        }
        .rdp-checkbox__label { display: inline-flex; gap: 4px; align-items: baseline; }
        .rdp-checkbox input { accent-color: var(--color-brand-active); }
        .rdp-checkbox input:disabled + .rdp-checkbox__label { opacity: 0.5; }
      `
    }}</component></label
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