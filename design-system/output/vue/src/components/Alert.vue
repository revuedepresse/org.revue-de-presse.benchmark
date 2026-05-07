<template>
  <div role="status" :class="`rdp-alert rdp-alert--${variant ?? 'empty'}`">
    <span aria-hidden="true" class="rdp-alert__icon">⚠</span
    ><span class="rdp-alert__text">{{ t(messageKey, vars) }}</span
    ><component :is="'style'">{{
      `
        .rdp-alert {
          display: inline-flex;
          align-items: center;
          gap: var(--separation-1);
          padding: var(--separation-1) var(--separation-2);
          background: var(--alert-bg-empty);
          color: var(--alert-fg-empty);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
          border-radius: var(--radius-default);
        }
        .rdp-alert--info { background: var(--color-brand); color: var(--color-white); }
        .rdp-alert--warning { background: var(--color-vanity-metric-like); color: var(--color-white); }
      `
    }}</component>
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