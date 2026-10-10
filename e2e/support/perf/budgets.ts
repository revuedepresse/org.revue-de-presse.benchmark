// Google "good" thresholds for Web Vitals + Lighthouse score floors.
// Single source of truth for both perf specs and the harness assertions.

export const BUDGETS = {
  webVitals: {
    LCP: 2500,   // ms
    INP: 200,    // ms (replaced FID in 2024-03)
    CLS: 0.1,    // unitless
    TTFB: 800,   // ms
    FCP: 1800,   // ms
  },
  lighthouse: {
    performance: 90,
    accessibility: 90,
    'best-practices': 90,
    seo: 90,
    // No `pwa` entry: Lighthouse 13 dropped the category, and these keys become
    // its `onlyCategories`, so naming it fails every audit. It was never
    // asserted anyway — we don't target PWA install despite the manifest.
  },
} as const;

export type WebVitalsBudget = typeof BUDGETS.webVitals;
export type LighthouseBudget = typeof BUDGETS.lighthouse;

export const RUNS_PER_MEASUREMENT = 3;
