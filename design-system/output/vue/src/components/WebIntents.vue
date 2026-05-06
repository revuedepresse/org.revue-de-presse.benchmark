<template>
  <div class="rdp-web-intents">
    <button
      type="button"
      class="rdp-web-intents__btn"
      :aria-label="t('web-intents.reply.aria-label')"
      @click="async (event) => onReply?.(postId)"
    >
      <Icon name="reply" :size="24" :decorative="true"></Icon></button
    ><button
      type="button"
      class="rdp-web-intents__btn"
      :aria-label="t('web-intents.repost.aria-label')"
      @click="async (event) => onRepost?.(postId)"
    >
      <Icon name="retweet" :size="24" :decorative="true"></Icon></button
    ><button
      type="button"
      class="rdp-web-intents__btn"
      :aria-label="t('web-intents.like.aria-label')"
      @click="async (event) => onLike?.(postId)"
    >
      <Icon name="like-intent" :size="24" :decorative="true"></Icon></button
    ><button
      type="button"
      class="rdp-web-intents__btn"
      :aria-label="t('web-intents.share.aria-label')"
      @click="async (event) => onShare?.(postId)"
    >
      <Icon name="share" :size="24" :decorative="true"></Icon></button
    ><component :is="'style'">{{
      `
        .rdp-web-intents { display: inline-flex; gap: var(--separation-2); }
        .rdp-web-intents__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          padding: 0;
          background: transparent;
          border: none;
          cursor: pointer;
        }
      `
    }}</component>
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";
import Icon from "./Icon.vue";

type WebIntentsProps = {
  postId: string;
  onReply?: (id: string) => void;
  onRepost?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
};

const props = defineProps<WebIntentsProps>();
</script>