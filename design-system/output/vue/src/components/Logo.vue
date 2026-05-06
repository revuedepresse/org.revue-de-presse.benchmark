<template>
  <span class="rdp-logo" :data-size="size ?? 'md'"
    ><svg
      viewBox="0 0 58 58"
      role="img"
      :width="size === 'sm' ? 32 : size === 'lg' ? 64 : 48"
      :height="size === 'sm' ? 32 : size === 'lg' ? 64 : 48"
      :aria-label="t(altKey ?? 'logo.alt')"
    >
      <circle cx="29" cy="29" r="29" fill="var(--color-brand)"></circle>
      <g transform="translate(6.349 13.196)">
        <path
          d="M44.485 41.775l-.4-.392-.767-.758-.845.835-.319.315 1.164 2.083z"
          transform="translate(-24.524 -28.899)"
          fill="var(--color-white)"
        ></path>
      </g>
    </svg>
    <template v-if="showWordmark">
      <span class="rdp-logo__wordmark">Revue de presse</span>
    </template>

    <component :is="'style'">{{
      `
        .rdp-logo {
          display: inline-flex;
          align-items: center;
          gap: var(--separation-1);
        }
        .rdp-logo__wordmark {
          font-family: 'Signika', sans-serif;
          font-size: 24px;
          color: var(--color-brand);
        }
      `
    }}</component></span
  >
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  altKey?: string;
};

const props = defineProps<LogoProps>();
</script>