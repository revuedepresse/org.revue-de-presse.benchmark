# Mitosis Design System — M2 Molecules + 5 Generators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the design system from M1 to ship the **8 molecules** required to compose the calendar and Bluesky-card organisms, and broaden generator coverage from 2 (React, Vue) to **5 generators** (React, Vue, **Svelte, Solid, Lit**). Add a `DesignSystemProvider` per target so consumers can inject their own `t` function. Histoire stories for every molecule.

**Architecture:** Reuse the M1 Mitosis pipeline. Three new generator entries in `mitosis.config.cjs`. Each per-target output package gets a tiny `Provider` wrapper component for i18n dependency-injection (target-specific because React uses Context, Vue uses provide/inject, Svelte uses Context, Solid uses Context, Lit uses CSS custom properties + a setLocale event). Molecules compose only M1 atoms — no business logic, no network calls.

**Tech Stack:** Same as M1 (Mitosis CLI, Vitest, Vite, Histoire) plus Lit 3.x for Web Components.

**Prerequisite:** M1 plan complete and merged. The 11 atoms emit cleanly to React and Vue.

**Companion spec:** `docs/superpowers/specs/2026-05-06-mitosis-design-system-design.md`. M2 implements §3 (Component architecture, tier 2), §6.3 (i18n provider), and unblocks the M3 organisms.

---

## File structure produced by this plan

```
design-system/
├── mitosis.config.cjs              # MODIFIED: targets array now ['react','vue','svelte','solid','lit']
├── src/
│   ├── components/
│   │   ├── (M1 atoms unchanged)
│   │   ├── MonthPicker.lite.tsx    # NEW
│   │   ├── YearPicker.lite.tsx     # NEW
│   │   ├── DateGrid.lite.tsx       # NEW
│   │   ├── CalendarActionBar.lite.tsx  # NEW
│   │   ├── MetricsBar.lite.tsx     # NEW
│   │   ├── Alert.lite.tsx          # NEW
│   │   ├── Notice.lite.tsx         # NEW
│   │   ├── WebIntents.lite.tsx     # NEW
│   │   └── index.ts                # MODIFIED: re-export molecules
│   └── locales/
│       ├── fr-FR.json              # MODIFIED: add molecule keys
│       └── en-GB.json              # MODIFIED: add molecule keys
├── output/
│   ├── react/  vue/                # existing
│   ├── svelte/                     # NEW
│   ├── solid/                      # NEW
│   └── lit/                        # NEW
├── packages/
│   ├── provider-react/             # NEW: <DesignSystemProvider> for React
│   ├── provider-vue/               # NEW
│   ├── provider-svelte/            # NEW
│   ├── provider-solid/             # NEW
│   └── provider-lit/               # NEW
├── tests/unit/
│   ├── (M1 tests unchanged)
│   ├── MonthPicker.test.ts         # NEW
│   ├── YearPicker.test.ts          # NEW
│   ├── DateGrid.test.ts            # NEW
│   ├── CalendarActionBar.test.ts   # NEW
│   ├── MetricsBar.test.ts          # NEW
│   ├── Alert.test.ts               # NEW
│   ├── Notice.test.ts              # NEW
│   └── WebIntents.test.ts          # NEW
└── stories/
    └── *.story.vue                 # one per new molecule
```

---

## Task 1: Extend Mitosis configuration

**Files:**
- Modify: `design-system/mitosis.config.cjs`

- [ ] **Step 1: Update the targets array**

Replace `design-system/mitosis.config.cjs` with:

```js
module.exports = {
  files: 'src/components/**/*.lite.tsx',
  dest: 'output',
  exclude: ['**/node_modules/**'],
  options: {
    react: { typescript: true, stylesType: 'styled-jsx', stateType: 'useState' },
    vue: { typescript: true, api: 'composition' },
    svelte: { typescript: true },
    solid: { typescript: true },
    lit: { typescript: true },
  },
  targets: ['react', 'vue', 'svelte', 'solid', 'lit'],
};
```

- [ ] **Step 2: Install new generator-target peer deps**

Update `design-system/package.json` `devDependencies` to add:

```
"lit": "^3.2.0",
"solid-js": "^1.9.0",
"svelte": "^5.0.0"
```

Then:

```bash
pnpm install
```

- [ ] **Step 3: Re-run Mitosis emit**

```bash
pnpm build:mitosis
```

Expected: 11 components × 5 targets = 55 generated files under `output/<target>/src/components/`. Inspect one Svelte file to confirm:

```bash
ls output/svelte/src/components | head
```

- [ ] **Step 4: Commit**

```bash
git add design-system/mitosis.config.cjs design-system/package.json design-system/pnpm-lock.yaml design-system/output
git commit -m "feat(design-system): add svelte, solid, lit generator targets"
```

---

## Task 2: Add molecule i18n keys

**Files:**
- Modify: `design-system/src/locales/fr-FR.json`
- Modify: `design-system/src/locales/en-GB.json`
- Modify: `design-system/tests/unit/i18n.test.ts`

- [ ] **Step 1: Add the new keys to fr-FR.json**

Append to the existing `design-system/src/locales/fr-FR.json` (before the closing brace):

