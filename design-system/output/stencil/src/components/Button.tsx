import { t } from "../utils/i18n";
import { Icon } from "./Icon";
import type { ButtonVariant, IconName } from "../types";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";

@Component({
  tag: "button",
})
export class Button {
  @Prop() variant: any;
  @Prop() loading: any;
  @Prop() disabled: any;
  @Prop() ariaLabel: any;
  @Event() click: any;
  @Prop() icon: any;
  @Prop() labelKey: any;
  @Prop() label: any;
  @Prop() iconAfter: any;

  componentDidLoad() {}

  render() {
    return (
      <button
        class={`rdp-button rdp-button--${this.variant}`}
        type="button"
        data-loading={this.loading ? "true" : undefined}
        disabled={this.disabled || this.loading}
        aria-label={this.ariaLabel}
        onClick={() => this.click?.()}
      >
        {!!this.icon ? (
          <span class="rdp-button__icon">
            <icon name={this.icon!} size={24} decorative={true}></icon>
          </span>
        ) : null}
        {this.variant !== "scrollTop" && this.variant !== "avatar" ? (
          <span class="rdp-button__label">
            {this.labelKey ? t(this.labelKey) : this.label ?? ""}
          </span>
        ) : null}
        {!!this.iconAfter ? (
          <span class="rdp-button__icon-after">
            <icon name={this.iconAfter!} size={24} decorative={true}></icon>
          </span>
        ) : null}
        <style>{`
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
      `}</style>
      </button>
    );
  }
}
