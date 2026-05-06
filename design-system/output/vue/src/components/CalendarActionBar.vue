<template>
  <div
    :class="`rdp-calendar-action-bar rdp-calendar-action-bar--${
      position ?? 'bottom'
    }`"
  >
    <button
      type="button"
      class="rdp-calendar-action-bar__pill"
      @click="async (event) => onDateClick?.()"
    >
      {{ formatDate(date, "shortDay", locale ?? "fr-FR") }}</button
    ><button
      type="button"
      class="rdp-calendar-action-bar__nav"
      :aria-label="t('actions.previous', undefined, locale ?? 'fr-FR')"
      @click="async (event) => onPrev?.()"
    >
      ‹</button
    ><button
      type="button"
      class="rdp-calendar-action-bar__nav"
      :aria-label="t('actions.next', undefined, locale ?? 'fr-FR')"
      @click="async (event) => onNext?.()"
    >
      ›</button
    ><component :is="'style'">{{
      `
        .rdp-calendar-action-bar {
          display: flex;
          gap: var(--separation-1);
          align-items: center;
          background: var(--color-brand-active);
          padding: var(--separation-1) var(--separation-2);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
        }
        .rdp-calendar-action-bar__pill {
          flex: 1;
          background: var(--color-content-background);
          color: var(--color-white);
          padding: var(--separation-1) var(--separation-2);
          border: none;
          border-radius: var(--radius-default);
          font-size: var(--font-size-date-picker);
          cursor: pointer;
        }
        .rdp-calendar-action-bar__nav {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-white);
          color: var(--color-brand-active);
          border: none;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
        }
      `
    }}</component>
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";
import { formatDate } from "../utils/intl";
import type { Locale } from "../utils/i18n";

type CalendarActionBarProps = {
  date: Date;
  locale?: Locale;
  onDateClick?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  position?: "top" | "bottom";
};

const props = defineProps<CalendarActionBarProps>();
</script>