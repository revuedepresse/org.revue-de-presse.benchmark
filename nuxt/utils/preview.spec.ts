import { describe, expect, it } from 'vitest';
import { cookieHeaderAfter, isPreviewOnlyPath, isPreviewQuery, previewFromRequest } from './preview';

describe('preview switch', () => {
  it('is off by default', () => {
    expect(previewFromRequest(undefined, undefined)).toEqual({ enabled: false, cookie: 'keep' });
  });

  it('is on only while the address carries ?apercu=1', () => {
    expect(previewFromRequest('1', undefined)).toEqual({ enabled: true, cookie: 'keep' });
    expect(previewFromRequest('0', undefined)).toEqual({ enabled: false, cookie: 'keep' });
    expect(previewFromRequest('oui', undefined)).toEqual({ enabled: false, cookie: 'keep' });
  });

  it('never turns on from the cookie an earlier version set, and clears it', () => {
    expect(previewFromRequest(undefined, '1')).toEqual({ enabled: false, cookie: 'clear' });
    expect(previewFromRequest('1', '1')).toEqual({ enabled: true, cookie: 'clear' });
  });

  it('follows the last ?apercu= when repeated', () => {
    expect(previewFromRequest(['0', '1'], undefined)).toEqual({ enabled: true, cookie: 'keep' });
    expect(isPreviewQuery(['1', '0'])).toBe(false);
  });

  it('keeps the Coop Médias newsletter page for the preview, the French media one public', () => {
    expect(isPreviewOnlyPath('/lettre-quotidienne')).toBe(false);
    expect(isPreviewOnlyPath('/lettre-quotidienne-coop-medias')).toBe(true);
    expect(isPreviewOnlyPath('/')).toBe(false);
  });

  it('drops the leftover cookie from the request cookies', () => {
    expect(cookieHeaderAfter('a=b; rdp_apercu=1', { enabled: false, cookie: 'clear' })).toBe('a=b');
    expect(cookieHeaderAfter('rdp_apercu=1', { enabled: false, cookie: 'clear' })).toBeUndefined();
    expect(cookieHeaderAfter('a=b', { enabled: true, cookie: 'keep' })).toBe('a=b');
  });
});
