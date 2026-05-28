<template>
  <div role="status" :class="`rdp-alert rdp-alert--${variant ?? 'empty'}`">
    <span aria-hidden="true" class="rdp-alert__icon">⚠</span
    ><span class="rdp-alert__text">{{ t(messageKey, vars) }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";

type AlertProps = {
  variant?: "empty" | "info" | "warning";
  messageKey: string;
  vars?: Record<string, string | number>;
};

const props = defineProps<AlertProps>();
</script>