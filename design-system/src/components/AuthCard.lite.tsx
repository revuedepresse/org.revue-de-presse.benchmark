import { useStore } from '@builder.io/mitosis';
import { t } from '../utils/i18n';
import Button from './Button.lite';
import EmailField from './EmailField.lite';
import PasswordField from './PasswordField.lite';
import Checkbox from './Checkbox.lite';
import FormError from './FormError.lite';
import Notice from './Notice.lite';
import Link from './Link.lite';
import type { ErrorMessage } from '../types';

type Flow = 'login' | 'signup' | 'reset' | 'edit-email' | 'edit-password' | 'confirm';

type AuthCardProps = {
  flow: Flow;
  formErrors?: ErrorMessage[];
  noticeKey?: { headline: string; body: string };
  onSubmit?: (payload: { flow: Flow; values: Record<string, string | boolean> }) => void;
};

export default function AuthCard(props: AuthCardProps) {
  const state = useStore({
    email: '',
    password: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    rememberMe: false,
    tos: false,
    submit() {
      const values: Record<string, string | boolean> = {};
      if (props.flow === 'login') {
        values.email = state.email;
        values.password = state.password;
        values.rememberMe = state.rememberMe;
      } else if (props.flow === 'signup') {
        values.email = state.email;
        values.password = state.password;
        values.tos = state.tos;
      } else if (props.flow === 'reset') {
        values.email = state.email;
      } else if (props.flow === 'edit-email') {
        values.email = state.email;
        values.currentPassword = state.currentPassword;
      } else if (props.flow === 'edit-password') {
        values.currentPassword = state.currentPassword;
        values.newPassword = state.newPassword;
        values.confirmPassword = state.confirmPassword;
      }
      props.onSubmit?.({ flow: props.flow, values });
    },
  });

  return (
    <section class="rdp-auth-card">
      <Show when={props.flow === 'confirm' && !!props.noticeKey}>
        <Notice headlineKey={props.noticeKey!.headline} bodyKey={props.noticeKey!.body} />
      </Show>
      <Show when={props.flow !== 'confirm'}>
        <div class="rdp-auth-card__panel">
          <h2 class="rdp-auth-card__title">{t(`auth.${props.flow}.title`)}</h2>

          <Show when={props.flow === 'reset'}>
            <p>{t('auth.reset.body')}</p>
          </Show>

          <Show
            when={
              props.flow === 'login' ||
              props.flow === 'signup' ||
              props.flow === 'reset' ||
              props.flow === 'edit-email'
            }
          >
            <EmailField
              name="email"
              value={state.email}
              onChange={(v: string) => (state.email = v)}
            />
          </Show>

          <Show when={props.flow === 'login'}>
            <PasswordField
              name="password"
              value={state.password}
              mode="login"
              onChange={(v: string) => (state.password = v)}
            />
            <Checkbox
              name="rememberMe"
              checked={state.rememberMe}
              onChange={(v: boolean) => (state.rememberMe = v)}
              labelKey="auth.remember-me"
            />
          </Show>

          <Show when={props.flow === 'signup'}>
            <PasswordField
              name="password"
              value={state.password}
              mode="new"
              onChange={(v: string) => (state.password = v)}
            />
            <Checkbox
              name="tos"
              checked={state.tos}
              onChange={(v: boolean) => (state.tos = v)}
              labelKey="auth.tos.checkbox-label"
            />
          </Show>

          <Show when={props.flow === 'edit-email'}>
            <PasswordField
              name="currentPassword"
              value={state.currentPassword}
              mode="login"
              onChange={(v: string) => (state.currentPassword = v)}
              labelKey="auth.edit-email.current-password-label"
            />
          </Show>

          <Show when={props.flow === 'edit-password'}>
            <PasswordField
              name="currentPassword"
              value={state.currentPassword}
              mode="login"
              onChange={(v: string) => (state.currentPassword = v)}
              labelKey="auth.edit-password.current-label"
            />
            <PasswordField
              name="newPassword"
              value={state.newPassword}
              mode="new"
              onChange={(v: string) => (state.newPassword = v)}
              labelKey="auth.edit-password.new-label"
            />
            <PasswordField
              name="confirmPassword"
              value={state.confirmPassword}
              mode="new"
              onChange={(v: string) => (state.confirmPassword = v)}
              labelKey="auth.edit-password.confirm-label"
              showHelper={false}
            />
          </Show>

          <Button
            variant="form"
            labelKey={`auth.${props.flow}.submit-label`}
            onClick={() => state.submit()}
          />

          <Show when={!!props.formErrors && props.formErrors.length > 0}>
            <FormError errors={props.formErrors!} />
          </Show>

          <Show when={props.flow === 'login'}>
            <Link href="#" labelKey="auth.login.forgot-password" />
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
  );
}
