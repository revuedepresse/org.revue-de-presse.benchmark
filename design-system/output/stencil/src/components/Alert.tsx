import { t } from "../utils/i18n";

import { Component, h, Fragment, Prop } from "@stencil/core";

@Component({
  tag: "alert",
})
export class Alert {
  @Prop() variant: any;
  @Prop() messageKey: any;
  @Prop() vars: any;

  componentDidLoad() {}

  render() {
    return (
      <div
        class={`rdp-alert rdp-alert--${this.variant ?? "empty"}`}
        role="status"
      >
        <span class="rdp-alert__icon" aria-hidden="true">
          ⚠
        </span>
        <span class="rdp-alert__text">{t(this.messageKey, this.vars)}</span>
        <style>{`
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
      `}</style>
      </div>
    );
  }
}
