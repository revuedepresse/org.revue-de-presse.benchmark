import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

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
  publicationUrl?: string;
};
type BlueskyPostCardProps = {
  post: BlueskyPost;
  locale?: Locale;
};
type Segment = {
  kind: "text" | "mention" | "url";
  value: string;
  href: string;
};

import { t } from "../utils/i18n";
import { formatDate, formatTime } from "../utils/intl";
import type { Locale } from "../utils/i18n";

@Component({
  selector: "bluesky-post-card",
  template: `
    <div class="rdp-bsky-post-frame">
      <div class="rdp-bsky-post__metrics" aria-hidden="false">
        <metrics-bar
          [replies]="post.metrics.replies"
          [reposts]="post.metrics.reposts"
          [likes]="post.metrics.likes"
          [locale]="locale"
        ></metrics-bar>
      </div>
      <article class="rdp-bsky-post">
        <a
          class="rdp-bsky-post__bluesky"
          aria-label="Bluesky"
          rel="noreferrer nofollow noopener"
          target="_blank"
          [attr.href]="publicationUrl"
          ><svg
            viewBox="0 0 600 530"
            width="20"
            height="20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.158 217.613 10 86.535 10 68.825c0-88.687 77.742-60.816 125.72-24.795z"
            ></path></svg
        ></a>
        <header class="rdp-bsky-post__header">
          <a
            class="rdp-bsky-post__avatar"
            rel="noreferrer nofollow noopener"
            target="_blank"
            [attr.aria-label]="post.authorName"
            [attr.href]="profileUrl"
            ><ng-container *ngIf="!!post.authorAvatarUrl"
              ><img alt="" [attr.src]="post.authorAvatarUrl" /></ng-container
          ></a>
          <a
            class="rdp-bsky-post__author"
            rel="noreferrer nofollow noopener"
            target="_blank"
            [attr.href]="profileUrl"
            ><strong>{{post.authorName}}</strong>
            <span class="rdp-bsky-post__handle"
              >{{t('bluesky.handle.prefix')}} {{post.authorHandle}}</span
            ></a
          >
        </header>
        <p class="rdp-bsky-post__body">
          <ng-container *ngFor="let seg of bodySegments"
            ><ng-container
              ><ng-container
                *ngIf="seg.kind === 'text'"
                >{{seg.value}}</ng-container
              >
              <ng-container *ngIf="seg.kind === 'mention'"
                ><a
                  class="rdp-bsky-post__body-link rdp-bsky-post__body-link--mention"
                  rel="noreferrer nofollow noopener"
                  target="_blank"
                  [attr.href]="seg.href"
                  >{{seg.value}}</a
                ></ng-container
              >
              <ng-container *ngIf="seg.kind === 'url'"
                ><a
                  class="rdp-bsky-post__body-link rdp-bsky-post__body-link--url"
                  rel="noreferrer nofollow noopener"
                  target="_blank"
                  [attr.href]="seg.href"
                  >{{seg.value}}</a
                ></ng-container
              ></ng-container
            ></ng-container
          >
        </p>
        <ng-container *ngIf="!!post.hasMedia"
          ><media-placeholder [width]="270" [height]="160"></media-placeholder
        ></ng-container>
        <footer class="rdp-bsky-post__footer">
          <a
            class="rdp-bsky-post__timestamp-link"
            rel="noreferrer nofollow noopener"
            target="_blank"
            [attr.href]="publicationUrl"
            ><time class="rdp-bsky-post__timestamp"
              >{{formatTime(post.publishedAt, locale ?? 'fr-FR')}} ·
              {{formatDate(post.publishedAt, 'longDay', locale ?? 'fr-FR')}}</time
            ></a
          >
        </footer>
      </article>
      <style>
        {{\`
                .rdp-bsky-post-frame {
                  display: flex;
                  flex-direction: column;
                  gap: var(--separation-1);
                }
                .rdp-bsky-post__metrics {
                  display: flex;
                  justify-content: flex-end;
                  padding-right: var(--separation-2);
                }
                .rdp-bsky-post {
                  position: relative;
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
                .rdp-bsky-post__bluesky {
                  position: absolute;
                  top: var(--separation-2);
                  right: var(--separation-2);
                  color: var(--color-brand-bluesky);
                  line-height: 0;
                  text-decoration: none;
                }
                .rdp-bsky-post__header {
                  display: flex;
                  gap: var(--separation-1);
                  align-items: center;
                  font-size: var(--font-size-content);
                  padding-right: 32px;
                }
                .rdp-bsky-post__avatar {
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  background: var(--color-light-grey);
                  overflow: hidden;
                  flex-shrink: 0;
                  display: inline-block;
                  text-decoration: none;
                }
                .rdp-bsky-post__avatar img { width: 100%; height: 100%; object-fit: cover; }
                .rdp-bsky-post__author {
                  display: flex;
                  flex-direction: column;
                  color: inherit;
                  text-decoration: none;
                }
                .rdp-bsky-post__author:hover strong { text-decoration: underline; }
                .rdp-bsky-post__handle {
                  color: var(--color-light-grey);
                  font-size: var(--font-size-publication-date);
                }
                .rdp-bsky-post__body { margin: 0; white-space: pre-line; }
                .rdp-bsky-post__body-link,
                .rdp-bsky-post__body-link:link,
                .rdp-bsky-post__body-link:visited,
                .rdp-bsky-post__body-link:hover,
                .rdp-bsky-post__body-link:active {
                  color: var(--color-content-text);
                  text-decoration: underline;
                }
                .rdp-bsky-post__footer {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: var(--font-size-publication-date);
                  color: var(--color-light-grey);
                }
                .rdp-bsky-post__timestamp-link {
                  color: inherit;
                  text-decoration: none;
                }
                .rdp-bsky-post__timestamp-link:hover .rdp-bsky-post__timestamp { text-decoration: underline; }
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
export default class BlueskyPostCard {
  t = t;
  formatDate = formatDate;
  formatTime = formatTime;

  @Input() post!: BlueskyPostCardProps["post"];
  @Input() locale!: BlueskyPostCardProps["locale"];

  get profileUrl() {
    return `https://bsky.app/profile/${this.post.authorHandle}`;
  }
  get publicationUrl() {
    return (
      this.post.publicationUrl ??
      `https://bsky.app/profile/${this.post.authorHandle}`
    );
  }
  get bodySegments() {
    const text = this.post.body ?? "";
    const out: Segment[] = [];
    const re =
      /(https?:\/\/[^\s]+|@[A-Za-z0-9._-]+(?:\.[A-Za-z]{2,})?|[A-Za-z0-9.-]+\.[A-Za-z]{2,}\/[^\s]*)/g;
    let last = 0;
    let m: RegExpExecArray | null = re.exec(text);
    while (m !== null) {
      if (m.index > last) {
        out.push({
          kind: "text",
          value: text.slice(last, m.index),
          href: "",
        });
      }
      const matched = m[0];
      if (matched.charAt(0) === "@") {
        const handle = matched.slice(1).replace(/[.,;:!?)]+$/, "");
        out.push({
          kind: "mention",
          value: `@${handle}`,
          href: `https://bsky.app/profile/${handle}`,
        });
        const trailing = matched.length - 1 - handle.length;
        if (trailing > 0) {
          out.push({
            kind: "text",
            value: matched.slice(matched.length - trailing),
            href: "",
          });
        }
      } else if (matched.charAt(0) === "h") {
        const trimmed = matched.replace(/[.,;:!?)]+$/, "");
        const trailing = matched.length - trimmed.length;
        out.push({
          kind: "url",
          value: trimmed,
          href: trimmed,
        });
        if (trailing > 0) {
          out.push({
            kind: "text",
            value: matched.slice(matched.length - trailing),
            href: "",
          });
        }
      } else {
        const trimmed = matched.replace(/[.,;:!?)]+$/, "");
        const trailing = matched.length - trimmed.length;
        out.push({
          kind: "url",
          value: trimmed,
          href: `https://${trimmed}`,
        });
        if (trailing > 0) {
          out.push({
            kind: "text",
            value: matched.slice(matched.length - trailing),
            href: "",
          });
        }
      }
      last = m.index + matched.length;
      m = re.exec(text);
    }
    if (last < text.length) {
      out.push({
        kind: "text",
        value: text.slice(last),
        href: "",
      });
    }
    return out;
  }
}

@NgModule({
  declarations: [BlueskyPostCard],
  imports: [CommonModule, MetricsBarModule, MediaPlaceholderModule],
  exports: [BlueskyPostCard],
})
export class BlueskyPostCardModule {}
