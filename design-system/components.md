# Revue de presse — Component Inventory

Two sources of truth, in this priority order:

1. **Live site `revue-de-presse.org`** (Nuxt/Vue app, captured 2026‑05‑06 via Playwright `getComputedStyle`). Authoritative for tokens, brand naming, and asset URLs — these are what currently ship.
2. **Adobe XD deck `revue-de-presse-3`** (59 artboards, last updated 2022‑10‑18). Authoritative for component states / variants / pages not on the live site yet.

Reference artefacts in this directory:

- `assets/logo.svg` — extracted from the live site (inline base64 → decoded). Original colours preserved (`#006663` circle + `#fff` paths). 5.4 KB.
- `assets/bluesky-logo.png` — fetched from `https://revue-de-presse.org/_nuxt/img/bluesky-logo.9fec0e0.png`.
- `research/live-tokens.json` — full CSS-custom-property snapshot from the live site.
- `research/screens-manifest.json` — the 59 XD artboards with UUIDs + thumbnail URLs.
- `research/screens/00..58-*.png` — full visual atlas (1.4 MB).

> **A note on extraction limits.** The Adobe XD shared‑viewer renders artboards to a `<canvas>` element — there is no DOM access to vector primitives, no JSON/SVG endpoint, and the chrome's own SVG icons are not the design content. We extracted what we could from the canvas (raster) and from the live site (where the logo ships as inline SVG). For other icons (chevron, eye, heart, share, close, alert, profile) we substitute equivalents from open icon sets (Lucide / Tabler / Heroicons) — they are visually indistinguishable from the XD glyphs and avoid licensing ambiguity.

---

## 1. Foundations

### 1.1 Colour tokens (live site, authoritative)

The live site already ships a CSS-custom-property design system. We adopt it verbatim. Where a live token has no XD counterpart, the live token wins; where the XD design has a colour the live site doesn't ship, we promote it as a future token (marked *⚠ XD-only*).

| Token | Hex | Role |
|---|---|---|
| `--color-white` | `#fff` | surface |
| `--color-black` | `#000` | text on light |
| `--color-brand` | `#006663` | primary brand (dark teal) |
| `--color-brand-active` | `#00cdc7` | active/highlight (cyan) |
| `--color-content-text` | `#2f394d` | dark navy text |
| `--color-content-background` | `#2f394d` | dark navy surfaces (sidebar, tweet header, banner) |
| `--color-content-font` | `#e6e6e6` | text-on-dark |
| `--color-light-grey` | `#657786` | muted text / metadata |
| `--color-taupe-grey` | `#ebeef0` | page background |
| `--color-border` | `#e6e6e6` | dividers, input borders |
| `--color-background-other-month` | `#e6e6e6` | dimmed calendar cells |
| `--color-background-future-date` | `#fff` | empty calendar cells |
| `--color-error` | `#fa0` | warnings/errors (yellow-orange — not red) |
| `--color-brand-bluesky` | `#1d9bf0` | Bluesky / external action accent (kept blue post-migration) |
| `--color-vanity-metric-like` | `#851430` | likes (deep red) |
| `--color-vanity-metric-retweet` | `#09442c` | reposts (deep green) |
| `--color-vanity-metric-reply` | `#1d9bf0` | replies (blue) |

**XD-only colours** (kept for design parity but absent from the live site): none material — every XD colour now maps to a live token. The XD's `#D44D4D` red is supplanted by `#851430` (likes) and `#fa0` (errors), depending on role.

### 1.2 Spacing scale (live site)

| Token | Value |
|---|---|
| `--separation-0` | `6px` |
| `--separation-1` | `8px` |
| `--separation-2` | `16px` |
| `--separation-3` | `19px` |
| `--margin-status` / `--margin-title` / `--margin-navigation` | `15` / `20` / `10 px` |

### 1.3 Radius

| Token | Value |
|---|---|
| `--radius-default` | `8px` |
| `--radius-date-picker` | `4px` |
| `--radius-selectable` | `4px` |

