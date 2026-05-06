import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type FormErrorProps = {
  errors: ErrorMessage[];
};

import { t } from "../utils/i18n";
import type { ErrorMessage } from "../types";

@Component({
  selector: "form-error",
  template: `
    <ng-container *ngIf="items.length > 0"
      ><div class="rdp-form-error" role="alert" aria-live="polite">
        <ng-container *ngFor="let item of items"
          ><p class="rdp-form-error__item">
            {{prefix}} {{item.text}}
          </p></ng-container
        >
        <style>
          {{\`
                    .rdp-form-error {
                      color: var(--form-error-fg);
                      font-size: var(--font-size-publication-date);
                      font-family: 'Roboto', sans-serif;
                      margin-top: var(--separation-1);
                    }
                    .rdp-form-error__item { margin: 0; }
                  \`}}
        </style>
      </div></ng-container
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
export default class FormError {
  t = t;

  @Input() errors!: FormErrorProps["errors"];

  get items() {
    return (this.errors ?? []).map((e) => ({
      key: e.key,
      text: t(e.key, e.vars),
    }));
  }
  get prefix() {
    return (this.errors ?? []).length > 1 ? "- " : "";
  }
}

@NgModule({
  declarations: [FormError],
  imports: [CommonModule],
  exports: [FormError],
})
export class FormErrorModule {}
