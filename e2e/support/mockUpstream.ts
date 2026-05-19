// Mock upstream API server. Both apps' proxies (Nuxt server/api/highlights.get.ts
// and Next app/api/highlights/route.ts) call this to mint tokens and fetch
// highlights, then forward to the browser. Started in globalSetup so it
// catches SSR fetches that page.route() cannot.

import { createServer, type Server } from 'node:http';
import { getFixture } from '../fixtures/highlights';

export const UPSTREAM_PORT = 4000;
export const UPSTREAM_URL = `http://localhost:${UPSTREAM_PORT}`;

export function startMockUpstream(): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? '/', UPSTREAM_URL);

      // POST /api/token — token mint endpoint
      if (url.pathname === '/api/token' && req.method === 'POST') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({
          access_token: `mock-token-${Date.now()}`,
          token_type: 'Bearer',
          expires_in: 3600,
        }));
        return;
      }

      // GET /api/highlights — Hydra collection. The apps' proxy code adapts
      // this back to the legacy { aggregates, statuses, version } shape.
      if (url.pathname === '/api/highlights' && req.method === 'GET') {
        const startDate = url.searchParams.get('startDate') ?? '2026-05-01';
        const fixture = getFixture(startDate);
        const hydraBody = {
          '@context': '/api/contexts/Highlight',
          '@id': '/api/highlights',
          '@type': 'hydra:Collection',
          'hydra:totalItems': fixture.statuses.length,
          'hydra:member': fixture.statuses.map((s) => ({
            '@id': `/api/highlights/${s.publication_id}`,
            publicationId: s.publication_id,
            screenName: s.screen_name,
            avatarUrl: s.avatar_url,
            text: s.text,
            reposts: s.reposts,
            likes: s.likes,
            replies: s.replies,
            date: s.date,
            url: s.url,
          })),
        };
        res.writeHead(200, { 'content-type': 'application/ld+json' });
        res.end(JSON.stringify(hydraBody));
        return;
      }

      // Anything else: 404
      res.writeHead(404, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: `Mock upstream: no handler for ${req.method} ${url.pathname}` }));
    });

    server.on('error', reject);
    server.listen(UPSTREAM_PORT, () => resolve(server));
  });
}

export function stopMockUpstream(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}
