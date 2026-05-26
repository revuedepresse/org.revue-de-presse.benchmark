SHELL:=/bin/bash
.ONESHELL:
.PHONY: install dev dev-tls certs build preview install-bubblewrap update-twa build-twa twa-fingerprint chat-jwt-secret help

install: ## Install Node dependencies (delegates to pnpm)
	@pnpm install

dev: ## Start the Nuxt dev server (http://localhost:3000)
	@pnpm dev

# mkcert-backed local TLS. Hostname must resolve to 127.0.0.1
# (add `127.0.0.1 local.revue-de-presse.org` to /etc/hosts).
# One-time setup on a fresh machine: `mkcert -install` (adds the local CA
# to the system trust store; requires sudo password).
CERT_DIR   := .certs
CERT_KEY   := $(CERT_DIR)/local-key.pem
CERT_CERT  := $(CERT_DIR)/local-cert.pem
CERT_HOSTS := local.revue-de-presse.org 127.0.0.1 ::1

certs: $(CERT_CERT) ## Generate mkcert TLS certs for local dev (idempotent)

$(CERT_CERT):
	@command -v mkcert >/dev/null 2>&1 || { printf '✗ mkcert not found — install with: brew install mkcert\n' >&2; exit 1; }
	@mkdir -p $(CERT_DIR)
	@mkcert -key-file $(CERT_KEY) -cert-file $(CERT_CERT) $(CERT_HOSTS)
	@printf '✓ TLS certs written to %s/ for: %s\n' '$(CERT_DIR)' '$(CERT_HOSTS)'

dev-tls: certs ## Start the Nuxt dev server on https://local.revue-de-presse.org:3000 (mkcert)
	@NUXT_DEV_TLS=1 PUBLIC_ORIGIN=https://local.revue-de-presse.org:3000 pnpm dev

# Nitro's `netlify` preset writes the publish dir to `{rootDir}/dist/`,
# not `.output/public/` — so the well-known assets must be copied there
# for Netlify to serve them.
PUBLISH_DIR := dist

build: ## Build the Nuxt app for production (and copy /.well-known assets)
	@NITRO_PRESET=netlify pnpm build
	@$(MAKE) publish-asset-links publish-atproto-did

publish-asset-links: ## Copy assetlinks.json into the build output (TWA digital asset links)
	@mkdir -p $(PUBLISH_DIR)/well-known
	@cp public/well-known/assetlinks.json $(PUBLISH_DIR)/well-known/assetlinks.json
	@printf '✓ assetlinks.json → %s/well-known/assetlinks.json\n' '$(PUBLISH_DIR)'

publish-atproto-did: ## Copy atproto-did into the build output
	@mkdir -p $(PUBLISH_DIR)/well-known
	@cp public/well-known/atproto-did $(PUBLISH_DIR)/well-known/atproto-did
	@printf '✓ atproto-did → %s/well-known/atproto-did\n' '$(PUBLISH_DIR)'

preview: ## Preview the production build locally
	@pnpm preview

install-bubblewrap: ## Install bubblewrap CLI globally (Trusted Web Activity tooling)
	@/bin/bash -c 'source ./scripts/twa.sh && install_bubblewrap'

update-twa: install-bubblewrap ## Regenerate the Android project from the current twa-manifest.json
	@/bin/bash -c 'source ./scripts/twa.sh && update_twa'

build-twa: ## Compile and sign the Android TWA (set BUBBLEWRAP_KEYSTORE_PASSWORD/BUBBLEWRAP_KEY_PASSWORD)
	@/bin/bash -c 'source ./scripts/twa.sh && build_twa'

APK ?= app-release-signed.apk
twa-fingerprint: ## Print SHA-256/SHA-1 of the APK's signing cert (override path with APK=...)
	@if [ ! -f "$(APK)" ]; then echo "APK not found: $(APK) (override with APK=path/to.apk)" >&2; exit 1; fi
	@keytool -printcert -jarfile "$(APK)" | grep -E '^\s*(SHA1|SHA256):'

chat-jwt-secret: ## Generate a fresh 256-bit API_JWT_SECRET; print to stdout (does NOT touch any .env)
	@set -euo pipefail; \
	secret=$$(openssl rand -base64 32 | tr -d '\n=+/' | head -c 43); \
	if [ -z "$$secret" ]; then printf '✗ Failed to generate API_JWT_SECRET\n' 1>&2; exit 1; fi; \
	printf '✓ Generated a fresh API_JWT_SECRET (43 URL-safe chars, 256-bit entropy):\n\n'; \
	printf '  API_JWT_SECRET=%s\n\n' "$$secret"; \
	printf '→ Paste the SAME line into:\n'; \
	printf '    1. ../org.revue-de-presse.api/.env.local  (API verifier)\n'; \
	printf '    2. nuxt/.env.local                        (Nuxt signer, local dev)\n'; \
	printf '    3. Netlify env vars for the Nuxt site     (Nuxt signer, prod)\n\n'; \
	printf '⚠  Rotating invalidates every active chat session. Deploy API first, Nuxt second.\n'

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
