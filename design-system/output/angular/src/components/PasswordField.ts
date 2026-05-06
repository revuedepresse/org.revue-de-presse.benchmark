import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type PasswordFieldProps = {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  mode: "login" | "new";
  labelKey?: string;
  error?: boolean;
  showHelper?: boolean;
};

import { t } from "../utils/i18n";
import { MIN_LENGTH_NO_MFA } from "../utils/password";

@Component({
  selector: "password-field",
  template: `
    <div class="rdp-textfield" [attr.data-error]="error ? 'true' : undefined">
      <label
        class="rdp-textfield__label"
        [attr.for]="\`field-\${name}\`"
        >{{t(labelKey ?? 'auth.password-label')}}</label
      >
      <input
        type="password"
        [attr.id]="\`field-\${name}\`"
        [attr.autocomplete]="mode === 'new' ? 'new-password' : 'current-password'"
        [attr.name]="name"
        [attr.value]="value"
        (input)="onChange?.($event.target.value)"
      />
      <ng-container *ngIf="showHelper ?? mode === 'new'"
        ><p class="rdp-textfield__helper">
          {{t('auth.password.helper-text', { min: MIN_LENGTH_NO_MFA })}}
        </p></ng-container
      >
      <style>
        {{\`
                .rdp-textfield { display: flex; flex-direction: column; gap: 4px; font-family: 'Roboto', sans-serif; }
                .rdp-textfield__label {
                  font-size: var(--font-size-publication-date);
                  color: var(--color-content-text);
                  padding-left: var(--separation-1);
                }
                .rdp-textfield__helper {
                  font-size: var(--font-size-publication-date);
                  color: var(--color-light-grey);
                  padding-left: var(--separation-1);
                  margin: 0;
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
export default class PasswordField {
  t = t;
  MIN_LENGTH_NO_MFA = MIN_LENGTH_NO_MFA;

  @Input() error!: PasswordFieldProps["error"];
  @Input() name!: PasswordFieldProps["name"];
  @Input() labelKey!: PasswordFieldProps["labelKey"];
  @Input() mode!: PasswordFieldProps["mode"];
  @Input() value!: PasswordFieldProps["value"];
  @Input() onChange!: PasswordFieldProps["onChange"];
  @Input() showHelper!: PasswordFieldProps["showHelper"];
}

@NgModule({
  declarations: [PasswordField],
  imports: [CommonModule],
  exports: [PasswordField],
})
export class PasswordFieldModule {}
