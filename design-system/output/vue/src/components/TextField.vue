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
    />
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