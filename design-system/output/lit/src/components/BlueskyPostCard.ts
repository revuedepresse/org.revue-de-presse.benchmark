import { t } from "../utils/i18n";
import { formatDate } from "../utils/intl";
import "./MetricsBar.ts";
import "./WebIntents.ts";
import "./MediaPlaceholder.ts";
import type { Locale } from "../utils/i18n";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

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

@customElement("bluesky-post-card")
export default class BlueskyPostCard extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() post: any;
  @property() locale: any;

  render() {
    return html`

          <article>
          <metrics-bar
            .replies="${this.post.metrics.replies}"
            .reposts="${this.post.metrics.reposts}"
            .likes="${this.post.metrics.likes}"
            .locale="${this.locale}"
          ></metrics-bar>
          <header>
            <span aria-hidden="true"
              >${
                !!this.post.authorAvatarUrl
                  ? html`<img
              alt=""
              .src="${this.post.authorAvatarUrl}"
            />`
                  : null
              }</span
            >
            <span
              ><strong>${this.post.authorName}</strong>
              <span>${t("bluesky.handle.prefix")} ${
      this.post.authorHandle
    }</span></span
            >
          </header>
          <p>${this.post.body}</p>
          ${
            !!this.post.hasMedia
              ? html`<media-placeholder
          .width="${270}"
          .height="${160}"
        ></media-placeholder
        >`
              : null
          }
          <footer>
            <time
              >${formatDate(
                this.post.publishedAt,
                "longDay",
                this.locale ?? "fr-FR"
              )}</time
            >
            <web-intents .postId="${this.post.id}"></web-intents>
          </footer>
          <style>
            ${`
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
                `}
          </style>
        </article>

        `;
  }
}
