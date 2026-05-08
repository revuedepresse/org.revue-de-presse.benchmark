SHELL:=/bin/bash
.ONESHELL:
.PHONY: install dev build preview install-bubblewrap update-twa build-twa help

install: ## Install Node dependencies (delegates to pnpm)
	@pnpm install

dev: ## Start the Nuxt dev server (http://localhost:3000)
	@pnpm dev

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

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
