SHELL:=/bin/bash
.ONESHELL:
.PHONY: install bootstrap post post-dry test typecheck help

install: ## Install Node dependencies (and seed .env.local from .env.local.dist if missing)
	@pnpm install
	@if [ ! -f .env.local ]; then cp .env.local.dist .env.local; echo "✓ created .env.local from template — fill in the missing values"; fi
	@# .env.local carries the TikTok Login Kit credentials. `cp` inherits the
	@# umask (0644 on the production host), so tighten unconditionally rather
	@# than only on creation — that also repairs deploys seeded before this
	@# line existed.
	@chmod 600 .env.local

bootstrap: ## Interactive: print TikTok Login Kit auth URL, complete OAuth, persist refresh_token
	@pnpm bootstrap

post: ## Cron entry: render scroll capture + publish to TikTok
	@pnpm post

post-dry: ## Same as `post` but skips the TikTok publish call
	@pnpm post:dry

test: ## Run unit tests
	@pnpm test:run

typecheck: ## Run tsc --noEmit
	@pnpm typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
