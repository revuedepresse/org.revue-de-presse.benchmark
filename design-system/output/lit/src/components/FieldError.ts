import { t } from "../utils/i18n";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type FieldErrorProps = {
  messageKey?: string;
  message?: string;
  vars?: Record<string, string | number>;
};

@customElement("field-error")
export default class FieldError extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() messageKey: any;
  @property() message: any;
  @property() vars: any;

  render() {
    return html`

          ${
            !!(this.messageKey || this.message)
              ? html`
      <p role="alert">
        ${
          this.messageKey
            ? html`${t(this.messageKey, this.vars)}`
            : html`${this.message ?? ""}`
        }
        <style>
          ${`
                      .rdp-field-error {
                        font-size: var(--font-size-publication-date);
                        color: var(--form-error-fg);
                        margin: 0;
                        padding-left: var(--separation-1);
                        font-family: 'Roboto', sans-serif;
                      }
                    `}
        </style>
      </p>
      `
              : null
          }

        `;
  }
}
