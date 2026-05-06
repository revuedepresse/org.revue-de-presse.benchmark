import { useState } from 'react';
import Logo from '@design-system/components/Logo';
import Icon from '@design-system/components/Icon';
import Button from '@design-system/components/Button';
import Link from '@design-system/components/Link';
import Checkbox from '@design-system/components/Checkbox';
import TextField from '@design-system/components/TextField';
import EmailField from '@design-system/components/EmailField';
import PasswordField from '@design-system/components/PasswordField';
import FieldError from '@design-system/components/FieldError';
import FormError from '@design-system/components/FormError';
import MediaPlaceholder from '@design-system/components/MediaPlaceholder';
import spriteUrl from '@icons/sprite.svg?url';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tos, setTos] = useState(false);
  const [showError, setShowError] = useState(false);

  return (
    <main>
      <object data={spriteUrl} type="image/svg+xml" style={{ display: 'none' }} />

      <header><Logo showWordmark /></header>

      <section>
        <h2>Buttons</h2>
        <Button variant="primary" label="Connexion" icon="pick-day" />
        <Button variant="secondary" label="Avril 2021" />
        <Button variant="form" label="S'inscrire" />
        <Button variant="quit" label="Quitter" iconAfter="next-item" />
        <Button variant="scrollTop" icon="next-day" ariaLabel="Remonter" />
      </section>

      <section>
        <h2>Form</h2>
        <EmailField name="email" value={email} onChange={setEmail} />
        <PasswordField name="password" value={password} mode="login" onChange={setPassword} />
        <Checkbox name="tos" checked={tos} onChange={setTos} labelKey="auth.tos.checkbox-label" />
        {showError ? (
          <FormError
            errors={[
              { key: 'errors.password.too-short', vars: { min: 15 } },
              { key: 'errors.tos.not-accepted' },
            ]}
          />
        ) : null}
        <Button variant="form" label="Tester l'erreur" onClick={() => setShowError(true)} />
      </section>

      <section>
        <h2>Misc</h2>
        <Link href="https://revue-de-presse.org" external label="revue-de-presse.org" />
        <Icon name="heart" />
        <Icon name="share" />
        <FieldError messageKey="errors.email.invalid" />
        <MediaPlaceholder width={270} height={160} />
      </section>

      <style>{`
        body { margin: 0; background: var(--color-taupe-grey); font-family: 'Roboto', sans-serif; }
        main { padding: var(--separation-3); display: grid; gap: var(--separation-3); }
        section { display: flex; flex-direction: column; gap: var(--separation-2); align-items: flex-start; }
        h2 { margin: 0; font-family: 'Signika', sans-serif; color: var(--color-content-text); }
      `}</style>
    </main>
  );
}
