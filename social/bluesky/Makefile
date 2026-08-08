SHELL:=/bin/bash
.ONESHELL:
.PHONY: install keygen bootstrap post post-cron post-dry test typecheck help

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

keygen: ## Generate the ES256 client key (public half -> nuxt/public/bluesky-jwks.json, private half printed once)
	@pnpm keygen $(if $(strip $(KID)),--kid $(KID)) $(if $(strip $(REPLACE)),--replace)

bootstrap: ## Interactive: open atproto auth URL, complete the OAuth flow, write .bluesky-session.json
	@pnpm bootstrap

post: ## Post yesterday's top 3 as a Bluesky thread (raw exit codes; see post-cron for cron)
	@pnpm post

post-cron: ## Cron entry: like `post`, but the two benign gate exits report success
	@# The gates are ordinary outcomes, not faults: 1 = already posted today,
	@# 5 = the top 3 is unchanged since the last post. Cron mails on any
	@# non-zero exit, so surfacing them as failures trains everyone to ignore
	@# the mail — and then a real 2/3/4 goes unread too.
	@# One logical line on purpose: `rc=$$?` has to observe the exit status of
	@# `pnpm post` in the same shell, which a second recipe line would not.
	@pnpm post; rc=$$?; \
	 case $$rc in \
	   0) ;; \
	   1) echo "· already posted today — nothing to do" ;; \
	   5) echo "· top 3 unchanged since the last post — nothing to do" ;; \
	   *) echo "✗ bluesky post failed (exit $$rc)" >&2; exit $$rc ;; \
	 esac

post-dry: ## Same as `post` but renders the thread and logs it; no PDS calls
	@pnpm post:dry

test: ## Run unit tests
	@pnpm test:run

typecheck: ## Run tsc --noEmit
	@pnpm typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
