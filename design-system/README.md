# @revue-de-presse/design-system

Framework-agnostic design system for [revue-de-presse.org](https://revue-de-presse.org), authored once in [Mitosis](https://github.com/BuilderIO/mitosis) and compiled to React, Vue, Svelte, Solid, Qwik, Preact, Lit, Stencil, Alpine, and Angular.

## Quick start (local dev)

```bash
pnpm install
pnpm build           # tokens parity check + Mitosis emit + hydrate utils into outputs
pnpm test            # Vitest unit suite
pnpm story           # Histoire stories
pnpm demo            # Vite + Vue showcase app (port 5173)
```

## Layout

- `src/components/*.lite.tsx` — Mitosis source. One component per file. See `src/components/CONVENTIONS.md` for authoring rules.
- `src/tokens/tokens.css` + `tokens.json` — foundation + component-layer tokens, kept in sync by `scripts/sync-tokens.mjs`.
- `src/locales/{fr-FR,en-GB}.json` — i18n dictionaries with strict key parity (enforced by `tests/unit/i18n.test.ts`).
- `src/utils/` — i18n, Intl, password helpers.
- `src/icons/sprite.svg` — Lucide-derived icon sprite (mount once per page).
- `output/<target>/` — Mitosis emit (gitignored at `output/*/dist`). One package per generator target. After Mitosis runs, `scripts/post-mitosis.mjs` hydrates each target with `src/utils`, `src/locales`, and `src/types.ts` so emitted relative imports resolve.
- `apps/demo/` — Vite + Vue showcase consuming `output/vue/`.
- `stories/` — Histoire stories.
- `tests/unit/` — Vitest unit suite.

## License

[GNU General Public License v3.0](../LICENSE).
