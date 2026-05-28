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
        linkedin-install linkedin-bootstrap linkedin-post linkedin-post-dry linkedin-test linkedin-typecheck \
        tiktok-install tiktok-bootstrap tiktok-post tiktok-post-dry tiktok-test tiktok-typecheck \
        bluesky-install bluesky-bootstrap bluesky-post bluesky-post-dry bluesky-test bluesky-typecheck \
        native-desktop-run \
        native-android-debug native-android-release native-ios-framework native-release

NUXT_DIR     := nuxt
NEXT_DIR     := next
E2E_DIR      := e2e
LINKEDIN_DIR := social/linkedin
TIKTOK_DIR   := social/tiktok
BLUESKY_DIR  := social/bluesky

# -- Install --------------------------------------------------------------

install: ## Install dependencies for nuxt, next, e2e, and social/{linkedin,tiktok,bluesky} workspaces
	@$(MAKE) -C $(NUXT_DIR) install
	@$(MAKE) -C $(NEXT_DIR) install
	@cd $(E2E_DIR)  && pnpm install
	@$(MAKE) -C $(LINKEDIN_DIR) install
	@$(MAKE) -C $(TIKTOK_DIR) install
	@$(MAKE) -C $(BLUESKY_DIR) install

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

test: nuxt-test next-test linkedin-test tiktok-test bluesky-test e2e-test native-test native-codegen-test ## Run all tests (nuxt unit + next unit + linkedin unit + tiktok unit + bluesky unit + e2e)

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

# -- TikTok --------------------------------------------------------------

tiktok-install: ## Install social/tiktok dependencies (seeds .env.local from template)
	@$(MAKE) -C $(TIKTOK_DIR) install

tiktok-bootstrap: ## Run the one-time TikTok Login Kit OAuth bootstrap (interactive)
	@$(MAKE) -C $(TIKTOK_DIR) bootstrap

tiktok-post: ## Cron entry: render scroll capture + publish to TikTok
	@$(MAKE) -C $(TIKTOK_DIR) post

tiktok-post-dry: ## Render + transcode without publishing to TikTok
	@$(MAKE) -C $(TIKTOK_DIR) post-dry

tiktok-test: ## Run social/tiktok unit tests
	@$(MAKE) -C $(TIKTOK_DIR) test

tiktok-typecheck: ## Typecheck social/tiktok
	@$(MAKE) -C $(TIKTOK_DIR) typecheck

# -- Bluesky -------------------------------------------------------------

bluesky-install: ## Install social/bluesky dependencies (seeds .env.local from template)
	@$(MAKE) -C $(BLUESKY_DIR) install

bluesky-bootstrap: ## Run the one-time atproto OAuth bootstrap for the Bluesky handle (interactive)
	@$(MAKE) -C $(BLUESKY_DIR) bootstrap

bluesky-post: ## Cron entry: post yesterday's top 3 to Bluesky as a 4-post thread
	@$(MAKE) -C $(BLUESKY_DIR) post

bluesky-post-dry: ## Render the thread and log it without calling the PDS
	@$(MAKE) -C $(BLUESKY_DIR) post-dry

bluesky-test: ## Run social/bluesky unit tests
	@$(MAKE) -C $(BLUESKY_DIR) test

bluesky-typecheck: ## Typecheck social/bluesky
	@$(MAKE) -C $(BLUESKY_DIR) typecheck

# -- Native KMP -----------------------------------------------------------

native-install:      ## Install native KMP dependencies (Gradle bootstrap)
	cd native && ./gradlew --no-daemon help

native-test:         ## Run native :domain, :data, :design and :ui unit tests (all targets)
	cd native && ./gradlew :domain:allTests :data:allTests :design:allTests :ui:allTests

native-desktop-run:  ## Run the native desktop app via Gradle
	cd native && ./gradlew :desktopApp:run

native-codegen-test: ## Run design-system codegen script tests
	cd design-system && pnpm test:scripts

native-android-debug:   ; cd native && ./gradlew :androidApp:assembleDebug
native-android-release: ; cd native && ./gradlew :androidApp:bundleRelease
native-ios-framework:   ; cd native && ./gradlew :iosApp:compileKotlinIosX64
native-release:         native-android-release native-ios-framework

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'
