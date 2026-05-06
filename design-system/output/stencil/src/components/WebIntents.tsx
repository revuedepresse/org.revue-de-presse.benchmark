import { t } from "../utils/i18n";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";

@Component({
  tag: "web-intents",
})
export class WebIntents {
  @Event() reply: any;
  @Prop() postId: any;
  @Event() repost: any;
  @Event() like: any;
  @Event() share: any;

  componentDidLoad() {}

  render() {
    return (
      <div class="rdp-web-intents">
        <button
          class="rdp-web-intents__btn"
          type="button"
          aria-label={t("web-intents.reply.aria-label")}
          onClick={() => this.reply?.(this.postId)}
        >
          ↩
        </button>
        <button
          class="rdp-web-intents__btn"
          type="button"
          aria-label={t("web-intents.repost.aria-label")}
          onClick={() => this.repost?.(this.postId)}
        >
          🔁
        </button>
        <button
          class="rdp-web-intents__btn"
          type="button"
          aria-label={t("web-intents.like.aria-label")}
          onClick={() => this.like?.(this.postId)}
        >
          ♡
        </button>
        <button
          class="rdp-web-intents__btn"
          type="button"
          aria-label={t("web-intents.share.aria-label")}
          onClick={() => this.share?.(this.postId)}
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
}
