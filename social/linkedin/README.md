# @revue-de-presse/social-linkedin

CLI that posts the previous day's Revue de Presse top 10 to the LinkedIn
organization page once per day. Run from cron in production.

## Posting identity

Posts are authored by a LinkedIn **organization page**, not a personal profile.

- **Organization URN:** `urn:li:organization:75720423` (the
  [Revue de Presse company page](https://www.linkedin.com/company/75720423/admin/settings/)).
- **Configured by:** the `LINKEDIN_ORGANIZATION_URN` env var. Defaults to the
  URN above; override in `.env.local` only if posting to a different page.
- **Sent to LinkedIn at:** `bin/post-daily-top10.ts` → `linkedinClient.createPost(...)`
  → the `author` field of the `/rest/posts` body.

The human who runs `make linkedin-bootstrap` is just the **credential carrier**:
they must be an admin of the organization above and they hold the
`w_organization_social` scope. From LinkedIn's perspective the post is
published by the organization, not by that admin's personal profile. The admin
never appears as the author and the post does not show up on their personal
feed.

If the credential admin leaves the organization, LinkedIn revokes the refresh
token and the daily cron starts failing with exit code 3. Recovery: bring a
new admin in, re-run `make linkedin-bootstrap` as that person.

## Quick start

```bash
cd social/linkedin
make install                 # pnpm install + seeds .env.local from .env.local.dist
# fill in the LINKEDIN_*, API_* values in .env.local
make linkedin-bootstrap      # one-time interactive OAuth (writes .linkedin-token.json)
make linkedin-post-dry       # smoke-test: render and log, no LinkedIn call
make linkedin-post           # production cron entry — posts yesterday's top 10
```

## CLI

```
post-daily-top10 [--date YYYY-MM-DD] [--force] [--dry-run]
  --date     Override the default (yesterday in $TZ).
  --force    Post even if the state file shows this date was already posted.
  --dry-run  Render the commentary and log it; do not call LinkedIn.
```

Exit codes: `0` success / dry-run, `1` already-posted, `2` upstream failure,
`3` LinkedIn failure, `4` config invalid.

## Cron

```cron
# /etc/cron.d/rdp-linkedin
30 5 * * *  rdp-linkedin  cd /opt/rdp/social-linkedin && make linkedin-post >> /var/log/rdp-linkedin/post.log 2>&1
```

05:30 Europe/Paris posts the previous calendar day's top 10.

## Generating LinkedIn credentials

The operator needs admin rights on the LinkedIn organization page at
<https://www.linkedin.com/company/75720423/admin/settings/>.

1. Go to <https://www.linkedin.com/developers/apps> and create a new app.
   Associate it with the organization page above.
2. On the new app's **Products** tab, request:
   - **Share on LinkedIn** (gives `w_member_social`, needed during the bootstrap
     consent screen)
   - **Marketing Developer Platform** (unlocks `w_organization_social` and
     `r_organization_social` — the scopes the daily post uses). Approval can
     take a few business days.
3. On the **Auth** tab:
   - Copy `Client ID` → `LINKEDIN_CLIENT_ID` in `.env.local`.
   - Copy `Client Secret` → `LINKEDIN_CLIENT_SECRET`.
   - Add the redirect URL the operator will use for bootstrap (any URL the
     operator controls, e.g. `https://localhost:8080/callback`). Set the same
     value in `LINKEDIN_REDIRECT_URI`.
4. On the **Settings** tab, confirm the app is associated with the right
   organization page and that you appear as an admin.
5. Fill in `.env.local`, run `make linkedin-bootstrap`, then verify with
   `make linkedin-post-dry`.

Refresh tokens live ~365 days. Re-run `make linkedin-bootstrap` roughly once a
year; the CLI logs a warning when expiry is < 14 days away.

## Files written

- `.linkedin-token.json` (mode `0600`) — LinkedIn access + refresh tokens; rotated
  on every run.
- `.linkedin-state.json` — dedupe state + last 30 posts (date, post URN).

Both default paths are relative to the workspace and gitignored.

## Tests

```bash
make linkedin-test       # vitest run
make linkedin-typecheck  # tsc --noEmit
```

## License

[GNU General Public License v3.0](../../LICENSE) — same license as the rest of
the repository.

This workspace depends on the following third-party packages (all
GPL-3.0-compatible):

| Package                | License      | Role                              |
|------------------------|--------------|-----------------------------------|
| `linkedin-api-client`  | Apache-2.0   | LinkedIn REST + OAuth SDK         |
| `pino`                 | MIT          | Structured JSON logging           |
| `pino-pretty`          | MIT          | Dev-only pretty log transport     |
| `dotenv`               | BSD-2-Clause | `.env.local` loader               |
| `tsx`                  | MIT          | TypeScript runner for the CLI     |
| `typescript`, `vitest` | Apache-2.0 / MIT | Build + test tooling          |

## Forking this workspace

Everything that ties this CLI to the upstream Revue de Presse organization is
either env-driven (override in `.env.local`) or clearly localized in source.
Audit checklist when forking:

1. **LinkedIn organization** — set `LINKEDIN_ORGANIZATION_URN` to your own
   organization page URN (the URL fragment after `/company/` on the page admin
   settings). Update the credential-runbook URL in this README.
2. **LinkedIn app credentials** — your own `LINKEDIN_CLIENT_ID`,
   `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI` from your LinkedIn
   developer-portal app.
3. **Upstream data source** — set `API_BASE_URL` and `API_CLIENT_SECRET` to
   your own highlights API, or replace `src/revueDePresseClient.ts` with a
   client for whatever feed you want to publish. The renderer in
   `src/renderPost.ts` only needs an array of `{ screenName, url, text, date }`
   objects (see `src/types.ts`).
4. **Post footer + hashtag** — `POST_FOOTER_URL` and `POST_HASHTAG` env vars.
   Leave either blank to drop that section entirely from the commentary.
5. **Header copy + locale** — the French header "Top 10 des publications de
   presse les plus relayées sur Bluesky le {date} :" lives at
   `src/renderPost.ts` and uses `Intl.DateTimeFormat('fr-FR', ...)` for the
   date. Edit both if you want a different language or framing — they're a
   handful of lines.
6. **Package name** — `package.json` is scoped to `@revue-de-presse/…`.
   Rename if you publish or fork into a different organization namespace.
7. **Cron user / paths** — `/etc/cron.d/rdp-linkedin` and
   `/opt/rdp/social-linkedin` in the cron example above are conventions of
   the upstream deployment; substitute your own user and install path.

Nothing else in `src/` or `bin/` is upstream-specific; the auth flow, atomic
file I/O, dedupe gate, token refresh, and error / exit-code logic are
general-purpose.
