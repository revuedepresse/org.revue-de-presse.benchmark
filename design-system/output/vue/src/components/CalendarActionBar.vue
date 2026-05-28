<template>
  <div
    :class="`rdp-calendar-action-bar rdp-calendar-action-bar--${
      position ?? 'top'
    }`"
  >
    <button
      type="button"
      class="rdp-calendar-action-bar__pill"
      :aria-label="
        t('actions.pick-month.aria-label', undefined, locale ?? 'fr-FR')
      "
      @click="async (event) => onPillClick?.()"
    >
      <Icon name="pick-day" :size="16" :decorative="true"></Icon
      ><span>{{ formatLegacyShortDay(date, locale ?? "fr-FR") }}</span>
    </button>
    <div class="rdp-calendar-action-bar__nav">
      <button
        type="button"
        class="rdp-calendar-action-bar__btn rdp-calendar-action-bar__btn--prev"
        :aria-label="t('actions.prev-day', undefined, locale ?? 'fr-FR')"
        :aria-disabled="prevDisabled === true ? 'true' : undefined"
        :disabled="prevDisabled === true"
        @click="
          async (event) => {
            if (prevDisabled !== true) onPrev?.();
          }
        "
      >
        <Icon name="previous-item" :size="32" :decorative="true"></Icon></button
      ><button
        type="button"
        class="rdp-calendar-action-bar__btn rdp-calendar-action-bar__btn--next"
        :aria-label="t('actions.next-day', undefined, locale ?? 'fr-FR')"
        :aria-disabled="nextDisabled === true ? 'true' : undefined"
        :disabled="nextDisabled === true"
        @click="
          async (event) => {
            if (nextDisabled !== true) onNext?.();
          }
        "
      >
        <Icon name="next-item" :size="32" :decorative="true"></Icon>
      </button>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";
import { formatLegacyShortDay } from "../utils/intl";
import Icon from "./Icon.vue";
import type { Locale } from "../utils/i18n";

type CalendarActionBarProps = {
  date: Date;
  locale?: Locale;
  onPrev?: () => void;
  onNext?: () => void;
  onPillClick?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  position?: "top" | "bottom";
};

const props = defineProps<CalendarActionBarProps>();
</script>