import { t } from "../utils/i18n";

import { Component, h, Fragment, Host, Prop } from "@stencil/core";

@Component({
  tag: "field-error",
})
export class FieldError {
  @Prop() messageKey: any;
  @Prop() message: any;
  @Prop() vars: any;

  componentDidLoad() {}

  render() {
    return (
      <Host>
        {!!(this.messageKey || this.message) ? (
          <p class="rdp-field-error" role="alert">
            {this.messageKey
              ? t(this.messageKey, this.vars)
              : this.message ?? ""}
            <style>{`
          .rdp-field-error {
            font-size: var(--font-size-publication-date);
            color: var(--form-error-fg);
            margin: 0;
            padding-left: var(--separation-1);
            font-family: 'Roboto', sans-serif;
          }
        `}</style>
          </p>
        ) : null}
      </Host>
    );
  }
}
