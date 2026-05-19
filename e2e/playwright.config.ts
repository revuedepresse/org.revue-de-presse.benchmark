import { defineConfig, devices } from '@playwright/test';

const NUXT_PORT = 3001;
const NEXT_PORT = 3002;
const NUXT_URL = `http://localhost:${NUXT_PORT}`;
const NEXT_URL = `http://localhost:${NEXT_PORT}`;

// Lighthouse needs a Chrome whose DevTools `/json/*` HTTP API is exposed;
// Playwright's fixture browser always runs with `--remote-debugging-pipe`,
// which suppresses that API. So the perf suite launches its own dedicated
// Chrome via chrome-launcher inside a worker-scoped fixture — see
// support/perf/lighthouse.ts.

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'nuxt-desktop-functional',
      testDir: './tests',
      use: { ...devices['Desktop Chrome'], baseURL: NUXT_URL },
    },
    {
      name: 'nuxt-mobile-functional',
      testDir: './tests',
      use: { ...devices['Pixel 5'], baseURL: NUXT_URL },
    },
    {
      name: 'next-desktop-functional',
      testDir: './tests',
      use: { ...devices['Desktop Chrome'], baseURL: NEXT_URL },
    },
    {
      name: 'next-mobile-functional',
      testDir: './tests',
      use: { ...devices['Pixel 5'], baseURL: NEXT_URL },
    },
    {
      name: 'nuxt-desktop-perf',
      testDir: './perf',
      use: { ...devices['Desktop Chrome'], baseURL: NUXT_URL },
    },
    {
      name: 'nuxt-mobile-perf',
      testDir: './perf',
      use: { ...devices['Pixel 5'], baseURL: NUXT_URL },
    },
    {
      name: 'next-desktop-perf',
      testDir: './perf',
      use: { ...devices['Desktop Chrome'], baseURL: NEXT_URL },
    },
    {
      name: 'next-mobile-perf',
      testDir: './perf',
      use: { ...devices['Pixel 5'], baseURL: NEXT_URL },
    },
  ],
  webServer: [
    {
      // Repo has no pnpm-workspace.yaml, so each app is its own install.
      // Use cwd to run from the app's directory rather than --filter.
      // Nuxt reads NUXT_API_BASE_URL via useRuntimeConfig, not API_BASE_URL.
      // dotenv: false keeps nuxt/.env from clobbering our mock URL.
      command: `PORT=${NUXT_PORT} pnpm preview --dotenv /dev/null`,
      cwd: '../nuxt',
      port: NUXT_PORT,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      env: {
        NUXT_API_BASE_URL: 'http://localhost:4000',
        NUXT_API_CLIENT_SECRET: 'mock-client-secret',
      },
    },
    {
      // Next reads API_BASE_URL directly via process.env (from next/lib/apiToken.ts).
      command: `PORT=${NEXT_PORT} pnpm start`,
      cwd: '../next',
      port: NEXT_PORT,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      env: {
        API_BASE_URL: 'http://localhost:4000',
        API_CLIENT_SECRET: 'mock-client-secret',
      },
    },
  ],
});
