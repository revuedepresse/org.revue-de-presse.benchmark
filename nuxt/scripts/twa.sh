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

# Bubblewrap (and the gradle build it spawns) refuses to run when both
# ANDROID_HOME and ANDROID_SDK_ROOT are set to different paths. Bubblewrap
# pins ANDROID_HOME to ~/.bubblewrap/android_sdk; if the user also has
# Homebrew's android-commandlinetools on PATH, ANDROID_SDK_ROOT collides
# and gradle aborts. Clear the legacy variable for any TWA invocation.
unset ANDROID_SDK_ROOT

# Bubblewrap 1.24.x still hard-codes androidbrowserhelper:2.6.2 in
# FeatureManager.js, so every `bubblewrap update` rewrites app/build.gradle
# back to that line. We need >=2.7.0 to clear the Play Console findings on
# edge-to-edge handling and the deprecated setStatusBarColor /
# setNavigationBarColor / getStatusBarColor APIs. Re-pin after every update.
ABH_VERSION="2.7.1"

_pin_abh_version() {
  local gradle="app/build.gradle"
  [ -f "$gradle" ] || return 0
  if grep -qE "androidbrowserhelper:[0-9]+\\.[0-9]+\\.[0-9]+" "$gradle"; then
    sed -i.tmp -E "s|(androidbrowserhelper:)[0-9]+\\.[0-9]+\\.[0-9]+|\\1${ABH_VERSION}|" "$gradle"
    rm -f "${gradle}.tmp"
    printf '✓ pinned androidbrowserhelper to %s in %s\n' "${ABH_VERSION}" "$gradle"
  fi
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
    # Resync manifest-checksum.txt to the restored manifest so a subsequent
    # plain `bubblewrap build` doesn't detect a change and try to re-fetch
    # the still-unreachable production webManifestUrl. (Bubblewrap stores
    # SHA-1 of twa-manifest.json contents in manifest-checksum.txt and
    # triggers an update if the hash differs.)
    if [ -f manifest-checksum.txt ]; then
      printf '%s' "$(shasum -a 1 twa-manifest.json | awk '{print $1}')" > manifest-checksum.txt
    fi
  fi
  return $rc
}

update_twa() {
  if [ ! -f ./twa-manifest.json ]; then
    cp ./twa-manifest.json.dist ./twa-manifest.json
    printf 'Copied twa-manifest.json.dist → twa-manifest.json. Edit signingKey.path before signing.\n'
  fi
  _with_local_manifest bubblewrap update
  _pin_abh_version
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
  # Run update + build inside one local-manifest session so neither call
  # re-fetches the unreachable production webManifestUrl.
  _with_local_manifest bash -c "
    set -e
    bubblewrap update
    $(declare -f _pin_abh_version)
    ABH_VERSION='${ABH_VERSION}' _pin_abh_version
    # Decline the 'twa-manifest.json changed' prompt — update just synced.
    printf 'n\n' | bubblewrap build --skipPwaValidation
  "
}

if [ "${1-}" = "install" ]; then install_bubblewrap; fi
if [ "${1-}" = "update" ]; then update_twa; fi
if [ "${1-}" = "build" ]; then build_twa; fi
