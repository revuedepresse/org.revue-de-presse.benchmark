import { t } from "../utils/i18n";

import Icon from "./Icon.jsx";

import Logo from "./Logo.jsx";

import { $, Fragment, component$, h } from "@builder.io/qwik";

type AppHeaderProps = {
  layout: "mobile" | "desktop";
  authenticated: boolean;
  showAccountControls?: boolean;
  onAccountClick?: () => void;
  onMySpaceClick?: () => void;
};
export const AppHeader = component$((props: AppHeaderProps) => {
  return (
    <header class={`rdp-app-header rdp-app-header--${props.layout}`}>
      <Logo
        showWordmark={true}
        size={(() => {
          props.layout === "mobile" ? "sm" : "md";
        })()}
      ></Logo>
      {props.showAccountControls === true && props.layout === "desktop" ? (
        <a
          href="#"
          class="rdp-app-header__myspace"
          preventdefault:click
          aria-disabled={(() => {
            !props.authenticated ? "true" : undefined;
          })()}
          onClick$={$((event) => {
            if (!props.authenticated) {
              return;
            }
            props.onMySpaceClick?.();
          })}
        >
          {t("header.my-space")}
        </a>
      ) : null}
      {props.showAccountControls === true ? (
        <button
          type="button"
          class="rdp-app-header__account"
          aria-label={t("header.my-account.aria-label")}
          onClick$={$((event) => props.onAccountClick?.())}
        >
          <Icon name="pick-item" size={32} decorative={true}></Icon>
        </button>
      ) : null}
      <style>{`
        .rdp-app-header {
          display: flex;
          align-items: center;
          gap: var(--separation-2);
          padding: var(--separation-1) var(--separation-2);
          background: var(--color-white);
          border-bottom: 1px solid var(--color-border);
          font-family: 'Signika', sans-serif;
        }
        .rdp-app-header--desktop { padding: var(--separation-1) var(--separation-3); }
        .rdp-app-header__myspace {
          margin-left: auto;
          color: var(--color-brand-active);
          text-decoration: none;
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-app-header__myspace[aria-disabled="true"] {
          color: var(--color-light-grey);
          cursor: not-allowed;
          pointer-events: none;
        }
        .rdp-app-header__account {
          background: transparent;
          border: none;
          cursor: pointer;
          width: 40px;
          height: 40px;
          margin-left: auto;
          color: var(--color-content-text);
        }
        .rdp-app-header--desktop .rdp-app-header__account { margin-left: 0; }
      `}</style>
    </header>
  );
});

export default AppHeader;
