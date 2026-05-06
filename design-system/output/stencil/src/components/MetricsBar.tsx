import { t } from "../utils/i18n";
import { formatCount } from "../utils/intl";
import type { Locale } from "../utils/i18n";

import { Component, h, Fragment, Prop } from "@stencil/core";

@Component({
  tag: "metrics-bar",
})
export class MetricsBar {
  @Prop() replies: any;
  @Prop() locale: any;
  @Prop() reposts: any;
  @Prop() likes: any;

  componentDidLoad() {}

  render() {
    return (
      <div class="rdp-metrics-bar">
        <span
          class="rdp-metrics-bar__pill rdp-metrics-bar__pill--reply"
          aria-label={t(
            "metrics.replies.aria-label",
            {
              count: this.replies,
            },
            this.locale ?? "fr-FR"
          )}
        >
          💬
          {formatCount(this.replies, this.locale ?? "fr-FR")}
        </span>
        <span
          class="rdp-metrics-bar__pill rdp-metrics-bar__pill--repost"
          aria-label={t(
            "metrics.reposts.aria-label",
            {
              count: this.reposts,
            },
            this.locale ?? "fr-FR"
          )}
        >
          🔁
          {formatCount(this.reposts, this.locale ?? "fr-FR")}
        </span>
        <span
          class="rdp-metrics-bar__pill rdp-metrics-bar__pill--like"
          aria-label={t(
            "metrics.likes.aria-label",
            {
              count: this.likes,
            },
            this.locale ?? "fr-FR"
          )}
        >
          ❤{formatCount(this.likes, this.locale ?? "fr-FR")}
        </span>
        <style>{`
        .rdp-metrics-bar {
          display: inline-flex;
          gap: var(--separation-1);
          font-size: var(--font-size-vanity-metric);
          font-family: 'Roboto', sans-serif;
        }
        .rdp-metrics-bar__pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px var(--separation-1);
          border-radius: 999px;
          color: var(--color-white);
        }
        .rdp-metrics-bar__pill--reply { background: var(--color-vanity-metric-reply); }
        .rdp-metrics-bar__pill--repost { background: var(--color-vanity-metric-retweet); }
        .rdp-metrics-bar__pill--like { background: var(--color-vanity-metric-like); }
      `}</style>
      </div>
    );
  }
}
