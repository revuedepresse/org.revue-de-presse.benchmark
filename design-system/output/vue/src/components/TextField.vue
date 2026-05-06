<template>
  <div class="rdp-textfield" :data-error="error ? 'true' : undefined">
    <label class="rdp-textfield__label" :for="`field-${name}`">
      <template v-if="labelKey">
        {{ t(labelKey) }}
      </template>

      <template v-else>
        {{ label ?? "" }}
      </template> </label
    ><input
      :id="`field-${name}`"
      :type="type ?? 'text'"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      @input="async (event) => onChange?.(event.target.value)"
    /><component :is="'style'">{{
      `
        .rdp-textfield { display: flex; flex-direction: column; gap: 4px; font-family: 'Roboto', sans-serif; }
        .rdp-textfield__label {
          font-size: var(--font-size-publication-date);
          color: var(--color-content-text);
          padding-left: var(--separation-1);
        }
        .rdp-textfield input {
          padding: var(--separation-1) var(--separation-2);
          border: 1px solid var(--input-border-default);
          background: var(--input-bg-default);
          color: var(--input-fg-default);
          border-radius: var(--radius-default);
          font-size: var(--font-size-content);
        }
        .rdp-textfield input:focus { outline: none; border-color: var(--color-brand-active); }
        .rdp-textfield[data-error="true"] input { border-color: var(--input-border-error); }
      `
    }}</component>
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";

type TextFieldProps = {
  name: string;
  type?: "text" | "email" | "tel" | "url";
  value: string;
  onChange?: (value: string) => void;
  labelKey?: string;
  label?: string;
  placeholder?: string;
  autocomplete?: string;
  error?: boolean;
  required?: boolean;
};

const props = defineProps<TextFieldProps>();
</script>