# @revue-de-presse/social-linkedin

CLI that posts the previous day's Revue de Presse top 10 to the LinkedIn
organization page once per day. Run from cron in production.

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
