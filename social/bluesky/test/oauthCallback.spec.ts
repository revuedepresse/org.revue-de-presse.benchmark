import { describe, expect, it } from 'vitest';
import { parseCallbackParams } from '../src/oauthCallback.ts';

describe('parseCallbackParams', () => {
  it('extracts code + state from a full redirect URL', () => {
    const params = parseCallbackParams(
      'http://127.0.0.1:8080/callback?code=abc123&state=xyz789&iss=https%3A%2F%2Fbsky.social',
    );
    expect(params.get('code')).toBe('abc123');
    expect(params.get('state')).toBe('xyz789');
    expect(params.get('iss')).toBe('https://bsky.social');
  });

  it('accepts a query string with a leading ?', () => {
    const params = parseCallbackParams('?code=abc123&state=xyz789');
    expect(params.get('code')).toBe('abc123');
    expect(params.get('state')).toBe('xyz789');
  });

  it('accepts a bare key=value query string with no leading ?', () => {
    const params = parseCallbackParams('code=abc123&state=xyz789');
    expect(params.get('code')).toBe('abc123');
    expect(params.get('state')).toBe('xyz789');
  });

  it('trims surrounding whitespace from the pasted input', () => {
    const params = parseCallbackParams('  ?code=abc123&state=xyz789  \n');
    expect(params.get('code')).toBe('abc123');
    expect(params.get('state')).toBe('xyz789');
  });

  it('throws when the input is empty', () => {
    expect(() => parseCallbackParams('')).toThrow(/empty/i);
    expect(() => parseCallbackParams('   ')).toThrow(/empty/i);
  });

  it('throws when code is missing', () => {
    expect(() => parseCallbackParams('http://127.0.0.1:8080/callback?state=xyz789')).toThrow(
      /code/i,
    );
  });

  it('throws when state is missing', () => {
    expect(() => parseCallbackParams('?code=abc123')).toThrow(/state/i);
  });

  it('throws when both are missing', () => {
    expect(() => parseCallbackParams('http://127.0.0.1:8080/callback?iss=foo')).toThrow(
      /code|state/i,
    );
  });
});
