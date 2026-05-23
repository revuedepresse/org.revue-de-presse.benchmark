SHELL:=/bin/bash
.ONESHELL:
.PHONY: install bluesky-bootstrap bluesky-post bluesky-post-dry bluesky-test bluesky-typecheck help

install: ## Install Node deps (and seed .env.local from .env.local.dist if missing)
	@pnpm env use --global 24
	@which node && node --version
	@pnpm install
	@if [ ! -f .env.local ]; then cp .env.local.dist .env.local; echo "✓ created .env.local from template — fill in the missing values"; fi

bluesky-bootstrap: ## Interactive: open atproto auth URL, listen on BLUESKY_REDIRECT_URI, write .bluesky-session.json
	@pnpm bootstrap

bluesky-post: ## Cron entry: post yesterday's top 3 as a Bluesky thread
	@pnpm post

bluesky-post-dry: ## Same as bluesky-post but renders the thread and logs it; no PDS calls
	@pnpm post:dry

bluesky-test: ## Run unit tests
	@pnpm test:run

bluesky-typecheck: ## Run tsc --noEmit
	@pnpm typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'
