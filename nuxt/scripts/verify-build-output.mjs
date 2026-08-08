#!/usr/bin/env node
// Assert that `nuxt build` actually emitted the application, not just an
// error-page shell.
//
// A misresolved `srcDir` does not fail the build. Nuxt finds no pages, emits
// only the 404/500 chunks, exits 0 and prints neither error nor warning — so
// a deploy of that output serves a site where every route is missing. The
// specific trap here is that Nuxt 4 defaults `srcDir` to 'app/', which in this
// workspace is the gitignored bubblewrap Android project; the failure
// therefore cannot reproduce in CI, where that directory does not exist.
//
// Expectations are derived from pages/ rather than hardcoded, so adding or
// renaming a page keeps this honest without anyone remembering to edit a list.

import { readdir, access } from 'node:fs/promises';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const nuxtDir = fileURLToPath(new URL('..', import.meta.url));
const pagesDir = join(nuxtDir, 'pages');
const chunkDir = join(nuxtDir, '.output/server/chunks/build');
const publicDir = join(nuxtDir, '.output/public');

/** Route params are directory-safe-ified: `[day].vue` -> `_day_-<hash>.mjs`. */
const chunkPrefix = (vueFile) => basename(vueFile, '.vue').replaceAll('[', '_').replaceAll(']', '_');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.vue')) out.push(full);
  }
  return out;
}

async function main() {
  for (const [label, dir] of [['pages/', pagesDir], ['.output/server/chunks/build/', chunkDir]]) {
    try {
      await access(dir);
    } catch {
      throw new Error(`${label} not found at ${dir} — run \`pnpm build\` first`);
    }
  }

  const pages = await walk(pagesDir);
  if (pages.length === 0) throw new Error('pages/ contains no .vue files — nothing to verify against');

  const chunks = (await readdir(chunkDir)).filter((f) => f.endsWith('.mjs') && !f.endsWith('.map'));

  const missing = pages.filter((p) => {
    const prefix = `${chunkPrefix(p)}-`;
    return !chunks.some((c) => c.startsWith(prefix));
  });

  // A build that lost its srcDir keeps the error pages, so their presence
  // proves nothing. Report on real routes only.
  const routeChunks = chunks.filter((c) => !/^(error-|entry|styles|server|client|app-styles)/.test(c));

  const problems = [];
  if (missing.length > 0) {
    problems.push(
      `${missing.length}/${pages.length} page(s) produced no chunk:\n` +
        missing.map((p) => `    - ${relative(nuxtDir, p)}`).join('\n'),
    );
  }
  if (routeChunks.length === 0) {
    problems.push('no route chunks at all — the build emitted an error-page shell');
  }

  for (const asset of ['bluesky-client-metadata.json', 'bluesky-jwks.json']) {
    // Served at a URL the atproto authorization server fetches by client_id;
    // losing it silently breaks the Bluesky bot's next bootstrap.
    try {
      await access(join(publicDir, asset));
    } catch {
      problems.push(`.output/public/${asset} missing — public/ was not copied`);
    }
  }

  if (problems.length > 0) {
    process.stderr.write(`\n✗ nuxt build output is incomplete\n\n  ${problems.join('\n  ')}\n\n`);
    process.exit(1);
  }

  process.stdout.write(
    `✓ build output verified — ${pages.length} pages, ${routeChunks.length} route chunks, public assets present\n`,
  );
}

main().catch((err) => {
  process.stderr.write(`✗ ${err.message}\n`);
  process.exit(1);
});
