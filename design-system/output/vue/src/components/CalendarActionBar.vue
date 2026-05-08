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
    <component :is="'style'">{{
      `
        .rdp-calendar-action-bar {
          display: flex;
          gap: var(--separation-1);
          align-items: center;
          background: var(--color-brand);
          padding: var(--separation-1) var(--separation-2);
          /* Square bottom corners so the band visually merges with the
             month bar / day grid below it. */
          border-radius: var(--radius-default) var(--radius-default) 0 0;
          font-family: 'Roboto', sans-serif;
        }
        .rdp-calendar-action-bar--bottom {
          border-radius: 0;
        }
        .rdp-calendar-action-bar__pill > svg:first-child { flex-shrink: 0; }
        .rdp-calendar-action-bar__pill {
          flex: 1;
          display: inline-flex;
          align-items: center;
          gap: var(--separation-1);
          background: transparent;
          color: var(--color-white);
          padding: 0 0 0 var(--separation-2);
          border: none;
          border-radius: var(--radius-default);
          font-size: var(--font-size-date-picker);
          font-family: inherit;
          text-align: left;
          cursor: pointer;
        }
        .rdp-calendar-action-bar__nav {
          display: flex;
          gap: var(--separation-1);
          flex-direction: row;
        }
        .rdp-calendar-action-bar__btn {
          width: 32px;
          height: 32px;
          padding: 0;
          background: transparent;
          color: var(--color-brand);
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          line-height: 0;
        }
        /* Day-nav uses the legacy previous-item / next-item icons (which carry
           a built-in white-fill circle) rotated 90° so the chevrons point
           left/right instead of up/down. */
        .rdp-calendar-action-bar__btn--prev svg { transform: rotate(-90deg); }
        .rdp-calendar-action-bar__btn--next svg { transform: rotate(-90deg); }
        .rdp-calendar-action-bar__btn[aria-disabled="true"] {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `
    }}</component>
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