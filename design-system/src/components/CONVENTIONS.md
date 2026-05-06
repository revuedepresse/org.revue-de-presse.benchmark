# Mitosis source conventions

Rules for `.lite.tsx` components in this directory. These exist because Mitosis transpiles the same source to React, Vue, Svelte, Solid, Qwik, Preact, Lit, Stencil, and Alpine — patterns that work in one target may not work in others.

## Forbidden

- `class` syntax for components. Use functions.
- Synchronous mutation of refs during render — Solid and Qwik break.
- React-specific event-system shortcuts (`event.persist()`, synthetic-event pooling assumptions).
- Direct DOM access during render. Use `onMount` / `onUpdate` lifecycle hooks.
- Default exports without a name matching the file. Use named exports.

## Required

- `useStore({ ... })` for component state. The compiler maps it to each target's idiomatic state primitive.
- Strings come from `t(key)` (default impl in `src/utils/i18n.ts`). Atoms accept `labelKey` (preferred) or `label` (literal fallback). When both are supplied, `labelKey` wins.
- Numbers and dates go through `formatCount` / `formatDate` from `src/utils/intl.ts`.
- Class names use the component-scoped CSS variable convention: `var(--button-bg-primary)`, not raw colours.
- Prop types declared inline above the component, not in a separate file.

## Event handlers

Keep handlers minimal. Mitosis tolerates `onClick={() => props.onClick?.()}` cleanly across targets. Do not destructure `event.target.value` from a synthetic event in a way that assumes React's pooling.

## Slots / children

Mitosis maps `props.children` correctly across all targets. For named slots (e.g. `Checkbox.labelChildren`), declare them as `?: any` and render with `{props.labelChildren}`.

## Styling

Inline `<style>` blocks at the bottom of the component. Reference component-layer CSS variables. Do not import a separate `.css` file — Mitosis cannot transport that across targets reliably.

## Testing

Tests live in `tests/unit/<ComponentName>.test.ts`. They import from the **generated** target output (e.g. `output/vue/src/Button.vue` and `output/react/src/Button.tsx`), not from `.lite.tsx` directly — Mitosis source is not a runnable component.
