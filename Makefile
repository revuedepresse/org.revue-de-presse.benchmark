SHELL:=/bin/bash
.ONESHELL:
.PHONY: help install \
        nuxt-dev nuxt-build nuxt-prod nuxt-test \
        next-dev next-build next-prod next-test \
        e2e-install-browsers e2e-test e2e-test-functional e2e-test-perf \
        test

NUXT_DIR := nuxt
NEXT_DIR := next
E2E_DIR  := e2e

# -- Install --------------------------------------------------------------

install: ## Install dependencies for nuxt, next, and e2e workspaces
	@$(MAKE) -C $(NUXT_DIR) install
	@cd $(NEXT_DIR) && pnpm install
	@cd $(E2E_DIR)  && pnpm install

# -- Nuxt -----------------------------------------------------------------

nuxt-dev: ## Start the Nuxt dev server (http://localhost:3000)
	@$(MAKE) -C $(NUXT_DIR) dev

nuxt-build: ## Build the Nuxt app for production
	@$(MAKE) -C $(NUXT_DIR) build

nuxt-prod: ## Preview the Nuxt production build locally
	@$(MAKE) -C $(NUXT_DIR) preview

nuxt-test: ## Run Nuxt unit tests (Vitest)
	@cd $(NUXT_DIR) && pnpm test:run

# -- Next -----------------------------------------------------------------

next-dev: ## Start the Next dev server
	@cd $(NEXT_DIR) && pnpm dev

next-build: ## Build the Next app for production
	@cd $(NEXT_DIR) && pnpm build

next-prod: ## Start the Next production server (requires `next-build` first)
	@cd $(NEXT_DIR) && pnpm start

next-test: ## Run Next unit tests (Vitest)
	@cd $(NEXT_DIR) && pnpm test:run

# -- E2E (Playwright) -----------------------------------------------------

e2e-install-browsers: ## Install Playwright browsers (chromium + system deps)
	@cd $(E2E_DIR) && pnpm install-browsers

e2e-test: ## Run the full Playwright suite (functional + perf)
	@cd $(E2E_DIR) && pnpm test

e2e-test-functional: ## Run only the Playwright functional projects
	@cd $(E2E_DIR) && pnpm test:functional

e2e-test-perf: ## Run only the Playwright perf projects
	@cd $(E2E_DIR) && pnpm test:perf

# -- Aggregates -----------------------------------------------------------

test: nuxt-test next-test e2e-test ## Run all tests (nuxt unit + next unit + e2e)

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'
