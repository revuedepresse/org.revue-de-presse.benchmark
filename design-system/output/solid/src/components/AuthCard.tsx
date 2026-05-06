import { Show, createSignal, createMemo } from "solid-js";

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
  const [email, setEmail] = createSignal("");

  const [password, setPassword] = createSignal("");

  const [currentPassword, setCurrentPassword] = createSignal("");

  const [newPassword, setNewPassword] = createSignal("");

  const [confirmPassword, setConfirmPassword] = createSignal("");

  const [rememberMe, setRememberMe] = createSignal(false);

  const [tos, setTos] = createSignal(false);

  function submit() {
    const values: Record<string, string | boolean> = {};
    if (props.flow === "login") {
      values.email = email();
      values.password = password();
      values.rememberMe = rememberMe();
    } else if (props.flow === "signup") {
      values.email = email();
      values.password = password();
      values.tos = tos();
    } else if (props.flow === "reset") {
      values.email = email();
    } else if (props.flow === "edit-email") {
      values.email = email();
      values.currentPassword = currentPassword();
    } else if (props.flow === "edit-password") {
      values.currentPassword = currentPassword();
      values.newPassword = newPassword();
      values.confirmPassword = confirmPassword();
    }
    props.onSubmit?.({
      flow: props.flow,
      values,
    });
  }

  return (
    <>
      <section class="rdp-auth-card">
        <Show when={props.flow === "confirm" && !!props.noticeKey}>
          <Notice
            headlineKey={props.noticeKey!.headline}
            bodyKey={props.noticeKey!.body}
          ></Notice>
        </Show>
        <Show when={props.flow !== "confirm"}>
          <div class="rdp-auth-card__panel">
            <h2 class="rdp-auth-card__title">
              {t(`auth.${props.flow}.title`)}
            </h2>
            <Show when={props.flow === "reset"}>
              <p>{t("auth.reset.body")}</p>
            </Show>
            <Show
              when={
                props.flow === "login" ||
                props.flow === "signup" ||
                props.flow === "reset" ||
                props.flow === "edit-email"
              }
            >
              <EmailField
                name="email"
                value={email()}
                onChange={(v) => setEmail(v)}
              ></EmailField>
            </Show>
            <Show when={props.flow === "login"}>
              <PasswordField
                name="password"
                mode="login"
                value={password()}
                onChange={(v) => setPassword(v)}
              ></PasswordField>
              <Checkbox
                name="rememberMe"
                labelKey="auth.remember-me"
                checked={rememberMe()}
                onChange={(v) => setRememberMe(v)}
              ></Checkbox>
            </Show>
            <Show when={props.flow === "signup"}>
              <PasswordField
                name="password"
                mode="new"
                value={password()}
                onChange={(v) => setPassword(v)}
              ></PasswordField>
              <Checkbox
                name="tos"
                labelKey="auth.tos.checkbox-label"
                checked={tos()}
                onChange={(v) => setTos(v)}
              ></Checkbox>
            </Show>
            <Show when={props.flow === "edit-email"}>
              <PasswordField
                name="currentPassword"
                mode="login"
                labelKey="auth.edit-email.current-password-label"
                value={currentPassword()}
                onChange={(v) => setCurrentPassword(v)}
              ></PasswordField>
            </Show>
            <Show when={props.flow === "edit-password"}>
              <PasswordField
                name="currentPassword"
                mode="login"
                labelKey="auth.edit-password.current-label"
                value={currentPassword()}
                onChange={(v) => setCurrentPassword(v)}
              ></PasswordField>
              <PasswordField
                name="newPassword"
                mode="new"
                labelKey="auth.edit-password.new-label"
                value={newPassword()}
                onChange={(v) => setNewPassword(v)}
              ></PasswordField>
              <PasswordField
                name="confirmPassword"
                mode="new"
                labelKey="auth.edit-password.confirm-label"
                value={confirmPassword()}
                onChange={(v) => setConfirmPassword(v)}
                showHelper={false}
              ></PasswordField>
            </Show>
            <Button
              variant="form"
              labelKey={`auth.${props.flow}.submit-label`}
              onClick={(event) => submit()}
            ></Button>
            <Show when={!!props.formErrors && props.formErrors.length > 0}>
              <FormError errors={props.formErrors!}></FormError>
            </Show>
            <Show when={props.flow === "login"}>
              <Link href="#" labelKey="auth.login.forgot-password"></Link>
            </Show>
          </div>
        </Show>
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
    </>
  );
}

export default AuthCard;