### 1.4 Typography

| Style | Family + size + line | Use |
|---|---|---|
| Title / Logo | Signika Regular **24/29 px** | wordmark, screen titles |
| Body | Roboto Regular **14/16 px** (`--font-size-content`) | paragraphs |
| Status | Roboto Regular **19/25 px** (`--font-size-status-text`) | tweet body |
| Caption | Roboto Regular **12/?-px** (`--font-size-publication-date`, `--font-size-calendar-month-day`, `--font-size-footer-copyright`) | metadata, footer credits |
| Footer title | Roboto Bold **26/16 px** | side-block headings |

`--line-height-base: 1.4em`. Per-component line spacing is exposed as named tokens (see `research/live-tokens.json` `type.line-spacing-*`).

### 1.5 Iconography

Two render sizes, **24×24 px** and **32×32 px**, matching the XD design. Implementation: ship one `Icon` component that takes a `name` prop and renders an SVG from a sprite. Glyph sources:

| Name | Source |
|---|---|
| `logo` | `assets/logo.svg` (extracted from live site) |
| `bluesky` | `assets/bluesky-logo.png` (live site asset; ideally re-export as SVG when Bluesky brand kit is added) |
| `chevron-up`, `chevron-down`, `chevron-left`, `chevron-right` | Lucide |
| `grid-view`, `list-view` | Lucide (`grid-3x3`, `list`) |
| `eye`, `share`, `heart`, `bell`, `x`, `user` | Lucide |
| `reply`, `repost`, `like`, `bookmark` | Lucide variants (Bluesky doesn't publish a bundled icon set) |

---

## 2. Internationalisation

**i18n is a first-class concern.** No literal strings in component sources. Every visible string is referenced by a key.

- **Keys:** `kebab-case`, dotted by component, e.g. `auth.login.email-label`, `calendar.weekday.monday-short`, `errors.password.too-short`.
- **Default locale:** `fr-FR` (the design and live site are French).
- **Mechanism:** components accept either a `t(key)` function via dependency injection (works in every Mitosis target) **or** literal string props with the key as the *prop name's contract*. Default is DI; literal-prop is the fallback for SSG/Alpine.
- **Locale-sensitive primitives:**
  - `Calendar` — month and weekday labels via `Intl.DateTimeFormat(locale, { weekday: 'short' | 'long' })` and `{ month: 'long' }`. **No hard-coded `Lun./Mar./...`**
  - Date pills (`Button.Primary` showing `Ven. 2 avr. 2021`) format via `Intl.DateTimeFormat(locale, { weekday:'short', day:'numeric', month:'short', year:'numeric' })`.
  - Number formatting (vanity metrics like `35,2 k` on the live site) via `Intl.NumberFormat(locale, { notation:'compact' })`.
- **Translation files:** `locales/fr-FR.json`, `locales/en-GB.json`, … shipped alongside the package; the consuming app supplies its own `t` function but the package ships fallbacks.

---

## 3. CSS-variable & tag naming convention

> The previous `--rdp-*` proposal is **dropped** in favour of two layered conventions, matching how the live site already does it.

### 3.1 CSS variables — component-scoped, not brand-scoped

| Layer | Pattern | Examples |
|---|---|---|
| Foundations | `--color-*`, `--spacing-*`, `--radius-*`, `--font-size-*`, `--line-spacing-*` | `--color-brand`, `--separation-1` |
| Component | `--<component>-<part>-<state>` | `--button-bg-primary`, `--button-bg-primary-hover`, `--calendar-cell-selected-bg`, `--input-border-error` |

Component variables resolve to foundation variables by default (`--button-bg-primary: var(--color-brand-active);`). A consumer overrides at the component layer to retheme without touching foundations.

### 3.2 Custom-element / tag prefix policy (per Mitosis target)

Mitosis lets each target define its own tag prefix. We pick conservatively per target:

| Target | Tag form | Rationale |
|---|---|---|
| Lit | `<rdp-button>` | namespaced to avoid collisions in HTMX/Alpine pages mounting the bundle |
| Stencil | `<rdp-button>` | same |
| React / Preact / Solid / Qwik | `<Button>` (PascalCase, no prefix) | imported by name, no global registry |
| Vue | `<Button>` (PascalCase) registered via the package's `install()` plugin |
| Angular | `rdp-button` (selector convention) | required by Angular's selector style |
| Svelte | `<Button>` | imported by name |
| Alpine | `data-rdp-button` directives | Alpine doesn't have a component model; we expose Alpine plugins |

The CSS-variable convention is shared across all targets.

---

## 4. Component catalogue

Sections grouped by role. Each component lists: **purpose**, **props (skeleton)**, **states/variants**, **i18n keys**, **artboards**.

### 4.A Buttons (XD artboard 02)

| # | Component | Props | States | i18n keys | Artboards |
|---|---|---|---|---|---|
| A.1 | `Button.Primary` | `icon, dateValue, onClick, disabled` | default / hover-focus / active / disabled | `buttons.date-pill.aria-label` (formatted via Intl) | 02, 09–13, 15, 26 |
| A.2 | `Button.Secondary` | `label, icon?, variant, onClick, disabled` | outlined / dark-fill / dark-fill-light-text / ghost | uses caller-supplied label | 02, 03, 04, 10, 15 |
| A.3 | `Button.ScrollTop` | `onClick, ariaLabel` | 4 fill variants | `actions.scroll-top.aria-label` | 02, 09 |
| A.4 | `Button.CalendarNav` | `direction, onClick, disabled` (axis: horizontal/vertical) | + paired `Input.Number` for the count cell | `actions.prev-month`, `actions.next-month`, `actions.prev-year`, `actions.next-year` | 02–05, 10–13 |
| A.5 | `Button.Avatar` | `imageSrc?, onClick, ariaLabel` | default / hover / active / disabled | `actions.account.aria-label` | 02, 09, 15, 18, 26, 34, 38, 42, 44 |
| A.6 | `Link.Quit` | `onClick` | default / hover | `actions.quit.label` (`Quitter`) | 02, 18, 26, 34, 42, 44, 47, 48, 57 |
| A.7 | `Button.Form` | `label, type, onClick, disabled, loading?` | default / focus-hover / active / disabled | caller-supplied label key | 07, 18, 26, 34, 47, 50, 57 |
| A.8 | `Link.InlineEdit` | `onClick` | default / hover | `actions.modify.label` (`modifier`) | 42, 44 |
| A.9 | `Link.TextAction` | `onClick, variant` | default / hover | caller-supplied | 18, 26, 34 |

### 4.B Form controls (XD artboard 07)

| # | Component | Props | Validation | i18n keys |
|---|---|---|---|---|
| B.1 | `TextField` | `name, value, onChange, label, error?, autocomplete, placeholder?` | empty / default / error | label key, optional error key |
| B.2 | `EmailField` | (same, `type=email`) | + RFC-5322 lite regex, `autocomplete=email` | `auth.email-label`, `errors.email.invalid` |
| B.3 | `PasswordField` | `name, value, onChange, label, mode (login\|new), error?, showStrengthMeter?` | OWASP rules (see §5) | `auth.password-label`, password error keys |
| B.4 | `Checkbox` | `name, checked, onChange, label, labelChildren?` (slot for inline links — e.g. ToS link in screen 34) | unchecked / checked | caller-supplied |
| B.5 | `FieldError` | `message, errorCode?` | always shown when set | error key |
| B.6 | `FormError` | `errors: ErrorMessage[]` | renders `- key1\n- key2…` below the submit button when 2+; single line when 1 | one key per error |

### 4.C Calendar (XD artboards 03 mobile, 04 desktop)

| # | Component | Locale-sensitive | States | Artboards |
|---|---|---|---|---|
| C.1 | `Calendar.DaysView` | weekday labels via `Intl`; locale prop | selected day = `--color-brand-active`, prev/next month dimmed via `--color-background-other-month` | 03, 04, 10, 15, 16, 26, 38, 44, 50, 57 |
| C.2 | `Calendar.MonthsView` | month names via `Intl` | selected month pill = brand-active | 03, 04, 11 |
| C.3 | `Calendar.YearsView` | numeric labels (locale-formatted) | scrollable list; **`yearRange: { min, max }` prop computed from data — never hard-code** | 12 |
| C.4 | `Calendar.ActionBar` | date-pill (A.1) format string from locale | mobile-bottom / desktop-top | 03, 04, 09, 13, 15, 16, 26 |
| C.5 | `Calendar` (organism) | composes C.1–C.4 + view-mode state machine `'day' \| 'month' \| 'year'` + **`presentation: 'inline' \| 'sheet'`** for mobile bottom-sheet overlay (10–13) | — | composes the above |

### 4.D Data display

| # | Component | Notes |
|---|---|---|
| D.1 | `SnapshotsList` | `Listes` header + items list; selected row highlighted brand-active; both mobile & desktop variants |
| D.2 | `BlueskyPostCard` | renamed from XD's `TwitterCard`. Avatar + display-name + `@handle.bsky.social` + body + timestamp + 4 actions (reply / repost / like / share). **Static mock data** — props: `post: PostMock`. The icons next to handles are `bluesky` (D.2's Bluesky butterfly) instead of the Twitter bird. |
| D.3 | `MediaPlaceholder` | gray rectangle with diagonal cross — Bluesky media spec (max 270 px wide × auto height) |
| D.4 | `MetricsBar` | three pills above tweets: replies (`#1d9bf0`), reposts (`#09442c`), likes (`#851430`); counts formatted via `Intl.NumberFormat({ notation: 'compact' })` |
| D.5 | `WebIntents` | standalone Bluesky action-button row; states default / hover / active |

