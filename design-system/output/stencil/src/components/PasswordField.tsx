import { t } from "../utils/i18n";
import { MIN_LENGTH_NO_MFA } from "../utils/password";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";

@Component({
  tag: "password-field",
})
export class PasswordField {
  @Prop() error: any;
  @Prop() name: any;
  @Prop() labelKey: any;
  @Prop() mode: any;
  @Prop() value: any;
  @Event() change: any;
  @Prop() showHelper: any;

  componentDidLoad() {}

  render() {
    return (
      <div class="rdp-textfield" data-error={this.error ? "true" : undefined}>
        <label class="rdp-textfield__label" for={`field-${this.name}`}>
          {t(this.labelKey ?? "auth.password-label")}
        </label>
        <input
          type="password"
          id={`field-${this.name}`}
          autocomplete={
            this.mode === "new" ? "new-password" : "current-password"
          }
          name={this.name}
          value={this.value}
          onInput={(event) => this.change?.(event.target.value)}
        />
        {this.showHelper ?? this.mode === "new" ? (
          <p class="rdp-textfield__helper">
            {t("auth.password.helper-text", {
              min: MIN_LENGTH_NO_MFA,
            })}
          </p>
        ) : null}
        <style>{`
        .rdp-textfield { display: flex; flex-direction: column; gap: 4px; font-family: 'Roboto', sans-serif; }
        .rdp-textfield__label {
          font-size: var(--font-size-publication-date);
          color: var(--color-content-text);
          padding-left: var(--separation-1);
        }
        .rdp-textfield__helper {
          font-size: var(--font-size-publication-date);
          color: var(--color-light-grey);
          padding-left: var(--separation-1);
          margin: 0;
        }
        .rdp-textfield input {
          padding: var(--separation-1) var(--separation-2);
          border: 1px solid var(--input-border-default);
          background: var(--input-bg-default);
          color: var(--input-fg-default);
          border-radius: var(--radius-default);
          font-size: var(--font-size-content);
        }
        .rdp-textfield[data-error="true"] input { border-color: var(--input-border-error); }
      `}</style>
      </div>
    );
  }
}
