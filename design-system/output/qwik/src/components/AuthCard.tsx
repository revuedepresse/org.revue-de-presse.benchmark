import { ErrorMessage } from "../types";

import { t } from "../utils/i18n";

import Button from "./Button.jsx";

import Checkbox from "./Checkbox.jsx";

import EmailField from "./EmailField.jsx";

import FormError from "./FormError.jsx";

import Link from "./Link.jsx";

import Notice from "./Notice.jsx";

import PasswordField from "./PasswordField.jsx";

import { $, Fragment, component$, h, useStore } from "@builder.io/qwik";

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
export const submit = function submit(props, state) {
  const values: Record<string, string | boolean> = {};
  if (props.flow === "login") {
    values.email = state.email;
    values.password = state.password;
    values.rememberMe = state.rememberMe;
  } else if (props.flow === "signup") {
    values.email = state.email;
    values.password = state.password;
    values.tos = state.tos;
  } else if (props.flow === "reset") {
    values.email = state.email;
  } else if (props.flow === "edit-email") {
    values.email = state.email;
    values.currentPassword = state.currentPassword;
  } else if (props.flow === "edit-password") {
    values.currentPassword = state.currentPassword;
    values.newPassword = state.newPassword;
    values.confirmPassword = state.confirmPassword;
  }
  props.onSubmit?.({
    flow: props.flow,
    values,
  });
};
export const AuthCard = component$((props: AuthCardProps) => {
  const state = useStore<any>({
    confirmPassword: "",
    currentPassword: "",
    email: "",
    newPassword: "",
    password: "",
    rememberMe: false,
    tos: false,
  });

  return (
    <section class="rdp-auth-card">
      {props.flow === "confirm" && !!props.noticeKey ? (
        <Notice
          headlineKey={(() => {
            props.noticeKey!.headline;
          })()}
          bodyKey={(() => {
            props.noticeKey!.body;
          })()}
        ></Notice>
      ) : null}
      {props.flow !== "confirm" ? (
        <div class="rdp-auth-card__panel">
          <h2 class="rdp-auth-card__title">{t(`auth.${props.flow}.title`)}</h2>
          {props.flow === "reset" ? <p>{t("auth.reset.body")}</p> : null}
          {props.flow === "login" ||
          props.flow === "signup" ||
          props.flow === "reset" ||
          props.flow === "edit-email" ? (
            <EmailField
              name="email"
              value={state.email}
              onChange$={$((event) => (state.email = v))}
            ></EmailField>
          ) : null}
          {props.flow === "login" ? (
            <>
              <PasswordField
                name="password"
                mode="login"
                value={state.password}
                onChange$={$((event) => (state.password = v))}
              ></PasswordField>
              <Checkbox
                name="rememberMe"
                labelKey="auth.remember-me"
                checked={state.rememberMe}
                onChange$={$((event) => (state.rememberMe = v))}
              ></Checkbox>
            </>
          ) : null}
          {props.flow === "signup" ? (
            <>
              <PasswordField
                name="password"
                mode="new"
                value={state.password}
                onChange$={$((event) => (state.password = v))}
              ></PasswordField>
              <Checkbox
                name="tos"
                labelKey="auth.tos.checkbox-label"
                checked={state.tos}
                onChange$={$((event) => (state.tos = v))}
              ></Checkbox>
            </>
          ) : null}
          {props.flow === "edit-email" ? (
            <PasswordField
              name="currentPassword"
              mode="login"
              labelKey="auth.edit-email.current-password-label"
              value={state.currentPassword}
              onChange$={$((event) => (state.currentPassword = v))}
            ></PasswordField>
          ) : null}
          {props.flow === "edit-password" ? (
            <>
              <PasswordField
                name="currentPassword"
                mode="login"
                labelKey="auth.edit-password.current-label"
                value={state.currentPassword}
                onChange$={$((event) => (state.currentPassword = v))}
              ></PasswordField>
              <PasswordField
                name="newPassword"
                mode="new"
                labelKey="auth.edit-password.new-label"
                value={state.newPassword}
                onChange$={$((event) => (state.newPassword = v))}
              ></PasswordField>
              <PasswordField
                name="confirmPassword"
                mode="new"
                labelKey="auth.edit-password.confirm-label"
                value={state.confirmPassword}
                onChange$={$((event) => (state.confirmPassword = v))}
                showHelper={false}
              ></PasswordField>
            </>
          ) : null}
          <Button
            variant="form"
            labelKey={`auth.${props.flow}.submit-label`}
            onClick$={$((event) => submit(props, state))}
          ></Button>
          {!!props.formErrors && props.formErrors.length > 0 ? (
            <FormError errors={props.formErrors!}></FormError>
          ) : null}
          {props.flow === "login" ? (
            <Link href="#" labelKey="auth.login.forgot-password"></Link>
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
});

export default AuthCard;
