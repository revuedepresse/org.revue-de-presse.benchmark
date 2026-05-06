# Screen-by-screen catalogue

Generated 2026-05-06 from a Playwright walk of all 59 artboards in the Adobe XD deck `revue-de-presse-3` (`https://xd.adobe.com/view/efa136bf-7446-4b56-8607-0c5bbe14c297-baf2/grid`). Each screen was navigated to its `/screen/<uuid>/` URL and the canvas region captured at display resolution (~1280 px wide, ~3× larger than the thumbnails in `screens/`). Hi-res PNGs persist in the Playwright sandbox; this file is the persistent record.

| Idx | Artboard | Components observed | Notes |
|---|---|---|---|
| 00 | design-system-cover | — | Title slide "Design system" |
| 01 | design-system-guidelines | tokens (logo / type / icons / colours) | Pink overlay annotations show 8/58×58/160×23/48×48 px logo measurements |
| 02 | design-system-components-buttons | A.1–A.9 | 6 button families × 4 states each |
| 03 | design-system-components-calendar-mobile | C.1, C.2, C.4 | Days view (7×6 grid) + Months view (vertical list) + bottom action bar |
| 04 | design-system-components-calendar-desktop | C.1, C.2, C.4 | Action bar at top of card (not bottom) |
| 05 | design-system-components-snapshots-list | D.1, C.4 | Mobile + desktop card variants side-by-side |
| 06 | design-system-components-twitter | D.2–D.5, E.1 | Pink overlay shows 12/10/5 px gaps; 48×48 avatar; 270 px max media width |
| 07 | design-system-components-forms | B.1, A.7 | Inputs (empty/default/error) + 4-state action button |
| 08 | section-mobile-app | — | Chapter divider "Mobile calendrier" |
| 09 | revue-de-presse-mobile-home | F.1, E.3, D.1, D.2, D.3, D.4, A.3, C.4, F.4 | About banner with close ✕; SnapshotsList collapsed to "Médias français" header; FAB scroll-top |
| 10 | revue-de-presse-mobile-calendar-days | F.1, C.1, C.4 | **New finding:** mobile uses bottom-sheet overlay with scrim — content above the calendar is dimmed |
| 11 | revue-de-presse-mobile-calendar-months | F.1, C.2, C.4 | Same bottom-sheet overlay pattern |
| 12 | revue-de-presse-mobile-calendar-years | F.1, C.3, C.4 | **New finding:** year list limited to 2020/2021 — design assumes historical-only data |
| 13 | revue-de-presse-mobile-snapshots-list | F.1, D.1, C.4 | **New finding:** SnapshotsList opens as the same bottom-sheet overlay pattern as the calendar |
| 14 | section-desktop-app | — | Chapter divider "Desktop / Home + 404" |
| 15 | revue-de-presse-desktop-home-v2 | F.2, F.3, E.3, D.2–D.4 | Two-column layout: sidebar (lists + calendar + about) on left, tweet feed on right |
| 16 | revue-de-presse-desktop-404 | F.2, F.3, E.3, E.1 | Yellow alert in main content area |
| 17 | section-mobile-auth | — | Chapter divider "Mobile connexion" |
| 18 | revue-de-presse-mobile-login | F.1, A.6, F.5(LoginForm), B.*, A.7, A.9 | Default state, placeholders only |
| 19 | revue-de-presse-mobile-login-1 | F.1, A.6, F.5, B.* | Filled state, ready to submit |
| 20 | revue-de-presse-mobile-login-2 | F.1, A.6, F.5, B.*, **form-error** | **New finding:** form-level error "Vos identifiants sont incorrectes." (not field-level) — both fields red-bordered |
| 21 | revue-de-presse-mobile-login-3 | F.1, A.6, F.5(ForgotPasswordForm), B.1, A.7 | "Mot de passe oublié ?" — single-email form, default state. **Possible defect:** submit button reads "Connexion" (probably should be "Envoyer") |
| 22 | revue-de-presse-mobile-login-4 | F.1, A.6, F.5, B.1, **form-error** | Forgot-password with invalid email format → "Votre email est incorrecte." |
| 23 | revue-de-presse-mobile-password-forgotten-new-password | F.1, A.6, F.5(NewPasswordFromLink), B.3, A.7 | Single-password reset form (no current-password — auth via email link) |
| 24 | revue-de-presse-mobile-password-forgotten-input-error | F.1, A.6, F.5, B.3, **form-error** | "- Le nouveau mot de passe n'est pas assez sécurisé." with dash prefix |
| 25 | section-desktop-auth | — | Chapter divider "Desktop connexion" |
| 26 | revue-de-presse-desktop-home-login | F.2, F.3, A.6, F.5(LoginForm), B.*, A.7 | Sidebar visible during auth; "Mon espace" header link is grayed for unauthenticated state |
| 27 | revue-de-presse-desktop-home-login-1 | F.2, F.3, A.6, F.5, B.* | Filled state |
| 28 | revue-de-presse-desktop-home-login-2 | F.2, F.3, A.6, F.5, B.*, **form-error** | Same "Vos identifiants sont incorrectes." pattern as mobile 20 |
| 29 | revue-de-presse-desktop-home-login-3 | F.2, F.3, A.6, F.5(ForgotPasswordForm), B.1 | Forgot-password default — desktop mirror of mobile 21 |
| 30 | revue-de-presse-desktop-home-login-4 | F.2, F.3, A.6, F.5, B.1, **form-error** | Mirror of mobile 22 |
| 31 | revue-de-presse-desktop-home-login-5 | F.2, F.3, A.6, F.5(NewPasswordFromLink), B.3 | Mirror of mobile 23 |
| 32 | revue-de-presse-desktop-home-login-6 | F.2, F.3, A.6, F.5, B.3, **form-error** | Mirror of mobile 24 |
| 33 | section-mobile-signin | — | Chapter divider "Mobile inscription" |
| 34 | revue-de-presse-mobile-signin | F.1, A.6, F.5(SignupForm), B.1, B.3, B.4, A.7, A.9 | **New finding:** ToS checkbox `J'accepte les conditions d'utilisation` has the words "conditions d'utilisation" rendered as an inline link |
| 35 | revue-de-presse-mobile-signin-1 | F.1, A.6, F.5, B.*, **multi-error** | **New finding:** errors stack vertically, leading dash prefix: `- Le mot de passe est incorrecte.` `- Veuillez accepter les condition d'utilisation.` |
| 36 | revue-de-presse-mobile-signin-2 | F.1, A.6, **E.2** | Notice.Success: "Allez voir vos emails / Votre inscription a bien été prise en compte." |
| 37 | section-desktop-signin | — | Chapter divider "Desktop inscription" |
| 38 | revue-de-presse-desktop-home-signin | F.2, F.3, A.6, F.5(SignupForm), B.*, A.7 | Desktop mirror of mobile 34 |
| 39 | revue-de-presse-desktop-home-signin-1 | F.2, F.3, A.6, F.5, B.*, **multi-error** | Mirror of mobile 35 |
| 40 | revue-de-presse-desktop-home-signin-2 | F.2, F.3, A.6, **E.2** | Mirror of mobile 36 (signup success) |
| 41 | section-mobile-account | — | Chapter divider "Mobile compte utilisateur" |
| 42 | revue-de-presse-mobile-user-account | F.1, A.6, AccountRow×2 | Two stacked read-only rows: Mon email + modifier link, Mon mot de passe + modifier link |
| 43 | section-desktop-account | — | Chapter divider "Desktop compte utilisateur" |
| 44 | revue-de-presse-desktop-user-account | F.2, F.3, A.6, AccountRow×2 | Two account rows side-by-side (not stacked) |
| 45 | section-mobile-new-email | — | Chapter divider "Mobile changer email" |
| 46 | revue-de-presse-mobile-new-email | F.1, A.6, F.5(EditEmailForm), B.1, B.2, A.7 | Form: nouvel email + mot de passe + Valider |
| 47 | revue-de-presse-mobile-new-email-input-error | F.1, A.6, F.5, B.1, B.2, A.7, **form-error** | "Votre email est incorrecte." |
| 48 | revue-de-presse-mobile-new-email-confirm | F.1, A.6, **E.2** | Notice.Success: "Allez voir vos emails / Votre nouvel email a bien été pris en compte." |
| 49 | section-desktop-new-email | — | Chapter divider "Desktop changer email" |
| 50 | revue-de-presse-desktop-new-email | F.2, F.3, A.6, F.5, B.* | Mirror of 46 |
| 51 | revue-de-presse-desktop-new-email-1 | F.2, F.3, A.6, F.5, B.*, **form-error** | Mirror of 47 |
| 52 | revue-de-presse-desktop-new-email-2 | F.2, F.3, A.6, **E.2** | Mirror of 48 |
| 53 | section-mobile-new-password | — | Chapter divider "Mobile changer mdp" |
| 54 | revue-de-presse-mobile-new-password-1 | F.1, A.6, F.5(EditPasswordForm), B.3×2, A.7 | Two password fields: Ancien + Nouveau + Valider |
| 55 | revue-de-presse-mobile-new-password-2 | F.1, A.6, F.5, B.3×2, **multi-error** | **Design defect to flag:** both labels say "Ancien mot de passe" — the second should be "Nouveau". Errors: `- L'ancien mot de passe est incorrecte.` `- Le nouveau mot de passe n'est pas assez sécurisé.` |
| 56 | section-desktop-new-password | — | Chapter divider "Desktop changer mdp" |
| 57 | revue-de-presse-desktop-new-password | F.2, F.3, A.6, F.5, B.3×2, A.7 | **Design defect to flag:** title reads "Modifier mon mot de passer" — should be "passe" |
| 58 | revue-de-presse-desktop-new-password-1 | F.2, F.3, A.6, F.5, B.3×2, **multi-error** | Desktop mirror of mobile 55 (inferred — MCP server dropped on this final navigation; pattern verified across all other mobile-desktop mirrors in this deck) |

