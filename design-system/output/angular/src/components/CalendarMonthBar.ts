import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type ViewMode = "day" | "month" | "year";
type CalendarMonthBarProps = {
  viewMode?: ViewMode;
  focusedYear?: number;
  focusedMonth?: number;
  locale?: Locale;
  onTitleClick?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

import { t } from "../utils/i18n";
import { localizedMonthLong } from "../utils/intl";
import type { Locale } from "../utils/i18n";

@Component({
  selector: "calendar-month-bar",
  template: `
    <div class="rdp-calendar-month-bar">
      <button
        type="button"
        class="rdp-calendar-month-bar__pill"
        [attr.aria-label]="t(titleAriaKey, undefined, locale ?? 'fr-FR')"
        (click)="onTitleClick?.()"
      >
        <icon name="pick-item" [size]="16" [decorative]="true"></icon>
        <span class="rdp-calendar-month-bar__label">{{title}}</span>
      </button>
      <div class="rdp-calendar-month-bar__nav">
        <button
          type="button"
          class="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--prev"
          [attr.aria-label]="t(prevAriaKey, undefined, locale ?? 'fr-FR')"
          (click)="onPrev?.()"
        >
          <icon name="previous-item" [size]="20" [decorative]="true"></icon>
        </button>
        <button
          type="button"
          class="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--next"
          [attr.aria-label]="t(nextAriaKey, undefined, locale ?? 'fr-FR')"
          (click)="onNext?.()"
        >
          <icon name="next-item" [size]="20" [decorative]="true"></icon>
        </button>
      </div>
      <style>
        {{\`
                .rdp-calendar-month-bar {
                  display: flex;
                  gap: var(--separation-1);
                  align-items: center;
                  padding: var(--separation-1) 0;
                  font-family: 'Roboto', sans-serif;
                }
                .rdp-calendar-month-bar__pill {
                  flex: 0 0 auto;
                  display: inline-flex;
                  align-items: center;
                  gap: var(--separation-1);
                  width: auto;
                  background: var(--color-white);
                  color: var(--color-brand);
                  border: 1px solid var(--color-brand);
                  padding: var(--separation-1) var(--separation-2);
                  border-radius: var(--radius-default);
                  font-size: var(--font-size-date-picker);
                  cursor: pointer;
                  text-align: left;
                }
                .rdp-calendar-month-bar__label { display: inline-block; }
                .rdp-calendar-month-bar__pill:hover { background: var(--color-brand); color: var(--color-white); border-color: var(--color-brand); }
                .rdp-calendar-month-bar__nav {
                  margin-left: auto;
                  display: flex;
                  flex-direction: row;
                  gap: var(--separation-1);
                  align-items: center;
                }
                .rdp-calendar-month-bar__btn {
                  width: 32px;
                  height: 32px;
                  background: transparent;
                  color: var(--color-brand);
                  border: none;
                  cursor: pointer;
                  padding: 0;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                }
                .rdp-calendar-month-bar__btn:hover { color: var(--color-brand-active); }
              \`}}
      </style>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class CalendarMonthBar {
  t = t;

  @Input() viewMode!: CalendarMonthBarProps["viewMode"];
  @Input() locale!: CalendarMonthBarProps["locale"];
  @Input() focusedYear!: CalendarMonthBarProps["focusedYear"];
  @Input() focusedMonth!: CalendarMonthBarProps["focusedMonth"];
  @Input() onTitleClick!: CalendarMonthBarProps["onTitleClick"];
  @Input() onPrev!: CalendarMonthBarProps["onPrev"];
  @Input() onNext!: CalendarMonthBarProps["onNext"];

  get title() {
    const m: ViewMode = this.viewMode ?? "day";
    const loc = this.locale ?? "fr-FR";
    const year = this.focusedYear ?? new Date().getFullYear();
    if (m === "month") return String(year);
    if (m === "year") return t("calendar.year-picker.heading", undefined, loc);
    return `${localizedMonthLong(this.focusedMonth ?? 0, loc)} ${year}`;
  }
  get titleAriaKey() {
    const m: ViewMode = this.viewMode ?? "day";
    if (m === "day") return "actions.pick-month.aria-label";
    if (m === "month") return "actions.pick-year.aria-label";
    return "calendar.year-picker.heading";
  }
  get prevAriaKey() {
    const m: ViewMode = this.viewMode ?? "day";
    return m === "year" ? "actions.prev-year" : "actions.prev-month";
  }
  get nextAriaKey() {
    const m: ViewMode = this.viewMode ?? "day";
    return m === "year" ? "actions.next-year" : "actions.next-month";
  }
}

@NgModule({
  declarations: [CalendarMonthBar],
  imports: [CommonModule, IconModule],
  exports: [CalendarMonthBar],
})
export class CalendarMonthBarModule {}
