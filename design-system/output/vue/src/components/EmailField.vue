<template>
  <div class="rdp-textfield" :data-error="error ? 'true' : undefined">
    <label class="rdp-textfield__label" :for="`field-${name}`">{{
      t(labelKey ?? "auth.email-label")
    }}</label
    ><input
      type="email"
      autocomplete="email"
      :id="`field-${name}`"
      :name="name"
      :value="value"
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
        .rdp-textfield[data-error="true"] input { border-color: var(--input-border-error); }
      `
    }}</component>
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";

type EmailFieldProps = {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  labelKey?: string;
  error?: boolean;
  required?: boolean;
};

const props = defineProps<EmailFieldProps>();
</script>