## Summary of new findings beyond the original `components.md` taxonomy

1. **Bottom-sheet overlay pattern (mobile only).** Calendar (10–12) and SnapshotsList (13) open as bottom-sheets with the underlying content dimmed by a scrim. Spec §4.C and §4.D should mark `Calendar` and `SnapshotsList` as having both inline and overlay rendering modes on mobile.
2. **Form-level errors are a distinct pattern from field-level errors.** Eight screens (20, 22, 24, 28, 30, 32, 35→39, 47, 51, 55, 58) display a red form-level message *below* the submit button, in addition to red field borders. The taxonomy needs a new component (`FormError`) distinct from `FieldError` (B.5). Multi-error variants stack vertically with a leading "`- `" prefix.
3. **`Notice.Success` (E.2) appears in three variants:** signup-confirm (36, 40), email-confirm (48, 52), and one variant unique to email change. Each has a bold-red headline + body. The `errors.password.weak` family wording should align with this notice in tone.
4. **Year picker has limited range in the design** (2020 / 2021 only). Either the design assumed historical-only data or the picker is meant to be paginated; in implementation we should compute the year range from data, not hard-code it.
5. **ToS checkbox label has an inline link** — `J'accepte les conditions d'utilisation` renders the trailing words as a teal underlined link that navigates to the ToS page. The `Checkbox` (B.4) needs to support a `labelChildren` slot, not just a `label` string.
6. **Forgot-password submit button is mislabeled "Connexion"** in screens 21 and 29, when it should be "Envoyer" or similar. This is a likely design defect; flag in the implementation plan.
7. **Edit-password form has only two fields**, not three — there is no separate "confirmer" input. The design relies on `current + new + Valider`. This contradicts the spec §7.4 wording "current password + new password + confirm". Reconcile: either match the design (drop the confirm field) or extend the design (add it). Recommendation: add the confirm field for safety, since OWASP-aligned UX expects it.
8. **Design defects worth flagging in the implementation plan:**
   - Screen 55 — both labels read "Ancien mot de passe"; the second should be "Nouveau mot de passe".
   - Screen 57 — title reads "Modifier mon mot de **passer**"; should be "passe".
   - Several error strings use `incorrecte` (feminine adjective) where French grammar wants `incorrect` for masculine nouns ("Le mot de passe est incorrecte" → "incorrect").
9. **The XD design copy predates the Bluesky migration.** The "À propos" sidebar text references *"l'API de Twitter"* — the live site has updated this string. The `Banner.About` component must source its copy from i18n keys, never hard-code.
10. **Header-link state for unauthenticated desktop users.** The "Mon espace" link in the desktop header (screens 15, 26–32, 38–40, 50–52, 57) is grayed out / disabled when no session is active. The `AppHeader.Desktop` (F.2) needs an `authenticated: boolean` prop driving link visibility/enabled-state.
