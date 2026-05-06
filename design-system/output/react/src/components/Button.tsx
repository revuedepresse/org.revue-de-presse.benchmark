"use client";
import * as React from "react";

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
import Icon from "./Icon";
import type { ButtonVariant, IconName } from "../types";

function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      className={`rdp-button rdp-button--${props.variant}`}
      data-loading={props.loading ? "true" : undefined}
      disabled={props.disabled || props.loading}
      aria-label={props.ariaLabel}
      onClick={(event) => props.onClick?.()}
    >
      {!!props.icon ? (
        <span className="rdp-button__icon">
          <Icon name={props.icon!} size={24} decorative />
        </span>
      ) : null}
      {props.variant !== "scrollTop" && props.variant !== "avatar" ? (
        <span className="rdp-button__label">
          {props.labelKey ? <>{t(props.labelKey)}</> : <>{props.label ?? ""}</>}
        </span>
      ) : null}
      {!!props.iconAfter ? (
        <span className="rdp-button__icon-after">
          <Icon name={props.iconAfter!} size={24} decorative />
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

export default Button;
