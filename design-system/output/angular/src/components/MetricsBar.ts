import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type MetricsBarProps = {
  replies: number;
  reposts: number;
  likes: number;
  locale?: Locale;
};

import { t } from "../utils/i18n";
import { formatCount } from "../utils/intl";
import type { Locale } from "../utils/i18n";

@Component({
  selector: "metrics-bar",
  template: `
    <div class="rdp-metrics-bar">
      <span
        class="rdp-metrics-bar__pill rdp-metrics-bar__pill--repost"
        [attr.aria-label]="t('metrics.reposts.aria-label', {
          count: reposts
        }, locale ?? 'fr-FR')"
        ><span class="rdp-metrics-bar__icon rdp-metrics-bar__icon--repost"
          ><icon name="retweet" [size]="16" [decorative]="true"></icon
        ></span>
        <span
          class="rdp-metrics-bar__count rdp-metrics-bar__count--repost"
          >{{formatCount(reposts, locale ?? 'fr-FR')}}</span
        ></span
      >
      <span
        class="rdp-metrics-bar__pill rdp-metrics-bar__pill--like"
        [attr.aria-label]="t('metrics.likes.aria-label', {
          count: likes
        }, locale ?? 'fr-FR')"
        ><span class="rdp-metrics-bar__icon rdp-metrics-bar__icon--like"
          ><icon name="like-metric" [size]="16" [decorative]="true"></icon
        ></span>
        <span
          class="rdp-metrics-bar__count rdp-metrics-bar__count--like"
          >{{formatCount(likes, locale ?? 'fr-FR')}}</span
        ></span
      >
      <style>
        {{\`
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
              \`}}
      </style>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class MetricsBar {
  t = t;
  formatCount = formatCount;

  @Input() reposts!: MetricsBarProps["reposts"];
  @Input() locale!: MetricsBarProps["locale"];
  @Input() likes!: MetricsBarProps["likes"];
}

@NgModule({
  declarations: [MetricsBar],
  imports: [CommonModule, IconModule],
  exports: [MetricsBar],
})
export class MetricsBarModule {}
