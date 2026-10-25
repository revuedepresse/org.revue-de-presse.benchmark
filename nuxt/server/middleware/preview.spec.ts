import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

declare const globalThis: any;

type FakeEvent = {
  url: string;
  node: { req: { headers: Record<string, string | undefined> } };
  context: Record<string, unknown>;
  setCookies: { name: string; value: string; options: Record<string, unknown> }[];
  deletedCookies: string[];
  redirect?: { to: string; code: number };
};

function makeEvent(path: string, cookie?: string): FakeEvent {
  return {
    url: `http://localhost${path}`,
    node: { req: { headers: cookie ? { cookie } : {} } },
    context: {},
    setCookies: [],
    deletedCookies: [],
  };
}

const cookiesOf = (event: FakeEvent) =>
  Object.fromEntries(
    (event.node.req.headers.cookie ?? '')
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => p.split('=')),
  );

beforeEach(() => {
  vi.resetModules();
  globalThis.defineEventHandler = (handler: any) => handler;
  globalThis.getRequestURL = (event: FakeEvent) => new URL(event.url);
  globalThis.getQuery = (event: FakeEvent) => Object.fromEntries(new URL(event.url).searchParams);
  globalThis.getCookie = (event: FakeEvent, name: string) => cookiesOf(event)[name];
  globalThis.setCookie = (event: FakeEvent, name: string, value: string, options: Record<string, unknown>) =>
    event.setCookies.push({ name, value, options });
  globalThis.deleteCookie = (event: FakeEvent, name: string) => event.deletedCookies.push(name);
  globalThis.sendRedirect = (event: FakeEvent, to: string, code: number) => {
    event.redirect = { to, code };
  };
});

afterEach(() => {
  for (const name of ['defineEventHandler', 'getRequestURL', 'getQuery', 'getCookie', 'setCookie', 'deleteCookie', 'sendRedirect']) {
    delete globalThis[name];
  }
});

const middleware = async () => (await import('./preview')).default as (event: FakeEvent) => unknown;

describe('preview middleware', () => {
  it('leaves the public site as it is without ?apercu= nor cookie', async () => {
    const event = makeEvent('/');
    await (await middleware())(event);
    expect(event.context.preview).toBe(false);
    expect(event.setCookies).toEqual([]);
    expect(event.deletedCookies).toEqual([]);
    expect(event.redirect).toBeUndefined();
  });

  it('turns the preview on with ?apercu=1, without remembering it', async () => {
    const event = makeEvent('/?apercu=1');
    await (await middleware())(event);
    expect(event.context.preview).toBe(true);
    expect(event.setCookies).toEqual([]);
  });

  it('shows the public site to an address without ?apercu=1, even after a preview', async () => {
    const event = makeEvent('/', 'other=x; rdp_apercu=1');
    await (await middleware())(event);
    expect(event.context.preview).toBe(false);
    // The cookie an earlier version set is cleared, for the proxy too.
    expect(event.deletedCookies).toEqual(['rdp_apercu']);
    expect(cookiesOf(event)).toEqual({ other: 'x' });
  });

  it('redirects the Coop Médias newsletter page to the home page without the preview', async () => {
    for (const [path, cookie] of [['/lettre-quotidienne-coop-medias', undefined], ['/lettre-quotidienne-coop-medias', 'rdp_apercu=1']] as const) {
      const event = makeEvent(path, cookie);
      await (await middleware())(event);
      expect(event.redirect).toEqual({ to: '/', code: 302 });
    }
  });

  it('shows the newsletter pages in preview', async () => {
    for (const event of [makeEvent('/lettre-quotidienne?apercu=1'), makeEvent('/lettre-quotidienne-coop-medias?apercu=1')]) {
      await (await middleware())(event);
      expect(event.redirect).toBeUndefined();
    }
  });
});
