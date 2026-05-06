<template>
  <div class="rdp-metrics-bar">
    <span
      class="rdp-metrics-bar__pill rdp-metrics-bar__pill--reply"
      :aria-label="
        t(
          'metrics.replies.aria-label',
          {
            count: replies,
          },
          locale ?? 'fr-FR'
        )
      "
      ><Icon name="reply" :size="16" :decorative="true"></Icon
      >{{ formatCount(replies, locale ?? "fr-FR") }}</span
    ><span
      class="rdp-metrics-bar__pill rdp-metrics-bar__pill--repost"
      :aria-label="
        t(
          'metrics.reposts.aria-label',
          {
            count: reposts,
          },
          locale ?? 'fr-FR'
        )
      "
      ><Icon name="retweet" :size="16" :decorative="true"></Icon
      >{{ formatCount(reposts, locale ?? "fr-FR") }}</span
    ><span
      class="rdp-metrics-bar__pill rdp-metrics-bar__pill--like"
      :aria-label="
        t(
          'metrics.likes.aria-label',
          {
            count: likes,
          },
          locale ?? 'fr-FR'
        )
      "
      ><Icon name="like-metric" :size="16" :decorative="true"></Icon
      >{{ formatCount(likes, locale ?? "fr-FR") }}</span
    ><component :is="'style'">{{
      `
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
      `
    }}</component>
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";
import { formatCount } from "../utils/intl";
import type { Locale } from "../utils/i18n";
import Icon from "./Icon.vue";

type MetricsBarProps = {
  replies: number;
  reposts: number;
  likes: number;
  locale?: Locale;
};

const props = defineProps<MetricsBarProps>();
</script>