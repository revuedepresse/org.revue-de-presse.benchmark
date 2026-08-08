SHELL:=/bin/bash
.ONESHELL:
.PHONY: install bootstrap post post-dry test typecheck help

POST_DATE  ?=
POST_FORCE ?=
POST_ARGS  := $(if $(strip $(POST_DATE)),--date $(POST_DATE)) $(if $(strip $(POST_FORCE)),--force)

install: ## Install Node dependencies (and seed .env.local from .env.local.dist if missing)
	@pnpm env use --global 24
	@which node && node --version
	@pnpm install
	@if [ ! -f .env.local ]; then cp .env.local.dist .env.local; echo "✓ created .env.local from template — fill in the missing values"; fi
	@# .env.local carries the LinkedIn OAuth credentials. `cp` inherits the
	@# umask (0644 on the production host), so tighten unconditionally rather
	@# than only on creation — that also repairs deploys seeded before this
	@# line existed.
	@chmod 600 .env.local

bootstrap: ## Interactive: print LinkedIn auth URL, prompt for redirect URL, write token file
	@pnpm bootstrap

post: ## Cron entry: post yesterday's top 10 to LinkedIn (POST_DATE=YYYY-MM-DD, POST_FORCE=1 to bypass dedupe)
	@pnpm post $(POST_ARGS)

post-dry: ## Same as `post` but logs the rendered commentary and skips the API call (POST_DATE=YYYY-MM-DD, POST_FORCE=1 to bypass dedupe)
	@pnpm post:dry $(POST_ARGS)

test: ## Run unit tests
	@pnpm test:run

typecheck: ## Run tsc --noEmit
	@pnpm typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
