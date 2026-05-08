import { Show } from "solid-js";

type AppHeaderProps = {
  layout: "mobile" | "desktop";
  authenticated: boolean;
  showAccountControls?: boolean;
  onAccountClick?: () => void;
  onMySpaceClick?: () => void;
  onLogoClick?: () => void;
};

import { t } from "../utils/i18n";
import Logo from "./Logo";
import Icon from "./Icon";

function AppHeader(props: AppHeaderProps) {
  return (
    <>
      <header class={`rdp-app-header rdp-app-header--${props.layout}`}>
        <button
          class="rdp-app-header__home"
          type="button"
          aria-label="Revue de presse"
          onClick={(event) => props.onLogoClick?.()}
        >
          <Logo
            showWordmark={true}
            size={props.layout === "mobile" ? "sm" : "md"}
          ></Logo>
        </button>
        <Show
          when={
            props.showAccountControls === true && props.layout === "desktop"
          }
        >
          <a
            class="rdp-app-header__myspace"
            href="#"
            aria-disabled={!props.authenticated ? "true" : undefined}
            onClick={(event) => {
              if (!props.authenticated) {
                event.preventDefault();
                return;
              }
              props.onMySpaceClick?.();
            }}
          >
            {t("header.my-space")}
          </a>
        </Show>
        <Show when={props.showAccountControls === true}>
          <button
            class="rdp-app-header__account"
            type="button"
            aria-label={t("header.my-account.aria-label")}
            onClick={(event) => props.onAccountClick?.()}
          >
            <Icon name="pick-item" size={32} decorative={true}></Icon>
          </button>
        </Show>
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
        .rdp-app-header__home {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          font: inherit;
          color: inherit;
          display: inline-flex;
          align-items: center;
        }
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
    </>
  );
}

export default AppHeader;
