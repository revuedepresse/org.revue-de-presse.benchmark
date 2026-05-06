import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type CheckboxProps = {
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labelKey?: string;
  label?: string;
  labelChildren?: any;
  disabled?: boolean;
};

import { t } from "../utils/i18n";

@Component({
  selector: "checkbox",
  template: `
    <label class="rdp-checkbox"
      ><input
        type="checkbox"
        [attr.name]="name"
        [attr.checked]="checked ?? false"
        [attr.disabled]="disabled"
        (change)="onChange?.($event.target.checked)"
      />
      <span class="rdp-checkbox__label"
        ><ng-container *ngIf="labelKey">{{t(labelKey)}}</ng-container
        ><ng-container *ngIf="!(labelKey)">{{label ?? ''}}</ng-container>
        {{labelChildren}}</span
      >
      <style>
        {{\`
                .rdp-checkbox {
                  display: inline-flex;
                  align-items: center;
                  gap: var(--separation-1);
                  font-family: 'Roboto', sans-serif;
                  font-size: var(--font-size-content);
                  color: var(--color-content-text);
                  cursor: pointer;
                }
                .rdp-checkbox__label { display: inline-flex; gap: 4px; align-items: baseline; }
                .rdp-checkbox input { accent-color: var(--color-brand-active); }
                .rdp-checkbox input:disabled + .rdp-checkbox__label { opacity: 0.5; }
              \`}}
      </style></label
    >
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class Checkbox {
  t = t;

  @Input() name!: CheckboxProps["name"];
  @Input() checked!: CheckboxProps["checked"];
  @Input() disabled!: CheckboxProps["disabled"];
  @Input() onChange!: CheckboxProps["onChange"];
  @Input() labelKey!: CheckboxProps["labelKey"];
  @Input() label!: CheckboxProps["label"];
  @Input() labelChildren!: CheckboxProps["labelChildren"];
}

@NgModule({
  declarations: [Checkbox],
  imports: [CommonModule],
  exports: [Checkbox],
})
export class CheckboxModule {}
