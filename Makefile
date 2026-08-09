SHELL:=/bin/bash
.ONESHELL:
.PHONY: help install \
        nuxt-dev nuxt-dev-tls nuxt-certs nuxt-build nuxt-prod nuxt-test \
        nuxt-install-bubblewrap nuxt-update-twa nuxt-build-twa \
        chat-jwt-secret \
        install-bubblewrap update-twa build-twa \
        e2e-install e2e-install-browsers e2e-build-apps \
        e2e-test e2e-test-functional e2e-test-perf e2e-show-report \
        test \
        linkedin-install linkedin-bootstrap linkedin-post linkedin-post-dry linkedin-test linkedin-typecheck \
        bluesky-install bluesky-keygen bluesky-bootstrap bluesky-post bluesky-post-cron bluesky-post-dry bluesky-test bluesky-typecheck

NUXT_DIR     := nuxt
E2E_DIR      := e2e
LINKEDIN_DIR := social/linkedin
BLUESKY_DIR  := social/bluesky

# -- Install --------------------------------------------------------------

install: ## Install dependencies for nuxt, e2e, and social/{linkedin,bluesky} workspaces
	@$(MAKE) -C $(NUXT_DIR) install
	@cd $(E2E_DIR)  && pnpm install
	@$(MAKE) -C $(LINKEDIN_DIR) install
	@$(MAKE) -C $(BLUESKY_DIR) install

# -- Nuxt -----------------------------------------------------------------

nuxt-dev: ## Start the Nuxt dev server (http://localhost:3000)
	@$(MAKE) -C $(NUXT_DIR) dev

nuxt-certs: ## Generate mkcert TLS certs for the Nuxt dev server (idempotent)
	@$(MAKE) -C $(NUXT_DIR) certs

nuxt-dev-tls: ## Start the Nuxt dev server on https://local.revue-de-presse.org:3000 (mkcert)
	@$(MAKE) -C $(NUXT_DIR) dev-tls

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

chat-jwt-secret: ## Generate a fresh 256-bit API_JWT_SECRET (delegates to nuxt/)
	@$(MAKE) -C $(NUXT_DIR) chat-jwt-secret

# -- TWA ------------------------------------------------------------------

install-bubblewrap: nuxt-install-bubblewrap ## Install bubblewrap CLI for the nuxt TWA

update-twa: nuxt-update-twa ## Regenerate the nuxt Android project from twa-manifest.json

build-twa: nuxt-build-twa ## Compile and sign the nuxt Android TWA (APK)

# -- E2E (Playwright) -----------------------------------------------------
#
# Playwright spawns `nuxt preview` as a `webServer` entry, so the suite
# cannot run unless the app is built. The e2e-test* targets below depend on
# e2e-build-apps to guarantee that — running them against a fresh checkout
# produces a working test run, not a "missing .output" error.

e2e-install: ## Install e2e Node dependencies (Playwright + helpers)
	@cd $(E2E_DIR) && pnpm install

e2e-install-browsers: e2e-install ## Install Playwright browsers (chromium + system deps)
	@cd $(E2E_DIR) && pnpm install-browsers

e2e-build-apps: nuxt-build ## Build nuxt so the Playwright webServer can start

e2e-test: e2e-build-apps ## Run the full Playwright suite (functional + perf)
	@cd $(E2E_DIR) && pnpm test

e2e-test-functional: e2e-build-apps ## Run only the Playwright functional projects
	@cd $(E2E_DIR) && pnpm test:functional

e2e-test-perf: e2e-build-apps ## Run only the Playwright perf projects
	@cd $(E2E_DIR) && pnpm test:perf

e2e-show-report: ## Open the last Playwright HTML report in a browser
	@cd $(E2E_DIR) && pnpm exec playwright show-report

# -- Aggregates -----------------------------------------------------------

test: nuxt-test linkedin-test bluesky-test e2e-test ## Run all tests (nuxt unit + linkedin unit + bluesky unit + e2e)

# -- LinkedIn -------------------------------------------------------------

linkedin-install: ## Install social/linkedin dependencies (seeds .env.local from template)
	@$(MAKE) -C $(LINKEDIN_DIR) install

linkedin-bootstrap: ## Run the one-time LinkedIn 3-legged OAuth bootstrap (interactive)
	@$(MAKE) -C $(LINKEDIN_DIR) bootstrap

linkedin-post: ## Cron entry: post yesterday's top 10 to LinkedIn (POST_DATE=YYYY-MM-DD to override date, POST_FORCE=1 to bypass dedupe)
	@$(MAKE) -C $(LINKEDIN_DIR) post POST_DATE=$(POST_DATE) POST_FORCE=$(POST_FORCE)

linkedin-post-dry: ## Render the post and log it without calling LinkedIn (POST_DATE=YYYY-MM-DD to override date, POST_FORCE=1 to bypass dedupe)
	@$(MAKE) -C $(LINKEDIN_DIR) post-dry POST_DATE=$(POST_DATE) POST_FORCE=$(POST_FORCE)

linkedin-test: ## Run social/linkedin unit tests
	@$(MAKE) -C $(LINKEDIN_DIR) test

linkedin-typecheck: ## Typecheck social/linkedin
	@$(MAKE) -C $(LINKEDIN_DIR) typecheck

# -- Bluesky -------------------------------------------------------------

bluesky-install: ## Install social/bluesky dependencies (seeds .env.local from template)
	@$(MAKE) -C $(BLUESKY_DIR) install

bluesky-keygen: ## Generate the ES256 OAuth client key (run locally; KID=<name> to rotate)
	@$(MAKE) -C $(BLUESKY_DIR) keygen

bluesky-bootstrap: ## Run the one-time atproto OAuth bootstrap for the Bluesky handle (interactive)
	@$(MAKE) -C $(BLUESKY_DIR) bootstrap

bluesky-post: ## Post yesterday's top 3 to Bluesky as a 4-post thread (raw exit codes)
	@$(MAKE) -C $(BLUESKY_DIR) post

bluesky-post-cron: ## Cron entry: as bluesky-post, but the benign gate exits (1, 5) report success
	@$(MAKE) -C $(BLUESKY_DIR) post-cron

bluesky-post-dry: ## Render the thread and log it without calling the PDS
	@$(MAKE) -C $(BLUESKY_DIR) post-dry

bluesky-test: ## Run social/bluesky unit tests
	@$(MAKE) -C $(BLUESKY_DIR) test

bluesky-typecheck: ## Typecheck social/bluesky
	@$(MAKE) -C $(BLUESKY_DIR) typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'
