import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type MonthPickerProps = {
  year: number;
  selectedMonth: number; // 0..11
  locale?: Locale;
  onSelect?: (monthIndex: number) => void;
};

import { t } from "../utils/i18n";
import { localizedMonthLong } from "../utils/intl";
import type { Locale } from "../utils/i18n";

@Component({
  selector: "month-picker",
  template: `
    <ul
      class="rdp-month-picker"
      role="listbox"
      [attr.aria-label]="t('calendar.heading.year', {
          year: year
        })"
    >
      <ng-container *ngFor="let name of months; index as index"
        ><li
          role="option"
          [attr.aria-selected]="index === selectedMonth ? 'true' : 'false'"
          [attr.aria-disabled]="isFuture(index) ? 'true' : undefined"
          [attr.data-future]="isFuture(index) ? 'true' : undefined"
          [class]="\`rdp-month-picker__item\${index === selectedMonth ? ' rdp-month-picker__item--selected' : ''}\`"
          (click)="
          if (!isFuture(index)) onSelect?.(index);
        "
        >
          {{name}}
        </li></ng-container
      >
      <style>
        {{\`
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
                .rdp-month-picker__item[data-future=&quot;true&quot;] {
                  color: var(--color-light-grey);
                  background: var(--color-background-other-month);
                  cursor: not-allowed;
                }
                .rdp-month-picker__item--selected {
                  background: var(--color-brand);
                  color: var(--color-white);
                }
              \`}}
      </style>
    </ul>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class MonthPicker {
  t = t;

  @Input() locale!: MonthPickerProps["locale"];
  @Input() year!: MonthPickerProps["year"];
  @Input() selectedMonth!: MonthPickerProps["selectedMonth"];
  @Input() onSelect!: MonthPickerProps["onSelect"];

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
}

@NgModule({
  declarations: [MonthPicker],
  imports: [CommonModule],
  exports: [MonthPicker],
})
export class MonthPickerModule {}
