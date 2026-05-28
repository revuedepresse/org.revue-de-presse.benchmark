# native/ — Compose Multiplatform release runbook

## Android (Play Store)
1. Bump `appVersionCode` + `appVersionName` in `gradle/libs.versions.toml`.
2. `make native-android-release`.
3. Upload AAB to Play Console → internal track.
4. After 24h, promote to closed beta; after another 7 days, production.

## iOS (App Store)
1. Bump marketing version in `iosApp.xcodeproj` (track Android `versionName`).
2. Open Xcode → Product → Archive → Distribute → App Store Connect.
3. TestFlight internal → external (Apple review) → App Store release.
4. **Pre-requisite:** Replace `TEAMID0000` in `nuxt/public/.well-known/apple-app-site-association` with the real Apple Developer team ID, then redeploy the Nuxt site.

## Desktop (internal only)
- `make native-desktop-run` opens a window in JVM mode.
- Not distributed externally.

## TWA fallback
`make twa-release` continues to work. Either AAB can ship; whichever is uploaded last to Play Console wins.

## Known iOS framework gaps
- `:data:CleanText.kt` references `Charsets` which is JVM-only; needs to be made `expect/actual` for iOS to link.
- `:data:InstallIdStoreImpl.ios.kt` has Array vs List type issues at the Security framework interop.

These need fixing before the iOS XCFramework can fully link on a clean macOS CI runner. Tracked separately.
