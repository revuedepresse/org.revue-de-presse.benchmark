import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type TextFieldProps = {
  name: string;
  type?: "text" | "email" | "tel" | "url";
  value: string;
  onChange?: (value: string) => void;
  labelKey?: string;
  label?: string;
  placeholder?: string;
  autocomplete?: string;
  error?: boolean;
  required?: boolean;
};

import { t } from "../utils/i18n";

@Component({
  selector: "text-field",
  template: `
    <div class="rdp-textfield" [attr.data-error]="error ? 'true' : undefined">
      <label class="rdp-textfield__label" [attr.for]="\`field-\${name}\`"
        ><ng-container *ngIf="labelKey">{{t(labelKey)}}</ng-container
        ><ng-container *ngIf="!(labelKey)">{{label ?? ''}}</ng-container></label
      >
      <input
        [attr.id]="\`field-\${name}\`"
        [attr.type]="type ?? 'text'"
        [attr.name]="name"
        [attr.value]="value"
        [attr.placeholder]="placeholder"
        [attr.autocomplete]="autocomplete"
        [attr.required]="required"
        (input)="onChange?.($event.target.value)"
      />
      <style>
        {{\`
                .rdp-textfield { display: flex; flex-direction: column; gap: 4px; font-family: 'Roboto', sans-serif; }
                .rdp-textfield__label {
                  font-size: var(--font-size-publication-date);
                  color: var(--color-content-text);
                  padding-left: var(--separation-1);
                }
                .rdp-textfield input {
                  padding: var(--separation-1) var(--separation-2);
                  border: 1px solid var(--input-border-default);
                  background: var(--input-bg-default);
                  color: var(--input-fg-default);
                  border-radius: var(--radius-default);
                  font-size: var(--font-size-content);
                }
                .rdp-textfield input:focus { outline: none; border-color: var(--color-brand-active); }
                .rdp-textfield[data-error=&quot;true&quot;] input { border-color: var(--input-border-error); }
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
export default class TextField {
  t = t;

  @Input() error!: TextFieldProps["error"];
  @Input() name!: TextFieldProps["name"];
  @Input() labelKey!: TextFieldProps["labelKey"];
  @Input() label!: TextFieldProps["label"];
  @Input() type!: TextFieldProps["type"];
  @Input() value!: TextFieldProps["value"];
  @Input() placeholder!: TextFieldProps["placeholder"];
  @Input() autocomplete!: TextFieldProps["autocomplete"];
  @Input() required!: TextFieldProps["required"];
  @Input() onChange!: TextFieldProps["onChange"];
}

@NgModule({
  declarations: [TextField],
  imports: [CommonModule],
  exports: [TextField],
})
export class TextFieldModule {}
