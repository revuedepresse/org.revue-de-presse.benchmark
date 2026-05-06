import { t } from "../utils/i18n";
import type { ErrorMessage } from "../types";

import { Component, h, Fragment, Host, Prop } from "@stencil/core";

@Component({
  tag: "form-error",
})
export class FormError {
  @Prop() errors: any;

  get items() {
    return (this.errors ?? []).map((e) => ({
      key: e.key,
      text: t(e.key, e.vars),
    }));
  }
  get prefix() {
    return (this.errors ?? []).length > 1 ? "- " : "";
  }

  componentDidLoad() {}

  render() {
    return (
      <Host>
        {this.items.length > 0 ? (
          <div class="rdp-form-error" role="alert" aria-live="polite">
            {this.items?.map((item) => (
              <p class="rdp-form-error__item">
                {this.prefix}
                {item.text}
              </p>
            ))}
            <style>{`
          .rdp-form-error {
            color: var(--form-error-fg);
            font-size: var(--font-size-publication-date);
            font-family: 'Roboto', sans-serif;
            margin-top: var(--separation-1);
          }
          .rdp-form-error__item { margin: 0; }
        `}</style>
          </div>
        ) : null}
      </Host>
    );
  }
}
