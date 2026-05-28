# native/ — Compose Multiplatform port

A Compose Multiplatform reimplementation of the Nuxt web app (`../nuxt`),
targeting **JVM desktop** (macOS / Linux / Windows), **Android**, and **iOS**
from a single Kotlin source tree.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Entry points (per platform)                                 │
│   desktopApp/  Main.kt              (jvm)                   │
│   androidApp/  MainActivity.kt      (android)               │
│   iosApp/      IosMain.kt           (ios{X64,Arm64,SimArm64})│
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼ provides RdpTheme + Koin modules
┌─────────────────────────────────────────────────────────────┐
│ :ui — Compose UI layer                                      │
│   components/    Reusable Composables (BlueskyPostCard,     │
│                  Calendar, BannerAbout, AppHeader, …)       │
│   screens/       HomeScreen, DayScreen, SourcesScreen,      │
│                  SourceScreen, LegalNoticeScreen,           │
│                  TermsOfServiceScreen, SupportScreen,       │
│                  NotFoundScreen                             │
│   nav/           Routes + RdpNavController + DeepLinks      │
│   di/            uiModule (Koin)                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼ pulls HighlightsRepository / SourcesRepository
┌─────────────────────────────────────────────────────────────┐
│ :data — REST + auth                                         │
│   api/           ApiClient, ApiEndpoints, HydraTypes        │
│   auth/          DeviceTokenInterceptor, DeviceTokenStore   │
│                  InstallIdStore (expect/actual per target)  │
│   repositories/  HighlightsRepositoryImpl,                  │
│                  SourcesRepositoryImpl, BaselineSources     │
│   mappers/       HydraToHighlight, CleanText                │
│   di/            dataModule, installIdModule                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼ Ktor 3 HttpClient (Java engine on JVM, Darwin on iOS)
                          ▼ talks to api.revue-de-presse.org
