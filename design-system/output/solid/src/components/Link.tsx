import { Show } from "solid-js";

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
    <>
      <a
        class={`rdp-link rdp-link--${props.variant ?? "underline"}`}
        href={props.href}
        target={props.external ? "_blank" : undefined}
        rel={props.external ? "noopener noreferrer" : undefined}
      >
        <Show fallback={props.label ?? ""} when={props.labelKey}>
          {t(props.labelKey)}
        </Show>
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
    </>
  );
}

export default Link;
