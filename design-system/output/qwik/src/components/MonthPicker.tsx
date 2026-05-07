import { Locale, t } from "../utils/i18n";

import { localizedMonthLong } from "../utils/intl";

import { $, Fragment, component$, h, useComputed$ } from "@builder.io/qwik";

type MonthPickerProps = {
  year: number;
  selectedMonth: number; // 0..11
  locale?: Locale;
  onSelect?: (monthIndex: number) => void;
};
export const isFuture = function isFuture(
  props,
  state,
  months,
  monthIndex: number
) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  if (props.year > currentYear) return true;
  if (props.year < currentYear) return false;
  return monthIndex > currentMonth;
};
export const MonthPicker = component$((props: MonthPickerProps) => {
  const months = useComputed$(() => {
    return Array.from(
      {
        length: 12,
      },
      (_, i) => localizedMonthLong(i, props.locale ?? "fr-FR")
    );
  });
  const state: any = {};

  return (
    <ul
      class="rdp-month-picker"
      role="listbox"
      aria-label={t("calendar.heading.year", {
        year: props.year,
      })}
    >
      {(months.value || []).map((name, index) => {
        return (
          <li
            role="option"
            aria-selected={(() => {
              index === props.selectedMonth ? "true" : "false";
            })()}
            aria-disabled={
              isFuture(props, state, months, index) ? "true" : undefined
            }
            data-future={
              isFuture(props, state, months, index) ? "true" : undefined
            }
            class={`rdp-month-picker__item${
              index === props.selectedMonth
                ? " rdp-month-picker__item--selected"
                : ""
            }`}
            onClick$={$((event) => {
              if (!isFuture(props, state, months, index))
                props.onSelect?.(index);
            })}
          >
            {name}
          </li>
        );
      })}
      <style>{`
        .rdp-month-picker {
          list-style: none; margin: 0; padding: 0;
          background: var(--color-white);
          border: 1px solid var(--color-brand);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-month-picker__item {
          padding: var(--separation-1) var(--separation-2);
          color: var(--color-brand);
          cursor: pointer;
          border-bottom: 1px solid var(--color-brand);
        }
        .rdp-month-picker__item:last-child { border-bottom: none; }
        .rdp-month-picker__item[data-future="true"] {
          color: var(--color-light-grey);
          background: var(--color-background-other-month);
          cursor: not-allowed;
        }
        .rdp-month-picker__item--selected {
          background: var(--color-brand);
          color: var(--color-white);
        }
      `}</style>
    </ul>
  );
});

export default MonthPicker;
