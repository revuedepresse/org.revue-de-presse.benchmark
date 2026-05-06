import { t } from '../utils/i18n';

type WebIntentsProps = {
  postId: string;
  onReply?: (id: string) => void;
  onRepost?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
};

export default function WebIntents(props: WebIntentsProps) {
  return (
    <div class="rdp-web-intents">
      <button
        type="button"
        class="rdp-web-intents__btn"
        aria-label={t('web-intents.reply.aria-label')}
        onClick={() => props.onReply?.(props.postId)}
      >
        ↩
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        aria-label={t('web-intents.repost.aria-label')}
        onClick={() => props.onRepost?.(props.postId)}
      >
        🔁
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        aria-label={t('web-intents.like.aria-label')}
        onClick={() => props.onLike?.(props.postId)}
      >
        ♡
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        aria-label={t('web-intents.share.aria-label')}
        onClick={() => props.onShare?.(props.postId)}
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
}
