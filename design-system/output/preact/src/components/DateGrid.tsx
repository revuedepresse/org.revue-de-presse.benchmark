/** @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

type DateGridProps = {
  year: number;
  month: number; // 0..11
  selectedDate?: Date;
  locale?: Locale;
  onSelect?: (date: Date) => void;
};
import { t } from "../utils/i18n";
import type { Locale } from "../utils/i18n";

function DateGrid(props: DateGridProps) {
  const [weekdays, setWeekdays] = useState(() => [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]);

  function rows() {
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
  }

  function isSelected(d: Date) {
    const sel = props.selectedDate;
    return (
      !!sel &&
      sel.getFullYear() === d.getFullYear() &&
      sel.getMonth() === d.getMonth() &&
      sel.getDate() === d.getDate()
    );
  }

  return (
    <table className="rdp-date-grid" role="grid">
      <thead>
        <tr>
          {weekdays?.map((w) => (
            <th scope="col" className="rdp-date-grid__weekday">
              {t(
                `calendar.weekdays.short.${w}`,
                undefined,
                props.locale ?? "fr-FR"
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows()?.map((row) => (
          <tr>
            {row?.map((d) => (
              <td
                role="gridcell"
                aria-selected={isSelected(d) ? "true" : "false"}
                data-other-month={
                  d.getMonth() !== props.month ? "true" : undefined
                }
                className={`rdp-date-grid__cell${
                  isSelected(d) ? " rdp-date-grid__cell--selected" : ""
                }`}
                onClick={(event) => props.onSelect?.(d)}
              >
                {d.getDate()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <style>{`
        .rdp-date-grid {
          border-collapse: separate;
          border-spacing: 4px;
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-calendar-month-day-cell);
        }
        .rdp-date-grid__weekday {
          font-weight: normal;
          font-size: var(--font-size-calendar-month-day);
          color: var(--color-brand-active);
          padding: 4px;
        }
        .rdp-date-grid__cell {
          padding: 6px 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-selectable);
          color: var(--color-content-text);
          background: var(--color-background-future-date);
          cursor: pointer;
          text-align: center;
          min-width: 32px;
        }
        .rdp-date-grid__cell[data-other-month="true"] {
          background: var(--color-background-other-month);
          color: var(--color-light-grey);
        }
        .rdp-date-grid__cell--selected {
          background: var(--color-brand-active);
          color: var(--color-white);
          border-color: var(--color-brand-active);
        }
      `}</style>
    </table>
  );
}

export default DateGrid;
