import { startMockUpstream } from './support/mockUpstream';

// Playwright globalSetup runs once before any test. We start the mock upstream
// here so both apps' SSR/CSR proxy fetches land on it. Server reference is
// stashed on globalThis for the teardown step.

declare global {
  // eslint-disable-next-line no-var
  var __mockUpstream: import('node:http').Server | undefined;
}

export default async function globalSetup() {
  if (globalThis.__mockUpstream) return; // dev mode may re-run setup
  globalThis.__mockUpstream = await startMockUpstream();
}
