SHELL:=/bin/bash
.ONESHELL:
.PHONY: install bootstrap post post-dry test typecheck help

install: ## Install Node deps (and seed .env.local from .env.local.dist if missing)
	@pnpm env use --global 24
	@which node && node --version
	@pnpm install
	@if [ ! -f .env.local ]; then cp .env.local.dist .env.local; echo "✓ created .env.local from template — fill in the missing values"; fi

bootstrap: ## Interactive: open atproto auth URL, listen on BLUESKY_REDIRECT_URI, write .bluesky-session.json
	@pnpm bootstrap

post: ## Cron entry: post yesterday's top 3 as a Bluesky thread
	@pnpm post

post-dry: ## Same as `post` but renders the thread and logs it; no PDS calls
	@pnpm post:dry

test: ## Run unit tests
	@pnpm test:run

typecheck: ## Run tsc --noEmit
	@pnpm typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
