import { stopMockUpstream } from './support/mockUpstream';

declare global {
  // eslint-disable-next-line no-var
  var __mockUpstream: import('node:http').Server | undefined;
}

export default async function globalTeardown() {
  if (globalThis.__mockUpstream) {
    await stopMockUpstream(globalThis.__mockUpstream);
    globalThis.__mockUpstream = undefined;
  }
}
