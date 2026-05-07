/** @jsx h */
import { h, Fragment } from "preact";

type AlertProps = {
  variant?: "empty" | "info" | "warning";
  messageKey: string;
  vars?: Record<string, string | number>;
};
import { t } from "../utils/i18n";

function Alert(props: AlertProps) {
  return (
    <div
      role="status"
      className={`rdp-alert rdp-alert--${props.variant ?? "empty"}`}
    >
      <span aria-hidden="true" className="rdp-alert__icon">
        ⚠
      </span>
      <span className="rdp-alert__text">{t(props.messageKey, props.vars)}</span>
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
        .rdp-alert--info { background: var(--color-brand); color: var(--color-white); }
        .rdp-alert--warning { background: var(--color-vanity-metric-like); color: var(--color-white); }
      `}</style>
    </div>
  );
}

export default Alert;
