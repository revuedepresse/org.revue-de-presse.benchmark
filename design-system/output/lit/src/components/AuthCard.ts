import { t } from "../utils/i18n";
import "./Button.ts";
import "./EmailField.ts";
import "./PasswordField.ts";
import "./Checkbox.ts";
import "./FormError.ts";
import "./Notice.ts";
import "./Link.ts";
import type { ErrorMessage } from "../types";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type Flow =
  | "login"
  | "signup"
  | "reset"
  | "edit-email"
  | "edit-password"
  | "confirm";
type AuthCardProps = {
  flow: Flow;
  formErrors?: ErrorMessage[];
  noticeKey?: {
    headline: string;
    body: string;
  };
  onSubmit?: (payload: {
    flow: Flow;
    values: Record<string, string | boolean>;
  }) => void;
};

@customElement("auth-card")
export default class AuthCard extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() flow: any;
  @property() onSubmit: any;
  @property() noticeKey: any;
  @property() formErrors: any;

  @state() email = "";
  @state() password = "";
  @state() currentPassword = "";
  @state() newPassword = "";
  @state() confirmPassword = "";
  @state() rememberMe = false;
  @state() tos = false;

  submit() {
    const values: Record<string, string | boolean> = {};
    if (this.flow === "login") {
      values.email = this.email;
      values.password = this.password;
      values.rememberMe = this.rememberMe;
    } else if (this.flow === "signup") {
      values.email = this.email;
      values.password = this.password;
      values.tos = this.tos;
    } else if (this.flow === "reset") {
      values.email = this.email;
    } else if (this.flow === "edit-email") {
      values.email = this.email;
      values.currentPassword = this.currentPassword;
    } else if (this.flow === "edit-password") {
      values.currentPassword = this.currentPassword;
      values.newPassword = this.newPassword;
      values.confirmPassword = this.confirmPassword;
    }
    this.onSubmit?.({
      flow: this.flow,
      values,
    });
  }

  render() {
    return html`

          <section >${
            this.flow === "confirm" && !!this.noticeKey
              ? html`<my-notice  .headlineKey=${
                  this.noticeKey!.headline
                }  .bodyKey=${this.noticeKey!.body} ></my-notice>`
              : null
          }
        ${
          this.flow !== "confirm"
            ? html`<div ><h2 >${t(`auth.${this.flow}.title`)}</h2>
      ${this.flow === "reset" ? html`<p >${t("auth.reset.body")}</p>` : null}
      ${
        this.flow === "login" ||
        this.flow === "signup" ||
        this.flow === "reset" ||
        this.flow === "edit-email"
          ? html`<email-field  name="email"  .value=${this.email}  @change=${(
              v
            ) => (this.email = v)} ></email-field>`
          : null
      }
      ${
        this.flow === "login"
          ? html`<password-field  name="password"  mode="login"  .value=${
              this.password
            }  @change=${(v) => (this.password = v)} ></password-field>
        <my-checkbox  name="rememberMe"  labelKey="auth.remember-me"  .checked=${
          this.rememberMe
        }  @change=${(v) => (this.rememberMe = v)} ></my-checkbox>`
          : null
      }
      ${
        this.flow === "signup"
          ? html`<password-field  name="password"  mode="new"  .value=${
              this.password
            }  @change=${(v) => (this.password = v)} ></password-field>
        <my-checkbox  name="tos"  labelKey="auth.tos.checkbox-label"  .checked=${
          this.tos
        }  @change=${(v) => (this.tos = v)} ></my-checkbox>`
          : null
      }
      ${
        this.flow === "edit-email"
          ? html`<password-field  name="currentPassword"  mode="login"  labelKey="auth.edit-email.current-password-label"  .value=${
              this.currentPassword
            }  @change=${(v) => (this.currentPassword = v)} ></password-field>`
          : null
      }
      ${
        this.flow === "edit-password"
          ? html`<password-field  name="currentPassword"  mode="login"  labelKey="auth.edit-password.current-label"  .value=${
              this.currentPassword
            }  @change=${(v) => (this.currentPassword = v)} ></password-field>
        <password-field  name="newPassword"  mode="new"  labelKey="auth.edit-password.new-label"  .value=${
          this.newPassword
        }  @change=${(v) => (this.newPassword = v)} ></password-field>
        <password-field  name="confirmPassword"  mode="new"  labelKey="auth.edit-password.confirm-label"  .value=${
          this.confirmPassword
        }  @change=${(v) =>
              (this.confirmPassword =
                v)}  .showHelper=${false} ></password-field>`
          : null
      }
      <my-button  variant="form"  .labelKey=${`auth.${this.flow}.submit-label`}  @click=${(
                event
              ) => this.submit()} ></my-button>
      ${
        !!this.formErrors && this.formErrors.length > 0
          ? html`<form-error  .errors=${this.formErrors!} ></form-error>`
          : null
      }
      ${
        this.flow === "login"
          ? html`<my-link  href="#"  labelKey="auth.login.forgot-password" ></my-link>`
          : null
      }</div>`
            : null
        }
        <style >${`
              .rdp-auth-card { display: grid; gap: var(--separation-2); }
              .rdp-auth-card__panel {
                background: var(--color-white);
                padding: var(--separation-3);
                border-radius: var(--radius-default);
                display: grid;
                gap: var(--separation-1);
                font-family: 'Roboto', sans-serif;
              }
              .rdp-auth-card__title {
                margin: 0;
                font-family: 'Signika', sans-serif;
                color: var(--color-content-text);
                text-align: center;
              }
            `}</style></section>
        `;
  }
}
