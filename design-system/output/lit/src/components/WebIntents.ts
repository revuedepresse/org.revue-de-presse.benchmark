import { t } from "../utils/i18n";
import "./Icon.ts";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type WebIntentsProps = {
  postId: string;
  onReply?: (id: string) => void;
  onRepost?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
};

@customElement("web-intents")
export default class WebIntents extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() onReply: any;
  @property() postId: any;
  @property() onRepost: any;
  @property() onLike: any;
  @property() onShare: any;

  render() {
    return html`

          <div ><button  type="button"  aria-label=${t(
            "web-intents.reply.aria-label"
          )}  @click=${(event) =>
      this.onReply?.(
        this.postId
      )} ><my-icon  name="reply"  .size=${24}  .decorative=${true} ></my-icon></button>
        <button  type="button"  aria-label=${t(
          "web-intents.repost.aria-label"
        )}  @click=${(event) =>
      this.onRepost?.(
        this.postId
      )} ><my-icon  name="retweet"  .size=${24}  .decorative=${true} ></my-icon></button>
        <button  type="button"  aria-label=${t(
          "web-intents.like.aria-label"
        )}  @click=${(event) =>
      this.onLike?.(
        this.postId
      )} ><my-icon  name="like-intent"  .size=${24}  .decorative=${true} ></my-icon></button>
        <button  type="button"  aria-label=${t(
          "web-intents.share.aria-label"
        )}  @click=${(event) =>
      this.onShare?.(
        this.postId
      )} ><my-icon  name="share"  .size=${24}  .decorative=${true} ></my-icon></button>
        <style >${`
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
            `}</style></div>
        `;
  }
}
