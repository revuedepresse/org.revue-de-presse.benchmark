import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type EmailFieldProps = {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  labelKey?: string;
  error?: boolean;
  required?: boolean;
};

import { t } from "../utils/i18n";

@Component({
  selector: "email-field",
  template: `
    <div class="rdp-textfield" [attr.data-error]="error ? 'true' : undefined">
      <label
        class="rdp-textfield__label"
        [attr.for]="\`field-\${name}\`"
        >{{t(labelKey ?? 'auth.email-label')}}</label
      >
      <input
        type="email"
        autocomplete="email"
        [attr.id]="\`field-\${name}\`"
        [attr.name]="name"
        [attr.value]="value"
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
export default class EmailField {
  t = t;

  @Input() error!: EmailFieldProps["error"];
  @Input() name!: EmailFieldProps["name"];
  @Input() labelKey!: EmailFieldProps["labelKey"];
  @Input() value!: EmailFieldProps["value"];
  @Input() required!: EmailFieldProps["required"];
  @Input() onChange!: EmailFieldProps["onChange"];
}

@NgModule({
  declarations: [EmailField],
  imports: [CommonModule],
  exports: [EmailField],
})
export class EmailFieldModule {}
