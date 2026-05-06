import { Show } from "solid-js";

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

function Button(props: ButtonProps) {
  return (
    <>
      <button
        class={`rdp-button rdp-button--${props.variant}`}
        type="button"
        data-loading={props.loading ? "true" : undefined}
        disabled={props.disabled || props.loading}
        aria-label={props.ariaLabel}
        onClick={(event) => props.onClick?.()}
      >
        <Show when={props.icon}>
          <span class="rdp-button__icon">{props.icon}</span>
        </Show>
        <Show
          when={props.variant !== "scrollTop" && props.variant !== "avatar"}
        >
          <span class="rdp-button__label">
            <Show fallback={props.label ?? ""} when={props.labelKey}>
              {t(props.labelKey)}
            </Show>
          </span>
        </Show>
        <Show when={props.iconAfter}>
          <span class="rdp-button__icon-after">{props.iconAfter}</span>
        </Show>
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
    </>
  );
}

export default Button;
