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
make install                 # pnpm install + seeds .env.local (mode 0600) from .env.local.dist
# fill in BLUESKY_HANDLE, BLUESKY_CLIENT_METADATA_URL, BLUESKY_REDIRECT_URI, API_* values in .env.local
make bluesky-keygen          # one-time: ES256 client key -> JWKS + BLUESKY_PRIVATE_JWK
# commit nuxt/public/bluesky-jwks.json and deploy, so jwks_uri resolves
# verify nuxt is serving nuxt/public/bluesky-client-metadata.json at the URL above
make bluesky-bootstrap       # one-time interactive OAuth (writes .bluesky-session.json)
make bluesky-post-dry        # smoke-test: render and log, no PDS call
make bluesky-post            # production cron entry — posts yesterday's top 3
```

## Session lifetime — read this before deploying

atproto caps the **absolute** lifetime of an OAuth session. Refreshing does not
extend it; when the ceiling is reached the PDS answers `invalid_grant` /
`"Session expired"` and `@atproto/oauth-client` then *deletes the stored
session*, so every later run fails with the rather misleading `The session was
deleted by another process`.

| Client type                                 | Ceiling     |
|---------------------------------------------|-------------|
| public — `token_endpoint_auth_method: none`  | **2 weeks** |
| confidential — `private_key_jwt`             | **2 years** |

This project therefore runs as a **confidential client**. `make bluesky-keygen`
generates the ES256 key that makes it one: the public half is written to
`nuxt/public/bluesky-jwks.json` (commit and deploy it), the private half is
printed once for `.env.local` as base64.

Two atproto rules make the switch all-or-nothing, so `src/clientMetadata.ts`
derives everything from whether `BLUESKY_PRIVATE_JWK` is set, and refuses the
invalid halfway states outright:

- a `native` client **must** authenticate with `none` — it cannot be confidential;
- a loopback (`127.0.0.1`) redirect URI is allowed **only** for `native` clients.

Hence a confidential client is `application_type: "web"` with an HTTPS redirect
(`/bluesky-callback`, served by the nuxt app), and bootstrap uses paste-back
rather than a local listener.

Leaving `BLUESKY_PRIVATE_JWK` empty still works — you get the old public/native
shape and a fortnightly re-authorisation. `make bluesky-post` logs which mode it
is in on every run, and warns for the last 14 days before the ceiling.

### Rotating the client key

```bash
make bluesky-keygen KID=rdp-2027-01   # appends a second key to the JWKS
```

Deploy the JWKS with both keys, switch `BLUESKY_PRIVATE_JWK` to the new one,
then remove the old entry once no session depends on it. No user interaction is
involved — unlike the session itself, client keys rotate unattended.

### Bootstrapping on a headless production host

`make bluesky-bootstrap` auto-detects headless mode when `$SSH_CONNECTION`
is set (or when binding the redirect port fails). It then skips the browser
launch and the loopback listener, prints the auth URL, and waits for you to
paste the redirected URL back on stdin. Open the URL on your laptop, approve,
copy the failed-to-load URL out of the address bar (it carries `code=…` and
`state=…`), paste it into the SSH session — done, no port-forwarding needed.

Paste-back reads from `/dev/tty` directly, so it works even when `make` /
`pnpm` closes the child's stdin (Linux production hosts hit this). If
`/dev/tty` is unreachable (some containers), or paste-back fails for any
reason, re-run with `BLUESKY_CALLBACK_URL=<full-redirect-url>` set — the
script skips the stdin prompt entirely and uses that value.

Alternative: bootstrap once locally and `scp` `.bluesky-session.json` (+
`.bluesky-session.json.did`) to the server's `BLUESKY_SESSION_FILE` path, or
base64 the blob into `BLUESKY_OAUTH_SESSION` (see "CI / env mode" below).

## CLI

```
post-daily-top3 [--date YYYY-MM-DD] [--force] [--dry-run]
  --date     Override the default (yesterday in $TZ).
  --force    Post even if the state file shows this date was already posted.
  --dry-run  Render the thread + log it; do not call the PDS.
```

Exit codes: `0` success / dry-run, `1` already-posted, `2` upstream failure,
`3` Bluesky / PDS failure, `4` config invalid, `5` duplicate top-3 content.

## Cron

```cron
35 5 * * *  rdp-bluesky  cd /opt/rdp/social-bluesky && make bluesky-post >> /var/log/rdp-bluesky/post.log 2>&1
```

05:35 Europe/Paris posts the previous calendar day's top 3. Offset by 5
minutes from the LinkedIn sibling's 05:30.

Two safety gates run before posting: a per-day check (via the PDS
`getAuthorFeed` against our own DID) and a publication-IDs check (against
the local state file's most-recent entry). A trip exits cleanly — `1` for
the per-day gate, `5` for the content gate. Pass `--force` to bypass both.

## Files written

- `.bluesky-session.json` (mode 0600) — OAuth session blob, rotated on every
  run by `@atproto/oauth-client-node`.
- `.bluesky-session.json.did` (mode 0600) — DID summary so the CLI can find
  the session entry without unpacking the blob.
- `.bluesky-session.json.bootstrapped-at` (mode 0600) — when the session was
  authorised. The absolute ceiling is not readable from the blob (a refresh
  token is opaque, not a JWT), so this is what the expiry warning counts from.
- `.bluesky-session.json.revoked` (mode 0600) — written only when the OAuth
  client purges the session after a failed refresh, so the next operator can
  tell "expired" apart from "never bootstrapped".
- `.bluesky-state.json` — dedupe state + last 30 thread root URIs.
- `.lock-*` — advisory lock files guarding token refresh; removed on release.

All gitignored.

## CI / env mode

Set `BLUESKY_OAUTH_SESSION` (base64 of `{did, session}`) to skip the session
file. Pair with `BLUESKY_ROTATED_SESSION_FILE` so your workflow can push the
rotated session back into your secret store.

Optionally set `BLUESKY_ROTATED_STATE_FILE` so the CLI also writes the
updated dedupe state on each successful post; the workflow uploads it back
and materialises it at `$BLUESKY_STATE_FILE` before the next run. Without
this, the per-day check (via `app.bsky.feed.getAuthorFeed`) still works in
env mode, but the publication-IDs gate is a no-op.

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

See the design notes maintained by the project for the forking guidance.
