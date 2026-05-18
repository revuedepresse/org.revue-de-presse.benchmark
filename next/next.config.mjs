import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // typedRoutes disabled: dynamic URLs from urlForDate() are runtime strings,
  // not statically-knowable Route literals. Re-enable later with `as Route`
  // casts at call sites if needed.
  webpack: (cfg) => {
    cfg.resolve.alias['@'] = here;
    cfg.resolve.alias['@design-system'] = path.join(repoRoot, 'design-system/output/react/src');
    cfg.resolve.alias['@tokens'] = path.join(repoRoot, 'design-system/src/tokens');
    cfg.resolve.alias['@icons'] = path.join(repoRoot, 'design-system/src/icons');
    return cfg;
  },
};

export default config;
