<template>
  <button
    type="button"
    :class="`rdp-button rdp-button--${variant}`"
    :data-loading="loading ? 'true' : undefined"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    @click="async (event) => onClick?.()"
  >
    <template v-if="!!icon">
      <span class="rdp-button__icon"
        ><Icon :name="icon" :size="24" :decorative="true"></Icon
      ></span>
    </template>

    <template v-if="variant !== 'scrollTop' && variant !== 'avatar'">
      <span class="rdp-button__label">
        <template v-if="labelKey">
          {{ t(labelKey) }}
        </template>

        <template v-else>
          {{ label ?? "" }}
        </template>
      </span>
    </template>

    <template v-if="!!iconAfter">
      <span class="rdp-button__icon-after"
        ><Icon :name="iconAfter" :size="24" :decorative="true"></Icon
      ></span>
    </template>

    <component :is="'style'">{{
      `
        .rdp-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--separation-1);
          border: none;
          cursor: pointer;
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
          padding: var(--separation-1) var(--separation-2);
          border-radius: var(--radius-default);
          background: var(--button-bg-primary);
          color: var(--button-fg-primary);
          transition: background 120ms;
        }
        .rdp-button:hover { background: var(--button-bg-primary-hover); }
        .rdp-button:disabled { background: var(--button-bg-disabled); cursor: not-allowed; }
        .rdp-button--secondary {
          background: var(--button-bg-secondary);
          color: var(--color-brand-active);
          border: 1px solid var(--button-border-secondary);
        }
        .rdp-button--scrollTop, .rdp-button--avatar {
          width: 48px; height: 48px; padding: 0; border-radius: 50%;
        }
        .rdp-button--quit { background: transparent; color: var(--color-content-text); padding: 0; }
        .rdp-button--calendarNav { padding: 0; width: 32px; height: 32px; border-radius: 50%; }
        .rdp-button--form { width: 100%; padding: var(--separation-2); }
      `
    }}</component>
  </button>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";
import Icon from "./Icon.vue";
import type { ButtonVariant, IconName } from "../types";

type ButtonProps = {
  variant: ButtonVariant;
  labelKey?: string;
  label?: string;
  icon?: IconName;
  iconAfter?: IconName;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
};

const props = defineProps<ButtonProps>();
</script>