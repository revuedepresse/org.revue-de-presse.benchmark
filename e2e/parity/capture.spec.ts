import { test } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'captures');

const STYLE_PROPS = [
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'borderTopStyle', 'borderTopColor', 'borderBottomColor',
  'borderTopLeftRadius', 'borderTopRightRadius',
  'borderBottomLeftRadius', 'borderBottomRightRadius',
  'backgroundColor',
  'color',
  'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'textAlign', 'textDecorationLine',
  'display', 'flexDirection', 'gap', 'alignItems', 'justifyContent',
  'width', 'height', 'maxWidth', 'minHeight',
  'boxShadow',
];

type SelectorMap = Record<string, string>;
type Screen = { name: string; path: string; selectors: SelectorMap };

const VIEWPORT = { width: 1280, height: 800 };

const SCREENS: Screen[] = [
  {
    name: 'home',
    path: '/',
    selectors: {
      AppShell:           '[data-testid="app-shell"]',
      AppHeaderRibbon:    '.rdp-app__header-ribbon',
      AppHeaderInner:     '.rdp-app__header-inner',
      HomeLink:           '.rdp-app-header__home',
      MySpaceLink:        '.rdp-app-header__myspace',
      AccountButton:      '.rdp-app-header__account',
      PopularNewsBar:     '.rdp-app__popular-news',
      ContentColumn:      '.rdp-app__column',
      MainColumn:         '.rdp-app__main',
      PostList:           '.rdp-app__post-list',
      PostItem:           '.rdp-app__post-item',
      Sidebar:            '.rdp-sidebar',
      Calendar:           '[data-testid="calendar"]',
      BannerAbout:        '.rdp-banner-about',
      BannerAboutTitle:   '.rdp-banner-about__title',
      BannerAboutPara:    '.rdp-banner-about__paragraph',
      BannerAboutLink:    '.rdp-banner-about__outer-link',
      PostCard:           '[data-testid="post-card"]',
      PostAvatar:         '.rdp-bsky-post__avatar',
      PostAuthor:         '.rdp-bsky-post__author',
      PostBody:           '.rdp-bsky-post__body',
      PostBlueskyMark:    '.rdp-bsky-post__bluesky',
      MetricsBar:         '.rdp-metrics-bar',
      MetricLikePill:     '.rdp-metrics-bar__pill--like',
      MetricLikeIcon:     '.rdp-metrics-bar__icon--like',
      MetricLikeCount:    '.rdp-metrics-bar__count--like',
      MetricRepostPill:   '.rdp-metrics-bar__pill--repost',
      MetricRepostIcon:   '.rdp-metrics-bar__icon--repost',
      MetricRepostCount:  '.rdp-metrics-bar__count--repost',
    },
  },
  {
    name: 'sources',
    path: '/sources',
    selectors: {
      AppShell:           '[data-testid="app-shell"]',
      AppHeaderRibbon:    '.rdp-app__header-ribbon',
      ContentColumn:      '.rdp-app__column',
      MainColumn:         '.rdp-app__main',
      Sidebar:            '.rdp-sidebar',
      BannerAbout:        '.rdp-banner-about',
    },
  },
];

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  await mkdir(OUT_DIR, { recursive: true });
});

for (const screen of SCREENS) {
  test(`capture parity baseline: ${screen.name}`, async ({ page }) => {
    await page.setViewportSize(VIEWPORT);
    await page.goto(screen.path);
    await page.waitForLoadState('networkidle').catch(() => undefined);

    const components: Record<string, unknown> = {};
    const missing: string[] = [];

    for (const [name, selector] of Object.entries(screen.selectors)) {
      const locator = page.locator(selector).first();
      const exists = (await locator.count()) > 0;
      if (!exists) {
        missing.push(name);
        components[name] = { selector, found: false };
        continue;
      }
      const box = await locator.boundingBox();
      const styles = await locator.evaluate((el, props) => {
        const cs = window.getComputedStyle(el as Element);
        const out: Record<string, string> = {};
        for (const p of props as string[]) out[p] = cs.getPropertyValue(toKebab(p)) || (cs as any)[p];
        function toKebab(s: string) {
          return s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
        }
        return out;
      }, STYLE_PROPS);
      const text = await locator.evaluate((el) => (el as HTMLElement).innerText?.slice(0, 80) ?? null);
      components[name] = { selector, found: true, box, text, styles };
    }

    const payload = {
      capturedAt: new Date().toISOString(),
      viewport: VIEWPORT,
      screen: screen.name,
      path: screen.path,
      missing,
      components,
    };

    await page.screenshot({
      path: path.join(OUT_DIR, `${screen.name}.png`),
      clip: { x: 0, y: 0, ...VIEWPORT },
    });
    await writeFile(
      path.join(OUT_DIR, `${screen.name}.json`),
      JSON.stringify(payload, null, 2),
    );

    if (missing.length) {
      console.warn(`[parity:${screen.name}] missing selectors:`, missing.join(', '));
    }
  });
}