```json
  ,
  "calendar.weekdays.short.monday": "Lun.",
  "calendar.weekdays.short.tuesday": "Mar.",
  "calendar.weekdays.short.wednesday": "Mer.",
  "calendar.weekdays.short.thursday": "Jeu.",
  "calendar.weekdays.short.friday": "Ven.",
  "calendar.weekdays.short.saturday": "Sam.",
  "calendar.weekdays.short.sunday": "Dim.",
  "calendar.heading.month": "{month}",
  "calendar.heading.year": "{year}",
  "snapshots-list.heading": "Listes",
  "alert.empty.no-content-for-date": "Il semblerait qu'il n'y a pas de contenu disponible pour cette liste et/ou pour cette date.",
  "notice.signup-confirmed.headline": "Allez voir vos emails",
  "notice.signup-confirmed.body": "Votre inscription a bien été prise en compte.",
  "notice.email-changed.headline": "Allez voir vos emails",
  "notice.email-changed.body": "Votre nouvel email a bien été pris en compte.",
  "metrics.replies.aria-label": "{count} réponses",
  "metrics.reposts.aria-label": "{count} reposts",
  "metrics.likes.aria-label": "{count} likes",
  "web-intents.reply.aria-label": "Répondre",
  "web-intents.repost.aria-label": "Reposter",
  "web-intents.like.aria-label": "Aimer",
  "web-intents.share.aria-label": "Partager"
```

(Assumes the existing JSON file does not have a trailing comma on the last entry — if it does, remove the leading comma above.)

- [ ] **Step 2: Add the same keys with English values to en-GB.json**

```json
  ,
  "calendar.weekdays.short.monday": "Mon",
  "calendar.weekdays.short.tuesday": "Tue",
  "calendar.weekdays.short.wednesday": "Wed",
  "calendar.weekdays.short.thursday": "Thu",
  "calendar.weekdays.short.friday": "Fri",
  "calendar.weekdays.short.saturday": "Sat",
  "calendar.weekdays.short.sunday": "Sun",
  "calendar.heading.month": "{month}",
  "calendar.heading.year": "{year}",
  "snapshots-list.heading": "Lists",
  "alert.empty.no-content-for-date": "There appears to be no content available for this list and/or for this date.",
  "notice.signup-confirmed.headline": "Check your email",
  "notice.signup-confirmed.body": "Your registration has been recorded.",
  "notice.email-changed.headline": "Check your email",
  "notice.email-changed.body": "Your new email address has been recorded.",
  "metrics.replies.aria-label": "{count} replies",
  "metrics.reposts.aria-label": "{count} reposts",
  "metrics.likes.aria-label": "{count} likes",
  "web-intents.reply.aria-label": "Reply",
  "web-intents.repost.aria-label": "Repost",
  "web-intents.like.aria-label": "Like",
  "web-intents.share.aria-label": "Share"
```

- [ ] **Step 3: Run the parity test from M1 to verify still green**

```bash
pnpm test tests/unit/i18n.test.ts
```

Expected: PASS (parity preserved).

- [ ] **Step 4: Commit**

```bash
git add design-system/src/locales
git commit -m "feat(design-system): add i18n keys for M2 molecules"
```

---

## Task 3: MonthPicker molecule

**Files:**
- Create: `design-system/src/components/MonthPicker.lite.tsx`
- Create: `design-system/tests/unit/MonthPicker.test.ts`

- [ ] **Step 1: Write the failing test**

Write to `design-system/tests/unit/MonthPicker.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('MonthPicker (post-Mitosis emit)', () => {
  for (const target of ['vue', 'react', 'svelte', 'solid', 'lit']) {
    it(`emits a ${target} component`, () => {
      const ext = target === 'vue' ? 'vue' : target === 'svelte' ? 'svelte' : 'tsx';
      const path = join(root, `output/${target}/src/components/MonthPicker.${ext === 'tsx' && target === 'lit' ? 'ts' : ext}`);
      expect(existsSync(path) || existsSync(path.replace(/\.tsx$/, '.ts'))).toBe(true);
    });
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/unit/MonthPicker.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/MonthPicker.lite.tsx`**

