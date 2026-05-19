SHELL:=/bin/bash
.ONESHELL:
.PHONY: install dev build preview publish-asset-links publish-atproto-did \
        install-bubblewrap update-twa build-twa help

install: ## Install Node dependencies (delegates to pnpm)
	@pnpm install

dev: ## Start the Next dev server (http://localhost:3000)
	@pnpm dev

# Next serves files in `public/` as static assets at the site root, so
# `public/well-known/<file>` is served at `/well-known/<file>` with no copy
# step needed. The publish-* targets below act as build-time guards that the
# expected assets are present.
PUBLISH_DIR := public

build: ## Build the Next app for production (and verify /.well-known assets)
	@pnpm build
	@$(MAKE) publish-asset-links publish-atproto-did

publish-asset-links: ## Verify assetlinks.json is in public/ (served by Next at /well-known/assetlinks.json)
	@test -f $(PUBLISH_DIR)/well-known/assetlinks.json
	@printf '✓ assetlinks.json present at %s/well-known/assetlinks.json\n' '$(PUBLISH_DIR)'

publish-atproto-did: ## Verify atproto-did is in public/ (served by Next at /well-known/atproto-did)
	@test -f $(PUBLISH_DIR)/well-known/atproto-did
	@printf '✓ atproto-did present at %s/well-known/atproto-did\n' '$(PUBLISH_DIR)'

preview: ## Start the Next production server (requires `build` first)
	@pnpm start

install-bubblewrap: ## Install bubblewrap CLI globally (Trusted Web Activity tooling)
	@/bin/bash -c 'source ./scripts/twa.sh && install_bubblewrap'

update-twa: install-bubblewrap ## Regenerate the Android project from the current twa-manifest.json
	@/bin/bash -c 'source ./scripts/twa.sh && update_twa'

build-twa: ## Compile and sign the Android TWA (set BUBBLEWRAP_KEYSTORE_PASSWORD/BUBBLEWRAP_KEY_PASSWORD)
	@/bin/bash -c 'source ./scripts/twa.sh && build_twa'

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
