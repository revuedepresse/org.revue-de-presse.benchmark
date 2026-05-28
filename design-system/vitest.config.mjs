import { defineConfig, configDefaults } from 'vitest/config'

// The codegen tests under scripts/__tests__ are written for Node's built-in
// test runner (node:test) and are executed via `pnpm test:scripts`. Vitest's
// default glob would otherwise pick up their *.test.mjs files and fail them
// with "No test suite found", so they are excluded from the Vitest run here.
export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'scripts/**'],
  },
})
