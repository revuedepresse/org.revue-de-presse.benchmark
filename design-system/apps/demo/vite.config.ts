import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@design-system': fileURLToPath(new URL('../../output/vue/src', import.meta.url)),
      '@tokens': fileURLToPath(new URL('../../src/tokens', import.meta.url)),
      '@icons': fileURLToPath(new URL('../../src/icons', import.meta.url)),
    },
  },
});
