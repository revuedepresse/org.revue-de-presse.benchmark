import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type ButtonProps = {
  variant: ButtonVariant;
  labelKey?: string;
  label?: string;
  icon?: IconName;
  iconAfter?: IconName;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
};

import { t } from "../utils/i18n";
import type { ButtonVariant, IconName } from "../types";

@Component({
  selector: "button",
  template: `
    <button
      type="button"
      [class]="\`rdp-button rdp-button--\${variant}\`"
      [attr.data-loading]="loading ? 'true' : undefined"
      [attr.disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel"
      (click)="onClick?.()"
    >
      <ng-container *ngIf="!!icon"
        ><span class="rdp-button__icon"
          ><icon [name]="icon!" [size]="24" [decorative]="true"></icon></span
      ></ng-container>
      <ng-container *ngIf="variant !== 'scrollTop' && variant !== 'avatar'"
        ><span class="rdp-button__label"
          ><ng-container *ngIf="labelKey">{{t(labelKey)}}</ng-container
          ><ng-container
            *ngIf="!(labelKey)"
            >{{label ?? ''}}</ng-container
          ></span
        ></ng-container
      >
      <ng-container *ngIf="!!iconAfter"
        ><span class="rdp-button__icon-after"
          ><icon
            [name]="iconAfter!"
            [size]="24"
            [decorative]="true"
          ></icon></span
      ></ng-container>
      <style>
        {{\`
                .rdp-button {
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  gap: var(--separation-1);
                  border: none;
                  cursor: pointer;
                  font-family: 'Roboto', sans-serif;
                  font-size: var(--font-size-content);
                  padding: var(--separation-1) var(--separation-2);
                  border-radius: var(--radius-default);
                  background: var(--button-bg-primary);
                  color: var(--button-fg-primary);
                  transition: background 120ms;
                }
                .rdp-button:hover { background: var(--button-bg-primary-hover); }
                .rdp-button:disabled { background: var(--button-bg-disabled); cursor: not-allowed; }
                .rdp-button--secondary {
                  background: var(--button-bg-secondary);
                  color: var(--color-brand-active);
                  border: 1px solid var(--button-border-secondary);
                }
                .rdp-button--scrollTop, .rdp-button--avatar {
                  width: 48px; height: 48px; padding: 0; border-radius: 50%;
                }
                .rdp-button--quit { background: transparent; color: var(--color-content-text); padding: 0; }
                .rdp-button--calendarNav { padding: 0; width: 32px; height: 32px; border-radius: 50%; }
                .rdp-button--form { width: 100%; padding: var(--separation-2); }
              \`}}
      </style>
    </button>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class Button {
  t = t;

  @Input() variant!: ButtonProps["variant"];
  @Input() loading!: ButtonProps["loading"];
  @Input() disabled!: ButtonProps["disabled"];
  @Input() ariaLabel!: ButtonProps["ariaLabel"];
  @Input() onClick!: ButtonProps["onClick"];
  @Input() icon!: ButtonProps["icon"];
  @Input() labelKey!: ButtonProps["labelKey"];
  @Input() label!: ButtonProps["label"];
  @Input() iconAfter!: ButtonProps["iconAfter"];
}

@NgModule({
  declarations: [Button],
  imports: [CommonModule, IconModule],
  exports: [Button],
})
export class ButtonModule {}
