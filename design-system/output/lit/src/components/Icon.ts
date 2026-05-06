import type { IconName } from "../types";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type IconProps = {
  name: IconName;
  size?: 24 | 32;
  ariaLabel?: string;
  decorative?: boolean;
};

@customElement("my-icon")
export default class Icon extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() size: any;
  @property() decorative: any;
  @property() ariaLabel: any;
  @property() name: any;

  render() {
    return html`

          <svg  viewBox="0 0 24 24"  .width=${this.size ?? 24}  .height=${
      this.size ?? 24
    }  aria-hidden=${
      this.decorative ?? !this.ariaLabel ? "true" : undefined
    }  aria-label=${
      this.decorative ?? !this.ariaLabel ? undefined : this.ariaLabel
    }  .role=${
      this.decorative ?? !this.ariaLabel ? undefined : "img"
    } ><use  .href=${`#${this.name}`} ></use>
        <style >${`
              .rdp-icon { display: inline-block; vertical-align: middle; color: currentColor; }
            `}</style></svg>
        `;
  }
}
