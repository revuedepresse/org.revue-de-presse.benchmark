import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@design-system': fileURLToPath(new URL('../../output/react/src', import.meta.url)),
      '@tokens': fileURLToPath(new URL('../../src/tokens', import.meta.url)),
      '@icons': fileURLToPath(new URL('../../src/icons', import.meta.url)),
    },
  },
});
