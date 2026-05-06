import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type FieldErrorProps = {
  messageKey?: string;
  message?: string;
  vars?: Record<string, string | number>;
};

import { t } from "../utils/i18n";

@Component({
  selector: "field-error",
  template: `
    <ng-container *ngIf="!!(messageKey || message)"
      ><p class="rdp-field-error" role="alert">
        <ng-container *ngIf="messageKey">{{t(messageKey, vars)}}</ng-container
        ><ng-container *ngIf="!(messageKey)">{{message ?? ''}}</ng-container>
        <style>
          {{\`
                    .rdp-field-error {
                      font-size: var(--font-size-publication-date);
                      color: var(--form-error-fg);
                      margin: 0;
                      padding-left: var(--separation-1);
                      font-family: 'Roboto', sans-serif;
                    }
                  \`}}
        </style>
      </p></ng-container
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
export default class FieldError {
  t = t;

  @Input() messageKey!: FieldErrorProps["messageKey"];
  @Input() message!: FieldErrorProps["message"];
  @Input() vars!: FieldErrorProps["vars"];
}

@NgModule({
  declarations: [FieldError],
  imports: [CommonModule],
  exports: [FieldError],
})
export class FieldErrorModule {}
