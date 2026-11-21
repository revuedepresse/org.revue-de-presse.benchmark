import { defineConfig, configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// The codegen tests under scripts/__tests__ are written for Node's built-in
// test runner (node:test) and are executed via `pnpm test:scripts`. Vitest's
// default glob would otherwise pick up their *.test.mjs files and fail them
// with "No test suite found", so they are excluded from the Vitest run here.
export default defineConfig({
  // Lets unit tests server-render emitted components (output/vue/**/*.vue)
  // instead of only matching their source text.
  plugins: [vue()],
  test: {
    exclude: [...configDefaults.exclude, 'scripts/**'],
  },
})