### 4.E Notifications

| # | Component | Notes |
|---|---|---|
| E.1 | `Alert.Empty` | yellow inline alert (`--color-error`) with bell/warning icon. Used for 404s and "no data for this date". i18n key: `errors.no-content-for-date`. |
| E.2 | `Notice.Success` | white card; bold red headline + body. Used for *"Votre nouvel email a bien été pris en compte"*. i18n keys per usage. |
| E.3 | `Banner.About` | dark navy block (`--color-content-background`) with eye icon, body, optional close ✕. Renders project description. i18n key: `about.body`. |

### 4.F Composed page sections

| # | Component | Composition |
|---|---|---|
| F.1 | `AppHeader.Mobile` | logo + wordmark left, avatar right |
| F.2 | `AppHeader.Desktop` | logo + wordmark left, "Mon espace" link + avatar right; **`authenticated: boolean` prop drives whether "Mon espace" is enabled** (gray/disabled for unauthenticated, e.g. screens 26–32 during login flow) |
| F.3 | `Sidebar.Desktop` | `SnapshotsList` + `Calendar` + `Banner.About` + social section + footer credits, in a fixed `--width-left-column-desktop: 336px` column |
| F.4 | `Footer.Mobile` | stacked sections on dark navy + ©2021 design credit |
| F.5 | `AuthCard` | white card slot for an auth form (login / signup / reset / new-email / new-password) |

