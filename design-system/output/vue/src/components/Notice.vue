<template>
  <div class="rdp-notice" role="status">
    <h2 class="rdp-notice__headline">{{ t(headlineKey, headlineVars) }}</h2>
    <p class="rdp-notice__body">{{ t(bodyKey, bodyVars) }}</p>
    <component :is="'style'">{{
      `
        .rdp-notice {
          background: var(--color-white);
          padding: var(--separation-3);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          color: var(--color-content-text);
          max-width: 360px;
        }
        .rdp-notice__headline {
          margin: 0 0 var(--separation-1);
          font-family: 'Signika', sans-serif;
          font-size: var(--font-size-status-text);
          color: var(--color-vanity-metric-like);
        }
        .rdp-notice__body { margin: 0; font-size: var(--font-size-content); }
      `
    }}</component>
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";

type NoticeProps = {
  headlineKey: string;
  bodyKey: string;
  headlineVars?: Record<string, string | number>;
  bodyVars?: Record<string, string | number>;
};

const props = defineProps<NoticeProps>();
</script>