import { defineConfig, devices } from '@playwright/test';

const NUXT_PORT = 3001;
const NEXT_PORT = 3002;
const NUXT_URL = `http://localhost:${NUXT_PORT}`;
const NEXT_URL = `http://localhost:${NEXT_PORT}`;

// Chromium needs a remote-debugging port for playwright-lighthouse to attach.
// One per worker; Playwright workerIndex is 0-based.
const LIGHTHOUSE_PORT_BASE = 9222;

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      args: [`--remote-debugging-port=${LIGHTHOUSE_PORT_BASE}`],
    },
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
      command: `PORT=${NUXT_PORT} pnpm --filter @revue-de-presse/nuxt-app preview`,
      port: NUXT_PORT,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      env: {
        API_BASE_URL: 'http://unused.test',
        API_CLIENT_SECRET: 'unused',
      },
    },
    {
      command: `PORT=${NEXT_PORT} pnpm --filter @revue-de-presse/next-app start`,
      port: NEXT_PORT,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      env: {
        API_BASE_URL: 'http://unused.test',
        API_CLIENT_SECRET: 'unused',
      },
    },
  ],
});