┌─────────────────────────────────────────────────────────────┐
│ :design — tokens, theme, drawables, i18n                    │
│   RdpTokens.kt (generated from                              │
│     ../design-system/research/live-tokens.json)             │
│   theme/        RdpTheme, Typography, Fonts                 │
│   drawables/    rdpLogoPainter, rdpBlueskyPainter,          │
│                 rdpNetlifyPainter                           │
│   i18n/         rdpString, currentRdpLocale (expect/actual) │
│   composeResources/drawable/{logo,bluesky,netlify}.svg      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼ uses RdpLocale + Highlight + Source entities
┌─────────────────────────────────────────────────────────────┐
│ :domain — pure Kotlin types, no Compose / no Ktor           │
│   entities/    Highlight, Source, SourceDetail, Metrics,    │
│                AppError, DeviceToken, RouteKey, RdpLocale   │
│   repositories/ HighlightsRepository, SourcesRepository,    │
│                 DeviceTokenStore, InstallIdStore (ifaces)   │
│   i18n/        RdpStrings.kt (generated from                │
│                ../design-system/output/vue/src/locales/     │
│                {fr-FR,en-GB}.json)                          │
└─────────────────────────────────────────────────────────────┘
```

The dependency direction is one-way: `ui → data → domain` and
`ui → design → domain`. The domain module is pure Kotlin with no UI / no I/O
dependencies. It only carries entity types, repository interfaces, and the
auto-generated `RdpStrings` map.

## Authentication

The native binary holds **no client secret** — the API server exposes a public
`POST /api/device-tokens` endpoint that accepts
`{platform, appVersion, installId}` and returns a short-lived Bearer:

1. `DeviceTokenInterceptor` (Ktor plugin) intercepts every request.
2. It pulls a token from `DeviceTokenStoreImpl`, which mints via
   `ApiClient.mintDeviceToken()` on first use and caches it until expiry.
3. The token is attached as `Authorization: Bearer …`.
4. On a 401, the store invalidates and the interceptor retries once.
5. On a 403 (e.g. blocked `installId`), the store rotates the install ID via
   `InstallIdStore.rotate()` and retries the mint.

Per-IP rate-limiting (token bucket: 6/min) lives on the server. See
`../org.revue-de-presse.api/src/Security/Domain/DeviceTokenMinter.php` and the
matching `config/packages/rate_limiter.yaml` `device_token_mint` policy.

## Theming + i18n

- `RdpTheme(locale = RdpLocale.FR_FR) { … }` — entry points default to French.
- All hardcoded UI text should go through
  `rdpString(RdpStrings.Key.SomeKey)`. Keys are generated from
  `../design-system/output/vue/src/locales/{fr-FR,en-GB}.json` via the
  `:domain:emitComposeStrings` Gradle task.
- Design tokens (colours, spacing, radii, typography sizes) come from
  `../design-system/research/live-tokens.json` and are emitted into
  `RdpTokens.kt` at build time. Edit the JSON, rerun
  `./gradlew :design:emitComposeTokens`, and rebuild.

## Navigation

- `RdpNavController` is a tiny mutable stack of route objects defined in
  `Routes.kt`. `navigateToPath("/sources")` parses path → route.
- `NavGraph` is a single `when` over `nav.current` that renders the right
  screen with its repositories.
- Deep links live in `DeepLinks.kt` as URI-pattern strings — the actual
  `navDeepLink {}` integration is pending an `androidMain` source split.
- Calendar floor: `Calendar.kt` exposes `ARCHIVE_FLOOR = 2025-03-04`. Day,
  month, and year selection are clamped to `[ARCHIVE_FLOOR, yesterday]` so the
  picker never lets the user navigate outside the data window.

## TLS + dev environment

- On JVM (desktop), `KtorClientFactory.jvm.kt` uses the **Java engine** for
  full TLS 1.3 support. CIO's custom TLS doesn't negotiate TLS 1.3 with the
  upstream nginx and fails the handshake.
- The factory builds an `SSLContext` that combines the system trust store
  with the **mkcert** root CA when it's present (probed via `$CAROOT`, then
  macOS / Linux / Windows mkcert default paths). Production builds (no
  mkcert) fall through to system trust silently.

## Running locally

```
make native-desktop-run        # JVM desktop window (maximised by default)
make native-android-release    # AAB for Play Console
# iOS: open iosApp/iosApp.xcodeproj in Xcode → run on a simulator / device
```

## Testing

- `make native-test` runs `:domain`, `:data`, `:design`, `:ui` JVM unit tests
  across all targets (common, JVM, Android-unit, iOS-unit where wired).
- UI tests use `runComposeUiTest` (Skiko-backed) — they boot a full Compose
  scene and assert via `onNodeWithTag(…)`.
- Visual parity audits live in `../e2e/parity/` (Playwright-driven captures
  of the Nuxt reference at 1280×800).

## Release runbook

### Android (Play Store)
1. Bump `appVersionCode` + `appVersionName` in `gradle/libs.versions.toml`.
2. `make native-android-release`.
3. Upload AAB to Play Console → internal track.
4. After 24h, promote to closed beta; after another 7 days, production.

### iOS (App Store)
1. Bump marketing version in `iosApp.xcodeproj` (track Android `versionName`).
2. Open Xcode → Product → Archive → Distribute → App Store Connect.
3. TestFlight internal → external (Apple review) → App Store release.
4. **Pre-requisite:** Replace `TEAMID0000` in
   `../nuxt/public/.well-known/apple-app-site-association` with the real
   Apple Developer team ID, then redeploy the Nuxt site.

### Desktop (internal only)
- `make native-desktop-run` opens a window in JVM mode.
- Not distributed externally.

### TWA fallback
`make twa-release` continues to work. Either AAB can ship; whichever is
uploaded last to Play Console wins.

## Known iOS framework gaps
- `:data:CleanText.kt` references `Charsets` which is JVM-only; needs to be
  made `expect/actual` for iOS to link.
- `:data:InstallIdStoreImpl.ios.kt` has Array vs List type issues at the
  Security framework interop.

These need fixing before the iOS XCFramework can fully link on a clean macOS
CI runner. Tracked separately.
