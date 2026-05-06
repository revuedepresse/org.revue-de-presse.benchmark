import { t } from "../utils/i18n";
import type { ErrorMessage } from "../types";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type FormErrorProps = {
  errors: ErrorMessage[];
};

@customElement("form-error")
export default class FormError extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() errors: any;

  get items() {
    return (this.errors ?? []).map((e) => ({
      key: e.key,
      text: t(e.key, e.vars),
    }));
  }
  get prefix() {
    return (this.errors ?? []).length > 1 ? "- " : "";
  }

  render() {
    return html`

          ${
            this.items.length > 0
              ? html`
       <div role="alert" aria-live="polite">
         ${this.items?.map(
           (item, index) => html`
          <p>${this.prefix} ${item.text}</p>
          `
         )}
         <style>
           ${`
                      .rdp-form-error {
                        color: var(--form-error-fg);
                        font-size: var(--font-size-publication-date);
                        font-family: 'Roboto', sans-serif;
                        margin-top: var(--separation-1);
                      }
                      .rdp-form-error__item { margin: 0; }
                    `}
         </style>
       </div>
       `
              : null
          }

        `;
  }
}
