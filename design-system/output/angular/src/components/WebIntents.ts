import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type WebIntentsProps = {
  postId: string;
  onReply?: (id: string) => void;
  onRepost?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
};

import { t } from "../utils/i18n";

@Component({
  selector: "web-intents",
  template: `
    <div class="rdp-web-intents">
      <button
        type="button"
        class="rdp-web-intents__btn"
        [attr.aria-label]="t('web-intents.reply.aria-label')"
        (click)="onReply?.(postId)"
      >
        <icon name="reply" [size]="24" [decorative]="true"></icon>
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        [attr.aria-label]="t('web-intents.repost.aria-label')"
        (click)="onRepost?.(postId)"
      >
        <icon name="retweet" [size]="24" [decorative]="true"></icon>
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        [attr.aria-label]="t('web-intents.like.aria-label')"
        (click)="onLike?.(postId)"
      >
        <icon name="like-intent" [size]="24" [decorative]="true"></icon>
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        [attr.aria-label]="t('web-intents.share.aria-label')"
        (click)="onShare?.(postId)"
      >
        <icon name="share" [size]="24" [decorative]="true"></icon>
      </button>
      <style>
        {{\`
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
export default class WebIntents {
  t = t;

  @Input() onReply!: WebIntentsProps["onReply"];
  @Input() postId!: WebIntentsProps["postId"];
  @Input() onRepost!: WebIntentsProps["onRepost"];
  @Input() onLike!: WebIntentsProps["onLike"];
  @Input() onShare!: WebIntentsProps["onShare"];
}

@NgModule({
  declarations: [WebIntents],
  imports: [CommonModule, IconModule],
  exports: [WebIntents],
})
export class WebIntentsModule {}
