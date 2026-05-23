# @revue-de-presse/social-bluesky

CLI that posts a daily Bluesky thread (lead + 3 replies) summarising the
previous day's top-3 most-relayed French press publications. Cron entry.

## Posting identity

Posts are authored by a **verified Bluesky handle**, configurable via
`BLUESKY_HANDLE` (default: `revue-de-presse.org`). The handle must be
verified per atproto rules (DNS TXT or `/.well-known/atproto-did`).

## Quick start

```bash
cd social/bluesky
make install                 # pnpm install + seeds .env.local from .env.local.dist
# fill in BLUESKY_HANDLE, BLUESKY_CLIENT_METADATA_URL, API_* values in .env.local
# verify nuxt is serving nuxt/public/bluesky-client-metadata.json at the URL above
make bluesky-bootstrap       # one-time interactive OAuth (writes .bluesky-session.json)
make bluesky-post-dry        # smoke-test: render and log, no PDS call
make bluesky-post            # production cron entry — posts yesterday's top 3
```

## CLI

```
post-daily-top3 [--date YYYY-MM-DD] [--force] [--dry-run]
  --date     Override the default (yesterday in $TZ).
  --force    Post even if the state file shows this date was already posted.
  --dry-run  Render the thread + log it; do not call the PDS.
```

Exit codes: `0` success / dry-run, `1` already-posted, `2` upstream failure,
`3` Bluesky / PDS failure, `4` config invalid.

## Cron

```cron
35 5 * * *  rdp-bluesky  cd /opt/rdp/social-bluesky && make bluesky-post >> /var/log/rdp-bluesky/post.log 2>&1
```

05:35 Europe/Paris posts the previous calendar day's top 3. Offset by 5
minutes from the LinkedIn sibling's 05:30.

## Files written

- `.bluesky-session.json` (mode 0600) — OAuth session blob, rotated on every
  run by `@atproto/oauth-client-node`.
- `.bluesky-session.json.did` (mode 0600) — DID summary so the CLI can find
  the session entry without unpacking the blob.
- `.bluesky-state.json` — dedupe state + last 30 thread root URIs.

All gitignored.

## CI / env mode

Set `BLUESKY_OAUTH_SESSION` (base64 of `{did, session}`) to skip the session
file. Pair with `BLUESKY_ROTATED_SESSION_FILE` so your workflow can push the
rotated session back into your secret store.

## Mention notifications

Every successful reply sends a notification to the mentioned outlet (3/day
across 3 different press accounts). Disable by removing the
`mentionResolver` call site in `bin/post-daily-top3.ts` and the `@` prefix in
`src/renderThread.ts`.

## Tests

```bash
make bluesky-test       # vitest run
make bluesky-typecheck  # tsc --noEmit
```

## License

[GNU General Public License v3.0](../../LICENSE) — same license as the rest
of the repository.

Third-party (all GPL-3.0-compatible):

| Package                       | License      | Role                                |
|-------------------------------|--------------|-------------------------------------|
| `@atproto/api`                | MIT          | XRPC client, Agent, lexicons         |
| `@atproto/oauth-client-node`  | MIT          | OAuth 2.1 + DPoP + PKCE + rotation   |
| `@atproto/jwk-jose`           | MIT          | DPoP keypair generation              |
| `sharp`                       | Apache-2.0   | OG-image resize for 1 MB blob ceiling|
| `pino`                        | MIT          | Structured JSON logging              |
| `pino-pretty`                 | MIT          | Dev-only pretty log transport        |
| `tsx`                         | MIT          | TypeScript runner                    |
| `typescript`, `vitest`        | Apache-2.0 / MIT | Build + test tooling            |

## Forking

See `docs/superpowers/specs/2026-05-23-bluesky-daily-top3-design.md` §14.
