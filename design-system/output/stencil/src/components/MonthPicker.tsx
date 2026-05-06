import { t } from "../utils/i18n";
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
      (_, i) =>
        new Intl.DateTimeFormat(this.locale ?? "fr-FR", {
          month: "long",
        }).format(new Date(this.year, i, 1))
    );
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
            onClick={() => this.select?.(index)}
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
}
