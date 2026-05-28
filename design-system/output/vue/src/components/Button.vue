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