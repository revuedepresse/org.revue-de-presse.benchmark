import { t } from '../utils/i18n';
import { formatDate } from '../utils/intl';
import MetricsBar from './MetricsBar.lite';
import WebIntents from './WebIntents.lite';
import MediaPlaceholder from './MediaPlaceholder.lite';
import type { Locale } from '../utils/i18n';

export type BlueskyPost = {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatarUrl?: string;
  body: string;
  publishedAt: Date;
  metrics: { replies: number; reposts: number; likes: number };
  hasMedia?: boolean;
};

type BlueskyPostCardProps = {
  post: BlueskyPost;
  locale?: Locale;
};

export default function BlueskyPostCard(props: BlueskyPostCardProps) {
  return (
    <article class="rdp-bsky-post">
      <MetricsBar
        replies={props.post.metrics.replies}
        reposts={props.post.metrics.reposts}
        likes={props.post.metrics.likes}
        locale={props.locale}
      />
      <header class="rdp-bsky-post__header">
        <span class="rdp-bsky-post__avatar" aria-hidden="true">
          <Show when={!!props.post.authorAvatarUrl}>
            <img src={props.post.authorAvatarUrl} alt="" />
          </Show>
        </span>
        <span class="rdp-bsky-post__author">
          <strong>{props.post.authorName}</strong>
          <span class="rdp-bsky-post__handle">
            {t('bluesky.handle.prefix')}
            {props.post.authorHandle}
          </span>
        </span>
      </header>
      <p class="rdp-bsky-post__body">{props.post.body}</p>
      <Show when={!!props.post.hasMedia}>
        <MediaPlaceholder width={270} height={160} />
      </Show>
      <footer class="rdp-bsky-post__footer">
        <time class="rdp-bsky-post__timestamp">
          {formatDate(props.post.publishedAt, 'longDay', props.locale ?? 'fr-FR')}
        </time>
        <WebIntents postId={props.post.id} />
      </footer>
      <style>{`
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
      `}</style>
    </article>
  );
}
