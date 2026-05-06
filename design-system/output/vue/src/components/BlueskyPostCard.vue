<template>
  <article class="rdp-bsky-post">
    <MetricsBar
      :replies="post.metrics.replies"
      :reposts="post.metrics.reposts"
      :likes="post.metrics.likes"
      :locale="locale"
    ></MetricsBar>
    <header class="rdp-bsky-post__header">
      <span class="rdp-bsky-post__avatar" aria-hidden="true">
        <template v-if="!!post.authorAvatarUrl">
          <img alt="" :src="post.authorAvatarUrl" />
        </template> </span
      ><span class="rdp-bsky-post__author"
        ><strong>{{ post.authorName }}</strong
        ><span class="rdp-bsky-post__handle"
          >{{ t("bluesky.handle.prefix") }}{{ post.authorHandle }}</span
        ></span
      >
    </header>
    <p class="rdp-bsky-post__body">{{ post.body }}</p>
    <template v-if="!!post.hasMedia">
      <MediaPlaceholder :width="270" :height="160"></MediaPlaceholder>
    </template>

    <footer class="rdp-bsky-post__footer">
      <time class="rdp-bsky-post__timestamp">{{
        formatDate(post.publishedAt, "longDay", locale ?? "fr-FR")
      }}</time
      ><WebIntents :postId="post.id"></WebIntents>
    </footer>
    <component :is="'style'">{{
      `
        .rdp-bsky-post {
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          padding: var(--separation-2);
          font-family: 'Roboto', sans-serif;
          color: var(--color-content-text);
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
          font-size: var(--font-size-status-text);
        }
        .rdp-bsky-post__header {
          display: flex;
          gap: var(--separation-1);
          align-items: center;
          font-size: var(--font-size-content);
        }
        .rdp-bsky-post__avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-light-grey);
          overflow: hidden;
          flex-shrink: 0;
        }
        .rdp-bsky-post__avatar img { width: 100%; height: 100%; object-fit: cover; }
        .rdp-bsky-post__author { display: flex; flex-direction: column; }
        .rdp-bsky-post__handle {
          color: var(--color-light-grey);
          font-size: var(--font-size-publication-date);
        }
        .rdp-bsky-post__body { margin: 0; }
        .rdp-bsky-post__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--font-size-publication-date);
          color: var(--color-light-grey);
        }
      `
    }}</component>
  </article>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";
import { formatDate } from "../utils/intl";
import MetricsBar from "./MetricsBar.vue";
import WebIntents from "./WebIntents.vue";
import MediaPlaceholder from "./MediaPlaceholder.vue";
import type { Locale } from "../utils/i18n";

export type BlueskyPost = {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatarUrl?: string;
  body: string;
  publishedAt: Date;
  metrics: {
    replies: number;
    reposts: number;
    likes: number;
  };
  hasMedia?: boolean;
};
type BlueskyPostCardProps = {
  post: BlueskyPost;
  locale?: Locale;
};

const props = defineProps<BlueskyPostCardProps>();
</script>