"use client";
import * as React from "react";

type WebIntentsProps = {
  postId: string;
  onReply?: (id: string) => void;
  onRepost?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
};
import { t } from "../utils/i18n";
import Icon from "./Icon";

function WebIntents(props: WebIntentsProps) {
  return (
    <div className="rdp-web-intents">
      <button
        type="button"
        className="rdp-web-intents__btn"
        aria-label={t("web-intents.reply.aria-label")}
        onClick={(event) => props.onReply?.(props.postId)}
      >
        <Icon name="reply" size={24} decorative />
      </button>
      <button
        type="button"
        className="rdp-web-intents__btn"
        aria-label={t("web-intents.repost.aria-label")}
        onClick={(event) => props.onRepost?.(props.postId)}
      >
        <Icon name="retweet" size={24} decorative />
      </button>
      <button
        type="button"
        className="rdp-web-intents__btn"
        aria-label={t("web-intents.like.aria-label")}
        onClick={(event) => props.onLike?.(props.postId)}
      >
        <Icon name="like-intent" size={24} decorative />
      </button>
      <button
        type="button"
        className="rdp-web-intents__btn"
        aria-label={t("web-intents.share.aria-label")}
        onClick={(event) => props.onShare?.(props.postId)}
      >
        <Icon name="share" size={24} decorative />
      </button>
      <style>{`
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
      `}</style>
    </div>
  );
}

export default WebIntents;
