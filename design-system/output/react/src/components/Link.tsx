import * as React from "react";

type LinkProps = {
  href: string;
  labelKey?: string;
  label?: string;
  external?: boolean;
  variant?: "underline" | "inline" | "plain";
};
import { t } from "../utils/i18n";

function Link(props: LinkProps) {
  return (
    <a
      className={`rdp-link rdp-link--${props.variant ?? "underline"}`}
      href={props.href}
      target={props.external ? "_blank" : undefined}
      rel={props.external ? "noopener noreferrer" : undefined}
    >
      {props.labelKey ? <>{t(props.labelKey)}</> : <>{props.label ?? ""}</>}
      <style>{`
        .rdp-link {
          color: var(--color-brand-active);
          text-decoration: none;
          font-family: 'Roboto', sans-serif;
        }
        .rdp-link--underline { text-decoration: underline; }
        .rdp-link--plain { color: inherit; }
        .rdp-link:hover { color: var(--color-brand); }
      `}</style>
    </a>
  );
}

export default Link;
