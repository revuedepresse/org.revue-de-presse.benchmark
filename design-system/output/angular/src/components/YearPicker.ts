import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type YearPickerProps = {
  yearRange: {
    min: number;
    max: number;
  };
  selectedYear: number;
  onSelect?: (year: number) => void;
};

@Component({
  selector: "year-picker",
  template: `
    <ul class="rdp-year-picker" role="listbox">
      <ng-container *ngFor="let y of years"
        ><li
          role="option"
          [attr.aria-selected]="y === selectedYear ? 'true' : 'false'"
          [class]="\`rdp-year-picker__item\${y === selectedYear ? ' rdp-year-picker__item--selected' : ''}\`"
          (click)="onSelect?.(y)"
        >
          {{y}}
        </li></ng-container
      >
      <style>
        {{\`
                .rdp-year-picker {
                  list-style: none; margin: 0; padding: 0;
                  background: var(--color-white);
                  border: 1px solid var(--color-brand);
                  border-radius: var(--radius-default);
                  font-family: 'Roboto', sans-serif;
                  font-size: var(--font-size-content);
                }
                .rdp-year-picker__item {
                  padding: var(--separation-1) var(--separation-2);
                  color: var(--color-brand);
                  cursor: pointer;
                  border-bottom: 1px solid var(--color-brand);
                  text-align: center;
                }
                .rdp-year-picker__item:last-child { border-bottom: none; }
                .rdp-year-picker__item--selected {
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
export default class YearPicker {
  @Input() yearRange!: YearPickerProps["yearRange"];
  @Input() selectedYear!: YearPickerProps["selectedYear"];
  @Input() onSelect!: YearPickerProps["onSelect"];

  get years() {
    return Array.from(
      {
        length: this.yearRange.max - this.yearRange.min + 1,
      },
      (_, i) => this.yearRange.min + i
    );
  }
}

@NgModule({
  declarations: [YearPicker],
  imports: [CommonModule],
  exports: [YearPicker],
})
export class YearPickerModule {}
