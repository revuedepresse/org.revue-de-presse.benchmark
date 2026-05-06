import { t } from '../utils/i18n';
import { MIN_LENGTH_NO_MFA } from '../utils/password';

type PasswordFieldProps = {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  mode: 'login' | 'new';
  labelKey?: string;
  error?: boolean;
  showHelper?: boolean;
};

export default function PasswordField(props: PasswordFieldProps) {
  return (
    <div class="rdp-textfield" data-error={props.error ? 'true' : undefined}>
      <label class="rdp-textfield__label" for={`field-${props.name}`}>
        {t(props.labelKey ?? 'auth.password-label')}
      </label>
      <input
        id={`field-${props.name}`}
        type="password"
        autocomplete={props.mode === 'new' ? 'new-password' : 'current-password'}
        name={props.name}
        value={props.value}
        onInput={(event: any) => props.onChange?.(event.target.value)}
      />
      {(props.showHelper ?? props.mode === 'new') && (
        <p class="rdp-textfield__helper">{t('auth.password.helper-text', { min: MIN_LENGTH_NO_MFA })}</p>
      )}
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
