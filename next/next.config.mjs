import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  webpack: (cfg) => {
    cfg.resolve.alias['@design-system'] = path.join(repoRoot, 'design-system/output/react/src');
    cfg.resolve.alias['@tokens'] = path.join(repoRoot, 'design-system/src/tokens');
    cfg.resolve.alias['@icons'] = path.join(repoRoot, 'design-system/src/icons');
    return cfg;
  },
};

export default config;
