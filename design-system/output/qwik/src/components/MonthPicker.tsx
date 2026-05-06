import { Locale, t } from "../utils/i18n";

import { $, Fragment, component$, h, useComputed$ } from "@builder.io/qwik";

type MonthPickerProps = {
  year: number;
  selectedMonth: number; // 0..11
  locale?: Locale;
  onSelect?: (monthIndex: number) => void;
};
export const MonthPicker = component$((props: MonthPickerProps) => {
  const months = useComputed$(() => {
    return Array.from(
      {
        length: 12,
      },
      (_, i) =>
        new Intl.DateTimeFormat(props.locale ?? "fr-FR", {
          month: "long",
        }).format(new Date(props.year, i, 1))
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
            class={`rdp-month-picker__item${
              index === props.selectedMonth
                ? " rdp-month-picker__item--selected"
                : ""
            }`}
            onClick$={$((event) => props.onSelect?.(index))}
          >
            {name}
          </li>
        );
      })}
      <style>{`
        .rdp-month-picker {
          list-style: none; margin: 0; padding: 0;
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-month-picker__item {
          padding: var(--separation-1) var(--separation-2);
          color: var(--color-content-text);
          cursor: pointer;
          border-bottom: 1px solid var(--color-border);
        }
        .rdp-month-picker__item:last-child { border-bottom: none; }
        .rdp-month-picker__item--selected {
          background: var(--color-brand-active);
          color: var(--color-white);
        }
      `}</style>
    </ul>
  );
});

export default MonthPicker;
