# Mitosis Design System — M3 Organisms + Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the **8 organisms** (Calendar, SnapshotsList, BlueskyPostCard, Banner.About, AppHeader, Sidebar, AuthCard, Footer), wire **zxcvbn-ts** + **Pwned Passwords** API into `PasswordField`, ship the **visual regression baseline** against the demo Vue app, and add the **edit-password confirm field** decision from spec §2.2 finding #7.

**Architecture:** Organisms compose only atoms (M1) and molecules (M2). They hold light internal state (`Calendar.viewMode`, `AuthCard.flow`) via small TS reducers. The `PasswordField` gains an async validation pipeline that lazily imports zxcvbn-ts and calls the Pwned Passwords k-anonymity API. Visual regression uses Playwright snapshot tests against the demo app at predetermined component states. The edit-password form uses three fields: current + new + confirm.

**Tech Stack:** Same as M2 (Mitosis, Vitest, Vite, Histoire) plus `@zxcvbn-ts/core`, `@zxcvbn-ts/language-common`, `@zxcvbn-ts/language-fr`, `@zxcvbn-ts/language-en`, Playwright (`@playwright/test`).

**Prerequisite:** M1 + M2 plans complete and merged. The 11 atoms + 8 molecules emit cleanly to React, Vue, Svelte, Solid, Lit. `DesignSystemProvider` exists per target.

**Companion spec:** `docs/superpowers/specs/2026-05-06-mitosis-design-system-design.md`. M3 implements §3 tier-3 organisms, §7 password rules in full, §8.2 visual regression, and §2.2 finding #7 (add confirm field).

---

## File structure produced by this plan

```
design-system/
├── src/
│   ├── components/
│   │   ├── (M1 atoms + M2 molecules unchanged)
│   │   ├── Calendar.lite.tsx           # NEW (organism, composes pickers + action bar)
│   │   ├── SnapshotsList.lite.tsx      # NEW
│   │   ├── BlueskyPostCard.lite.tsx    # NEW
│   │   ├── BannerAbout.lite.tsx        # NEW
│   │   ├── AppHeader.lite.tsx          # NEW
│   │   ├── Sidebar.lite.tsx            # NEW
│   │   ├── AuthCard.lite.tsx           # NEW
│   │   ├── Footer.lite.tsx             # NEW
│   │   ├── PasswordField.lite.tsx      # MODIFIED: async zxcvbn + Pwned pipeline
│   │   └── index.ts                    # MODIFIED: re-export organisms
│   ├── utils/
│   │   ├── password.ts                 # MODIFIED: full pipeline (zxcvbn + Pwned)
│   │   └── pwned-passwords.ts          # NEW: k-anonymity client
│   └── locales/
│       ├── fr-FR.json                  # MODIFIED: add organism keys
│       └── en-GB.json                  # MODIFIED: add organism keys
├── tests/
│   ├── unit/
│   │   ├── (M1 + M2 unchanged)
│   │   ├── Calendar.test.ts            # NEW
│   │   ├── SnapshotsList.test.ts       # NEW
│   │   ├── BlueskyPostCard.test.ts     # NEW
│   │   ├── BannerAbout.test.ts         # NEW
│   │   ├── AppHeader.test.ts           # NEW
│   │   ├── Sidebar.test.ts             # NEW
│   │   ├── AuthCard.test.ts            # NEW
│   │   ├── Footer.test.ts              # NEW
│   │   ├── pwned-passwords.test.ts     # NEW
│   │   └── password-pipeline.test.ts   # NEW
│   └── visual/                         # NEW: Playwright snapshot suite
│       ├── playwright.config.ts
│       ├── snapshots/
│       └── atoms.spec.ts
└── apps/demo/src/                      # MODIFIED: add organism showcases
    └── App.vue
```

---

## Task 1: Add zxcvbn-ts as a peer dependency

**Files:**
- Modify: `design-system/package.json`

- [ ] **Step 1: Add peer + dev dependencies**

Update `design-system/package.json` `peerDependencies` (add the property if absent) and `devDependencies`:

```json
{
  "peerDependencies": {
    "@zxcvbn-ts/core": "^3",
    "@zxcvbn-ts/language-common": "^3",
    "@zxcvbn-ts/language-fr": "^3",
    "@zxcvbn-ts/language-en": "^3"
  },
  "devDependencies": {
    "...": "...",
    "@zxcvbn-ts/core": "^3.0.4",
    "@zxcvbn-ts/language-common": "^3.0.4",
    "@zxcvbn-ts/language-fr": "^3.0.4",
    "@zxcvbn-ts/language-en": "^3.0.4",
    "@playwright/test": "^1.47.0"
  }
}
```

- [ ] **Step 2: Install**

```bash
pnpm install
```

- [ ] **Step 3: Commit**

```bash
git add design-system/package.json design-system/pnpm-lock.yaml
git commit -m "feat(design-system): add zxcvbn-ts and playwright as deps"
```

---

## Task 2: Pwned Passwords k-anonymity client

**Files:**
- Create: `design-system/src/utils/pwned-passwords.ts`
- Create: `design-system/tests/unit/pwned-passwords.test.ts`

- [ ] **Step 1: Write the failing test**

Write to `design-system/tests/unit/pwned-passwords.test.ts`:

```ts
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { isBreached } from '../../src/utils/pwned-passwords';

const ORIGINAL_FETCH = globalThis.fetch;

describe('isBreached', () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { globalThis.fetch = ORIGINAL_FETCH; });

  it('returns true when the SHA-1 suffix is in the response', async () => {
    // 'password' SHA-1 = 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8 → prefix 5BAA6, suffix 1E4C9B93F3F0682250B6CF8331B7EE68FD8
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '003D68EB55068C33ACE09247EE4C639306B:5\r\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:1234\r\nFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:1',
    } as Response);
    const result = await isBreached('password');
    expect(result).toEqual({ breached: true, count: 1234 });
  });

  it('returns false when the suffix is absent', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:1\r\nBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB:2',
    } as Response);
    expect(await isBreached('a-novel-passphrase-of-substantial-length')).toEqual({ breached: false });
  });

  it('returns { error: "fetch-failed" } when network errors', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network'));
    expect(await isBreached('whatever')).toEqual({ error: 'fetch-failed' });
  });

  it('uses the k-anonymity endpoint with first 5 hex chars', async () => {
    const spy = vi.fn().mockResolvedValue({ ok: true, text: async () => '' } as Response);
    globalThis.fetch = spy;
    await isBreached('password');
    expect(spy).toHaveBeenCalledWith('https://api.pwnedpasswords.com/range/5BAA6', expect.any(Object));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
pnpm test tests/unit/pwned-passwords.test.ts
```

Expected: FAIL — module missing.

- [ ] **Step 3: Write `src/utils/pwned-passwords.ts`**

Write to `design-system/src/utils/pwned-passwords.ts`:

