SHELL:=/bin/bash
.ONESHELL:
.PHONY: install bootstrap post post-dry test typecheck help

install: ## Install Node dependencies (and seed .env.local from .env.local.dist if missing)
	@pnpm install
	@if [ ! -f .env.local ]; then cp .env.local.dist .env.local; echo "✓ created .env.local from template — fill in the missing values"; fi

bootstrap: ## Interactive: print LinkedIn auth URL, prompt for redirect URL, write token file
	@pnpm bootstrap

post: ## Cron entry: post yesterday's top 10 to LinkedIn
	@pnpm post

post-dry: ## Same as `post` but logs the rendered commentary and skips the API call
	@pnpm post:dry

test: ## Run unit tests
	@pnpm test:run

typecheck: ## Run tsc --noEmit
	@pnpm typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
