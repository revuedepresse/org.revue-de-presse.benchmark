import { Locale, t } from "../utils/i18n";

import { formatCount } from "../utils/intl";

import Icon from "./Icon.jsx";

import { Fragment, component$, h } from "@builder.io/qwik";

type MetricsBarProps = {
  replies: number;
  reposts: number;
  likes: number;
  locale?: Locale;
};
export const MetricsBar = component$((props: MetricsBarProps) => {
  return (
    <div class="rdp-metrics-bar">
      <span
        class="rdp-metrics-bar__pill rdp-metrics-bar__pill--repost"
        aria-label={t(
          "metrics.reposts.aria-label",
          {
            count: props.reposts,
          },
          props.locale ?? "fr-FR"
        )}
      >
        <span class="rdp-metrics-bar__icon rdp-metrics-bar__icon--repost">
          <Icon name="retweet" size={16} decorative={true}></Icon>
        </span>
        <span class="rdp-metrics-bar__count rdp-metrics-bar__count--repost">
          {formatCount(props.reposts, props.locale ?? "fr-FR")}
        </span>
      </span>
      <span
        class="rdp-metrics-bar__pill rdp-metrics-bar__pill--like"
        aria-label={t(
          "metrics.likes.aria-label",
          {
            count: props.likes,
          },
          props.locale ?? "fr-FR"
        )}
      >
        <span class="rdp-metrics-bar__icon rdp-metrics-bar__icon--like">
          <Icon name="like-metric" size={16} decorative={true}></Icon>
        </span>
        <span class="rdp-metrics-bar__count rdp-metrics-bar__count--like">
          {formatCount(props.likes, props.locale ?? "fr-FR")}
        </span>
      </span>
      <style>{`
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
      `}</style>
    </div>
  );
});

export default MetricsBar;
