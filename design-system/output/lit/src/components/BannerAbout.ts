import { t } from "../utils/i18n";
import "./Icon.ts";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type BannerAboutProps = {
  bodyKey?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
};

@customElement("banner-about")
export default class BannerAbout extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() onDismiss: any;
  @property() bodyKey: any;
  @property() dismissible: any;

  @state() dismissed = false;

  dismiss() {
    this.dismissed = true;
    this.onDismiss?.();
  }

  render() {
    return html`

          ${
            !this.dismissed
              ? html`<aside  role="region" ><header ><my-icon  name="introducing"  .size=${24} ></my-icon>
      <span >${t("footer.about.heading")}</span></header>
      <p >${t(this.bodyKey ?? "footer.about.body")}</p>
      ${
        !!this.dismissible
          ? html`<button  type="button"  aria-label=${t(
              "actions.quit.label"
            )}  @click=${(event) => this.dismiss()} >
                    ×
                  </button>`
          : null
      }
      <style >${`
                  .rdp-banner-about {
                    background: var(--banner-about-bg);
                    color: var(--banner-about-fg);
                    padding: var(--separation-2);
                    border-radius: var(--radius-default);
                    font-family: 'Roboto', sans-serif;
                    font-size: var(--font-size-content);
                    position: relative;
                  }
                  .rdp-banner-about__heading {
                    display: flex;
                    align-items: center;
                    gap: var(--separation-1);
                    font-family: 'Signika', sans-serif;
                    font-size: var(--font-size-status-text);
                    color: var(--color-brand-active);
                    margin-bottom: var(--separation-1);
                  }
                  .rdp-banner-about__body { margin: 0; }
                  .rdp-banner-about__close {
                    position: absolute;
                    top: var(--separation-1);
                    right: var(--separation-1);
                    background: transparent;
                    border: none;
                    color: var(--color-content-font);
                    font-size: 24px;
                    cursor: pointer;
                  }
                `}</style></aside>`
              : null
          }
        `;
  }
}
