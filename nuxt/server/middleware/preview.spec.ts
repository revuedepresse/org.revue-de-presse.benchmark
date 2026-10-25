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

  it('turns the preview on with ?apercu=1, in a session cookie for the whole site', async () => {
    const event = makeEvent('/?apercu=1');
    await (await middleware())(event);
    expect(event.context.preview).toBe(true);
    expect(event.setCookies).toEqual([
      { name: 'rdp_apercu', value: '1', options: { path: '/', sameSite: 'lax', secure: false } },
    ]);
    expect(event.setCookies[0].options).not.toHaveProperty('maxAge');
    // The highlights proxy, called while this page renders, sees it too.
    expect(cookiesOf(event).rdp_apercu).toBe('1');
  });

  it('keeps the preview on the next pages through the cookie', async () => {
    const event = makeEvent('/sources', 'rdp_apercu=1');
    await (await middleware())(event);
    expect(event.context.preview).toBe(true);
    expect(event.setCookies).toEqual([]);
  });

  it('turns the preview off with ?apercu=0 and clears the cookie', async () => {
    const event = makeEvent('/?apercu=0', 'other=x; rdp_apercu=1');
    await (await middleware())(event);
    expect(event.context.preview).toBe(false);
    expect(event.deletedCookies).toEqual(['rdp_apercu']);
    expect(cookiesOf(event)).toEqual({ other: 'x' });
  });

  it('redirects the Coop Médias newsletter page to the home page without the preview', async () => {
    for (const path of ['/lettre-quotidienne-coop-medias', '/lettre-quotidienne-coop-medias?apercu=0']) {
      const event = makeEvent(path, path.includes('apercu=0') ? 'rdp_apercu=1' : undefined);
      await (await middleware())(event);
      expect(event.redirect).toEqual({ to: '/', code: 302 });
    }
  });

  it('shows the newsletter pages in preview', async () => {
    for (const event of [makeEvent('/lettre-quotidienne?apercu=1'), makeEvent('/lettre-quotidienne-coop-medias', 'rdp_apercu=1')]) {
      await (await middleware())(event);
      expect(event.redirect).toBeUndefined();
    }
  });
});
