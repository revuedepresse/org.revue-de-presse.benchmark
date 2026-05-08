#!/usr/bin/env bash
# Bubblewrap helpers ported from legacy/fun.sh.
#
#   install_bubblewrap   — pin Node to .nvmrc via asdf and install
#                          @bubblewrap/cli globally.
#   update_twa           — run `bubblewrap update` against the local
#                          twa-manifest.json (copy from twa-manifest.json.dist
#                          first if missing).

set -Eeuo pipefail

install_bubblewrap() {
  if command -v asdf >/dev/null 2>&1 && [ -f "./.nvmrc" ]; then
    asdf install nodejs "$(cat ./.nvmrc)"
  fi
  npm install -g @bubblewrap/cli
}

# Bubblewrap (`update` and `build`) always fetches webManifestUrl. When the
# production deploy lags behind the next TWA we want to ship, swap the URL
# to a local server hosting public/manifest.webmanifest + icons for the
# duration of the bubblewrap call, then restore.
_with_local_manifest() {
  local original_url http_status needs_local_serve=0 srv_pid="" stage_dir rc=0
  original_url="$(grep -oE '"webManifestUrl": *"[^"]+"' twa-manifest.json | head -1 | sed -E 's/.*"webManifestUrl": *"([^"]+)"/\1/')"
  if [ -n "$original_url" ]; then
    http_status="$(curl -s -o /dev/null -w '%{http_code}' "$original_url" || true)"
    [ "$http_status" != "200" ] && needs_local_serve=1
  fi
  if [ "$needs_local_serve" = "1" ]; then
    printf 'webManifestUrl unreachable (status %s); serving local copy on 127.0.0.1:8765.\n' "$http_status"
    stage_dir="$(mktemp -d)"
    cp public/manifest.webmanifest "$stage_dir/"
    cp public/revue-de-presse_512x512_006663.png "$stage_dir/" 2>/dev/null || true
    cp public/revue-de-presse_512x512_monochrome.png "$stage_dir/" 2>/dev/null || true
    cp public/revue-de-presse_48x48_monochrome.png "$stage_dir/" 2>/dev/null || true
    (cd "$stage_dir" && python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1) &
    srv_pid=$!
    sleep 1
    cp twa-manifest.json twa-manifest.json.bak
    sed -i.tmp -E "s|\"webManifestUrl\": *\"[^\"]+\"|\"webManifestUrl\": \"http://127.0.0.1:8765/manifest.webmanifest\"|" twa-manifest.json
    rm -f twa-manifest.json.tmp
  fi
  "$@" || rc=$?
  if [ "$needs_local_serve" = "1" ]; then
    mv twa-manifest.json.bak twa-manifest.json
    [ -n "$srv_pid" ] && kill "$srv_pid" 2>/dev/null || true
  fi
  return $rc
}

update_twa() {
  if [ ! -f ./twa-manifest.json ]; then
    cp ./twa-manifest.json.dist ./twa-manifest.json
    printf 'Copied twa-manifest.json.dist → twa-manifest.json. Edit signingKey.path before signing.\n'
  fi
  _with_local_manifest bubblewrap update
}

build_twa() {
  if [ ! -f ./twa-manifest.json ]; then
    printf 'twa-manifest.json missing — run `make update-twa` first.\n' >&2
    return 1
  fi
  if [ -z "${BUBBLEWRAP_KEYSTORE_PASSWORD:-}" ] || [ -z "${BUBBLEWRAP_KEY_PASSWORD:-}" ]; then
    printf 'Set BUBBLEWRAP_KEYSTORE_PASSWORD and BUBBLEWRAP_KEY_PASSWORD to sign non-interactively, or run `bubblewrap build` directly.\n' >&2
    return 1
  fi
  _with_local_manifest bubblewrap build --skipPwaValidation
}

if [ "${1-}" = "install" ]; then install_bubblewrap; fi
if [ "${1-}" = "update" ]; then update_twa; fi
if [ "${1-}" = "build" ]; then build_twa; fi
