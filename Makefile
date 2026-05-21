SHELL:=/bin/bash
.ONESHELL:
.PHONY: help install \
        nuxt-dev nuxt-build nuxt-prod nuxt-test \
        nuxt-install-bubblewrap nuxt-update-twa nuxt-build-twa \
        next-dev next-build next-prod next-test \
        next-install-bubblewrap next-update-twa next-build-twa \
        install-bubblewrap update-twa build-twa \
        e2e-install e2e-install-browsers e2e-build-apps \
        e2e-test e2e-test-functional e2e-test-perf e2e-show-report \
        test \
        linkedin-install linkedin-bootstrap linkedin-post linkedin-post-dry linkedin-test linkedin-typecheck

NUXT_DIR     := nuxt
NEXT_DIR     := next
E2E_DIR      := e2e
LINKEDIN_DIR := social/linkedin

# -- Install --------------------------------------------------------------

install: ## Install dependencies for nuxt, next, e2e, and social/linkedin workspaces
	@$(MAKE) -C $(NUXT_DIR) install
	@$(MAKE) -C $(NEXT_DIR) install
	@cd $(E2E_DIR)  && pnpm install
	@$(MAKE) -C $(LINKEDIN_DIR) install

# -- Nuxt -----------------------------------------------------------------

nuxt-dev: ## Start the Nuxt dev server (http://localhost:3000)
	@$(MAKE) -C $(NUXT_DIR) dev

nuxt-build: ## Build the Nuxt app for production
	@$(MAKE) -C $(NUXT_DIR) build

nuxt-prod: ## Preview the Nuxt production build locally
	@$(MAKE) -C $(NUXT_DIR) preview

nuxt-test: ## Run Nuxt unit tests (Vitest)
	@cd $(NUXT_DIR) && pnpm test:run

nuxt-install-bubblewrap: ## Install bubblewrap CLI for the Nuxt TWA
	@$(MAKE) -C $(NUXT_DIR) install-bubblewrap

nuxt-update-twa: ## Regenerate the Nuxt Android project from twa-manifest.json
	@$(MAKE) -C $(NUXT_DIR) update-twa

nuxt-build-twa: ## Compile and sign the Nuxt Android TWA (APK)
	@$(MAKE) -C $(NUXT_DIR) build-twa

# -- Next -----------------------------------------------------------------

next-dev: ## Start the Next dev server
	@$(MAKE) -C $(NEXT_DIR) dev

next-build: ## Build the Next app for production
	@$(MAKE) -C $(NEXT_DIR) build

next-prod: ## Start the Next production server (requires `next-build` first)
	@$(MAKE) -C $(NEXT_DIR) preview

next-test: ## Run Next unit tests (Vitest)
	@cd $(NEXT_DIR) && pnpm test:run

next-install-bubblewrap: ## Install bubblewrap CLI for the Next TWA
	@$(MAKE) -C $(NEXT_DIR) install-bubblewrap

next-update-twa: ## Regenerate the Next Android project from twa-manifest.json
	@$(MAKE) -C $(NEXT_DIR) update-twa

next-build-twa: ## Compile and sign the Next Android TWA (APK)
	@$(MAKE) -C $(NEXT_DIR) build-twa

# -- TWA (aggregates, delegate to nuxt + next) ----------------------------

install-bubblewrap: nuxt-install-bubblewrap next-install-bubblewrap ## Install bubblewrap CLI for both nuxt + next TWAs

update-twa: nuxt-update-twa next-update-twa ## Regenerate both nuxt + next Android projects from twa-manifest.json

build-twa: nuxt-build-twa next-build-twa ## Compile and sign both nuxt + next Android TWAs (APK)

# -- E2E (Playwright) -----------------------------------------------------
#
# Playwright spawns `nuxt preview` + `next start` as `webServer` entries, so
# the suite cannot run unless BOTH apps are built. The e2e-test* targets
# below depend on e2e-build-apps to guarantee that — running them against a
# fresh checkout produces a working test run, not a "missing .next" error.

e2e-install: ## Install e2e Node dependencies (Playwright + helpers)
	@cd $(E2E_DIR) && pnpm install

e2e-install-browsers: e2e-install ## Install Playwright browsers (chromium + system deps)
	@cd $(E2E_DIR) && pnpm install-browsers

e2e-build-apps: nuxt-build next-build ## Build nuxt + next so the Playwright webServer can start

e2e-test: e2e-build-apps ## Run the full Playwright suite (functional + perf)
	@cd $(E2E_DIR) && pnpm test

e2e-test-functional: e2e-build-apps ## Run only the Playwright functional projects
	@cd $(E2E_DIR) && pnpm test:functional

e2e-test-perf: e2e-build-apps ## Run only the Playwright perf projects
	@cd $(E2E_DIR) && pnpm test:perf

e2e-show-report: ## Open the last Playwright HTML report in a browser
	@cd $(E2E_DIR) && pnpm exec playwright show-report

# -- Aggregates -----------------------------------------------------------

test: nuxt-test next-test linkedin-test e2e-test ## Run all tests (nuxt unit + next unit + linkedin unit + e2e)

# -- LinkedIn -------------------------------------------------------------

linkedin-install: ## Install social/linkedin dependencies (seeds .env.local from template)
	@$(MAKE) -C $(LINKEDIN_DIR) install

linkedin-bootstrap: ## Run the one-time LinkedIn 3-legged OAuth bootstrap (interactive)
	@$(MAKE) -C $(LINKEDIN_DIR) bootstrap

linkedin-post: ## Cron entry: post yesterday's top 10 to LinkedIn
	@$(MAKE) -C $(LINKEDIN_DIR) post

linkedin-post-dry: ## Render the post and log it without calling LinkedIn
	@$(MAKE) -C $(LINKEDIN_DIR) post-dry

linkedin-test: ## Run social/linkedin unit tests
	@$(MAKE) -C $(LINKEDIN_DIR) test

linkedin-typecheck: ## Typecheck social/linkedin
	@$(MAKE) -C $(LINKEDIN_DIR) typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'
