<template>
  <table class="rdp-date-grid" role="grid">
    <thead>
      <tr>
        <template :key="index" v-for="(w, index) in weekdays">
          <th scope="col" class="rdp-date-grid__weekday">
            {{
              t(`calendar.weekdays.short.${w}`, undefined, locale ?? "fr-FR")
            }}
          </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template :key="index" v-for="(row, index) in rows">
        <tr>
          <template :key="index" v-for="(d, index) in row">
            <td
              role="gridcell"
              :aria-selected="isSelected(d) ? 'true' : 'false'"
              :aria-disabled="isDisabled(d) ? 'true' : undefined"
              :data-other-month="d.getMonth() !== month ? 'true' : undefined"
              :data-future="isDisabled(d) ? 'true' : undefined"
              :class="`rdp-date-grid__cell${
                isSelected(d) ? ' rdp-date-grid__cell--selected' : ''
              }`"
              @click="
                async (event) => {
                  if (!isDisabled(d)) onSelect?.(d);
                }
              "
            >
              <template v-if="!isDisabled(d)">
                {{ d.getDate() }}
              </template>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
    <component :is="'style'">{{
      `
        .rdp-date-grid {
          width: calc(100% - 2 * var(--separation-2));
          margin: 0 var(--separation-2) var(--separation-2);
          table-layout: fixed;
          border-collapse: separate;
          border-spacing: 2px;
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-calendar-month-day-cell);
        }
        .rdp-date-grid__weekday {
          font-weight: normal;
          font-size: var(--font-size-calendar-month-day);
          color: var(--color-brand);
          padding: 4px 0;
          text-align: center;
        }
        .rdp-date-grid__cell {
          padding: 6px 0;
          height: 32px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-selectable);
          color: var(--color-content-text);
          background: var(--color-background-future-date);
          cursor: pointer;
          text-align: center;
          box-sizing: border-box;
        }
        .rdp-date-grid__cell[data-other-month="true"] {
          background: var(--color-background-other-month);
          color: var(--color-light-grey);
        }
        .rdp-date-grid__cell[data-future="true"] {
          color: var(--color-light-grey);
          background: var(--color-background-future-date);
          cursor: not-allowed;
        }
        .rdp-date-grid__cell--selected {
          background: var(--color-brand);
          color: var(--color-white);
          border-color: var(--color-brand);
        }
      `
    }}</component>
  </table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { t } from "../utils/i18n";
import type { Locale } from "../utils/i18n";

type DateGridProps = {
  year: number;
  month: number; // 0..11
  selectedDate?: Date;
  minDate?: Date;
  locale?: Locale;
  onSelect?: (date: Date) => void;
};

const props = defineProps<DateGridProps>();
const weekdays = ref([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

const rows = computed(() => {
  const first = new Date(props.year, props.month, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(props.year, props.month, 1 - offset);
  const all = Array.from(
    {
      length: 42,
    },
    (_, i) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
  );
  return [0, 1, 2, 3, 4, 5].map((row) => all.slice(row * 7, row * 7 + 7));
});

function isSelected(d: Date) {
  const sel = props.selectedDate;
  return (
    !!sel &&
    sel.getFullYear() === d.getFullYear() &&
    sel.getMonth() === d.getMonth() &&
    sel.getDate() === d.getDate()
  );
}
function isFuture(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cell = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return cell.getTime() >= today.getTime();
}
function isBeforeMin(d: Date) {
  if (!props.minDate) return false;
  const min = new Date(
    props.minDate.getFullYear(),
    props.minDate.getMonth(),
    props.minDate.getDate()
  );
  const cell = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return cell.getTime() < min.getTime();
}
function isDisabled(d: Date) {
  return isFuture(d) || isBeforeMin(d);
}
</script>