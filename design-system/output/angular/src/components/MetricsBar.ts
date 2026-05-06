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
        class="rdp-metrics-bar__pill rdp-metrics-bar__pill--reply"
        [attr.aria-label]="t('metrics.replies.aria-label', {
          count: replies
        }, locale ?? 'fr-FR')"
      >
        💬 {{formatCount(replies, locale ?? 'fr-FR')}}</span
      >
      <span
        class="rdp-metrics-bar__pill rdp-metrics-bar__pill--repost"
        [attr.aria-label]="t('metrics.reposts.aria-label', {
          count: reposts
        }, locale ?? 'fr-FR')"
      >
        🔁 {{formatCount(reposts, locale ?? 'fr-FR')}}</span
      >
      <span
        class="rdp-metrics-bar__pill rdp-metrics-bar__pill--like"
        [attr.aria-label]="t('metrics.likes.aria-label', {
          count: likes
        }, locale ?? 'fr-FR')"
      >
        ❤ {{formatCount(likes, locale ?? 'fr-FR')}}</span
      >
      <style>
        {{\`
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

  @Input() replies!: MetricsBarProps["replies"];
  @Input() locale!: MetricsBarProps["locale"];
  @Input() reposts!: MetricsBarProps["reposts"];
  @Input() likes!: MetricsBarProps["likes"];
}

@NgModule({
  declarations: [MetricsBar],
  imports: [CommonModule],
  exports: [MetricsBar],
})
export class MetricsBarModule {}
