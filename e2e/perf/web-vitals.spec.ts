import { test } from '@playwright/test';
import {
  collectWebVitals,
  measureN,
  medianWebVitals,
  assertWebVitals,
} from '../support/perf/web-vitals';
import { BUDGETS, RUNS_PER_MEASUREMENT } from '../support/perf/budgets';
import { PAGES } from '../fixtures/pages';

for (const route of PAGES) {
  test(`web-vitals: ${route.id}`, async ({ page }, testInfo) => {
    const reports = await measureN(RUNS_PER_MEASUREMENT, () =>
      collectWebVitals(page, route.path),
    );
    const median = medianWebVitals(reports);
    await testInfo.attach('web-vitals.json', {
      body: JSON.stringify({ median, runs: reports }, null, 2),
      contentType: 'application/json',
    });
    // eslint-disable-next-line no-console
    console.log(`[web-vitals] ${testInfo.project.name} ${route.id}`, median);
    assertWebVitals(median, BUDGETS.webVitals, {
      project: testInfo.project.name,
      route: route.id,
    });
  });
}