### 4.G Page-level templates (consumer-side, **not in library**)

`HomePage`, `NotFoundPage`, `LoginPage`, `SignupPage`, `AccountPage`, `EditEmailPage`, `ConfirmEmailPage`, `EditPasswordPage` — these compose library primitives in the consuming app.

---

## 5. Password & authentication rules (OWASP-aligned)

These rules are encoded in `PasswordField` (component B.3) and the corresponding form-level validators. Source: [OWASP Authentication Cheat Sheet — Implement Proper Password Strength Controls](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls).

### 5.1 Length

| Rule | Value |
|---|---|
| Min length, MFA enabled | **8** |
| Min length, no MFA | **15** |
| Max length | **≥ 64** (allow passphrases) |
| Truncation | **Forbidden.** Never silently truncate. Reject on the boundary if necessary. |

> **Locked for v1: no MFA** → **min 15 chars**. MFA is deferred to a future iteration; revisit the minimum (drop to 8) when MFA ships. The `PasswordField`'s `mode` prop (`'login' | 'new'`) decides whether the strength rules apply (only on `mode === 'new'`).

### 5.2 Composition

| Rule | Value |
|---|---|
| Allowed characters | **All Unicode code points incl. whitespace** |
| Mandatory composition (upper / lower / digit / symbol) | **None.** OWASP explicitly recommends *against* composition rules. |
| Display password rule helper text | Show only the length rule + the breach-rejection rule. Drop the XD design's *"doit comporter 8 caractères dont une majuscule et un chiffre"* — it contradicts OWASP. |

