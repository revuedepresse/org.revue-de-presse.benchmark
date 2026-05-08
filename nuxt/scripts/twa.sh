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

update_twa() {
  if [ ! -f ./twa-manifest.json ]; then
    cp ./twa-manifest.json.dist ./twa-manifest.json
    printf 'Copied twa-manifest.json.dist → twa-manifest.json. Edit signingKey.path before signing.\n'
  fi
  bubblewrap update
}

# Allow `source ./scripts/twa.sh && update_twa` from the Makefile, or direct
# invocation: `./scripts/twa.sh install` / `./scripts/twa.sh update`.
if [ "${1-}" = "install" ]; then install_bubblewrap; fi
if [ "${1-}" = "update" ]; then update_twa; fi
