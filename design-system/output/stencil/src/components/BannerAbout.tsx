import { t } from "../utils/i18n";
import { Icon } from "./Icon";

import {
  Component,
  h,
  Fragment,
  Host,
  Event,
  EventEmitter,
  Prop,
  State,
} from "@stencil/core";

@Component({
  tag: "banner-about",
})
export class BannerAbout {
  @Event() dismiss: any;
  @Prop() bodyKey: any;
  @Prop() dismissible: any;
  @State() dismissed = false;

  dismiss() {
    this.dismissed = true;
    this.dismiss?.();
  }

  componentDidLoad() {}

  render() {
    return (
      <Host>
        {!this.dismissed ? (
          <aside class="rdp-banner-about" role="region">
            <header class="rdp-banner-about__heading">
              <icon name="introducing" size={24}></icon>
              <span>{t("footer.about.heading")}</span>
            </header>
            <p class="rdp-banner-about__body">
              {t(this.bodyKey ?? "footer.about.body")}
            </p>
            {!!this.dismissible ? (
              <button
                class="rdp-banner-about__close"
                type="button"
                aria-label={t("actions.quit.label")}
                onClick={() => this.dismiss()}
              >
                ×
              </button>
            ) : null}
            <style>{`
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
        `}</style>
          </aside>
        ) : null}
      </Host>
    );
  }
}