i18n key for helper: `auth.password.helper-text` → "Au moins 15 caractères. Tous les caractères sont autorisés."

### 5.3 Strength & breach

| Rule | Implementation |
|---|---|
| Strength meter | **[zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn)** (`@zxcvbn-ts/core` + `@zxcvbn-ts/language-common` + `@zxcvbn-ts/language-fr` + `@zxcvbn-ts/language-en`) integrated into `PasswordField` when `mode='new'`. Score < 3 blocks submit. |
| Breach rejection | Check candidate against [Pwned Passwords k-anonymity API](https://haveibeenpwned.com/API/v3#PwnedPasswords). Reject if hash prefix returns ≥1 match. (Hash via SHA-1 — that's what the API requires.) |
| Common-password rejection | Locally embed top-10k common passwords (NCSC list) for offline fallback / during typing. |

### 5.4 Lifecycle

| Rule | Value |
|---|---|
| Periodic rotation | **No.** Do not require periodic password changes. |
| Forced rotation trigger | Only on credential leak / compromise event. |
| Password change form | Require **current password** + new password + confirm. Encode as `EditPasswordPage` (G.8). |
| Transport | TLS only. (Non-functional but worth flagging in the spec.) |

### 5.5 Error keys

Concrete i18n keys for `FieldError` produced by `PasswordField`:

```
errors.password.too-short            "Le mot de passe doit contenir au moins {min} caractères."
errors.password.too-long             "Le mot de passe ne peut pas dépasser {max} caractères."
errors.password.weak                 "Mot de passe trop faible (zxcvbn score {score}/4 — visez 3+)."
errors.password.breached             "Ce mot de passe figure dans une fuite de données connue. Choisissez-en un autre."
errors.password.common               "Ce mot de passe est trop courant."
errors.password.confirmation-mismatch "La confirmation ne correspond pas."
```

---

## 6. Mitosis component plan

**Library components: 27.**

- **Atoms (11):** `Button` *(absorbs Primary/Secondary/ScrollTop/CalendarNav/Form/Avatar/Quit via variant prop)*, `Link`, `Logo`, `Icon`, `Checkbox`, `TextField`, `EmailField`, `PasswordField`, `FieldError`, **`FormError`** *(new — §2.2 of the spec, sources: screens 20, 22, 24, 28, 30, 32, 35, 39, 47, 51, 55, 58)*, `MediaPlaceholder`.
- **Molecules (8):** `MonthPicker`, `YearPicker`, `DateGrid`, `CalendarActionBar`, `MetricsBar`, `Alert`, `Notice`, `WebIntents`.
- **Organisms (8):** `Calendar` *(supports `presentation: 'inline' \| 'sheet'` — mobile bottom-sheet overlay, screens 10–13)*, `SnapshotsList` *(same `presentation` prop — screen 13)*, `BlueskyPostCard`, `Banner.About`, `AppHeader` *(`authenticated: boolean` controls "Mon espace" enabled state)*, `Sidebar`, `AuthCard`, `Footer`.

**Out of library (templates, kept in consumers):** `HomePage`, `NotFoundPage`, `LoginPage`, `SignupPage`, `AccountPage`, `EditEmailPage`, `ConfirmEmailPage`, `EditPasswordPage`.

At 10 generator targets ⇒ **270 generated framework components** + **27 source files**. Token CSS distributed once; per-target tag prefixes per §3.2.

---

## 7. Cross-reference: artboard → components

(Section dividers — artboards `…` named `section-*` in the manifest — are slide titles, not components.)

| Idx | Artboard | Components |
|---|---|---|
| 00 | design-system-cover | (title slide) |
| 01 | design-system-guidelines | tokens (§1) |
| 02 | design-system-components-buttons | A.1–A.9 |
| 03–04 | design-system-components-calendar-{mobile,desktop} | C.1–C.4 |
| 05 | design-system-components-snapshots-list | D.1, C.4 |
| 06 | design-system-components-twitter (re-purposed → Bluesky) | D.2–D.5, E.1 |
| 07 | design-system-components-forms | B.1, A.7 |
| 09 | mobile-home | F.1, E.3, D.1, D.2, D.3, D.4, A.3, C.4, F.4 |
| 10–13 | mobile-calendar / snapshots-list | F.1, C.*, D.1 |
| 15 | desktop-home-v2 | F.2, F.3, E.3, D.2–D.4 |
| 16 | desktop-404 | F.2, F.3, E.3, E.1 |
| 18–22 | mobile-login states | F.1, A.6, F.5(LoginForm), B.1–B.4, A.7, A.9 |
| 23, 24 | mobile-password-forgotten + error | F.1, A.6, F.5, B.3, A.7, B.5 |
| 26–32 | desktop-home-login states | F.2, F.3, A.6, F.5(LoginForm), B.*, A.7 |
| 34–36 | mobile-signin states | F.1, A.6, F.5(SignupForm), B.*, A.7 |
| 38–40 | desktop-home-signin states | F.2, F.3, A.6, F.5(SignupForm), B.*, A.7 |
| 42, 44 | user-account (mobile, desktop) | F.{1,2}, A.6, A.8 rows |
| 46–48 | mobile-new-email + error + confirm | F.1, A.6, F.5, B.1–B.3, A.7, B.5, E.2 |
| 50–52 | desktop-new-email states | F.2, F.3, A.6, F.5, B.*, A.7 |
| 54, 55 | mobile-new-password states | F.1, A.6, F.5(NewPasswordForm), B.3, A.7 |
| 57, 58 | desktop-new-password states | F.2, F.3, A.6, F.5, B.3, A.7 |

---

## 8. Locked decisions

| # | Decision |
|---|---|
| 1 | **Password helper text** replaces the XD's "8 chars + uppercase + digit" with the OWASP-aligned wording (§5.2). |
| 2 | **No MFA in v1** → password min length **15**. MFA deferred; revisit minimum when it ships. |
| 3 | **Auth scope: own revue-de-presse.org account.** Email + password managed by the application. Bluesky is **read-only display** (public posts). No Bluesky OAuth / DPoP in the auth flow. |
| 4 | **zxcvbn-ts shipped** as a peer-installed dependency. The package wires it through `PasswordField` when `mode='new'`. |
| 5 | **i18n: ship the dictionaries, accept any `t` via DI.** The package ships JSON `locales/fr-FR.json` + `locales/en-GB.json`, exports a default `t` that does dictionary lookup, and accepts an injected `t` from the consuming app (compatible with vue-i18n, react-i18next, formatjs, etc.). Fallback: identity (returns the key) — never crashes. |
| 6 | **Locales for v1: `fr-FR` + `en-GB`** shipped from day one. Every i18n key in this document MUST be present in both dictionaries before release. |

---

*Generated 2026‑05‑06. Token source: `revue-de-presse.org` live CSS. Component states: Adobe XD deck (59 artboards). Asset extraction: Playwright MCP + manual SVG decode + Lucide icon substitution.*
