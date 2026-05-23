# @revue-de-presse/social-tiktok

Daily 9:16 scroll capture of the Revue de presse top-10 publications, auto-posted to
[`@revue_2_presse`](https://www.tiktok.com/@revue_2_presse) on TikTok.

## One-time setup

1. Create a TikTok app at <https://developers.tiktok.com/apps/> with the **Login Kit**
   and **Content Posting API** products. Add
   `https://api.revue-de-presse.org/api/tiktok/oauth/callback` as the Redirect URI —
   exactly that string. TikTok's portal requires `https://` on a public domain
   (it rejects `http://`, `http://localhost`, and `https://localhost`), so we
   point at the API's public callback route (`app_tiktok_oauth_callback`,
   `PUBLIC_ACCESS`), which renders the incoming `code` + `state` as a plain
   HTML page for copy-paste back into the bootstrap CLI. Request scopes
   `user.info.basic`, `video.upload`, `video.publish`. Add `@revue_2_presse`
   as a Sandbox tester.
2. Install workspace dependencies. This also seeds `.env.local` from the template
   if it's missing:
   ```
   make tiktok-install
   ```
3. Open `social/tiktok/.env.local` and fill in:
   - `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` — from the TikTok developer portal.
     The bootstrap doesn't talk to TikTok's token endpoint directly anymore (the
     API server does), but `TIKTOK_CLIENT_SECRET` is still needed locally for
     the daily refresh-token rotation in `make tiktok-post`.
   - `API_CLIENT_SECRET` — same value as the Nuxt/Next/linkedin workspaces use to mint
     upstream tokens. Required by the bootstrap to call the API's
     `app_tiktok_oauth_exchange` route, which sits behind `ROLE_USER`.
4. Run the interactive OAuth bootstrap to obtain the long-lived refresh token:
   ```
   make tiktok-bootstrap
   ```
   The CLI opens the TikTok authorize page in your browser. Sign in as
   `@revue_2_presse` and approve the scopes; TikTok will redirect to
   `https://api.revue-de-presse.org/api/tiktok/oauth/callback?code=…&state=…`,
   which the API renders as an HTML page showing the code, state, and full
   callback URL. Copy any of those back into the CLI prompt. The CLI mints a
   Bearer token against `/api/token` (using `API_CLIENT_SECRET`), POSTs
   `{code, code_verifier, redirect_uri}` to `/api/tiktok/oauth/exchange`,
   persists the returned `refresh_token` into `social/tiktok/.env.local` as
   `TIKTOK_REFRESH_TOKEN`, and prints the `gh secret set` commands to seed CI.

## Daily run

- **CI**: `.github/workflows/tiktok-publish.yml` cron `30 21 * * *` UTC.
- **Local**: `make tiktok-post` (mode from `PUBLISH_MODE`, defaults to `inbox`).
- **Render only** (no TikTok POST): `make tiktok-post-dry`.

## Modes

| `PUBLISH_MODE` | Behavior |
|---|---|
| `inbox` (default) | Video lands in the `@revue_2_presse` TikTok inbox; finalise the post in the app. The CLI prints the suggested caption to stdout for copy-paste. |
| `direct` | Video posted straight to the profile with the rendered French caption + cover frame from the final paused frame (`video_cover_timestamp_ms: 23500`). Requires the TikTok app to have completed audit. |

## Failure exit codes

| Code | Meaning |
|---|---|
| 2 | Invalid env (zod) — see stderr |
| 10 | Pre-flight invariant failed (intro/outro/post-item) |
| 11 | Playwright navigation to `NUXT_CAPTURE_URL` failed |
| 12 | Playwright produced no `.webm` |
| 13 | `ffmpeg` failed |
| 20 | `refresh_token` rejected — re-run `make tiktok-bootstrap` |
| 21 | `client_key` / `client_secret` rejected |
| 22 | TikTok init non-2xx |
| 23 | TikTok upload PUT non-2xx |
| 24 | TikTok status terminal `FAILED` (TikTok-provided `fail_reason` in stderr) |
| 25 | TikTok status poll timed out (90 s) |
| 26 | Refresh-token rotation write-back failed (publish may have succeeded — new token printed to stderr) |
| 1 | Any other uncaught error |

## Where the refresh token lives

| Surface | Path / store |
|---|---|
| Local dev | `social/tiktok/.env.local` (gitignored) |
| CI | GitHub Actions repository secret `TIKTOK_REFRESH_TOKEN`, rotated each run via the `TIKTOK_SECRET_ROTATOR_PAT` PAT (`gh secret set`) |

TikTok rotates the refresh_token on every `grant_type=refresh_token` exchange, so it
is rewritten on each daily run. The 365-day TTL means annual manual re-auth is needed
if the daily run is skipped for that long.

See the project's design and implementation notes maintained alongside the publisher.
