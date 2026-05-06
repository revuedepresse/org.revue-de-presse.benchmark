import { t } from "../utils/i18n";
import { Icon } from "./Icon";

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
          <icon name="reply" size={24} decorative={true}></icon>
        </button>
        <button
          class="rdp-web-intents__btn"
          type="button"
          aria-label={t("web-intents.repost.aria-label")}
          onClick={() => this.repost?.(this.postId)}
        >
          <icon name="retweet" size={24} decorative={true}></icon>
        </button>
        <button
          class="rdp-web-intents__btn"
          type="button"
          aria-label={t("web-intents.like.aria-label")}
          onClick={() => this.like?.(this.postId)}
        >
          <icon name="like-intent" size={24} decorative={true}></icon>
        </button>
        <button
          class="rdp-web-intents__btn"
          type="button"
          aria-label={t("web-intents.share.aria-label")}
          onClick={() => this.share?.(this.postId)}
        >
          <icon name="share" size={24} decorative={true}></icon>
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
}