```ts
import { sha1Prefix } from './password';

const ENDPOINT = 'https://api.pwnedpasswords.com/range/';

export type BreachResult =
  | { breached: true; count: number }
  | { breached: false }
  | { error: 'fetch-failed' };

export async function isBreached(value: string, signal?: AbortSignal): Promise<BreachResult> {
  try {
    const fullHashHex = await fullSha1Hex(value);
    const prefix = fullHashHex.slice(0, 5).toUpperCase();
    const suffix = fullHashHex.slice(5).toUpperCase();
    const response = await fetch(`${ENDPOINT}${prefix}`, {
      headers: { 'Add-Padding': 'true' },
      signal,
    });
    if (!response.ok) return { error: 'fetch-failed' };
    const body = await response.text();
    for (const line of body.split(/\r?\n/)) {
      const [hashSuffix, rawCount] = line.split(':');
      if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
        return { breached: true, count: parseInt(rawCount ?? '0', 10) };
      }
    }
    return { breached: false };
  } catch {
    return { error: 'fetch-failed' };
  }
}

async function fullSha1Hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Re-export for callers that already imported from utils/password
export { sha1Prefix };
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
pnpm test tests/unit/pwned-passwords.test.ts
```

Expected: PASS — four tests green.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/utils/pwned-passwords.ts design-system/tests/unit/pwned-passwords.test.ts
git commit -m "feat(design-system): add Pwned Passwords k-anonymity client"
```

---

## Task 3: Full password validation pipeline

**Files:**
- Modify: `design-system/src/utils/password.ts`
- Create: `design-system/tests/unit/password-pipeline.test.ts`

- [ ] **Step 1: Write the failing test**

Write to `design-system/tests/unit/password-pipeline.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import * as zxcvbn from '@zxcvbn-ts/core';
import { validatePassword } from '../../src/utils/password';

