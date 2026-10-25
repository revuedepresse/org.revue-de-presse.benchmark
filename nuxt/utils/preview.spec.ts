import { describe, expect, it } from 'vitest';
import { cookieHeaderAfter, isPreviewOnlyPath, previewFromRequest } from './preview';

describe('preview switch', () => {
  it('is off by default', () => {
    expect(previewFromRequest(undefined, undefined)).toEqual({ enabled: false, cookie: 'keep' });
  });

  it('turns on with ?apercu=1 and remembers it in the cookie', () => {
    expect(previewFromRequest('1', undefined)).toEqual({ enabled: true, cookie: 'set' });
  });

  it('stays on while the cookie is there', () => {
    expect(previewFromRequest(undefined, '1')).toEqual({ enabled: true, cookie: 'keep' });
  });

  it('turns off with ?apercu=0 and clears the cookie', () => {
    expect(previewFromRequest('0', '1')).toEqual({ enabled: false, cookie: 'clear' });
    expect(previewFromRequest('0', undefined)).toEqual({ enabled: false, cookie: 'keep' });
  });

  it('ignores other values of ?apercu= and of the cookie', () => {
    expect(previewFromRequest('oui', undefined)).toEqual({ enabled: false, cookie: 'keep' });
    expect(previewFromRequest('oui', '1')).toEqual({ enabled: true, cookie: 'keep' });
    expect(previewFromRequest(undefined, 'yes')).toEqual({ enabled: false, cookie: 'keep' });
  });

  it('follows the last ?apercu= when repeated', () => {
    expect(previewFromRequest(['0', '1'], undefined)).toEqual({ enabled: true, cookie: 'set' });
  });

  it('keeps the newsletter pages for the preview', () => {
    expect(isPreviewOnlyPath('/lettre-quotidienne')).toBe(true);
    expect(isPreviewOnlyPath('/lettre-quotidienne-coop-medias')).toBe(true);
    expect(isPreviewOnlyPath('/')).toBe(false);
    expect(isPreviewOnlyPath('/sources')).toBe(false);
  });

  it('rewrites the request cookies to match the decision', () => {
    expect(cookieHeaderAfter(undefined, { enabled: true, cookie: 'set' })).toBe('rdp_apercu=1');
    expect(cookieHeaderAfter('a=b', { enabled: true, cookie: 'set' })).toBe('a=b; rdp_apercu=1');
    expect(cookieHeaderAfter('a=b; rdp_apercu=1', { enabled: false, cookie: 'clear' })).toBe('a=b');
    expect(cookieHeaderAfter('rdp_apercu=1', { enabled: false, cookie: 'clear' })).toBeUndefined();
    expect(cookieHeaderAfter('a=b', { enabled: false, cookie: 'keep' })).toBe('a=b');
  });
});
