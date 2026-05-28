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
    />
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