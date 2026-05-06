import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type AlertProps = {
  variant?: "empty" | "info" | "warning";
  messageKey: string;
  vars?: Record<string, string | number>;
};

import { t } from "../utils/i18n";

@Component({
  selector: "alert",
  template: `
    <div
      role="status"
      [class]="\`rdp-alert rdp-alert--\${variant ?? 'empty'}\`"
    >
      <span aria-hidden="true" class="rdp-alert__icon">⚠</span>
      <span class="rdp-alert__text">{{t(messageKey, vars)}}</span>
      <style>
        {{\`
                .rdp-alert {
                  display: inline-flex;
                  align-items: center;
                  gap: var(--separation-1);
                  padding: var(--separation-1) var(--separation-2);
                  background: var(--alert-bg-empty);
                  color: var(--alert-fg-empty);
                  font-family: 'Roboto', sans-serif;
                  font-size: var(--font-size-content);
                  border-radius: var(--radius-default);
                }
                .rdp-alert--info { background: var(--color-brand-active); color: var(--color-white); }
                .rdp-alert--warning { background: var(--color-vanity-metric-like); color: var(--color-white); }
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
export default class Alert {
  t = t;

  @Input() variant!: AlertProps["variant"];
  @Input() messageKey!: AlertProps["messageKey"];
  @Input() vars!: AlertProps["vars"];
}

@NgModule({
  declarations: [Alert],
  imports: [CommonModule],
  exports: [Alert],
})
export class AlertModule {}
