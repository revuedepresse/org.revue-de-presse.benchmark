import { t } from "../utils/i18n";
import { Button } from "./Button";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { Checkbox } from "./Checkbox";
import { FormError } from "./FormError";
import { Notice } from "./Notice";
import { Link } from "./Link";
import type { ErrorMessage } from "../types";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
  State,
} from "@stencil/core";

@Component({
  tag: "auth-card",
})
export class AuthCard {
  @Prop() flow: any;
  @Event() submit: any;
  @Prop() noticeKey: any;
  @Prop() formErrors: any;
  @State() email = "";
  @State() password = "";
  @State() currentPassword = "";
  @State() newPassword = "";
  @State() confirmPassword = "";
  @State() rememberMe = false;
  @State() tos = false;

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
    this.submit?.({
      flow: this.flow,
      values,
    });
  }

  componentDidLoad() {}

  render() {
    return (
      <section class="rdp-auth-card">
        {this.flow === "confirm" && !!this.noticeKey ? (
          <notice
            headlineKey={this.noticeKey!.headline}
            bodyKey={this.noticeKey!.body}
          ></notice>
        ) : null}
        {this.flow !== "confirm" ? (
          <div class="rdp-auth-card__panel">
            <h2 class="rdp-auth-card__title">{t(`auth.${this.flow}.title`)}</h2>
            {this.flow === "reset" ? <p>{t("auth.reset.body")}</p> : null}
            {this.flow === "login" ||
            this.flow === "signup" ||
            this.flow === "reset" ||
            this.flow === "edit-email" ? (
              <email-field
                name="email"
                value={this.email}
                onChange={(v) => (this.email = v)}
              ></email-field>
            ) : null}
            {this.flow === "login" ? (
              <Fragment>
                <password-field
                  name="password"
                  mode="login"
                  value={this.password}
                  onChange={(v) => (this.password = v)}
                ></password-field>
                <checkbox
                  name="rememberMe"
                  labelKey="auth.remember-me"
                  checked={this.rememberMe}
                  onChange={(v) => (this.rememberMe = v)}
                ></checkbox>
              </Fragment>
            ) : null}
            {this.flow === "signup" ? (
              <Fragment>
                <password-field
                  name="password"
                  mode="new"
                  value={this.password}
                  onChange={(v) => (this.password = v)}
                ></password-field>
                <checkbox
                  name="tos"
                  labelKey="auth.tos.checkbox-label"
                  checked={this.tos}
                  onChange={(v) => (this.tos = v)}
                ></checkbox>
              </Fragment>
            ) : null}
            {this.flow === "edit-email" ? (
              <password-field
                name="currentPassword"
                mode="login"
                labelKey="auth.edit-email.current-password-label"
                value={this.currentPassword}
                onChange={(v) => (this.currentPassword = v)}
              ></password-field>
            ) : null}
            {this.flow === "edit-password" ? (
              <Fragment>
                <password-field
                  name="currentPassword"
                  mode="login"
                  labelKey="auth.edit-password.current-label"
                  value={this.currentPassword}
                  onChange={(v) => (this.currentPassword = v)}
                ></password-field>
                <password-field
                  name="newPassword"
                  mode="new"
                  labelKey="auth.edit-password.new-label"
                  value={this.newPassword}
                  onChange={(v) => (this.newPassword = v)}
                ></password-field>
                <password-field
                  name="confirmPassword"
                  mode="new"
                  labelKey="auth.edit-password.confirm-label"
                  value={this.confirmPassword}
                  onChange={(v) => (this.confirmPassword = v)}
                  showHelper={false}
                ></password-field>
              </Fragment>
            ) : null}
            <button
              variant="form"
              labelKey={`auth.${this.flow}.submit-label`}
              onClick={() => this.submit()}
            ></button>
            {!!this.formErrors && this.formErrors.length > 0 ? (
              <form-error errors={this.formErrors!}></form-error>
            ) : null}
            {this.flow === "login" ? (
              <link href="#" labelKey="auth.login.forgot-password" />
            ) : null}
          </div>
        ) : null}
        <style>{`
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
      `}</style>
      </section>
    );
  }
}
