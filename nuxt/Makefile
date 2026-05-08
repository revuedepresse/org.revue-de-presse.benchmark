SHELL:=/bin/bash
.ONESHELL:
.PHONY: install dev build preview install-bubblewrap update-twa help

install: ## Install Node dependencies (delegates to pnpm)
	@pnpm install

dev: ## Start the Nuxt dev server (http://localhost:3000)
	@pnpm dev

build: ## Build the Nuxt app for production (and copy /.well-known assets)
	@pnpm build
	@$(MAKE) publish-asset-links publish-atproto-did

publish-asset-links: ## Copy assetlinks.json into the build output (TWA digital asset links)
	@mkdir -p .output/public/well-known
	@cp public/well-known/assetlinks.json .output/public/well-known/assetlinks.json
	@printf '✓ assetlinks.json → .output/public/well-known/assetlinks.json\n'

publish-atproto-did: ## Copy atproto-did into the build output
	@mkdir -p .output/public/well-known
	@cp public/well-known/atproto-did .output/public/well-known/atproto-did
	@printf '✓ atproto-did → .output/public/well-known/atproto-did\n'

preview: ## Preview the production build locally
	@pnpm preview

install-bubblewrap: ## Install bubblewrap CLI globally (Trusted Web Activity tooling)
	@/bin/bash -c 'source ./scripts/twa.sh && install_bubblewrap'

update-twa: install-bubblewrap ## Build the Android TWA from the current twa-manifest.json
	@/bin/bash -c 'source ./scripts/twa.sh && update_twa'

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
