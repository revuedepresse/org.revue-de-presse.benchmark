import { t } from "../utils/i18n";
import { formatCount } from "../utils/intl";
import type { Locale } from "../utils/i18n";
import "./Icon.ts";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type MetricsBarProps = {
  replies: number;
  reposts: number;
  likes: number;
  locale?: Locale;
};

@customElement("metrics-bar")
export default class MetricsBar extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() reposts: any;
  @property() locale: any;
  @property() likes: any;

  render() {
    return html`

          <div ><span  aria-label=${t(
            "metrics.reposts.aria-label",
            {
              count: this.reposts,
            },
            this.locale ?? "fr-FR"
          )} ><span ><my-icon  name="retweet"  .size=${16}  .decorative=${true} ></my-icon></span>
        <span >${formatCount(
          this.reposts,
          this.locale ?? "fr-FR"
        )}</span></span>
        <span  aria-label=${t(
          "metrics.likes.aria-label",
          {
            count: this.likes,
          },
          this.locale ?? "fr-FR"
        )} ><span ><my-icon  name="like-metric"  .size=${16}  .decorative=${true} ></my-icon></span>
        <span >${formatCount(this.likes, this.locale ?? "fr-FR")}</span></span>
        <style >${`
              /* Legacy vanity-metric pattern: a 24px tinted circle hosting the
                 glyph, followed by a count rendered in the matching dark colour.
                 No solid pill background — the post-card body shows through. */
              .rdp-metrics-bar {
                display: inline-flex;
                gap: var(--separation-2);
                font-family: 'Roboto', sans-serif;
                font-size: var(--font-size-vanity-metric);
                line-height: var(--line-spacing-vanity-metric, 25px);
              }
              .rdp-metrics-bar__pill {
                display: inline-flex;
                align-items: center;
                gap: 5px;
              }
              .rdp-metrics-bar__icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
              }
              .rdp-metrics-bar__icon--repost {
                background: var(--color-vanity-metric-retweet-bg);
                color: var(--color-vanity-metric-retweet);
              }
              .rdp-metrics-bar__icon--like {
                background: var(--color-vanity-metric-like-bg);
                color: var(--color-vanity-metric-like);
              }
              .rdp-metrics-bar__count--repost { color: var(--color-vanity-metric-retweet); }
              .rdp-metrics-bar__count--like { color: var(--color-vanity-metric-like); }
            `}</style></div>
        `;
  }
}
