/** @jsx h */
import { h, Fragment } from "preact";

type MonthPickerProps = {
  year: number;
  selectedMonth: number; // 0..11
  locale?: Locale;
  onSelect?: (monthIndex: number) => void;
};
import { t } from "../utils/i18n";
import type { Locale } from "../utils/i18n";

function MonthPicker(props: MonthPickerProps) {
  function months() {
    return Array.from(
      {
        length: 12,
      },
      (_, i) =>
        new Intl.DateTimeFormat(props.locale ?? "fr-FR", {
          month: "long",
        }).format(new Date(props.year, i, 1))
    );
  }

  return (
    <ul
      className="rdp-month-picker"
      role="listbox"
      aria-label={t("calendar.heading.year", {
        year: props.year,
      })}
    >
      {months()?.map((name, index) => (
        <li
          role="option"
          aria-selected={index === props.selectedMonth ? "true" : "false"}
          className={`rdp-month-picker__item${
            index === props.selectedMonth
              ? " rdp-month-picker__item--selected"
              : ""
          }`}
          onClick={(event) => props.onSelect?.(index)}
        >
          {name}
        </li>
      ))}
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
}

export default MonthPicker;
