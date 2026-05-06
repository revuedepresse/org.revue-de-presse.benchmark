import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@design-system': fileURLToPath(new URL('../../output/svelte/src', import.meta.url)),
      '@tokens': fileURLToPath(new URL('../../src/tokens', import.meta.url)),
      '@icons': fileURLToPath(new URL('../../src/icons', import.meta.url)),
      '@components-css': fileURLToPath(new URL('../../output/components.css', import.meta.url)),
    },
  },
});
