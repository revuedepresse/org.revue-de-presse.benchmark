import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type DateGridProps = {
  year: number;
  month: number; // 0..11
  selectedDate?: Date;
  locale?: Locale;
  onSelect?: (date: Date) => void;
};

import { t } from "../utils/i18n";
import type { Locale } from "../utils/i18n";

@Component({
  selector: "date-grid",
  template: `
    <table class="rdp-date-grid" role="grid">
      <thead>
        <tr>
          <ng-container *ngFor="let w of weekdays"
            ><th scope="col" class="rdp-date-grid__weekday">
              {{t(\`calendar.weekdays.short.\${w}\`, undefined, locale ?? 'fr-FR')}}
            </th></ng-container
          >
        </tr>
      </thead>
      <tbody>
        <ng-container *ngFor="let row of rows"
          ><tr>
            <ng-container *ngFor="let d of row"
              ><td
                role="gridcell"
                [attr.aria-selected]="isSelected(d) ? 'true' : 'false'"
                [attr.data-other-month]="d.getMonth() !== month ? 'true' : undefined"
                [class]="\`rdp-date-grid__cell\${isSelected(d) ? ' rdp-date-grid__cell--selected' : ''}\`"
                (click)="onSelect?.(d)"
              >
                {{d.getDate()}}
              </td></ng-container
            >
          </tr></ng-container
        >
      </tbody>
      <style>
        {{\`
                .rdp-date-grid {
                  width: 100%;
                  table-layout: fixed;
                  border-collapse: separate;
                  border-spacing: 2px;
                  font-family: 'Roboto', sans-serif;
                  font-size: var(--font-size-calendar-month-day-cell);
                }
                .rdp-date-grid__weekday {
                  font-weight: normal;
                  font-size: var(--font-size-calendar-month-day);
                  color: var(--color-brand-active);
                  padding: 4px 0;
                  text-align: center;
                }
                .rdp-date-grid__cell {
                  padding: 6px 0;
                  border: 1px solid var(--color-border);
                  border-radius: var(--radius-selectable);
                  color: var(--color-content-text);
                  background: var(--color-background-future-date);
                  cursor: pointer;
                  text-align: center;
                }
                .rdp-date-grid__cell[data-other-month=&quot;true&quot;] {
                  background: var(--color-background-other-month);
                  color: var(--color-light-grey);
                }
                .rdp-date-grid__cell--selected {
                  background: var(--color-brand-active);
                  color: var(--color-white);
                  border-color: var(--color-brand-active);
                }
              \`}}
      </style>
    </table>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class DateGrid {
  t = t;

  @Input() year!: DateGridProps["year"];
  @Input() month!: DateGridProps["month"];
  @Input() selectedDate!: DateGridProps["selectedDate"];
  @Input() locale!: DateGridProps["locale"];
  @Input() onSelect!: DateGridProps["onSelect"];

  weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  get rows() {
    const first = new Date(this.year, this.month, 1);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(this.year, this.month, 1 - offset);
    const all = Array.from(
      {
        length: 42,
      },
      (_, i) =>
        new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    );
    return [0, 1, 2, 3, 4, 5].map((row) => all.slice(row * 7, row * 7 + 7));
  }
  isSelected(d: Date) {
    const sel = this.selectedDate;
    return (
      !!sel &&
      sel.getFullYear() === d.getFullYear() &&
      sel.getMonth() === d.getMonth() &&
      sel.getDate() === d.getDate()
    );
  }
}

@NgModule({
  declarations: [DateGrid],
  imports: [CommonModule],
  exports: [DateGrid],
})
export class DateGridModule {}
