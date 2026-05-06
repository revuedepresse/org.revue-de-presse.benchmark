import { t } from "../utils/i18n";

import { $, Fragment, component$, h } from "@builder.io/qwik";

type WebIntentsProps = {
  postId: string;
  onReply?: (id: string) => void;
  onRepost?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
};
export const WebIntents = component$((props: WebIntentsProps) => {
  return (
    <div class="rdp-web-intents">
      <button
        type="button"
        class="rdp-web-intents__btn"
        aria-label={t("web-intents.reply.aria-label")}
        onClick$={$((event) => props.onReply?.(props.postId))}
      >
        ↩
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        aria-label={t("web-intents.repost.aria-label")}
        onClick$={$((event) => props.onRepost?.(props.postId))}
      >
        🔁
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        aria-label={t("web-intents.like.aria-label")}
        onClick$={$((event) => props.onLike?.(props.postId))}
      >
        ♡
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        aria-label={t("web-intents.share.aria-label")}
        onClick$={$((event) => props.onShare?.(props.postId))}
      >
        ↗
      </button>
      <style>{`
        .rdp-web-intents { display: inline-flex; gap: var(--separation-2); }
        .rdp-web-intents__btn {
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          color: var(--color-light-grey);
          cursor: pointer;
          font-size: 16px;
        }
        .rdp-web-intents__btn:hover { color: var(--color-brand-active); }
      `}</style>
    </div>
  );
});

export default WebIntents;