describe('validatePassword (full pipeline)', () => {
  it('returns too-short when length below min', async () => {
    const result = await validatePassword('a'.repeat(14), 'no-mfa', { breach: 'skip' });
    expect(result.errors[0]).toMatchObject({ key: 'errors.password.too-short' });
  });

  it('returns weak when zxcvbn score is below 3', async () => {
    vi.spyOn(zxcvbn, 'zxcvbnAsync').mockResolvedValue({ score: 2 } as unknown as Awaited<ReturnType<typeof zxcvbn.zxcvbnAsync>>);
    const result = await validatePassword('passwordpassword', 'no-mfa', { breach: 'skip' });
    expect(result.errors.some((e) => e.key === 'errors.password.weak')).toBe(true);
    vi.restoreAllMocks();
  });

  it('returns ok when length, zxcvbn, and breach all pass', async () => {
    vi.spyOn(zxcvbn, 'zxcvbnAsync').mockResolvedValue({ score: 4 } as unknown as Awaited<ReturnType<typeof zxcvbn.zxcvbnAsync>>);
    const result = await validatePassword('correct-horse-battery-staple-2026', 'no-mfa', { breach: 'skip' });
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
    vi.restoreAllMocks();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
pnpm test tests/unit/password-pipeline.test.ts
```

Expected: FAIL — `validatePassword` does not exist.

- [ ] **Step 3: Modify `src/utils/password.ts`**

Append to the M1 `design-system/src/utils/password.ts` (do not remove the M1 functions):

```ts
import { isBreached } from './pwned-passwords';
import type { ErrorMessage } from '../types';

export type ValidationResult = {
  ok: boolean;
  score?: number;
  errors: ErrorMessage[];
};

export type ValidateOptions = {
  breach?: 'check' | 'skip';
};

export async function validatePassword(
  value: string,
  mode: Mode,
  opts: ValidateOptions = {}
): Promise<ValidationResult> {
  const errors: ErrorMessage[] = [];

  // 1. Length
  const lengthResult = checkLength(value, mode);
  if (!lengthResult.ok) {
    if (lengthResult.code === 'too-short') {
      errors.push({ key: 'errors.password.too-short', vars: { min: lengthResult.min } });
    } else {
      errors.push({ key: 'errors.password.too-long', vars: { max: lengthResult.max } });
    }
    return { ok: false, errors };
  }

  // 2. zxcvbn (lazy import — keeps M1 atoms light)
  const { zxcvbnAsync, zxcvbnOptions } = await import('@zxcvbn-ts/core');
  const langCommon = await import('@zxcvbn-ts/language-common');
  const langFr = await import('@zxcvbn-ts/language-fr');
  const langEn = await import('@zxcvbn-ts/language-en');
  zxcvbnOptions.setOptions({
    translations: langEn.translations,
    dictionary: { ...langCommon.dictionary, ...langFr.dictionary, ...langEn.dictionary },
    graphs: langCommon.adjacencyGraphs,
  });
  const z = await zxcvbnAsync(value);
  if (z.score < 3) {
    errors.push({ key: 'errors.password.weak', vars: { score: z.score } });
  }

  if (errors.length > 0) return { ok: false, score: z.score, errors };

  // 3. Pwned Passwords
  if (opts.breach !== 'skip') {
    const breach = await isBreached(value);
    if ('breached' in breach && breach.breached) {
      errors.push({ key: 'errors.password.breached' });
      return { ok: false, score: z.score, errors };
    }
  }

  return { ok: true, score: z.score, errors: [] };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
pnpm test tests/unit/password-pipeline.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/utils/password.ts design-system/tests/unit/password-pipeline.test.ts
git commit -m "feat(design-system): add full password validation pipeline (length + zxcvbn + Pwned)"
```

---

## Task 4: Wire validation into `PasswordField`

**Files:**
- Modify: `design-system/src/components/PasswordField.lite.tsx`
- Modify: `design-system/tests/unit/PasswordField.test.ts`

- [ ] **Step 1: Update the PasswordField source**

Replace `design-system/src/components/PasswordField.lite.tsx` with:

```tsx
import { useStore } from '@builder.io/mitosis';
import { t } from '../utils/i18n';
import { MIN_LENGTH_NO_MFA, validatePassword } from '../utils/password';
import type { ErrorMessage } from '../types';

type PasswordFieldProps = {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  mode: 'login' | 'new';
  labelKey?: string;
  showHelper?: boolean;
  onValidationChange?: (state: { ok: boolean; score?: number; errors: ErrorMessage[] }) => void;
  validateBreached?: boolean;
};

export default function PasswordField(props: PasswordFieldProps) {
  const state = useStore({
    score: undefined as number | undefined,
    errors: [] as ErrorMessage[],
    debounceTimer: null as ReturnType<typeof setTimeout> | null,
    pendingBlur: false,
    async runSyncValidation(v: string) {
      // Length + zxcvbn only; breach check waits for blur
      const result = await validatePassword(v, 'no-mfa', { breach: 'skip' });
      state.score = result.score;
      state.errors = result.errors;
      props.onValidationChange?.(result);
    },
    async runBlurValidation(v: string) {
      const breachOpt = props.validateBreached === false ? 'skip' : 'check';
      const result = await validatePassword(v, 'no-mfa', { breach: breachOpt });
      state.score = result.score;
      state.errors = result.errors;
      props.onValidationChange?.(result);
    },
    onInput(value: string) {
      props.onChange?.(value);
      if (props.mode !== 'new') return;
      if (state.debounceTimer) clearTimeout(state.debounceTimer);
      state.debounceTimer = setTimeout(() => state.runSyncValidation(value), 200);
    },
    onBlur() {
      if (props.mode !== 'new') return;
      state.runBlurValidation(props.value);
    },
  });

  const labelText = t(props.labelKey ?? 'auth.password-label');
  const helperText = t('auth.password.helper-text', { min: MIN_LENGTH_NO_MFA });
  const helperVisible = (props.showHelper ?? props.mode === 'new');
  const isError = state.errors.length > 0;

  return (
    <div class="rdp-textfield" data-error={isError ? 'true' : undefined}>
      <label class="rdp-textfield__label" for={`field-${props.name}`}>
        {labelText}
      </label>
      <input
        id={`field-${props.name}`}
        type="password"
        autocomplete={props.mode === 'new' ? 'new-password' : 'current-password'}
        name={props.name}
        value={props.value}
        onInput={(event) => state.onInput((event.target as HTMLInputElement).value)}
        onBlur={() => state.onBlur()}
      />
      {helperVisible && (
        <p class="rdp-textfield__helper">{helperText}</p>
      )}
      {state.score !== undefined && props.mode === 'new' && (
        <progress
          class="rdp-textfield__strength"
          max="4"
          value={state.score}
          aria-label={`zxcvbn ${state.score}/4`}
        />
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
        .rdp-textfield__strength { width: 100%; height: 4px; }
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
```

- [ ] **Step 2: Update the PasswordField emit-test**

Replace the body of `design-system/tests/unit/PasswordField.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('PasswordField (post-Mitosis emit)', () => {
  for (const target of ['vue', 'react', 'svelte', 'solid', 'lit']) {
    it(`emits a ${target} component with onBlur and a strength meter`, () => {
      const ext = target === 'vue' ? 'vue' : target === 'svelte' ? 'svelte' : target === 'lit' ? 'ts' : 'tsx';
      const path = join(root, `output/${target}/src/components/PasswordField.${ext}`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, 'utf8');
      expect(src).toMatch(/blur/i);
      expect(src).toMatch(/progress|score/i);
    });
  }
});
```

- [ ] **Step 3: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/PasswordField.test.ts
```

Expected: PASS — 5 targets.

- [ ] **Step 4: Commit**

```bash
git add design-system/src/components/PasswordField.lite.tsx design-system/tests/unit/PasswordField.test.ts design-system/output
git commit -m "feat(design-system): wire zxcvbn + Pwned validation into PasswordField"
```

---

## Task 5: Add organism i18n keys

**Files:**
- Modify: `design-system/src/locales/fr-FR.json`
- Modify: `design-system/src/locales/en-GB.json`

- [ ] **Step 1: Append organism keys to fr-FR.json**

```json
  ,
  "header.my-space": "Mon espace",
  "header.my-account.aria-label": "Mon compte",
  "footer.about.heading": "À propos",
  "footer.social.heading": "@revue_2_presse",
  "footer.about.body": "Revue de presse s'appuie sur l'API de Bluesky et propose une vue des publications des médias en fonction du succès que ces publications ont rencontré auprès du public.",
  "footer.social.body": "Retrouvez chaque soir les 3 tweets médias ayant été les plus relayés au cours de la journée.",
  "footer.pro-bono.heading": "Pro bono publico",
  "footer.pro-bono.body": "Revue de presse ne reçoit aucun financement. Ce projet est porté par :",
  "footer.copyright": "© {year} · Design by @CcelestinC",
  "auth.login.title": "Se connecter",
  "auth.login.submit": "Connexion",
  "auth.login.forgot-password": "mot de passe oublié ?",
  "auth.login.no-account-question": "Pas de compte ?",
  "auth.login.no-account-cta": "Inscrivez-vous afin d'accéder à vos listes personnalisées.",
  "auth.login.no-account-action": "S'inscrire",
  "auth.signup.title": "Pas de compte ?",
  "auth.signup.subtitle": "Inscrivez-vous afin de configurer des listes personnalisées.",
  "auth.signup.submit": "S'inscrire",
  "auth.signup.already-question": "Déjà inscrit ?",
  "auth.signup.already-cta": "Connectez-vous afin d'accéder à votre espace personnalisé.",
  "auth.signup.already-action": "Connexion",
  "auth.forgot-password.title": "Mot de passe oublié ?",
  "auth.forgot-password.body": "Si votre email est associé à un compte vous allez recevoir un email afin d'avoir un nouveau mot de passe.",
  "auth.forgot-password.submit-label": "Envoyer",
  "auth.new-password.title": "Nouveau mot de passe",
  "auth.new-password.submit-label": "Valider",
  "auth.edit-password.title": "Modifier mon mot de passe",
  "auth.edit-password.current-label": "Ancien mot de passe",
  "auth.edit-password.new-label": "Nouveau mot de passe",
  "auth.edit-password.confirm-label": "Confirmer le nouveau mot de passe",
  "auth.edit-password.submit-label": "Valider",
  "auth.edit-email.title": "Modifier mon email",
  "auth.edit-email.new-label": "Nouvel email",
  "auth.edit-email.current-password-label": "Mot de passe",
  "auth.edit-email.submit-label": "Valider",
  "snapshots-list.empty": "Aucune liste disponible.",
  "bluesky.handle.prefix": "@"
```

- [ ] **Step 2: Append the en-GB equivalents**

```json
  ,
  "header.my-space": "My space",
  "header.my-account.aria-label": "My account",
  "footer.about.heading": "About",
  "footer.social.heading": "@revue_2_presse",
  "footer.about.body": "Revue de presse uses the Bluesky API and provides a view of media publications based on the success they have had with the public.",
  "footer.social.body": "Each evening, see the 3 media posts that were most relayed during the day.",
  "footer.pro-bono.heading": "Pro bono publico",
  "footer.pro-bono.body": "Revue de presse receives no funding. This project is run by:",
  "footer.copyright": "© {year} · Design by @CcelestinC",
  "auth.login.title": "Log in",
  "auth.login.submit": "Log in",
  "auth.login.forgot-password": "forgot password?",
  "auth.login.no-account-question": "No account?",
  "auth.login.no-account-cta": "Sign up to access your personalised lists.",
  "auth.login.no-account-action": "Sign up",
  "auth.signup.title": "No account?",
  "auth.signup.subtitle": "Sign up to configure personalised lists.",
  "auth.signup.submit": "Sign up",
  "auth.signup.already-question": "Already registered?",
  "auth.signup.already-cta": "Log in to access your personalised space.",
  "auth.signup.already-action": "Log in",
  "auth.forgot-password.title": "Forgot password?",
  "auth.forgot-password.body": "If your email is associated with an account you will receive a message to set a new password.",
  "auth.forgot-password.submit-label": "Send",
  "auth.new-password.title": "New password",
  "auth.new-password.submit-label": "Submit",
  "auth.edit-password.title": "Change my password",
  "auth.edit-password.current-label": "Current password",
  "auth.edit-password.new-label": "New password",
  "auth.edit-password.confirm-label": "Confirm new password",
  "auth.edit-password.submit-label": "Submit",
  "auth.edit-email.title": "Change my email",
  "auth.edit-email.new-label": "New email",
  "auth.edit-email.current-password-label": "Password",
  "auth.edit-email.submit-label": "Submit",
  "snapshots-list.empty": "No list available.",
  "bluesky.handle.prefix": "@"
```

- [ ] **Step 3: Run the parity test**

```bash
pnpm test tests/unit/i18n.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add design-system/src/locales
git commit -m "feat(design-system): add i18n keys for M3 organisms (auth + Bluesky + footer)"
```

---

## Task 6: Calendar organism

**Files:**
- Create: `design-system/src/components/Calendar.lite.tsx`
- Create: `design-system/tests/unit/Calendar.test.ts`

- [ ] **Step 1: Write the failing test**

Write to `design-system/tests/unit/Calendar.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('Calendar organism (post-Mitosis emit)', () => {
  it('emits Vue component composing pickers and action bar', () => {
    const path = join(root, 'output/vue/src/components/Calendar.vue');
    expect(existsSync(path)).toBe(true);
    const src = readFileSync(path, 'utf8');
    expect(src).toMatch(/DateGrid|MonthPicker|YearPicker/);
    // viewMode state machine present
    expect(src).toMatch(/viewMode/);
    // presentation prop wired
    expect(src).toMatch(/presentation/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/unit/Calendar.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/Calendar.lite.tsx`**

```tsx
import { useStore } from '@builder.io/mitosis';
import DateGrid from './DateGrid.lite';
import MonthPicker from './MonthPicker.lite';
import YearPicker from './YearPicker.lite';
import CalendarActionBar from './CalendarActionBar.lite';
import type { Locale } from '../utils/i18n';

type CalendarProps = {
  selectedDate: Date;
  locale?: Locale;
  yearRange: { min: number; max: number };
  presentation?: 'inline' | 'sheet';
  onSelect?: (date: Date) => void;
  onDismiss?: () => void;
};

type ViewMode = 'day' | 'month' | 'year';

export default function Calendar(props: CalendarProps) {
  const state = useStore({
    viewMode: 'day' as ViewMode,
    focusedYear: props.selectedDate.getFullYear(),
    focusedMonth: props.selectedDate.getMonth(),
    setView(mode: ViewMode) { state.viewMode = mode; },
    selectDay(d: Date) {
      state.focusedYear = d.getFullYear();
      state.focusedMonth = d.getMonth();
      props.onSelect?.(d);
    },
    selectMonth(idx: number) {
      state.focusedMonth = idx;
      state.viewMode = 'day';
    },
    selectYear(y: number) {
      state.focusedYear = y;
      state.viewMode = 'month';
    },
    prev() {
      if (state.viewMode === 'day') {
        const m = state.focusedMonth - 1;
        if (m < 0) { state.focusedMonth = 11; state.focusedYear -= 1; }
        else state.focusedMonth = m;
      }
    },
    next() {
      if (state.viewMode === 'day') {
        const m = state.focusedMonth + 1;
        if (m > 11) { state.focusedMonth = 0; state.focusedYear += 1; }
        else state.focusedMonth = m;
      }
    },
  });

  const presentation = props.presentation ?? 'inline';

  return (
    <div class={`rdp-calendar rdp-calendar--${presentation}`} role="dialog" aria-modal={presentation === 'sheet' ? 'true' : 'false'}>
      {presentation === 'sheet' && (
        <div class="rdp-calendar__scrim" onClick={() => props.onDismiss?.()} aria-hidden="true" />
      )}
      <div class="rdp-calendar__panel">
        <CalendarActionBar
          date={props.selectedDate}
          locale={props.locale}
          position="top"
          onDateClick={() => state.setView('month')}
          onPrev={() => state.prev()}
          onNext={() => state.next()}
        />
        {state.viewMode === 'day' && (
          <DateGrid
            year={state.focusedYear}
            month={state.focusedMonth}
            selectedDate={props.selectedDate}
            locale={props.locale}
            onSelect={(d) => state.selectDay(d)}
          />
        )}
        {state.viewMode === 'month' && (
          <MonthPicker
            year={state.focusedYear}
            selectedMonth={state.focusedMonth}
            locale={props.locale}
            onSelect={(idx) => state.selectMonth(idx)}
          />
        )}
        {state.viewMode === 'year' && (
          <YearPicker
            yearRange={props.yearRange}
            selectedYear={state.focusedYear}
            onSelect={(y) => state.selectYear(y)}
          />
        )}
      </div>
      <style>{`
        .rdp-calendar { font-family: 'Roboto', sans-serif; }
        .rdp-calendar--inline { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-default); padding: var(--separation-2); }
        .rdp-calendar--sheet { position: fixed; inset: 0; display: grid; align-items: end; }
        .rdp-calendar__scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.4); }
        .rdp-calendar--sheet .rdp-calendar__panel {
          position: relative;
          background: var(--color-white);
          padding: var(--separation-2);
          border-radius: var(--radius-default) var(--radius-default) 0 0;
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/Calendar.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/Calendar.lite.tsx design-system/tests/unit/Calendar.test.ts design-system/output
git commit -m "feat(design-system): add Calendar organism with view-mode state machine"
```

---

## Task 7: SnapshotsList organism

**Files:**
- Create: `design-system/src/components/SnapshotsList.lite.tsx`
- Create: `design-system/tests/unit/SnapshotsList.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('SnapshotsList (post-Mitosis emit)', () => {
  it('emits Vue component with presentation prop', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/SnapshotsList.vue'), 'utf8');
    expect(src).toMatch(/presentation/);
  });
});
```

- [ ] **Step 2: Run test**

```bash
pnpm test tests/unit/SnapshotsList.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/SnapshotsList.lite.tsx`**

```tsx
import { t } from '../utils/i18n';
import Icon from './Icon.lite';

type ListItem = { id: string; label: string };

type SnapshotsListProps = {
  items: ListItem[];
  selectedId?: string;
  presentation?: 'inline' | 'sheet';
  onSelect?: (id: string) => void;
  onDismiss?: () => void;
};

export default function SnapshotsList(props: SnapshotsListProps) {
  const presentation = props.presentation ?? 'inline';

  if (props.items.length === 0) {
    return (
      <p class="rdp-snapshots-list__empty">{t('snapshots-list.empty')}</p>
    );
  }

  return (
    <div class={`rdp-snapshots-list rdp-snapshots-list--${presentation}`}>
      {presentation === 'sheet' && (
        <div class="rdp-snapshots-list__scrim" onClick={() => props.onDismiss?.()} aria-hidden="true" />
      )}
      <div class="rdp-snapshots-list__panel">
        <header class="rdp-snapshots-list__header">
          <Icon name="grid-view" size={24} ariaLabel={t('snapshots-list.heading')} />
          <span>{t('snapshots-list.heading')}</span>
        </header>
        <ul class="rdp-snapshots-list__items" role="listbox">
          {props.items.map((item) => (
            <li
              key={item.id}
              role="option"
              aria-selected={item.id === props.selectedId ? 'true' : 'false'}
              class={`rdp-snapshots-list__item${item.id === props.selectedId ? ' rdp-snapshots-list__item--selected' : ''}`}
              onClick={() => props.onSelect?.(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        .rdp-snapshots-list {
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
        }
        .rdp-snapshots-list--sheet { position: fixed; inset: 0; display: grid; align-items: end; }
        .rdp-snapshots-list__scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.4); }
        .rdp-snapshots-list__header {
          display: flex; align-items: center; gap: var(--separation-1);
          padding: var(--separation-1) var(--separation-2);
          background: var(--color-brand-active);
          color: var(--color-white);
          border-radius: var(--radius-default) var(--radius-default) 0 0;
          font-size: var(--font-size-content);
        }
        .rdp-snapshots-list__items {
          list-style: none; margin: 0; padding: 0;
          font-size: var(--font-size-content);
        }
        .rdp-snapshots-list__item {
          padding: var(--separation-1) var(--separation-2);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-content-text);
          cursor: pointer;
        }
        .rdp-snapshots-list__item:last-child { border-bottom: none; }
        .rdp-snapshots-list__item--selected { background: var(--color-brand-active); color: var(--color-white); }
        .rdp-snapshots-list__empty {
          padding: var(--separation-2);
          color: var(--color-light-grey);
          font-size: var(--font-size-content);
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/SnapshotsList.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/SnapshotsList.lite.tsx design-system/tests/unit/SnapshotsList.test.ts design-system/output
git commit -m "feat(design-system): add SnapshotsList organism (inline + sheet presentation)"
```

---

## Task 8: BlueskyPostCard organism

**Files:**
- Create: `design-system/src/components/BlueskyPostCard.lite.tsx`
- Create: `design-system/tests/unit/BlueskyPostCard.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('BlueskyPostCard (post-Mitosis emit)', () => {
  it('emits Vue component referencing avatar, handle, body', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/BlueskyPostCard.vue'), 'utf8');
    expect(src).toMatch(/avatar/i);
    expect(src).toMatch(/handle/i);
  });
});
```

- [ ] **Step 2: Run test**

```bash
pnpm test tests/unit/BlueskyPostCard.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/BlueskyPostCard.lite.tsx`**

```tsx
import { t } from '../utils/i18n';
import { formatDate } from '../utils/intl';
import MetricsBar from './MetricsBar.lite';
import WebIntents from './WebIntents.lite';
import MediaPlaceholder from './MediaPlaceholder.lite';
import type { Locale } from '../utils/i18n';

export type BlueskyPost = {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatarUrl?: string;
  body: string;
  publishedAt: Date;
  metrics: { replies: number; reposts: number; likes: number };
  hasMedia?: boolean;
};

type BlueskyPostCardProps = {
  post: BlueskyPost;
  locale?: Locale;
};

export default function BlueskyPostCard(props: BlueskyPostCardProps) {
  const locale = props.locale ?? 'fr-FR';
  const handle = `${t('bluesky.handle.prefix')}${props.post.authorHandle}`;
  const ts = formatDate(props.post.publishedAt, 'longDay', locale);

  return (
    <article class="rdp-bsky-post">
      <MetricsBar
        replies={props.post.metrics.replies}
        reposts={props.post.metrics.reposts}
        likes={props.post.metrics.likes}
        locale={locale}
      />
      <header class="rdp-bsky-post__header">
        <span class="rdp-bsky-post__avatar" aria-hidden="true">
          {props.post.authorAvatarUrl ? (
            <img src={props.post.authorAvatarUrl} alt="" />
          ) : null}
        </span>
        <span class="rdp-bsky-post__author">
          <strong>{props.post.authorName}</strong>
          <span class="rdp-bsky-post__handle">{handle}</span>
        </span>
      </header>
      <p class="rdp-bsky-post__body">{props.post.body}</p>
      {props.post.hasMedia && <MediaPlaceholder width={270} height={160} />}
      <footer class="rdp-bsky-post__footer">
        <time class="rdp-bsky-post__timestamp">{ts}</time>
        <WebIntents postId={props.post.id} />
      </footer>
      <style>{`
        .rdp-bsky-post {
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          padding: var(--separation-2);
          font-family: 'Roboto', sans-serif;
          color: var(--color-content-text);
          display: flex; flex-direction: column;
          gap: var(--separation-1);
          font-size: var(--font-size-status-text);
        }
        .rdp-bsky-post__header { display: flex; gap: var(--separation-1); align-items: center; font-size: var(--font-size-content); }
        .rdp-bsky-post__avatar {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: var(--color-light-grey);
          overflow: hidden;
          flex-shrink: 0;
        }
        .rdp-bsky-post__avatar img { width: 100%; height: 100%; object-fit: cover; }
        .rdp-bsky-post__author { display: flex; flex-direction: column; }
        .rdp-bsky-post__handle { color: var(--color-light-grey); font-size: var(--font-size-publication-date); }
        .rdp-bsky-post__body { margin: 0; }
        .rdp-bsky-post__footer { display: flex; justify-content: space-between; align-items: center; font-size: var(--font-size-publication-date); color: var(--color-light-grey); }
      `}</style>
    </article>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/BlueskyPostCard.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/BlueskyPostCard.lite.tsx design-system/tests/unit/BlueskyPostCard.test.ts design-system/output
git commit -m "feat(design-system): add BlueskyPostCard organism with mock data shape"
```

---

## Task 9: BannerAbout organism

**Files:**
- Create: `design-system/src/components/BannerAbout.lite.tsx`
- Create: `design-system/tests/unit/BannerAbout.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('BannerAbout (post-Mitosis emit)', () => {
  it('emits Vue component with dismiss handler', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/BannerAbout.vue'), 'utf8');
    expect(src).toMatch(/dismiss|onDismiss/i);
  });
});
```

- [ ] **Step 2: Run test**

```bash
pnpm test tests/unit/BannerAbout.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/BannerAbout.lite.tsx`**

```tsx
import { useStore } from '@builder.io/mitosis';
import { t } from '../utils/i18n';
import Icon from './Icon.lite';

type BannerAboutProps = {
  bodyKey?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
};

export default function BannerAbout(props: BannerAboutProps) {
  const state = useStore({
    dismissed: false,
    dismiss() {
      state.dismissed = true;
      props.onDismiss?.();
    },
  });

  if (state.dismissed) return null;

  return (
    <aside class="rdp-banner-about" role="region">
      <header class="rdp-banner-about__heading">
        <Icon name="eye" size={24} />
        <span>{t('footer.about.heading')}</span>
      </header>
      <p class="rdp-banner-about__body">{t(props.bodyKey ?? 'footer.about.body')}</p>
      {props.dismissible && (
        <button
          type="button"
          class="rdp-banner-about__close"
          aria-label={t('actions.quit.label')}
          onClick={() => state.dismiss()}
        >
          ×
        </button>
      )}
      <style>{`
        .rdp-banner-about {
          background: var(--banner-about-bg);
          color: var(--banner-about-fg);
          padding: var(--separation-2);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
          position: relative;
        }
        .rdp-banner-about__heading {
          display: flex; align-items: center; gap: var(--separation-1);
          font-family: 'Signika', sans-serif;
          font-size: var(--font-size-status-text);
          color: var(--color-brand-active);
          margin-bottom: var(--separation-1);
        }
        .rdp-banner-about__body { margin: 0; }
        .rdp-banner-about__close {
          position: absolute; top: var(--separation-1); right: var(--separation-1);
          background: transparent; border: none; color: var(--color-content-font);
          font-size: 24px; cursor: pointer;
        }
      `}</style>
    </aside>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/BannerAbout.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/BannerAbout.lite.tsx design-system/tests/unit/BannerAbout.test.ts design-system/output
git commit -m "feat(design-system): add BannerAbout organism (dismissible)"
```

---

## Task 10: AppHeader organism (with `authenticated` prop)

**Files:**
- Create: `design-system/src/components/AppHeader.lite.tsx`
- Create: `design-system/tests/unit/AppHeader.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('AppHeader (post-Mitosis emit)', () => {
  it('emits Vue component supporting authenticated state', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/AppHeader.vue'), 'utf8');
    expect(src).toMatch(/authenticated/);
    expect(src).toMatch(/aria-disabled|disabled/);
  });
});
```

- [ ] **Step 2: Run test**

```bash
pnpm test tests/unit/AppHeader.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/AppHeader.lite.tsx`**

```tsx
import { t } from '../utils/i18n';
import Logo from './Logo.lite';
import Icon from './Icon.lite';

type AppHeaderProps = {
  layout: 'mobile' | 'desktop';
  authenticated: boolean;
  onAccountClick?: () => void;
  onMySpaceClick?: () => void;
};

export default function AppHeader(props: AppHeaderProps) {
  return (
    <header class={`rdp-app-header rdp-app-header--${props.layout}`}>
      <Logo showWordmark={true} size={props.layout === 'mobile' ? 'sm' : 'md'} />
      {props.layout === 'desktop' && (
        <a
          href="#"
          class="rdp-app-header__myspace"
          aria-disabled={!props.authenticated ? 'true' : undefined}
          onClick={(event) => {
            if (!props.authenticated) { event.preventDefault(); return; }
            props.onMySpaceClick?.();
          }}
        >
          {t('header.my-space')}
        </a>
      )}
      <button
        type="button"
        class="rdp-app-header__account"
        aria-label={t('header.my-account.aria-label')}
        onClick={() => props.onAccountClick?.()}
      >
        <Icon name="user" size={32} />
      </button>
      <style>{`
        .rdp-app-header {
          display: flex; align-items: center;
          gap: var(--separation-2);
          padding: var(--separation-1) var(--separation-2);
          background: var(--color-white);
          border-bottom: 1px solid var(--color-border);
          font-family: 'Signika', sans-serif;
        }
        .rdp-app-header--desktop { padding: var(--separation-1) var(--separation-3); }
        .rdp-app-header__myspace {
          margin-left: auto;
          color: var(--color-brand-active);
          text-decoration: none;
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-app-header__myspace[aria-disabled="true"] {
          color: var(--color-light-grey);
          cursor: not-allowed;
          pointer-events: none;
        }
        .rdp-app-header__account {
          background: transparent; border: none; cursor: pointer;
          width: 40px; height: 40px;
          margin-left: auto;
          color: var(--color-content-text);
        }
        .rdp-app-header--desktop .rdp-app-header__account { margin-left: 0; }
      `}</style>
    </header>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/AppHeader.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/AppHeader.lite.tsx design-system/tests/unit/AppHeader.test.ts design-system/output
git commit -m "feat(design-system): add AppHeader organism with authenticated state"
```

---

## Task 11: Sidebar organism

**Files:**
- Create: `design-system/src/components/Sidebar.lite.tsx`
- Create: `design-system/tests/unit/Sidebar.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('Sidebar (post-Mitosis emit)', () => {
  it('emits Vue component composing SnapshotsList, Calendar, BannerAbout', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/Sidebar.vue'), 'utf8');
    expect(src).toMatch(/SnapshotsList|Calendar|BannerAbout/);
  });
});
```

- [ ] **Step 2: Run test**

```bash
pnpm test tests/unit/Sidebar.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/Sidebar.lite.tsx`**

```tsx
import SnapshotsList from './SnapshotsList.lite';
import Calendar from './Calendar.lite';
import BannerAbout from './BannerAbout.lite';
import Footer from './Footer.lite';
import type { Locale } from '../utils/i18n';

type ListItem = { id: string; label: string };

type SidebarProps = {
  lists: ListItem[];
  selectedListId?: string;
  selectedDate: Date;
  yearRange: { min: number; max: number };
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
};

export default function Sidebar(props: SidebarProps) {
  return (
    <aside class="rdp-sidebar">
      <SnapshotsList
        items={props.lists}
        selectedId={props.selectedListId}
        onSelect={(id) => props.onListSelect?.(id)}
      />
      <Calendar
        selectedDate={props.selectedDate}
        locale={props.locale}
        yearRange={props.yearRange}
        onSelect={(d) => props.onDateSelect?.(d)}
      />
      <BannerAbout />
      <Footer />
      <style>{`
        .rdp-sidebar {
          width: var(--width-left-column-desktop, 336px);
          display: flex; flex-direction: column;
          gap: var(--separation-2);
        }
      `}</style>
    </aside>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/Sidebar.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/Sidebar.lite.tsx design-system/tests/unit/Sidebar.test.ts design-system/output
git commit -m "feat(design-system): add Sidebar organism"
```

---

## Task 12: AuthCard organism (with the auth-flow state machine)

**Files:**
- Create: `design-system/src/components/AuthCard.lite.tsx`
- Create: `design-system/tests/unit/AuthCard.test.ts`

The AuthCard owns the `flow: 'login' | 'signup' | 'reset' | 'edit-email' | 'edit-password' | 'confirm'` state machine. It does NOT handle the network request — it emits `onSubmit({ flow, values })` and the consumer wires the API call.

**Important:** the `edit-password` flow ships **three fields** (current + new + confirm) per spec §2.2 finding #7.

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('AuthCard (post-Mitosis emit)', () => {
  it('emits Vue component handling all six flows', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/AuthCard.vue'), 'utf8');
    for (const flow of ['login', 'signup', 'reset', 'edit-email', 'edit-password', 'confirm']) {
      expect(src).toContain(flow);
    }
  });

  it('edit-password flow renders three fields', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/AuthCard.vue'), 'utf8');
    expect(src).toMatch(/current.*new.*confirm|currentPassword.*newPassword.*confirmPassword/s);
  });
});
```

- [ ] **Step 2: Run test**

```bash
pnpm test tests/unit/AuthCard.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/AuthCard.lite.tsx`**

```tsx
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
  tosHref?: string;
  onSubmit?: (payload: { flow: Flow; values: Record<string, string | boolean> }) => void;
  onSwitchFlow?: (flow: Flow) => void;
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
    update(field: string, value: string | boolean) {
      // mitosis-friendly assignment
      (state as unknown as Record<string, unknown>)[field] = value;
    },
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
      {props.flow === 'confirm' && props.noticeKey ? (
        <Notice headlineKey={props.noticeKey.headline} bodyKey={props.noticeKey.body} />
      ) : (
        <div class="rdp-auth-card__panel">
          <h2 class="rdp-auth-card__title">{t(`auth.${props.flow}.title`)}</h2>
          {props.flow === 'reset' && <p>{t('auth.forgot-password.body')}</p>}

          {(props.flow === 'login' || props.flow === 'signup' || props.flow === 'reset' || props.flow === 'edit-email') && (
            <EmailField
              name="email"
              value={state.email}
              onChange={(v) => state.update('email', v)}
              error={false}
            />
          )}

          {props.flow === 'login' && (
            <>
              <PasswordField name="password" value={state.password} mode="login" onChange={(v) => state.update('password', v)} />
              <Checkbox
                name="rememberMe"
                checked={state.rememberMe}
                onChange={(v) => state.update('rememberMe', v)}
                labelKey="auth.remember-me"
              />
            </>
          )}

          {props.flow === 'signup' && (
            <>
              <PasswordField name="password" value={state.password} mode="new" onChange={(v) => state.update('password', v)} />
              <Checkbox
                name="tos"
                checked={state.tos}
                onChange={(v) => state.update('tos', v)}
                labelKey="auth.tos.checkbox-label"
              />
            </>
          )}

          {props.flow === 'edit-email' && (
            <PasswordField
              name="currentPassword"
              value={state.currentPassword}
              mode="login"
              onChange={(v) => state.update('currentPassword', v)}
              labelKey="auth.edit-email.current-password-label"
            />
          )}

          {props.flow === 'edit-password' && (
            <>
              <PasswordField
                name="currentPassword"
                value={state.currentPassword}
                mode="login"
                onChange={(v) => state.update('currentPassword', v)}
                labelKey="auth.edit-password.current-label"
              />
              <PasswordField
                name="newPassword"
                value={state.newPassword}
                mode="new"
                onChange={(v) => state.update('newPassword', v)}
                labelKey="auth.edit-password.new-label"
              />
              <PasswordField
                name="confirmPassword"
                value={state.confirmPassword}
                mode="new"
                onChange={(v) => state.update('confirmPassword', v)}
                labelKey="auth.edit-password.confirm-label"
                showHelper={false}
              />
            </>
          )}

          <Button variant="form" labelKey={`auth.${props.flow}.submit-label`} onClick={() => state.submit()} />

          {props.formErrors && props.formErrors.length > 0 && <FormError errors={props.formErrors} />}

          {props.flow === 'login' && (
            <Link href="#" labelKey="auth.login.forgot-password" />
          )}
        </div>
      )}
      <style>{`
        .rdp-auth-card { display: grid; gap: var(--separation-2); }
        .rdp-auth-card__panel {
          background: var(--color-white);
          padding: var(--separation-3);
          border-radius: var(--radius-default);
          display: grid; gap: var(--separation-1);
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
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/AuthCard.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/AuthCard.lite.tsx design-system/tests/unit/AuthCard.test.ts design-system/output
git commit -m "feat(design-system): add AuthCard organism with six-flow state machine and confirm field"
```

---

## Task 13: Footer organism

**Files:**
- Create: `design-system/src/components/Footer.lite.tsx`
- Create: `design-system/tests/unit/Footer.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('Footer (post-Mitosis emit)', () => {
  it('emits Vue component', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/Footer.vue'), 'utf8');
    expect(src).toMatch(/copyright/i);
  });
});
```

- [ ] **Step 2: Run test**

```bash
pnpm test tests/unit/Footer.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/Footer.lite.tsx`**

```tsx
import { t } from '../utils/i18n';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer class="rdp-footer">
      <section class="rdp-footer__section">
        <h3>{t('footer.about.heading')}</h3>
        <p>{t('footer.about.body')}</p>
      </section>
      <section class="rdp-footer__section">
        <h3>{t('footer.social.heading')}</h3>
        <p>{t('footer.social.body')}</p>
      </section>
      <section class="rdp-footer__section">
        <h3>{t('footer.pro-bono.heading')}</h3>
        <p>{t('footer.pro-bono.body')}</p>
      </section>
      <p class="rdp-footer__copyright">{t('footer.copyright', { year })}</p>
      <style>{`
        .rdp-footer {
          background: var(--banner-about-bg);
          color: var(--banner-about-fg);
          padding: var(--separation-2);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-footer-paragraph);
          display: grid; gap: var(--separation-2);
        }
        .rdp-footer__section h3 {
          font-family: 'Signika', sans-serif;
          font-size: var(--font-size-footer-title);
          color: var(--color-brand-active);
          margin: 0 0 var(--separation-1);
        }
        .rdp-footer__section p { margin: 0; }
        .rdp-footer__copyright {
          font-size: var(--font-size-footer-copyright);
          text-align: center;
          margin: 0;
          color: var(--color-content-font);
        }
      `}</style>
    </footer>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/Footer.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/Footer.lite.tsx design-system/tests/unit/Footer.test.ts design-system/output
git commit -m "feat(design-system): add Footer organism"
```

---

## Task 14: Update components barrel and demo app

**Files:**
- Modify: `design-system/src/components/index.ts`
- Modify: `design-system/apps/demo/src/App.vue`

- [ ] **Step 1: Append organism re-exports**

Append to `design-system/src/components/index.ts`:

```ts
export { default as AppHeader } from './AppHeader.lite';
export { default as AuthCard } from './AuthCard.lite';
export { default as BannerAbout } from './BannerAbout.lite';
export { default as BlueskyPostCard } from './BlueskyPostCard.lite';
export { default as Calendar } from './Calendar.lite';
export { default as Footer } from './Footer.lite';
export { default as Sidebar } from './Sidebar.lite';
export { default as SnapshotsList } from './SnapshotsList.lite';
```

- [ ] **Step 2: Add organism showcases to the demo app**

Replace the `<section>` blocks in `design-system/apps/demo/src/App.vue` with:

```vue
<!-- new sections (keep existing M1 atom and M2 molecule sections above them) -->

<section>
  <h2>Calendar (inline)</h2>
  <Calendar
    :selected-date="new Date(2021, 3, 6)"
    :year-range="{ min: 2020, max: new Date().getFullYear() }"
    locale="fr-FR"
    @select="(d) => console.log('selected', d)"
  />
</section>

<section>
  <h2>SnapshotsList</h2>
  <SnapshotsList
    :items="[
      { id: 'agile', label: 'Agile' },
      { id: 'lean-startup', label: 'Lean startup' },
      { id: 'medias-francais', label: 'Médias français' },
      { id: 'machine-learning', label: 'Machine learning' },
    ]"
    selected-id="medias-francais"
  />
</section>

<section>
  <h2>BlueskyPostCard</h2>
  <BlueskyPostCard
    :post="{
      id: 'mock-1',
      authorName: 'Le Monde',
      authorHandle: 'lemonde.fr',
      body: 'Voici un exemple de post Bluesky pour la démo.',
      publishedAt: new Date('2021-04-02T17:55:00Z'),
      metrics: { replies: 182, reposts: 36000, likes: 35200 },
      hasMedia: true,
    }"
  />
</section>

<section>
  <h2>AuthCard (login)</h2>
  <AuthCard flow="login" />
</section>

<section>
  <h2>AuthCard (edit-password — three fields)</h2>
  <AuthCard flow="edit-password" />
</section>
```

Also add the imports at the top of `<script setup>`:

```ts
import Calendar from '@design-system/components/Calendar.vue';
import SnapshotsList from '@design-system/components/SnapshotsList.vue';
import BlueskyPostCard from '@design-system/components/BlueskyPostCard.vue';
import AuthCard from '@design-system/components/AuthCard.vue';
```

- [ ] **Step 3: Type-check**

```bash
pnpm typecheck
```

Expected: zero errors.

- [ ] **Step 4: Boot demo and verify**

```bash
pnpm demo
# Open http://localhost:5173 — verify Calendar, SnapshotsList, BlueskyPostCard, two AuthCards render. Stop with Ctrl+C.
```

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/index.ts design-system/apps/demo/src/App.vue
git commit -m "feat(design-system): re-export M3 organisms and showcase in demo app"
```

---

## Task 15: Visual regression baseline (Playwright)

**Files:**
- Create: `design-system/tests/visual/playwright.config.ts`
- Create: `design-system/tests/visual/atoms.spec.ts`
- Modify: `design-system/package.json` (add `test:visual` script)

- [ ] **Step 1: Add Playwright script to root package.json**

Update `scripts` in `design-system/package.json`:

```json
{
  "scripts": {
    "test:visual": "playwright test --config tests/visual/playwright.config.ts"
  }
}
```

- [ ] **Step 2: Install Playwright browsers (one-time)**

```bash
pnpm exec playwright install chromium
```

- [ ] **Step 3: Write the Playwright config**

Write to `design-system/tests/visual/playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'pnpm demo',
    cwd: '../../',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
```

- [ ] **Step 4: Write the snapshot suite**

Write to `design-system/tests/visual/atoms.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('Visual regression — demo app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
  });

  test('full-page baseline', async ({ page }) => {
    await expect(page).toHaveScreenshot('demo-fullpage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('Buttons section', async ({ page }) => {
    const section = page.locator('section', { hasText: 'Buttons' });
    await expect(section).toHaveScreenshot('section-buttons.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Calendar section', async ({ page }) => {
    const section = page.locator('section', { hasText: 'Calendar' });
    await expect(section).toHaveScreenshot('section-calendar.png', { maxDiffPixelRatio: 0.02 });
  });

  test('AuthCard edit-password renders three fields', async ({ page }) => {
    const card = page.locator('section', { hasText: 'AuthCard (edit-password' });
    await expect(card.locator('input[type="password"]')).toHaveCount(3);
  });
});
```

- [ ] **Step 5: Run the visual test to capture baselines**

```bash
pnpm test:visual --update-snapshots
```

Expected: baselines written under `tests/visual/atoms.spec.ts-snapshots/`. Inspect the files manually for visual correctness.

- [ ] **Step 6: Re-run without `--update-snapshots`**

```bash
pnpm test:visual
```

Expected: PASS — baselines match.

- [ ] **Step 7: Commit**

```bash
git add design-system/tests/visual design-system/package.json design-system/pnpm-lock.yaml
git commit -m "test(design-system): add Playwright visual regression baseline against demo app"
```

---

## Task 16: Update CI to run visual regression

**Files:**
- Modify: `design-system/.github/workflows/ci.yml`

- [ ] **Step 1: Add visual job**

Replace `design-system/.github/workflows/ci.yml`:

```yaml
name: design-system-ci

on:
  push:
    branches: [main]
    paths: ['design-system/**']
  pull_request:
    paths: ['design-system/**']

jobs:
  build-and-test:
    name: build-and-test
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: design-system
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          cache-dependency-path: design-system/pnpm-lock.yaml
      - run: pnpm install --frozen-lockfile
      - run: node scripts/sync-tokens.mjs --check
      - run: pnpm build:mitosis
      - run: pnpm test
      - run: pnpm typecheck

  visual:
    name: visual-regression
    runs-on: ubuntu-latest
    needs: build-and-test
    defaults:
      run:
        working-directory: design-system
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          cache-dependency-path: design-system/pnpm-lock.yaml
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm build:mitosis
      - run: pnpm test:visual
        env:
          CI: 'true'
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: visual-diff
          path: design-system/test-results
```

- [ ] **Step 2: Commit**

```bash
git add design-system/.github/workflows/ci.yml
git commit -m "ci(design-system): run visual regression after build-and-test"
```

---

## Final acceptance check

- [ ] **Run the full local CI loop**

```bash
cd ./design-system
pnpm install --frozen-lockfile
node scripts/sync-tokens.mjs --check
pnpm build:mitosis
pnpm test
pnpm typecheck
pnpm test:visual
```

Expected: every step exits 0. Vitest now reports M1 + M2 + 8 organism emit-checks + password pipeline + Pwned tests. Playwright snapshots match.

- [ ] **Verify all M3 deliverables in the demo app**

Open `http://localhost:5173`. Visible:

- Logo + 7-variant Buttons (M1)
- 8 molecules (M2)
- Calendar (inline) with day grid (M3)
- SnapshotsList (M3)
- BlueskyPostCard with three vanity-metric pills (M3)
- AuthCard in `login` flow (M3)
- AuthCard in `edit-password` flow showing **three** password fields (M3)

---

## Self-review notes

- **Spec coverage:** §3 tier-3 organisms — all 8 implemented (Tasks 6–13). §7 password rules — full pipeline wired (Tasks 2–4). §2.2 finding #7 (add confirm field) — implemented in `AuthCard` `edit-password` flow (Task 12). §8.2 visual regression — baseline established (Task 15).
- **Type consistency:** `Locale`, `IconName`, `ButtonVariant`, `ErrorMessage`, `BlueskyPost`, `Flow` — all defined in `src/types.ts` or co-located with their components and used consistently downstream.
- **No placeholders:** every step has a concrete code block or shell command with expected output.
- **Out-of-scope deferrals:** remaining 5 generators land in M4. Per-target visual regression (right now we test only Vue) lands in M4. v1.0.0 publish in M5.
