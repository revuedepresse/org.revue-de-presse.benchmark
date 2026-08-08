SHELL:=/bin/bash
.ONESHELL:
.PHONY: install bootstrap post post-dry test typecheck help

install: ## Install Node deps (and seed .env.local from .env.local.dist if missing)
	@# `pnpm env use --global` only works when pnpm was installed via the
	@# standalone script; brew/npm/corepack installs reject it. Verify Node
	@# >=24 directly instead so any install method works.
	@node_major=$$(node -v 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/'); \
	 if [ -z "$$node_major" ] || [ "$$node_major" -lt 24 ]; then \
	   echo "✗ Node >=24 required (current: $$(node -v 2>/dev/null || echo 'not installed'))" >&2; \
	   exit 1; \
	 fi
	@which node && node --version
	@pnpm install
	@if [ ! -f .env.local ]; then cp .env.local.dist .env.local; echo "✓ created .env.local from template — fill in the missing values"; fi
	@# .env.local carries API_CLIENT_SECRET and the OAuth client signing key.
	@# `cp` inherits the umask (0644 on the production host), so tighten
	@# unconditionally rather than only on creation — that also repairs
	@# deploys seeded before this line existed.
	@chmod 600 .env.local

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