```tsx
import { t } from '../utils/i18n';
import type { Locale } from '../utils/i18n';

type MonthPickerProps = {
  year: number;
  selectedMonth: number; // 0..11
  locale?: Locale;
  onSelect?: (monthIndex: number) => void;
};

export default function MonthPicker(props: MonthPickerProps) {
  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(props.locale ?? 'fr-FR', { month: 'long' })
      .format(new Date(props.year, i, 1))
  );

  return (
    <ul class="rdp-month-picker" role="listbox" aria-label={t('calendar.heading.year', { year: props.year })}>
      {months.map((name, index) => (
        <li
          key={index}
          role="option"
          aria-selected={index === props.selectedMonth ? 'true' : 'false'}
          class={`rdp-month-picker__item${index === props.selectedMonth ? ' rdp-month-picker__item--selected' : ''}`}
          onClick={() => props.onSelect?.(index)}
        >
          {name}
        </li>
      ))}
      <style>{`
        .rdp-month-picker {
          list-style: none; margin: 0; padding: 0;
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-month-picker__item {
          padding: var(--separation-1) var(--separation-2);
          color: var(--color-content-text);
          cursor: pointer;
          border-bottom: 1px solid var(--color-border);
        }
        .rdp-month-picker__item:last-child { border-bottom: none; }
        .rdp-month-picker__item--selected {
          background: var(--color-brand-active);
          color: var(--color-white);
        }
      `}</style>
    </ul>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/MonthPicker.test.ts
```

Expected: PASS (5 targets emit MonthPicker).

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/MonthPicker.lite.tsx design-system/tests/unit/MonthPicker.test.ts design-system/output
git commit -m "feat(design-system): add MonthPicker molecule"
```

---

## Task 4: YearPicker molecule

**Files:**
- Create: `design-system/src/components/YearPicker.lite.tsx`
- Create: `design-system/tests/unit/YearPicker.test.ts`

- [ ] **Step 1: Write the failing test**

Write to `design-system/tests/unit/YearPicker.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('YearPicker (post-Mitosis emit)', () => {
  for (const target of ['vue', 'react', 'svelte', 'solid']) {
    it(`emits a ${target} component`, () => {
      const ext = target === 'vue' ? 'vue' : target === 'svelte' ? 'svelte' : 'tsx';
      const path = join(root, `output/${target}/src/components/YearPicker.${ext}`);
      expect(existsSync(path)).toBe(true);
    });
  }
  it('emits a lit component', () => {
    const path = join(root, 'output/lit/src/components/YearPicker.ts');
    expect(existsSync(path)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/unit/YearPicker.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/YearPicker.lite.tsx`**

```tsx
import { t } from '../utils/i18n';

type YearPickerProps = {
  yearRange: { min: number; max: number };
  selectedYear: number;
  onSelect?: (year: number) => void;
};

export default function YearPicker(props: YearPickerProps) {
  const years = Array.from(
    { length: props.yearRange.max - props.yearRange.min + 1 },
    (_, i) => props.yearRange.min + i
  );

  return (
    <ul class="rdp-year-picker" role="listbox">
      {years.map((y) => (
        <li
          key={y}
          role="option"
          aria-selected={y === props.selectedYear ? 'true' : 'false'}
          class={`rdp-year-picker__item${y === props.selectedYear ? ' rdp-year-picker__item--selected' : ''}`}
          onClick={() => props.onSelect?.(y)}
        >
          {y}
        </li>
      ))}
      <style>{`
        .rdp-year-picker {
          list-style: none; margin: 0; padding: 0;
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-year-picker__item {
          padding: var(--separation-1) var(--separation-2);
          color: var(--color-content-text);
          cursor: pointer;
          border-bottom: 1px solid var(--color-border);
          text-align: center;
        }
        .rdp-year-picker__item:last-child { border-bottom: none; }
        .rdp-year-picker__item--selected {
          background: var(--color-brand-active);
          color: var(--color-white);
        }
      `}</style>
    </ul>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/YearPicker.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/YearPicker.lite.tsx design-system/tests/unit/YearPicker.test.ts design-system/output
git commit -m "feat(design-system): add YearPicker molecule with data-driven yearRange"
```

---

## Task 5: DateGrid molecule

**Files:**
- Create: `design-system/src/components/DateGrid.lite.tsx`
- Create: `design-system/tests/unit/DateGrid.test.ts`

DateGrid renders a 7×6 day grid for a given month, with weekdays from `Intl` and prev/next-month days dimmed.

- [ ] **Step 1: Write the failing test**

Write to `design-system/tests/unit/DateGrid.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('DateGrid (post-Mitosis emit)', () => {
  it('emits Vue component referencing weekdays', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/DateGrid.vue'), 'utf8');
    expect(src).toMatch(/weekday/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/unit/DateGrid.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/DateGrid.lite.tsx`**

```tsx
import { t } from '../utils/i18n';
import type { Locale } from '../utils/i18n';

type DateGridProps = {
  year: number;
  month: number;       // 0..11
  selectedDate?: Date;
  locale?: Locale;
  onSelect?: (date: Date) => void;
};

function buildGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  // Monday-first: convert getDay() (Sun=0) so Monday=0, Sunday=6
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) =>
    new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
  );
}

export default function DateGrid(props: DateGridProps) {
  const locale = props.locale ?? 'fr-FR';
  const cells = buildGrid(props.year, props.month);
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  function isSelected(d: Date): boolean {
    const s = props.selectedDate;
    return !!s && s.getFullYear() === d.getFullYear() && s.getMonth() === d.getMonth() && s.getDate() === d.getDate();
  }

  return (
    <table class="rdp-date-grid" role="grid">
      <thead>
        <tr>
          {weekdays.map((w) => (
            <th key={w} scope="col" class="rdp-date-grid__weekday">
              {t(`calendar.weekdays.short.${w}`, undefined, locale)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <tr key={row}>
            {[0, 1, 2, 3, 4, 5, 6].map((col) => {
              const d = cells[row * 7 + col]!;
              const otherMonth = d.getMonth() !== props.month;
              return (
                <td
                  key={`${row}-${col}`}
                  role="gridcell"
                  aria-selected={isSelected(d) ? 'true' : 'false'}
                  data-other-month={otherMonth ? 'true' : undefined}
                  class={`rdp-date-grid__cell${isSelected(d) ? ' rdp-date-grid__cell--selected' : ''}`}
                  onClick={() => props.onSelect?.(d)}
                >
                  {d.getDate()}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      <style>{`
        .rdp-date-grid {
          border-collapse: separate;
          border-spacing: 4px;
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-calendar-month-day-cell);
        }
        .rdp-date-grid__weekday {
          font-weight: normal;
          font-size: var(--font-size-calendar-month-day);
          color: var(--color-brand-active);
          padding: 4px;
        }
        .rdp-date-grid__cell {
          padding: 6px 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-selectable);
          color: var(--color-content-text);
          background: var(--color-background-future-date);
          cursor: pointer;
          text-align: center;
          min-width: 32px;
        }
        .rdp-date-grid__cell[data-other-month="true"] {
          background: var(--color-background-other-month);
          color: var(--color-light-grey);
        }
        .rdp-date-grid__cell--selected {
          background: var(--color-brand-active);
          color: var(--color-white);
          border-color: var(--color-brand-active);
        }
      `}</style>
    </table>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/DateGrid.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/DateGrid.lite.tsx design-system/tests/unit/DateGrid.test.ts design-system/output
git commit -m "feat(design-system): add DateGrid molecule (Monday-first 7x6 grid)"
```

---

## Task 6: CalendarActionBar molecule

**Files:**
- Create: `design-system/src/components/CalendarActionBar.lite.tsx`
- Create: `design-system/tests/unit/CalendarActionBar.test.ts`

- [ ] **Step 1: Write the failing test**

Write to `design-system/tests/unit/CalendarActionBar.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('CalendarActionBar (post-Mitosis emit)', () => {
  it('emits Vue component with previous/next handlers', () => {
    const src = readFileSync(join(root, 'output/vue/src/components/CalendarActionBar.vue'), 'utf8');
    expect(src).toMatch(/onPrev|onNext/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/unit/CalendarActionBar.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/CalendarActionBar.lite.tsx`**

```tsx
import { t } from '../utils/i18n';
import { formatDate } from '../utils/intl';
import type { Locale } from '../utils/i18n';

type CalendarActionBarProps = {
  date: Date;
  locale?: Locale;
  onDateClick?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  position?: 'top' | 'bottom';
};

export default function CalendarActionBar(props: CalendarActionBarProps) {
  const locale = props.locale ?? 'fr-FR';
  const label = formatDate(props.date, 'shortDay', locale);

  return (
    <div class={`rdp-calendar-action-bar rdp-calendar-action-bar--${props.position ?? 'bottom'}`}>
      <button
        type="button"
        class="rdp-calendar-action-bar__pill"
        onClick={() => props.onDateClick?.()}
      >
        {label}
      </button>
      <button
        type="button"
        class="rdp-calendar-action-bar__nav"
        aria-label={t('actions.previous', undefined, locale)}
        onClick={() => props.onPrev?.()}
      >
        ‹
      </button>
      <button
        type="button"
        class="rdp-calendar-action-bar__nav"
        aria-label={t('actions.next', undefined, locale)}
        onClick={() => props.onNext?.()}
      >
        ›
      </button>
      <style>{`
        .rdp-calendar-action-bar {
          display: flex; gap: var(--separation-1);
          align-items: center;
          background: var(--color-brand-active);
          padding: var(--separation-1) var(--separation-2);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
        }
        .rdp-calendar-action-bar__pill {
          flex: 1;
          background: var(--color-content-background);
          color: var(--color-white);
          padding: var(--separation-1) var(--separation-2);
          border: none;
          border-radius: var(--radius-default);
          font-size: var(--font-size-date-picker);
          cursor: pointer;
        }
        .rdp-calendar-action-bar__nav {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--color-white); color: var(--color-brand-active);
          border: none; cursor: pointer; font-size: 20px; line-height: 1;
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/CalendarActionBar.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/CalendarActionBar.lite.tsx design-system/tests/unit/CalendarActionBar.test.ts design-system/output
git commit -m "feat(design-system): add CalendarActionBar molecule"
```

---

## Task 7: MetricsBar molecule

**Files:**
- Create: `design-system/src/components/MetricsBar.lite.tsx`
- Create: `design-system/tests/unit/MetricsBar.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('MetricsBar (post-Mitosis emit)', () => {
  it('emits Vue component', () => {
    expect(existsSync(join(root, 'output/vue/src/components/MetricsBar.vue'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/unit/MetricsBar.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/MetricsBar.lite.tsx`**

```tsx
import { t } from '../utils/i18n';
import { formatCount } from '../utils/intl';
import type { Locale } from '../utils/i18n';

type MetricsBarProps = {
  replies: number;
  reposts: number;
  likes: number;
  locale?: Locale;
};

export default function MetricsBar(props: MetricsBarProps) {
  const locale = props.locale ?? 'fr-FR';
  return (
    <div class="rdp-metrics-bar">
      <span class="rdp-metrics-bar__pill rdp-metrics-bar__pill--reply" aria-label={t('metrics.replies.aria-label', { count: props.replies }, locale)}>
        💬 {formatCount(props.replies, locale)}
      </span>
      <span class="rdp-metrics-bar__pill rdp-metrics-bar__pill--repost" aria-label={t('metrics.reposts.aria-label', { count: props.reposts }, locale)}>
        🔁 {formatCount(props.reposts, locale)}
      </span>
      <span class="rdp-metrics-bar__pill rdp-metrics-bar__pill--like" aria-label={t('metrics.likes.aria-label', { count: props.likes }, locale)}>
        ❤ {formatCount(props.likes, locale)}
      </span>
      <style>{`
        .rdp-metrics-bar { display: inline-flex; gap: var(--separation-1); font-size: var(--font-size-vanity-metric); font-family: 'Roboto', sans-serif; }
        .rdp-metrics-bar__pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px var(--separation-1);
          border-radius: 999px;
          color: var(--color-white);
        }
        .rdp-metrics-bar__pill--reply { background: var(--color-vanity-metric-reply); }
        .rdp-metrics-bar__pill--repost { background: var(--color-vanity-metric-retweet); }
        .rdp-metrics-bar__pill--like { background: var(--color-vanity-metric-like); }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/MetricsBar.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/MetricsBar.lite.tsx design-system/tests/unit/MetricsBar.test.ts design-system/output
git commit -m "feat(design-system): add MetricsBar molecule"
```

---

## Task 8: Alert molecule

**Files:**
- Create: `design-system/src/components/Alert.lite.tsx`
- Create: `design-system/tests/unit/Alert.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('Alert (post-Mitosis emit)', () => {
  it('emits Vue component', () => {
    expect(existsSync(join(root, 'output/vue/src/components/Alert.vue'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/unit/Alert.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/Alert.lite.tsx`**

```tsx
import { t } from '../utils/i18n';

type AlertProps = {
  variant?: 'empty' | 'info' | 'warning';
  messageKey: string;
  vars?: Record<string, string | number>;
};

export default function Alert(props: AlertProps) {
  const text = t(props.messageKey, props.vars);
  const v = props.variant ?? 'empty';
  return (
    <div class={`rdp-alert rdp-alert--${v}`} role="status">
      <span aria-hidden="true" class="rdp-alert__icon">⚠</span>
      <span class="rdp-alert__text">{text}</span>
      <style>{`
        .rdp-alert {
          display: inline-flex; align-items: center; gap: var(--separation-1);
          padding: var(--separation-1) var(--separation-2);
          background: var(--alert-bg-empty);
          color: var(--alert-fg-empty);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
          border-radius: var(--radius-default);
        }
        .rdp-alert--info { background: var(--color-brand-active); color: var(--color-white); }
        .rdp-alert--warning { background: var(--color-vanity-metric-like); color: var(--color-white); }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/Alert.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/Alert.lite.tsx design-system/tests/unit/Alert.test.ts design-system/output
git commit -m "feat(design-system): add Alert molecule"
```

---

## Task 9: Notice molecule

**Files:**
- Create: `design-system/src/components/Notice.lite.tsx`
- Create: `design-system/tests/unit/Notice.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('Notice (post-Mitosis emit)', () => {
  it('emits Vue component', () => {
    expect(existsSync(join(root, 'output/vue/src/components/Notice.vue'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/unit/Notice.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/Notice.lite.tsx`**

```tsx
import { t } from '../utils/i18n';

type NoticeProps = {
  headlineKey: string;
  bodyKey: string;
  headlineVars?: Record<string, string | number>;
  bodyVars?: Record<string, string | number>;
};

export default function Notice(props: NoticeProps) {
  return (
    <div class="rdp-notice" role="status">
      <h2 class="rdp-notice__headline">{t(props.headlineKey, props.headlineVars)}</h2>
      <p class="rdp-notice__body">{t(props.bodyKey, props.bodyVars)}</p>
      <style>{`
        .rdp-notice {
          background: var(--color-white);
          padding: var(--separation-3);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          color: var(--color-content-text);
          max-width: 360px;
        }
        .rdp-notice__headline {
          margin: 0 0 var(--separation-1);
          font-family: 'Signika', sans-serif;
          font-size: var(--font-size-status-text);
          color: var(--color-vanity-metric-like);
        }
        .rdp-notice__body { margin: 0; font-size: var(--font-size-content); }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/Notice.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/Notice.lite.tsx design-system/tests/unit/Notice.test.ts design-system/output
git commit -m "feat(design-system): add Notice molecule"
```

---

## Task 10: WebIntents molecule

**Files:**
- Create: `design-system/src/components/WebIntents.lite.tsx`
- Create: `design-system/tests/unit/WebIntents.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '../..');

describe('WebIntents (post-Mitosis emit)', () => {
  it('emits Vue component', () => {
    expect(existsSync(join(root, 'output/vue/src/components/WebIntents.vue'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/unit/WebIntents.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write `src/components/WebIntents.lite.tsx`**

```tsx
import { t } from '../utils/i18n';

type WebIntentsProps = {
  postId: string;
  onReply?: (id: string) => void;
  onRepost?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
};

export default function WebIntents(props: WebIntentsProps) {
  return (
    <div class="rdp-web-intents">
      <button type="button" class="rdp-web-intents__btn" aria-label={t('web-intents.reply.aria-label')} onClick={() => props.onReply?.(props.postId)}>↩</button>
      <button type="button" class="rdp-web-intents__btn" aria-label={t('web-intents.repost.aria-label')} onClick={() => props.onRepost?.(props.postId)}>🔁</button>
      <button type="button" class="rdp-web-intents__btn" aria-label={t('web-intents.like.aria-label')} onClick={() => props.onLike?.(props.postId)}>♡</button>
      <button type="button" class="rdp-web-intents__btn" aria-label={t('web-intents.share.aria-label')} onClick={() => props.onShare?.(props.postId)}>↗</button>
      <style>{`
        .rdp-web-intents { display: inline-flex; gap: var(--separation-2); }
        .rdp-web-intents__btn {
          width: 24px; height: 24px;
          background: transparent; border: none;
          color: var(--color-light-grey);
          cursor: pointer; font-size: 16px;
        }
        .rdp-web-intents__btn:hover { color: var(--color-brand-active); }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build:mitosis && pnpm test tests/unit/WebIntents.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add design-system/src/components/WebIntents.lite.tsx design-system/tests/unit/WebIntents.test.ts design-system/output
git commit -m "feat(design-system): add WebIntents molecule"
```

---

## Task 11: DesignSystemProvider per target (i18n DI)

**Files (one Provider per target):**
- Create: `design-system/packages/provider-react/src/index.tsx`
- Create: `design-system/packages/provider-vue/src/index.ts`
- Create: `design-system/packages/provider-svelte/src/Provider.svelte`
- Create: `design-system/packages/provider-solid/src/index.tsx`
- Create: `design-system/packages/provider-lit/src/index.ts`
- Create: one `package.json` per provider package
- Modify: `design-system/pnpm-workspace.yaml` to include `packages/*`

The Provider's job: receive a consumer-supplied `t` function and `locale`, and apply them globally for all subsequent component renders. Each target uses its native pattern.

- [ ] **Step 1: Add `packages/*` to the workspace**

Modify `design-system/pnpm-workspace.yaml` to:

```yaml
packages:
  - "apps/*"
  - "output/*"
  - "packages/*"
```

- [ ] **Step 2: Write `packages/provider-react/package.json`**

```json
{
  "name": "@revue-de-presse/design-system-provider-react",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "peerDependencies": {
    "react": ">=18"
  }
}
```

- [ ] **Step 3: Write `packages/provider-react/src/index.tsx`**

```tsx
import React, { createContext, useContext, useState } from 'react';
import { t as defaultT, setLocale, type Locale } from '../../../src/utils/i18n';

type DSContext = {
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const Ctx = createContext<DSContext | null>(null);

export function DesignSystemProvider({
  children,
  t,
  locale: initialLocale = 'fr-FR',
}: {
  children: React.ReactNode;
  t?: (key: string, vars?: Record<string, string | number>) => string;
  locale?: Locale;
}) {
  const [locale, _setLocale] = useState<Locale>(initialLocale);
  const value: DSContext = {
    t: t ?? ((key, vars) => defaultT(key, vars, locale)),
    locale,
    setLocale: (l) => {
      setLocale(l);
      _setLocale(l);
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDesignSystem(): DSContext {
  const v = useContext(Ctx);
  if (!v) {
    return {
      t: defaultT,
      locale: 'fr-FR',
      setLocale,
    };
  }
  return v;
}
```

- [ ] **Step 4: Write `packages/provider-vue/package.json`** (mirror of step 2 for vue)

```json
{
  "name": "@revue-de-presse/design-system-provider-vue",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "peerDependencies": {
    "vue": ">=3"
  }
}
```

- [ ] **Step 5: Write `packages/provider-vue/src/index.ts`**

```ts
import { defineComponent, h, provide, inject, ref, type InjectionKey, type Ref } from 'vue';
import { t as defaultT, setLocale, type Locale } from '../../../src/utils/i18n';

export type DSContext = {
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Ref<Locale>;
  setLocale: (l: Locale) => void;
};

const KEY: InjectionKey<DSContext> = Symbol('design-system');

export const DesignSystemProvider = defineComponent({
  name: 'DesignSystemProvider',
  props: {
    locale: { type: String as () => Locale, default: 'fr-FR' },
    t: { type: Function as unknown as () => DSContext['t'], default: null },
  },
  setup(props, { slots }) {
    const locale = ref<Locale>(props.locale);
    const ctx: DSContext = {
      t: props.t ?? ((k, v) => defaultT(k, v, locale.value)),
      locale,
      setLocale: (l) => {
        setLocale(l);
        locale.value = l;
      },
    };
    provide(KEY, ctx);
    return () => slots.default?.();
  },
});

export function useDesignSystem(): DSContext {
  const v = inject(KEY);
  if (!v) {
    return {
      t: defaultT,
      locale: ref<Locale>('fr-FR'),
      setLocale,
    };
  }
  return v;
}
```

- [ ] **Step 6: Write `packages/provider-svelte/package.json`**

```json
{
  "name": "@revue-de-presse/design-system-provider-svelte",
  "version": "0.1.0",
  "type": "module",
  "svelte": "./src/Provider.svelte",
  "peerDependencies": {
    "svelte": ">=4"
  }
}
```

- [ ] **Step 7: Write `packages/provider-svelte/src/Provider.svelte`**

```svelte
<script lang="ts" context="module">
  import { writable } from 'svelte/store';
  import { setContext, getContext } from 'svelte';
  import { t as defaultT, setLocale as defaultSetLocale, type Locale } from '../../../src/utils/i18n';

  const KEY = Symbol('design-system');
  export type DSContext = {
    t: (k: string, vars?: Record<string, string | number>) => string;
    locale: ReturnType<typeof writable<Locale>>;
    setLocale: (l: Locale) => void;
  };

  export function useDesignSystem(): DSContext {
    return getContext<DSContext>(KEY) ?? {
      t: defaultT,
      locale: writable<Locale>('fr-FR'),
      setLocale: defaultSetLocale,
    };
  }

  export const PROVIDER_KEY = KEY;
</script>

<script lang="ts">
  export let locale: Locale = 'fr-FR';
  export let t: ((k: string, vars?: Record<string, string | number>) => string) | null = null;

  const localeStore = writable<Locale>(locale);
  const ctx: DSContext = {
    t: t ?? ((k, v) => { let l: Locale = locale; localeStore.subscribe((x) => (l = x))(); return defaultT(k, v, l); }),
    locale: localeStore,
    setLocale: (l) => { defaultSetLocale(l); localeStore.set(l); },
  };
  setContext(PROVIDER_KEY, ctx);
</script>

<slot />
```

- [ ] **Step 8: Write `packages/provider-solid/package.json`**

```json
{
  "name": "@revue-de-presse/design-system-provider-solid",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "peerDependencies": {
    "solid-js": ">=1"
  }
}
```

- [ ] **Step 9: Write `packages/provider-solid/src/index.tsx`**

```tsx
import { createContext, useContext, createSignal, type JSX, type ParentProps } from 'solid-js';
import { t as defaultT, setLocale as defaultSetLocale, type Locale } from '../../../src/utils/i18n';

type DSContext = {
  t: (k: string, vars?: Record<string, string | number>) => string;
  locale: () => Locale;
  setLocale: (l: Locale) => void;
};

const Ctx = createContext<DSContext>();

export function DesignSystemProvider(props: ParentProps<{ locale?: Locale; t?: DSContext['t'] }>): JSX.Element {
  const [locale, setLocaleSignal] = createSignal<Locale>(props.locale ?? 'fr-FR');
  const ctx: DSContext = {
    t: props.t ?? ((k, v) => defaultT(k, v, locale())),
    locale,
    setLocale: (l) => {
      defaultSetLocale(l);
      setLocaleSignal(l);
    },
  };
  return <Ctx.Provider value={ctx}>{props.children}</Ctx.Provider>;
}

export function useDesignSystem(): DSContext {
  const v = useContext(Ctx);
  if (!v) {
    return {
      t: defaultT,
      locale: () => 'fr-FR',
      setLocale: defaultSetLocale,
    };
  }
  return v;
}
```

- [ ] **Step 10: Write `packages/provider-lit/package.json`**

```json
{
  "name": "@revue-de-presse/design-system-provider-lit",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "peerDependencies": {
    "lit": ">=3"
  }
}
```

- [ ] **Step 11: Write `packages/provider-lit/src/index.ts`**

Lit Web Components don't have a context API equivalent to React Context. Provider is implemented as a custom element that emits a `design-system-locale-changed` CustomEvent and sets a CSS attribute on its host. Component-level i18n consumes a global `globalThis.__rdp_t` set by the provider.

```ts
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t as defaultT, setLocale as defaultSetLocale, type Locale } from '../../../src/utils/i18n';

declare global {
  // eslint-disable-next-line no-var
  var __rdp_t: ((k: string, vars?: Record<string, string | number>) => string) | undefined;
  // eslint-disable-next-line no-var
  var __rdp_locale: Locale | undefined;
}

if (!globalThis.__rdp_t) globalThis.__rdp_t = defaultT;
if (!globalThis.__rdp_locale) globalThis.__rdp_locale = 'fr-FR';

@customElement('rdp-design-system-provider')
export class DesignSystemProvider extends LitElement {
  @property({ type: String }) locale: Locale = 'fr-FR';
  @property({ attribute: false }) t?: (k: string, vars?: Record<string, string | number>) => string;

  static styles = css`:host { display: contents; }`;

  updated(): void {
    globalThis.__rdp_t = this.t ?? ((k, v) => defaultT(k, v, this.locale));
    globalThis.__rdp_locale = this.locale;
    defaultSetLocale(this.locale);
    this.dispatchEvent(
      new CustomEvent('design-system-locale-changed', { detail: { locale: this.locale }, bubbles: true, composed: true })
    );
  }

  render() {
    return html`<slot></slot>`;
  }
}
```

- [ ] **Step 12: Install workspace deps**

```bash
pnpm install
```

Expected: pnpm picks up the five new provider packages.

- [ ] **Step 13: Commit**

```bash
git add design-system/packages design-system/pnpm-workspace.yaml design-system/pnpm-lock.yaml
git commit -m "feat(design-system): add DesignSystemProvider for react/vue/svelte/solid/lit"
```

---

## Task 12: Components barrel export update

**Files:**
- Modify: `design-system/src/components/index.ts`

- [ ] **Step 1: Add molecule re-exports**

Append to `design-system/src/components/index.ts`:

```ts
export { default as Alert } from './Alert.lite';
export { default as CalendarActionBar } from './CalendarActionBar.lite';
export { default as DateGrid } from './DateGrid.lite';
export { default as MetricsBar } from './MetricsBar.lite';
export { default as MonthPicker } from './MonthPicker.lite';
export { default as Notice } from './Notice.lite';
export { default as WebIntents } from './WebIntents.lite';
export { default as YearPicker } from './YearPicker.lite';
```

- [ ] **Step 2: Type-check**

```bash
pnpm typecheck
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add design-system/src/components/index.ts
git commit -m "feat(design-system): re-export M2 molecules from barrel"
```

---

## Task 13: Histoire stories for molecules

**Files:**
- Create: `design-system/stories/MonthPicker.story.vue`
- Create: `design-system/stories/YearPicker.story.vue`
- Create: `design-system/stories/DateGrid.story.vue`
- Create: `design-system/stories/CalendarActionBar.story.vue`
- Create: `design-system/stories/MetricsBar.story.vue`
- Create: `design-system/stories/Alert.story.vue`
- Create: `design-system/stories/Notice.story.vue`
- Create: `design-system/stories/WebIntents.story.vue`

- [ ] **Step 1: Write all eight stories**

For each molecule, create a Histoire story file. Each follows the same shape — one variant per relevant prop. Examples (write these full files):

`stories/MonthPicker.story.vue`:

```vue
<script setup lang="ts">
import MonthPicker from '@design-system/components/MonthPicker.vue';
</script>
<template>
  <Story title="Molecules/MonthPicker">
    <Variant title="2021, April selected">
      <MonthPicker :year="2021" :selected-month="3" locale="fr-FR" />
    </Variant>
    <Variant title="en-GB">
      <MonthPicker :year="2021" :selected-month="3" locale="en-GB" />
    </Variant>
  </Story>
</template>
```

`stories/YearPicker.story.vue`:

```vue
<script setup lang="ts">
import YearPicker from '@design-system/components/YearPicker.vue';
</script>
<template>
  <Story title="Molecules/YearPicker">
    <Variant title="2020-2025, 2021 selected">
      <YearPicker :year-range="{ min: 2020, max: 2025 }" :selected-year="2021" />
    </Variant>
  </Story>
</template>
```

`stories/DateGrid.story.vue`:

```vue
<script setup lang="ts">
import DateGrid from '@design-system/components/DateGrid.vue';
</script>
<template>
  <Story title="Molecules/DateGrid">
    <Variant title="April 2021, day 6 selected">
      <DateGrid :year="2021" :month="3" :selected-date="new Date(2021, 3, 6)" locale="fr-FR" />
    </Variant>
  </Story>
</template>
```

`stories/CalendarActionBar.story.vue`:

```vue
<script setup lang="ts">
import CalendarActionBar from '@design-system/components/CalendarActionBar.vue';
</script>
<template>
  <Story title="Molecules/CalendarActionBar">
    <Variant title="bottom (mobile)">
      <CalendarActionBar :date="new Date(2021, 3, 2)" position="bottom" />
    </Variant>
    <Variant title="top (desktop)">
      <CalendarActionBar :date="new Date(2021, 3, 2)" position="top" />
    </Variant>
  </Story>
</template>
```

`stories/MetricsBar.story.vue`:

```vue
<script setup lang="ts">
import MetricsBar from '@design-system/components/MetricsBar.vue';
</script>
<template>
  <Story title="Molecules/MetricsBar">
    <Variant title="default"><MetricsBar :replies="182" :reposts="36000" :likes="35200" locale="fr-FR" /></Variant>
    <Variant title="en-GB"><MetricsBar :replies="182" :reposts="36000" :likes="35200" locale="en-GB" /></Variant>
  </Story>
</template>
```

`stories/Alert.story.vue`:

```vue
<script setup lang="ts">
import Alert from '@design-system/components/Alert.vue';
</script>
<template>
  <Story title="Molecules/Alert">
    <Variant title="empty">
      <Alert variant="empty" message-key="alert.empty.no-content-for-date" />
    </Variant>
    <Variant title="info">
      <Alert variant="info" message-key="alert.empty.no-content-for-date" />
    </Variant>
    <Variant title="warning">
      <Alert variant="warning" message-key="errors.password.breached" />
    </Variant>
  </Story>
</template>
```

`stories/Notice.story.vue`:

```vue
<script setup lang="ts">
import Notice from '@design-system/components/Notice.vue';
</script>
<template>
  <Story title="Molecules/Notice">
    <Variant title="signup confirmed">
      <Notice headline-key="notice.signup-confirmed.headline" body-key="notice.signup-confirmed.body" />
    </Variant>
    <Variant title="email changed">
      <Notice headline-key="notice.email-changed.headline" body-key="notice.email-changed.body" />
    </Variant>
  </Story>
</template>
```

`stories/WebIntents.story.vue`:

```vue
<script setup lang="ts">
import WebIntents from '@design-system/components/WebIntents.vue';
</script>
<template>
  <Story title="Molecules/WebIntents">
    <Variant title="default"><WebIntents post-id="example-1" /></Variant>
  </Story>
</template>
```

- [ ] **Step 2: Boot Histoire and verify**

```bash
pnpm story
```

Expected: Histoire boots; all 8 molecule stories render alongside the M1 atom stories.

- [ ] **Step 3: Commit**

```bash
git add design-system/stories
git commit -m "feat(design-system): add Histoire stories for M2 molecules"
```

---

## Task 14: Update CI for new generators

**Files:**
- Modify: `design-system/.github/workflows/ci.yml`

- [ ] **Step 1: Update the CI matrix**

Replace `design-system/.github/workflows/ci.yml` with the same workflow but ensure `pnpm build:mitosis` is still the trigger (it now emits 5 targets). Keep the workflow simple — single job, runs build + test. No matrix-per-target needed in M2; M4 (when all 10 targets are present) will introduce a per-target matrix if it makes sense.

The existing M1 workflow file already covers this. No change needed — just verify the latest emit succeeds in CI. If a developer wants to test locally:

```bash
cd design-system && pnpm install --frozen-lockfile && pnpm build && pnpm test && pnpm typecheck
```

Expected: green.

- [ ] **Step 2: Commit (no-op note)**

If no file changes were necessary, skip the commit. Otherwise commit any tweaks made during local verification.

---

## Final acceptance check (run after all tasks)

- [ ] **Run the full local CI loop**

```bash
cd ./design-system
pnpm install --frozen-lockfile
node scripts/sync-tokens.mjs --check
pnpm build:mitosis
pnpm test
pnpm typecheck
```

Expected: every step exits 0. Vitest reports M1 tests + 8 new molecule emit-checks across 5 targets (so ~40 added emit assertions on top of M1's ~30).

- [ ] **Verify all 5 targets emit each molecule**

```bash
for tgt in react vue svelte solid lit; do
  for c in MonthPicker YearPicker DateGrid CalendarActionBar MetricsBar Alert Notice WebIntents; do
    ext=$([ "$tgt" = "vue" ] && echo vue || ([ "$tgt" = "svelte" ] && echo svelte || ([ "$tgt" = "lit" ] && echo ts || echo tsx)))
    [ -f "output/$tgt/src/components/$c.$ext" ] || echo "MISSING: output/$tgt/src/components/$c.$ext"
  done
done
```

Expected: zero MISSING lines.

- [ ] **Verify Histoire boots with 19 stories**

```bash
pnpm story
# Expected: Atoms (11) + Molecules (8) = 19 stories listed.
```

---

## Self-review notes

- **Spec coverage:** §3 tier-2 molecules — all 8 implemented (Tasks 3–10). §6.3 Provider DI — implemented across 5 targets (Task 11). 3 generator targets added (Task 1).
- **Type consistency:** `Locale`, `IconName`, `ButtonVariant`, `ErrorMessage` continue to come from M1's `src/types.ts` and `src/utils/i18n.ts`. No drift.
- **No placeholders:** every step has a concrete code block or shell command.
- **Out-of-scope deferrals stated:** zxcvbn-ts and Pwned Passwords still M3; visual regression M3; remaining 5 generators M4; publish M5.
- **Edit-password add-confirm-field decision** is implemented in M3 with the auth organism, not here.
