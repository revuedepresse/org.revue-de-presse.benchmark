<template>
  <a
    :class="`rdp-link rdp-link--${variant ?? 'underline'}`"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <template v-if="labelKey">
      {{ t(labelKey) }}
    </template>

    <template v-else>
      {{ label ?? "" }}
    </template>
    <component :is="'style'">{{
      `
        .rdp-link {
          color: var(--color-brand-active);
          text-decoration: none;
          font-family: 'Roboto', sans-serif;
        }
        .rdp-link--underline { text-decoration: underline; }
        .rdp-link--plain { color: inherit; }
        .rdp-link:hover { color: var(--color-brand); }
      `
    }}</component></a
  >
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";

type LinkProps = {
  href: string;
  labelKey?: string;
  label?: string;
  external?: boolean;
  variant?: "underline" | "inline" | "plain";
};

const props = defineProps<LinkProps>();
</script>