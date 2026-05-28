# Component conventions

- One file per component. No nested composables exported.
- Public composables take a trailing `modifier: Modifier = Modifier`.
- Colours: `RdpColors.*` only — never raw hex, never `Color.Red`. Detekt rule enforces.
- Strings: `rdpString(RdpStrings.Key.X)` only — never literals. Detekt rule enforces.
- Test tags mirror the BEM-style class names from `design-system/output/components.css`:
  `Modifier.testTag("<ComponentName>.<part>")`. Examples:
  - `.rdp-alert` → `"Alert.root"`
  - `.rdp-bluesky-post-card__header` → `"BlueskyPostCard.header"`
- Every component has `@Preview` (Android) + a desktop preview function, with both `RdpLocale.FR_FR` and `RdpLocale.EN_GB` variants.
- Port from `design-system/src/components/<Name>.lite.tsx` — the Mitosis source, not the Vue/React output.
