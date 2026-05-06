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
        ↩
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        [attr.aria-label]="t('web-intents.repost.aria-label')"
        (click)="onRepost?.(postId)"
      >
        🔁
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        [attr.aria-label]="t('web-intents.like.aria-label')"
        (click)="onLike?.(postId)"
      >
        ♡
      </button>
      <button
        type="button"
        class="rdp-web-intents__btn"
        [attr.aria-label]="t('web-intents.share.aria-label')"
        (click)="onShare?.(postId)"
      >
        ↗
      </button>
      <style>
        {{\`
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
  imports: [CommonModule],
  exports: [WebIntents],
})
export class WebIntentsModule {}
