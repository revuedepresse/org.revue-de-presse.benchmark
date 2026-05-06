/** @jsx h */
import { h, Fragment } from "preact";

type MetricsBarProps = {
  replies: number;
  reposts: number;
  likes: number;
  locale?: Locale;
};
import { t } from "../utils/i18n";
import { formatCount } from "../utils/intl";
import type { Locale } from "../utils/i18n";

function MetricsBar(props: MetricsBarProps) {
  return (
    <div className="rdp-metrics-bar">
      <span
        className="rdp-metrics-bar__pill rdp-metrics-bar__pill--reply"
        aria-label={t(
          "metrics.replies.aria-label",
          {
            count: props.replies,
          },
          props.locale ?? "fr-FR"
        )}
      >
        💬 {formatCount(props.replies, props.locale ?? "fr-FR")}
      </span>
      <span
        className="rdp-metrics-bar__pill rdp-metrics-bar__pill--repost"
        aria-label={t(
          "metrics.reposts.aria-label",
          {
            count: props.reposts,
          },
          props.locale ?? "fr-FR"
        )}
      >
        🔁 {formatCount(props.reposts, props.locale ?? "fr-FR")}
      </span>
      <span
        className="rdp-metrics-bar__pill rdp-metrics-bar__pill--like"
        aria-label={t(
          "metrics.likes.aria-label",
          {
            count: props.likes,
          },
          props.locale ?? "fr-FR"
        )}
      >
        ❤ {formatCount(props.likes, props.locale ?? "fr-FR")}
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

export default MetricsBar;
