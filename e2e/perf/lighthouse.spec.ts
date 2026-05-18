import { test } from '@playwright/test';
import {
  runLighthouse,
  lighthousePortForWorker,
  slugify,
} from '../support/perf/lighthouse';
import { RUNS_PER_MEASUREMENT } from '../support/perf/budgets';
import { PAGES } from '../fixtures/pages';

for (const route of PAGES) {
  test(`lighthouse: ${route.id}`, async ({ page }, testInfo) => {
    const port = lighthousePortForWorker(testInfo.workerIndex);
    const baseURL = testInfo.project.use.baseURL!;
    const url = new URL(route.path, baseURL).toString();
    // Multi-run Lighthouse: playAudit asserts thresholds internally per run.
    // The 90 ≥ "good" floor absorbs some variance; if 3× proves too slow,
    // dropping to 1× is acceptable degradation.
    for (let i = 0; i < RUNS_PER_MEASUREMENT; i++) {
      await runLighthouse(page, {
        url,
        port,
        reportName: `${testInfo.project.name}-${slugify(route.path)}-${i}`,
      });
    }
  });
}
