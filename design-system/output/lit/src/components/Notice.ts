import { t } from "../utils/i18n";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type NoticeProps = {
  headlineKey: string;
  bodyKey: string;
  headlineVars?: Record<string, string | number>;
  bodyVars?: Record<string, string | number>;
};

@customElement("my-notice")
export default class Notice extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() headlineKey: any;
  @property() headlineVars: any;
  @property() bodyKey: any;
  @property() bodyVars: any;

  render() {
    return html`

          <div role="status">
          <h2>${t(this.headlineKey, this.headlineVars)}</h2>
          <p>${t(this.bodyKey, this.bodyVars)}</p>
          <style>
            ${`
                  .rdp-notice {
                    background: var(--color-white);
                    padding: var(--separation-3);
                    border-radius: var(--radius-default);
                    font-family: 'Roboto', sans-serif;
                    color: var(--color-content-text);
                    max-width: 360px;
                  }
                  .rdp-notice__headline {
                    margin: 0 0 var(--separation-1);
                    font-family: 'Signika', sans-serif;
                    font-size: var(--font-size-status-text);
                    color: var(--color-vanity-metric-like);
                  }
                  .rdp-notice__body { margin: 0; font-size: var(--font-size-content); }
                `}
          </style>
        </div>

        `;
  }
}
