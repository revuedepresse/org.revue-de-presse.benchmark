/** @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

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
import { t } from "../utils/i18n";
import Button from "./Button";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import Checkbox from "./Checkbox";
import FormError from "./FormError";
import Notice from "./Notice";
import Link from "./Link";
import type { ErrorMessage } from "../types";

function AuthCard(props: AuthCardProps) {
  const [email, setEmail] = useState(() => "");

  const [password, setPassword] = useState(() => "");

  const [currentPassword, setCurrentPassword] = useState(() => "");

  const [newPassword, setNewPassword] = useState(() => "");

  const [confirmPassword, setConfirmPassword] = useState(() => "");

  const [rememberMe, setRememberMe] = useState(() => false);

  const [tos, setTos] = useState(() => false);

  function submit() {
    const values: Record<string, string | boolean> = {};
    if (props.flow === "login") {
      values.email = email;
      values.password = password;
      values.rememberMe = rememberMe;
    } else if (props.flow === "signup") {
      values.email = email;
      values.password = password;
      values.tos = tos;
    } else if (props.flow === "reset") {
      values.email = email;
    } else if (props.flow === "edit-email") {
      values.email = email;
      values.currentPassword = currentPassword;
    } else if (props.flow === "edit-password") {
      values.currentPassword = currentPassword;
      values.newPassword = newPassword;
      values.confirmPassword = confirmPassword;
    }
    props.onSubmit?.({
      flow: props.flow,
      values,
    });
  }

  return (
    <section className="rdp-auth-card">
      {props.flow === "confirm" && !!props.noticeKey ? (
        <Notice
          headlineKey={props.noticeKey!.headline}
          bodyKey={props.noticeKey!.body}
        />
      ) : null}
      {props.flow !== "confirm" ? (
        <div className="rdp-auth-card__panel">
          <h2 className="rdp-auth-card__title">
            {t(`auth.${props.flow}.title`)}
          </h2>
          {props.flow === "reset" ? <p>{t("auth.reset.body")}</p> : null}
          {props.flow === "login" ||
          props.flow === "signup" ||
          props.flow === "reset" ||
          props.flow === "edit-email" ? (
            <EmailField
              name="email"
              value={email}
              onChange={(v) => setEmail(v)}
            />
          ) : null}
          {props.flow === "login" ? (
            <Fragment>
              <PasswordField
                name="password"
                mode="login"
                value={password}
                onChange={(v) => setPassword(v)}
              />
              <Checkbox
                name="rememberMe"
                labelKey="auth.remember-me"
                checked={rememberMe}
                onChange={(v) => setRememberMe(v)}
              />
            </Fragment>
          ) : null}
          {props.flow === "signup" ? (
            <Fragment>
              <PasswordField
                name="password"
                mode="new"
                value={password}
                onChange={(v) => setPassword(v)}
              />
              <Checkbox
                name="tos"
                labelKey="auth.tos.checkbox-label"
                checked={tos}
                onChange={(v) => setTos(v)}
              />
            </Fragment>
          ) : null}
          {props.flow === "edit-email" ? (
            <PasswordField
              name="currentPassword"
              mode="login"
              labelKey="auth.edit-email.current-password-label"
              value={currentPassword}
              onChange={(v) => setCurrentPassword(v)}
            />
          ) : null}
          {props.flow === "edit-password" ? (
            <Fragment>
              <PasswordField
                name="currentPassword"
                mode="login"
                labelKey="auth.edit-password.current-label"
                value={currentPassword}
                onChange={(v) => setCurrentPassword(v)}
              />
              <PasswordField
                name="newPassword"
                mode="new"
                labelKey="auth.edit-password.new-label"
                value={newPassword}
                onChange={(v) => setNewPassword(v)}
              />
              <PasswordField
                name="confirmPassword"
                mode="new"
                labelKey="auth.edit-password.confirm-label"
                value={confirmPassword}
                onChange={(v) => setConfirmPassword(v)}
                showHelper={false}
              />
            </Fragment>
          ) : null}
          <Button
            variant="form"
            labelKey={`auth.${props.flow}.submit-label`}
            onClick={(event) => submit()}
          />
          {!!props.formErrors && props.formErrors.length > 0 ? (
            <FormError errors={props.formErrors!} />
          ) : null}
          {props.flow === "login" ? (
            <Link href="#" labelKey="auth.login.forgot-password" />
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

export default AuthCard;
