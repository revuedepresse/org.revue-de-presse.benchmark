# Mitosis source conventions

Rules for `.lite.tsx` components in this directory. They cover constructs that the Mitosis 0.13 Vue adapter handles cleanly and are intentionally conservative so re-introducing additional targets later does not require rewriting authoring patterns.

## Forbidden

- `class` syntax for components. Use functions.
- Synchronous mutation of refs during render.
- Direct DOM access during render. Use `onMount` / `onUpdate` lifecycle hooks.
- Default exports without a name matching the file. Use named exports.

## Required

- `useStore({ ... })` for component state. The compiler maps it to each target's idiomatic state primitive.
- Strings come from `t(key)` (default impl in `src/utils/i18n.ts`). Atoms accept `labelKey` (preferred) or `label` (literal fallback). When both are supplied, `labelKey` wins.
- Numbers and dates go through `formatCount` / `formatDate` from `src/utils/intl.ts`.
- Class names use the component-scoped CSS variable convention: `var(--button-bg-primary)`, not raw colours.
- Prop types declared inline above the component, not in a separate file.

## Event handlers

Keep handlers minimal. `onClick={() => props.onClick?.()}` compiles cleanly through Mitosis.

## Slots / children

Mitosis maps `props.children` correctly across all targets. For named slots (e.g. `Checkbox.labelChildren`), declare them as `?: any` and render with `{props.labelChildren}`.

## Styling

Inline `<style>` blocks at the bottom of the component. Reference component-layer CSS variables. Do not import a separate `.css` file — the `<style>` block is the source of truth that `post-mitosis.mjs` extracts into `output/components.css`.

## Testing

Tests live in `tests/unit/<ComponentName>.test.ts`. They assert against the **generated** Vue emit at `output/vue/src/components/<Component>.vue`, not against `.lite.tsx` directly — Mitosis source is not a runnable component.
