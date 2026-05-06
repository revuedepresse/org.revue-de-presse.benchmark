# Design — Revue de presse Mitosis design system

**Status:** Awaiting user review.
**Date:** 2026-05-06.
**Owner:** Thierry Marianne.
**Implementation home:** `./design-system/`.
**Companion artefacts** (already on disk in that home):

- `components.md` — full component catalogue with states, props, i18n keys, and artboard cross-reference.
- `assets/logo.svg` — extracted from the live site.
- `assets/bluesky-logo.png` — fetched from the live site CDN.
- `research/live-tokens.json` — live-site CSS-custom-property snapshot (60+ tokens).
- `research/screens-manifest.json` + `research/screens/` — XD visual atlas (59 PNGs).

---

## Table of contents

- [1. Goals](#1-goals)
  - [1.1 Out of scope for v1](#11-out-of-scope-for-v1)
  - [1.2 Ten Mitosis targets](#12-ten-mitosis-targets)
- [2. Sources of truth](#2-sources-of-truth)
  - [2.1 Extraction method](#21-extraction-method)
  - [2.2 New findings from the per-screen walk](#22-new-findings-from-the-per-screen-walk)
- [3. Project layout](#3-project-layout)
  - [3.1 Package layout & versioning](#31-package-layout--versioning)
  - [3.2 Build pipeline](#32-build-pipeline)
  - [3.3 CI](#33-ci)
- [4. Component architecture](#4-component-architecture)
  - [4.1 Composition tiers](#41-composition-tiers)
  - [4.2 Data-flow rules](#42-data-flow-rules)
  - [4.3 State machines](#43-state-machines)
  - [4.4 Generator-aware coding patterns](#44-generator-aware-coding-patterns)
  - [4.5 Canonical Button contract](#45-canonical-button-contract)
  - [4.6 Custom-element & tag prefix policy](#46-custom-element--tag-prefix-policy)
- [5. Tokens](#5-tokens)
  - [5.1 Foundation tokens](#51-foundation-tokens-sourced-from-researchlive-tokensjson)
  - [5.2 Component tokens](#52-component-tokens)
  - [5.3 Cross-target distribution](#53-cross-target-distribution)
  - [5.4 JSON mirror & sync gate](#54-json-mirror--sync-gate)
- [6. Internationalisation](#6-internationalisation)
  - [6.1 Locale set](#61-locale-set)
  - [6.2 Default `t` implementation](#62-default-t-implementation)
  - [6.3 Provider pattern (per target)](#63-provider-pattern-per-target)
  - [6.4 Locale switching at runtime](#64-locale-switching-at-runtime)
  - [6.5 Date and number formatting](#65-date-and-number-formatting)
- [7. Authentication & password rules (OWASP-aligned)](#7-authentication--password-rules-owasp-aligned)
  - [7.1 Length](#71-length)
  - [7.2 Composition](#72-composition)
  - [7.3 Strength & breach checks](#73-strength--breach-checks)
  - [7.4 Lifecycle](#74-lifecycle)
  - [7.5 Error keys](#75-error-keys)
- [8. Testing](#8-testing)
  - [8.1 Unit (Vitest)](#81-unit-vitest)
  - [8.2 Visual regression (Playwright)](#82-visual-regression-playwright)
  - [8.3 Type checks](#83-type-checks)
- [9. Rollout (sequencing — not a schedule)](#9-rollout-sequencing--not-a-schedule)
- [10. Locked decisions](#10-locked-decisions)
- [11. Open dependencies for the implementation plan](#11-open-dependencies-for-the-implementation-plan)

---

## 1. Goals

Ship a **framework-agnostic design system** for Revue de presse, authored once in [Mitosis](https://github.com/BuilderIO/mitosis) and compiled to ten target frameworks. The system must be:

1. Faithful to the published design — token values come from what `revue-de-presse.org` actually serves today, not stale design-tool exports.
2. **Internationalised from day one** — French (`fr-FR`) and British English (`en-GB`) shipped in the same package.
3. **OWASP-aligned** for password handling — no compositional rules, breach rejection, no rotation policy.
4. Small enough that a single maintainer can keep all ten generator outputs healthy, by leaning on stateless atoms and shared CSS variables instead of per-target theming systems.

### 1.1 Out of scope for v1

- MFA. Deferred. Revisit the password length minimum (drop from 15 → 8 chars) when MFA ships.
- Bluesky federated auth. Bluesky integration in v1 is **read-only display** of public posts; the `revue-de-presse.org` account flow is a self-managed email/password login.
- Dark mode. The token surface is structured to allow it later (CSS variables piercing shadow DOM) but no dark palette is shipped.
- Tooling outputs (Style Dictionary platform builds, Tailwind preset, Figma sync). The `tokens.json` mirror exists so these are unblocked when needed.

### 1.2 Ten Mitosis targets

`react`, `vue`, `angular`, `svelte`, `preact`, `solid`, `qwik`, `lit`, `stencil`, `alpine`. **HTMX is not a Mitosis target** and is not shipped — HTMX pages can mount the Lit/Stencil bundle as Web Components.

---

## 2. Sources of truth

Two sources, in this priority order — when they disagree, the live site wins for tokens, the XD deck wins for component states:

| Source | URL | Priority for | Captured |
|---|---|---|---|
| Live site (production Nuxt/Vue app) | `https://revue-de-presse.org/` | Tokens, brand naming, asset URLs, Bluesky integration | 2026-05-06 via Playwright `getComputedStyle(:root)` |
| Adobe XD shared deck | `https://xd.adobe.com/view/efa136bf-7446-4b56-8607-0c5bbe14c297-baf2/grid` | Component states, variants, page layouts not yet on the live site | 2022-10-18 (last design update); 59 artboards downloaded as PNG |

### 2.1 Extraction method

- **XD deck** is canvas-rendered — vector data is not exposed in the DOM. We extracted the 59 artboard thumbnails via the `data-id` attributes on `<div role="gridcell">` cards, downloaded the public CDN PNGs in parallel, and read each one to identify components. We then walked all 59 artboards individually via Playwright (`/screen/<uuid>/` URLs) and captured each canvas at display resolution (~1280 px wide) to surface state variants the thumbnails missed. The persistent record is `research/screens/` (low-res atlas) + `research/screens-catalogue.md` (per-screen observations).
- **Live site** publishes a CSS-custom-property design system. We dumped `:root` computed styles via Playwright and persisted them as `research/live-tokens.json`. The site also embeds the brand logo as inline base64 SVG, which we decoded to `assets/logo.svg`.
- **Icon glyphs** (chevrons, eye, share, heart, alert, close, profile) are not extractable as SVG from XD; we substitute open-source equivalents from Lucide. The custom logo is the only design-specific SVG asset.

### 2.2 New findings from the per-screen walk

The hi-res walk surfaced details that the thumbnail atlas alone could not, and they materially affect the implementation. Each is sourced to a specific screen (full table in `research/screens-catalogue.md`).

1. **Mobile bottom-sheet overlay for Calendar and SnapshotsList.** Screens 10–13 reveal that mobile opens both selectors as bottom-sheets with the underlying page dimmed by a scrim. The library `Calendar` and `SnapshotsList` organisms must therefore support both an *inline* and a *bottom-sheet overlay* rendering mode — toggled by a `presentation: 'inline' | 'sheet'` prop that resolves the layout, scrim, and dismiss interaction.
2. **Form-level errors are distinct from field-level.** Eight screens (20, 22, 24, 28, 30, 32, 35, 39, 47, 51, 55, 58) show a red message *below* the submit button in addition to red field borders. We add a new atom `FormError` (sibling of `FieldError`, B.5) accepting `errors: ErrorMessage[]` and rendering each on its own line with a leading "`- `" prefix when there are 2+. Total atom count moves from 10 → **11**.
3. **`Notice.Success` (E.2) appears in three contexts** — signup-confirm (36, 40), email-confirm (48, 52), and one unique to email change — all with the bold-red headline + body shape. The component's `headlineKey` and `bodyKey` props handle the variation; no per-context subclassing.
4. **Year picker is data-driven.** Screen 12 lists only 2020 / 2021. The library's `Calendar.YearsView` (C.3) must compute its year range from data, not hard-code, and accept a `yearRange: { min: number, max: number }` prop.
5. **`Checkbox` (B.4) must accept rich labels.** The signup ToS checkbox (screen 34) renders "J'accepte les **conditions d'utilisation**" with the trailing words as an inline link. Add a `labelChildren` slot in addition to the existing `label` string, and a `tosLinkHref` convenience prop where applicable.
6. **`AppHeader.Desktop` (F.2) needs an authenticated state.** Screens 26–32, 38–40, 50–52, 57 show the "Mon espace" link grayed out when no session exists. Add `authenticated: boolean` to F.2's contract.
7. **Edit-password form ships with only two fields in the design.** Screens 54, 55, 57, 58 show *Ancien + Nouveau + Valider* — no third "confirmer" field. The design diverges from the OWASP-aligned guidance in §7.4 of this spec which asked for *current + new + confirm*. **Resolution: add the confirm field in implementation** — it's a low-cost UX safeguard that prevents typos in a destructive change. Note this divergence for the design-team review when they next refresh the deck.
8. **Forgot-password submit button is mislabeled `Connexion`** on screens 21 and 29. **Resolution: implementation uses i18n key `auth.forgot-password.submit-label`** with copy "Envoyer" (fr) / "Send" (en); this is one of two intentional copy fixes the implementation makes vs the source design (the other being the OWASP password helper text in §5.2).
9. **The XD copy predates Bluesky.** The "À propos" sidebar text says "l'API de Twitter"; the live site has already updated this. `Banner.About` (E.3) sources its copy from `about.body` i18n key — never hard-coded. The shipped `fr-FR.json` and `en-GB.json` use the live-site wording.
10. **French-grammar defects in the source design's error strings** ("Le mot de passe est incorrect**e**" → should be `incorrect`; "condition" should be `conditions`). The shipped `fr-FR.json` corrects these. List of intentional fixes is in `research/screens-catalogue.md` §"Design defects worth flagging".

These findings are material to the implementation and have been folded back into:

- `components.md` — adds `FormError` atom, `presentation` prop on `Calendar`/`SnapshotsList`, `labelChildren` on `Checkbox`, `authenticated` on `AppHeader.Desktop`, `yearRange` on `Calendar.YearsView`.
- §6 of this spec — atom count moves from 10 to 11; total component count from 26 to **27**.

---

## 3. Project layout

```
design-system/
├── package.json                    # @revue-de-presse/design-system, MIT, type:module
├── tsconfig.json                   # strict, ESM-first
├── mitosis.config.cjs              # 10 generator targets
├── src/
│   ├── components/                 # 26 *.lite.tsx Mitosis sources (catalogue in components.md §6)
│   ├── tokens/
│   │   ├── tokens.css              # foundation CSS variables (live-site palette)
│   │   └── tokens.json             # machine-readable mirror, kept in sync via pnpm tokens:sync
│   ├── locales/
│   │   ├── fr-FR.json              # default
│   │   └── en-GB.json              # English
│   ├── icons/
│   │   ├── logo.svg                # extracted from live site
│   │   └── sprite.svg              # Lucide selections + logo, generated by build
│   └── utils/
│       ├── i18n.ts                 # default t(key, vars) + DI hook
│       ├── intl.ts                 # formatDate / formatCount wrappers
│       └── password.ts             # zxcvbn-ts + Pwned-Passwords helpers
├── output/                         # generated, gitignored
│   └── {react,vue,svelte,angular,solid,qwik,preact,lit,stencil,alpine}/
│       ├── src/                    # generator output
│       └── dist/                   # tsup/vite build output, publishable
├── stories/                        # Histoire — one per atom/molecule/organism
├── tests/
│   ├── unit/                       # Vitest — token integrity, i18n parity, password rules
│   └── visual/                     # Playwright snapshots against the demo app
├── apps/
│   └── demo/                       # tiny Vite + Vue app consuming `output/vue/dist/` for visual regression
├── docs/                           # static site auto-built from stories, deployed to GH Pages
└── research/                       # XD atlas + manifest + live-tokens (already populated)
```

### 3.1 Package layout & versioning

Ten npm packages, one per target, all published from this monorepo and **all pinning the same version**:

- `@revue-de-presse/design-system-react`
- `@revue-de-presse/design-system-vue`
- `@revue-de-presse/design-system-svelte`
- `@revue-de-presse/design-system-angular`
- `@revue-de-presse/design-system-solid`
- `@revue-de-presse/design-system-qwik`
- `@revue-de-presse/design-system-preact`
- `@revue-de-presse/design-system-lit`
- `@revue-de-presse/design-system-stencil`
- `@revue-de-presse/design-system-alpine`

The token CSS is included in every package (`dist/tokens.css`) and exported from each package root for consumers to `import` once.

### 3.2 Build pipeline

```
pnpm build
  → mitosis build         # src/components/*.lite.tsx → output/<target>/src/
  → for each target:
      tsup or vite build  # → output/<target>/dist/
      copy tokens.css     # → output/<target>/dist/tokens.css
  → pnpm tokens:sync      # asserts tokens.css ↔ tokens.json parity (CI gate)

pnpm dev
  → boot the demo Vite app + Histoire side-by-side, both pointing at output/vue/dist
```

### 3.3 CI

GitHub Actions matrix `{target × {build, test}}` — 20 jobs. Per-target failure is non-blocking for siblings: it surfaces as a job failure but does not cancel the matrix. Publishing is gated on **all** jobs passing.

---

## 4. Component architecture

### 4.1 Composition tiers

| Tier | Knows about | Examples |
|---|---|---|
| Atoms | Tokens, icons, i18n, own props. Never imports other library components. | `Button`, `Link`, `Logo`, `Icon`, `Checkbox`, `TextField`, `EmailField`, `PasswordField`, `FieldError`, `MediaPlaceholder` (10 total) |
| Molecules | Atoms only. Orchestrates layout but no business logic. | `MonthPicker`, `YearPicker`, `DateGrid`, `CalendarActionBar`, `MetricsBar`, `Alert`, `Notice`, `WebIntents` (8 total) |
| Organisms | Atoms + molecules + small in-component state. Emits intents to consumer. | `Calendar`, `SnapshotsList`, `BlueskyPostCard`, `Banner.About`, `AppHeader`, `Sidebar`, `AuthCard`, `Footer` (8 total) |

**Library total: 27 source components** (revised after the per-screen walk in §2.2 added `FormError`). At ten generator targets that produces 270 generated framework components, plus 10 thin `index` re-exports. Page-level templates (`HomePage`, `LoginPage`, …) are **not** in the library — they live in consuming apps.

### 4.2 Data-flow rules

- Components are stateless by default. Internal state only when the design demands it: `Calendar.viewMode`, `AuthCard.flow`, `PasswordField.strengthFeedback`, `Banner.About.dismissed`.
- All visible strings come through `t(key, vars?)`. Atoms accept `labelKey` or `label`; `labelKey` wins when both supplied.
- All dates / numbers go through `utils/intl.ts` so identical strings emerge from all 10 targets.
- Forms own field state internally and emit `onSubmit({ values, valid })`. Network calls and routing live in the consumer.
- Errors are data, not exceptions: `error?: string | { key: string; vars?: object }` props on form fields.

### 4.3 State machines

Hand-rolled reducers in TypeScript, **not XState** — XState through 10 generator targets is a tax we don't need at this size. The three machines are:

- `Calendar.viewMode: 'day' | 'month' | 'year'`
- `AuthCard.flow: 'login' | 'signup' | 'reset' | 'edit-email' | 'edit-password' | 'confirm'`
- `PasswordField.strength: { score: 0-4, breached: boolean, ok: boolean }`

### 4.4 Generator-aware coding patterns

Mitosis source must avoid:

- `class` syntax (use functions and `useStore`).
- Synchronous mutation of refs during render (race condition on Solid, breaks Qwik resumability).
- React-specific event-system shortcuts (`event.persist()`, synthetic-event pooling assumptions).
- Direct DOM access inside render (use `onMount`/`onUpdate`).

These rules live in `src/components/CONVENTIONS.md` next to the Mitosis sources, and are checked by the visual regression suite (any drift between targets surfaces there first).

### 4.5 Canonical Button contract

A single `Button` atom dispatches on a `variant` prop instead of seven near-duplicate atoms:

```ts
type ButtonProps = {
  variant: 'primary' | 'secondary' | 'scrollTop' | 'calendarNav' | 'form' | 'avatar' | 'quit';
  labelKey?: string;
  label?: string;
  icon?: IconName;
  iconAfter?: IconName;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  onClick: () => void;
};
```

Trade-off accepted: file is ~150 lines of variant-aware markup, but focus / hover / disabled / loading wiring is shared. Seven atoms would have meant seven copies.

### 4.6 Custom-element & tag prefix policy

| Target | Tag form | Notes |
|---|---|---|
| Lit, Stencil | `<rdp-button>` | namespaced custom elements; needed to avoid collisions when mounted into HTMX/Alpine pages |
| React, Preact, Solid, Qwik, Vue, Svelte | `<Button>` | imported by name, no global registry |
| Angular | `rdp-button` (selector) | Angular's selector convention requires kebab-case |
| Alpine | `data-rdp-button` directives + Alpine plugin | Alpine has no component model, so we expose plugins |

Across all targets the **CSS-variable convention is identical** — that's the single theming surface.

---

## 5. Tokens

### 5.1 Foundation tokens (sourced from `research/live-tokens.json`)

```css
:root {
  /* Colour */
  --color-white: #fff;
  --color-black: #000;
  --color-brand: #006663;
  --color-brand-active: #00cdc7;
  --color-content-text: #2f394d;
  --color-content-background: #2f394d;
  --color-content-font: #e6e6e6;
  --color-light-grey: #657786;
  --color-taupe-grey: #ebeef0;
  --color-border: #e6e6e6;
  --color-background-other-month: #e6e6e6;
  --color-background-future-date: #fff;
  --color-error: #fa0;                          /* yellow-orange, NOT red */
  --color-brand-bluesky: #1d9bf0;
  --color-vanity-metric-like: #851430;          /* deep red */
  --color-vanity-metric-retweet: #09442c;       /* deep green */
  --color-vanity-metric-reply: #1d9bf0;         /* blue */

  /* Spacing */
  --separation-0: 6px;
  --separation-1: 8px;
  --separation-2: 16px;
  --separation-3: 19px;

  /* Radius */
  --radius-default: 8px;
  --radius-date-picker: 4px;
  --radius-selectable: 4px;

  /* Typography */
  --line-height-base: 1.4em;
  --font-size-content: 14px;
  --font-size-status-text: 19px;
  --font-size-publication-date: 12px;
  --font-size-calendar-month-day: 12px;
  --font-size-calendar-month-day-cell: 16px;
  --font-size-vanity-metric: 15px;
  --font-size-date-picker: 16px;
  --font-size-footer-paragraph: 16px;
  --font-size-footer-title: 26px;
  --font-size-footer-copyright: 12px;
  --font-size-footer-outer-link: 14px;
  /* line-spacing tokens follow the same naming, see research/live-tokens.json */
}
```

### 5.2 Component tokens

Layered on top of foundations; this is the surface consumers override:

```css
:root {
  --button-bg-primary: var(--color-brand-active);
  --button-bg-primary-hover: var(--color-brand);
  --button-fg-primary: var(--color-white);
  --button-bg-secondary: transparent;
  --button-border-secondary: var(--color-brand-active);
  --calendar-cell-selected-bg: var(--color-brand-active);
  --calendar-cell-other-month-bg: var(--color-background-other-month);
  --input-border-default: var(--color-border);
  --input-border-error: var(--color-vanity-metric-like);
  --alert-bg-empty: var(--color-error);
  --banner-about-bg: var(--color-content-background);
  --banner-about-fg: var(--color-content-font);
  /* …one per visual decision */
}
```

### 5.3 Cross-target distribution

CSS custom properties pierce shadow DOM by default — Lit and Stencil components inherit foundation tokens with no explicit `::part` exposure. Alpine pages link `tokens.css` once at the host page level. React/Vue/Svelte/Angular/Solid/Qwik/Preact import `dist/tokens.css` from the package root.

### 5.4 JSON mirror & sync gate

`tokens.json` carries the same data structured as `{ color: { brand: "#006663", ... }, spacing: { ... }, ... }`. A unit test (`tests/unit/tokens.test.ts`) parses both files and asserts:

1. Same set of keys.
2. Same values.
3. Every component-layer alias resolves to a foundation token (no orphan references).

CI fails if drift is detected. `pnpm tokens:sync` regenerates `tokens.json` from `tokens.css` for the lazy path.

---

## 6. Internationalisation

### 6.1 Locale set

`fr-FR` (default) and `en-GB`, both shipped in v1. Every i18n key MUST exist in both dictionaries before release; a Vitest unit test enforces strict parity.

### 6.2 Default `t` implementation

```ts
// src/utils/i18n.ts
import frFR from '../locales/fr-FR.json';
import enGB from '../locales/en-GB.json';

const dicts = { 'fr-FR': frFR, 'en-GB': enGB };

export function t(
  key: string,
  vars?: Record<string, string | number>,
  locale: 'fr-FR' | 'en-GB' = 'fr-FR'
): string {
  const dict = dicts[locale] ?? dicts['fr-FR'];
  const raw = (dict as Record<string, string>)[key] ?? key;   // identity fallback
  return vars ? interpolate(raw, vars) : raw;
}

function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_m, k) => String(vars[k] ?? ''));
}
```

### 6.3 Provider pattern (per target)

Each target ships a `<DesignSystemProvider locale="…" t={consumerT}>` — generated alongside components. Without a provider, atoms read the bundled dictionary. With a provider, the consumer's `t` (typically wired through `vue-i18n`, `react-i18next`, or `formatjs`) wins.

### 6.4 Locale switching at runtime

The provider exposes `setLocale(locale)`; library components subscribe to a tiny in-package event emitter (`onLocaleChange`) and re-render. We do **not** lazy-load dictionaries — both are well under 10 KB gzipped, and Mitosis generator output is simpler when imports are eager.

### 6.5 Date and number formatting

```ts
// src/utils/intl.ts
export type DateKind = 'shortDay' | 'longDay' | 'monthYear' | 'iso';

export function formatDate(d: Date, kind: DateKind, locale: string): string {
  const opts: Record<DateKind, Intl.DateTimeFormatOptions> = {
    shortDay:  { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
    longDay:   { weekday: 'long',  day: 'numeric', month: 'long',  year: 'numeric' },
    monthYear: { month: 'long', year: 'numeric' },
    iso:       { year: 'numeric', month: '2-digit', day: '2-digit' },
  };
  return new Intl.DateTimeFormat(locale, opts[kind]).format(d);
}

export function formatCount(n: number, locale: string): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}
```

`shortDay(new Date(2021, 3, 2), 'fr-FR')` → `Ven. 2 avr. 2021` (matches XD design and the live site).
`shortDay(new Date(2021, 3, 2), 'en-GB')` → `Fri 2 Apr 2021`.
`formatCount(35200, 'fr-FR')` → `35,2 k` (matches the live site).

---

## 7. Authentication & password rules (OWASP-aligned)

Authentication scope for v1: a self-managed **revue-de-presse.org account** with email + password. Bluesky read-only display is a separate concern handled by `BlueskyPostCard` with static mock data.

### 7.1 Length

| Rule | Value |
|---|---|
| Min length | **15** (no MFA in v1) |
| Min length when MFA ships | 8 |
| Max length | **64** (allow passphrases) |
| Truncation | Forbidden — reject on the boundary, never silently truncate |

### 7.2 Composition

| Rule | Value |
|---|---|
| Allowed characters | All Unicode code points incl. whitespace |
| Mandatory upper / lower / digit / symbol | **None** — OWASP recommends *against* composition rules |
| Helper text | "Au moins 15 caractères. Tous les caractères sont autorisés." (fr) / "At least 15 characters. All characters allowed." (en) |

### 7.3 Strength & breach checks

Pipeline runs in this order on every relevant lifecycle event:

```
1. length(value, { min: 15, max: 64 })       → errors.password.too-short / too-long
2. zxcvbnAsync(value, dictionaries)          → errors.password.weak (when score < 3)
3. localCommonPasswordsCheck(value, ncscTop10k)  → errors.password.common
4. pwnedPasswordsCheck(value)                → errors.password.breached
```

- Steps 1, 2, 3 run synchronously on keystroke (debounced 200 ms).
- Step 4 (Pwned Passwords) runs only **on blur** and only if 1, 2, **and 3** passed — avoids needless network traffic.
- The k-anonymity API takes the first 5 hex chars of SHA-1; we hash client-side via `crypto.subtle.digest('SHA-1', …)`.

`zxcvbn-ts` is a peer dependency:

```json
"peerDependencies": {
  "@zxcvbn-ts/core": "^3",
  "@zxcvbn-ts/language-common": "^3",
  "@zxcvbn-ts/language-fr": "^3",
  "@zxcvbn-ts/language-en": "^3"
}
```

We import them lazily on the first render where `mode='new'` so login pages don't pay the cost.

### 7.4 Lifecycle

| Rule | Value |
|---|---|
| Periodic rotation | None |
| Forced rotation trigger | Only on credential leak / compromise event |
| Password change form | Requires current password + new password + confirm (component flow `AuthCard.flow = 'edit-password'`) |
| Transport | TLS only (assumed by deployment, not enforced by library) |

### 7.5 Error keys

```
errors.password.too-short             "Le mot de passe doit contenir au moins {min} caractères."
errors.password.too-long              "Le mot de passe ne peut pas dépasser {max} caractères."
errors.password.weak                  "Mot de passe trop faible (zxcvbn score {score}/4 — visez 3+)."
errors.password.breached              "Ce mot de passe figure dans une fuite de données connue. Choisissez-en un autre."
errors.password.common                "Ce mot de passe est trop courant."
errors.password.confirmation-mismatch "La confirmation ne correspond pas."
```

English equivalents in `en-GB.json`.

---

## 8. Testing

### 8.1 Unit (Vitest)

- `tokens.test.ts` — `tokens.css` ↔ `tokens.json` parity, no orphan aliases.
- `i18n.test.ts` — `fr-FR.json` and `en-GB.json` have identical key sets, no missing translations.
- `password.test.ts` — boundary cases (14 chars rejected, 15 chars accepted; 64-byte boundary), Pwned hash format produces valid SHA-1 prefixes, zxcvbn score thresholds.
- `intl.test.ts` — `formatDate` produces the locked string for known inputs, `formatCount` matches live-site formatting.

### 8.2 Visual regression (Playwright)

- The demo Vite + Vue app renders each component at its documented states (4 button variants × 4 states = 16 button screenshots, etc.).
- Snapshots stored under `tests/visual/__snapshots__/` and diffed on every CI run.
- Per-target visual coverage deferred to v2; in v1 only Vue is visually tested. Cross-target consistency is established by the snapshot-comparison test introduced in v2.

### 8.3 Type checks

`tsc --noEmit` runs per target before publish. Mitosis's TypeScript output is generated; the test confirms the output type-checks in each target's expected toolchain.

---

## 9. Rollout (sequencing — not a schedule)

The implementation plan will set durations. This section sequences the work so the plan has a starting structure.

- **M1 — Foundations.** `tokens.css` + `tokens.json` (parity-tested) + 10 atoms compiled to Vue and React only. Demo Vite app boots with foundation tokens visible. Histoire wired.
- **M2 — Molecules + atom-coverage.** All 10 atoms across 5 generators (React, Vue, Svelte, Lit, Solid). Histoire stories for every atom and molecule.
- **M3 — Organisms + auth.** `Calendar`, `AuthCard`, `BlueskyPostCard`. `zxcvbn-ts` wired. Pwned Passwords integration. `fr-FR` + `en-GB` dictionaries complete and parity-tested.
- **M4 — Remaining generators.** Angular, Qwik, Preact, Stencil, Alpine. Visual regression baseline captured against the demo Vue app.
- **M5 — Publish v1.0.0.** Ten npm packages + Histoire docs site deployed to GH Pages.

---

## 10. Locked decisions

| # | Decision |
|---|---|
| 1 | Live site (`revue-de-presse.org`) is authoritative for tokens; XD deck is authoritative for component states. |
| 2 | Component-scoped CSS variables (e.g. `--button-bg-primary`) layered over foundation tokens. The `--rdp-*` proposal is dropped. |
| 3 | `<rdp-button>` tag prefix for Lit, Stencil, Angular selectors. PascalCase imports for React/Vue/Svelte/Solid/Qwik/Preact. Alpine plugin directives (`data-rdp-button`). |
| 4 | `BlueskyPostCard` replaces the XD's `TwitterCard`. Static mock data only. |
| 5 | Logo SVG extracted from the live site to `assets/logo.svg`. Other glyphs are Lucide substitutions (chevron, eye, share, heart, alert, close, profile). |
| 6 | OWASP-aligned password rules: min 15 (no MFA), max 64+, all Unicode allowed, no composition rules, breach rejection via Pwned Passwords k-anonymity, no rotation. |
| 7 | i18n: ship `fr-FR` + `en-GB` dictionaries; default `t` does dictionary lookup; consumer can inject a custom `t` via `<DesignSystemProvider>`. |
| 8 | zxcvbn-ts shipped as peer dependency; lazy-imported on first `mode='new'` render. |
| 9 | Single `Button` atom dispatches on `variant`; not seven copies. |
| 10 | State machines hand-rolled in TypeScript reducers; not XState. |
| 11 | Ten npm packages, one per Mitosis target, all sharing the same version. |

---

## 11. Open dependencies for the implementation plan

These do not block writing the implementation plan, but each one is a question the plan must resolve when it sequences work:

1. **English copy.** All `fr-FR` strings need `en-GB` equivalents written before the M3 milestone closes.
2. **Bluesky icon.** The Bluesky asset shipped is a PNG. If a vector source becomes available (Bluesky brand kit, Iconify), swap it.
3. **Histoire vs Storybook.** Default is Histoire (faster, Vue-native, lighter). Plan should switch if the project has an existing Storybook investment elsewhere.
4. **Demo app target.** Default is Vite + Vue. If a different framework is preferred for visual regression, name it before M1.
5. **CI provider.** Plan assumes GitHub Actions. If the org uses another, swap the matrix YAML.

---

*End of design.* The companion `design-system/components.md` file is the canonical component catalogue (props, states, i18n keys, artboard cross-reference) and should be read alongside this spec.
