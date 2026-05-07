import { t } from "../utils/i18n";
import { localizedMonthLong } from "../utils/intl";
import type { Locale } from "../utils/i18n";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";

@Component({
  tag: "month-picker",
})
export class MonthPicker {
  @Prop() locale: any;
  @Prop() year: any;
  @Prop() selectedMonth: any;
  @Event() select: any;

  get months() {
    return Array.from(
      {
        length: 12,
      },
      (_, i) => localizedMonthLong(i, this.locale ?? "fr-FR")
    );
  }
  isFuture(monthIndex: number) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    if (this.year > currentYear) return true;
    if (this.year < currentYear) return false;
    return monthIndex > currentMonth;
  }

  componentDidLoad() {}

  render() {
    return (
      <ul
        class="rdp-month-picker"
        role="listbox"
        aria-label={t("calendar.heading.year", {
          year: this.year,
        })}
      >
        {this.months?.map((name, index) => (
          <li
            class={`rdp-month-picker__item${
              index === this.selectedMonth
                ? " rdp-month-picker__item--selected"
                : ""
            }`}
            role="option"
            aria-selected={index === this.selectedMonth ? "true" : "false"}
            aria-disabled={this.isFuture(index) ? "true" : undefined}
            data-future={this.isFuture(index) ? "true" : undefined}
            onClick={() => {
              if (!this.isFuture(index)) this.select?.(index);
            }}
          >
            {name}
          </li>
        ))}
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
  }
}
