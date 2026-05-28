<template>
  <div class="rdp-calendar-month-bar">
    <button
      type="button"
      class="rdp-calendar-month-bar__pill"
      :aria-label="t(titleAriaKey, undefined, locale ?? 'fr-FR')"
      @click="async (event) => onTitleClick?.()"
    >
      <Icon name="pick-item" :size="16" :decorative="true"></Icon
      ><span class="rdp-calendar-month-bar__label">{{ title }}</span>
    </button>
    <div class="rdp-calendar-month-bar__nav">
      <button
        type="button"
        class="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--prev"
        :aria-label="t(prevAriaKey, undefined, locale ?? 'fr-FR')"
        :aria-disabled="prevDisabled === true ? 'true' : undefined"
        :disabled="prevDisabled === true"
        @click="
          async (event) => {
            if (prevDisabled !== true) onPrev?.();
          }
        "
      >
        <svg
          viewBox="0 0 24 14"
          width="22"
          height="14"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 11 12 3l9 8"></path>
        </svg></button
      ><button
        type="button"
        class="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--next"
        :aria-label="t(nextAriaKey, undefined, locale ?? 'fr-FR')"
        :aria-disabled="nextDisabled === true ? 'true' : undefined"
        :disabled="nextDisabled === true"
        @click="
          async (event) => {
            if (nextDisabled !== true) onNext?.();
          }
        "
      >
        <svg
          viewBox="0 0 24 14"
          width="22"
          height="14"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 3 12 11l9-8"></path>
        </svg>
      </button>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { t } from "../utils/i18n";
import { localizedMonthLong } from "../utils/intl";
import Icon from "./Icon.vue";
import type { Locale } from "../utils/i18n";

type ViewMode = "day" | "month" | "year";
type CalendarMonthBarProps = {
  viewMode?: ViewMode;
  focusedYear?: number;
  focusedMonth?: number;
  locale?: Locale;
  onTitleClick?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
};

const props = defineProps<CalendarMonthBarProps>();

const title = computed(() => {
  const m: ViewMode = props.viewMode ?? "day";
  const loc = props.locale ?? "fr-FR";
  const year = props.focusedYear ?? new Date().getFullYear();
  if (m === "month") return String(year);
  if (m === "year") return t("calendar.year-picker.heading", undefined, loc);
  return `${localizedMonthLong(props.focusedMonth ?? 0, loc)} ${year}`;
});
const titleAriaKey = computed(() => {
  const m: ViewMode = props.viewMode ?? "day";
  if (m === "day") return "actions.pick-month.aria-label";
  if (m === "month") return "actions.pick-year.aria-label";
  return "calendar.year-picker.heading";
});
const prevAriaKey = computed(() => {
  const m: ViewMode = props.viewMode ?? "day";
  return m === "year" ? "actions.prev-year" : "actions.prev-month";
});
const nextAriaKey = computed(() => {
  const m: ViewMode = props.viewMode ?? "day";
  return m === "year" ? "actions.next-year" : "actions.next-month";
});
</script>