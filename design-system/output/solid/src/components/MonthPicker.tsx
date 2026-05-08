import { For, createSignal, createMemo } from "solid-js";

type MonthPickerProps = {
  year: number;
  selectedMonth: number; // 0..11
  minDate?: Date;
  locale?: Locale;
  onSelect?: (monthIndex: number) => void;
};

import { t } from "../utils/i18n";
import { localizedMonthLong } from "../utils/intl";
import type { Locale } from "../utils/i18n";

function MonthPicker(props: MonthPickerProps) {
  const months = createMemo(() => {
    return Array.from(
      {
        length: 12,
      },
      (_, i) => localizedMonthLong(i, props.locale ?? "fr-FR")
    );
  });

  function isFuture(monthIndex: number) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    if (props.year > currentYear) return true;
    if (props.year < currentYear) return false;
    return monthIndex > currentMonth;
  }

  function isBeforeMin(monthIndex: number) {
    if (!props.minDate) return false;
    const minYear = props.minDate.getFullYear();
    const minMonth = props.minDate.getMonth();
    if (props.year < minYear) return true;
    if (props.year > minYear) return false;
    return monthIndex < minMonth;
  }

  function isDisabled(monthIndex: number) {
    return isFuture(monthIndex) || isBeforeMin(monthIndex);
  }

  return (
    <>
      <ul
        class="rdp-month-picker"
        role="listbox"
        aria-label={t("calendar.heading.year", {
          year: props.year,
        })}
      >
        <For each={months()}>
          {(name, _index) => {
            const index = _index();
            return (
              <li
                class={`rdp-month-picker__item${
                  index === props.selectedMonth
                    ? " rdp-month-picker__item--selected"
                    : ""
                }`}
                role="option"
                aria-selected={index === props.selectedMonth ? "true" : "false"}
                aria-disabled={isDisabled(index) ? "true" : undefined}
                data-future={isDisabled(index) ? "true" : undefined}
                onClick={(event) => {
                  if (!isDisabled(index)) props.onSelect?.(index);
                }}
              >
                {name}
              </li>
            );
          }}
        </For>
        <style>{`
        .rdp-month-picker {
          list-style: none;
          margin: 0 var(--separation-2) var(--separation-2);
          margin-left: calc(2 * var(--separation-2));
          padding: 0;
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
    </>
  );
}

export default MonthPicker;
