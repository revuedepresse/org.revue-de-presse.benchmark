import { t } from "../utils/i18n";
import { formatDate } from "../utils/intl";
import { MetricsBar } from "./MetricsBar";
import { WebIntents } from "./WebIntents";
import { MediaPlaceholder } from "./MediaPlaceholder";
import type { Locale } from "../utils/i18n";

import { Component, h, Fragment, Prop } from "@stencil/core";

@Component({
  tag: "bluesky-post-card",
})
export class BlueskyPostCard {
  @Prop() post: any;
  @Prop() locale: any;

  componentDidLoad() {}

  render() {
    return (
      <article class="rdp-bsky-post">
        <metrics-bar
          replies={this.post.metrics.replies}
          reposts={this.post.metrics.reposts}
          likes={this.post.metrics.likes}
          locale={this.locale}
        ></metrics-bar>
        <header class="rdp-bsky-post__header">
          <span class="rdp-bsky-post__avatar" aria-hidden="true">
            {!!this.post.authorAvatarUrl ? (
              <img alt="" src={this.post.authorAvatarUrl} />
            ) : null}
          </span>
          <span class="rdp-bsky-post__author">
            <strong>{this.post.authorName}</strong>
            <span class="rdp-bsky-post__handle">
              {t("bluesky.handle.prefix")}
              {this.post.authorHandle}
            </span>
          </span>
        </header>
        <p class="rdp-bsky-post__body">{this.post.body}</p>
        {!!this.post.hasMedia ? (
          <media-placeholder width={270} height={160}></media-placeholder>
        ) : null}
        <footer class="rdp-bsky-post__footer">
          <time class="rdp-bsky-post__timestamp">
            {formatDate(
              this.post.publishedAt,
              "longDay",
              this.locale ?? "fr-FR"
            )}
          </time>
          <web-intents postId={this.post.id}></web-intents>
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
}
