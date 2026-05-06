<template>
  <svg
    class="rdp-icon"
    viewBox="0 0 24 24"
    :width="size ?? 24"
    :height="size ?? 24"
    :aria-hidden="decorative ?? !ariaLabel ? 'true' : undefined"
    :aria-label="decorative ?? !ariaLabel ? undefined : ariaLabel"
    :role="decorative ?? !ariaLabel ? undefined : 'img'"
  >
    <use :href="`#${name}`"></use>
    <component :is="'style'">
      {{
        `
        .rdp-icon { display: inline-block; vertical-align: middle; color: currentColor; }
      `
      }}
    </component>
  </svg>
</template>

<script setup lang="ts">
import type { IconName } from "../types";

type IconProps = {
  name: IconName;
  size?: 24 | 32;
  ariaLabel?: string;
  decorative?: boolean;
};

const props = defineProps<IconProps>();
</script>