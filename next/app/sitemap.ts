// Wraps the shared buildLegacySitemapUrls() that the Nuxt app also uses.
// Honors the same exclude list as nuxt.config.ts sitemap.exclude:
//   /contenu-introuvable, /source/**, /[day], /[day]/**
// (The helper already excludes these by construction — it only emits
// canonical dated routes plus the static legal/contact/support pages.)

import type { MetadataRoute } from 'next';
import { buildLegacySitemapUrls } from '../../nuxt/sitemap/build-urls';

const BASE_URL = 'https://revue-de-presse.org';

export default function sitemap(): MetadataRoute.Sitemap {
  return buildLegacySitemapUrls().map((u) => ({
    url: new URL(u.loc, BASE_URL).toString(),
    lastModified: u.lastmod,
    changeFrequency: u.changefreq,
    priority: u.priority ?? 0.7,
  }));
}
