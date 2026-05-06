import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '@design-system': fileURLToPath(new URL('../../output/solid/src', import.meta.url)),
      '@tokens': fileURLToPath(new URL('../../src/tokens', import.meta.url)),
      '@icons': fileURLToPath(new URL('../../src/icons', import.meta.url)),
    },
  },
});
