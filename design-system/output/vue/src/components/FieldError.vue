<template>
  <template v-if="!!(messageKey || message)">
    <p class="rdp-field-error" role="alert">
      <template v-if="messageKey">
        {{ t(messageKey, vars) }}
      </template>

      <template v-else>
        {{ message ?? "" }}
      </template>
      <component :is="'style'">{{
        `
          .rdp-field-error {
            font-size: var(--font-size-publication-date);
            color: var(--form-error-fg);
            margin: 0;
            padding-left: var(--separation-1);
            font-family: 'Roboto', sans-serif;
          }
        `
      }}</component>
    </p>
  </template>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";

type FieldErrorProps = {
  messageKey?: string;
  message?: string;
  vars?: Record<string, string | number>;
};

const props = defineProps<FieldErrorProps>();
</script>