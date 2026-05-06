import { t } from "../utils/i18n";

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
          )}  @click=${(event) => this.onReply?.(this.postId)} >
                ↩
              </button>
        <button  type="button"  aria-label=${t(
          "web-intents.repost.aria-label"
        )}  @click=${(event) => this.onRepost?.(this.postId)} >
                🔁
              </button>
        <button  type="button"  aria-label=${t(
          "web-intents.like.aria-label"
        )}  @click=${(event) => this.onLike?.(this.postId)} >
                ♡
              </button>
        <button  type="button"  aria-label=${t(
          "web-intents.share.aria-label"
        )}  @click=${(event) => this.onShare?.(this.postId)} >
                ↗
              </button>
        <style >${`
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
            `}</style></div>
        `;
  }
}
