import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensCssPath = join(__dirname, '../../src/tokens/tokens.css');
const tokensJsonPath = join(__dirname, '../../src/tokens/tokens.json');

function parseCssVars(css: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gim;
  for (const m of css.matchAll(re)) {
    out[m[1]!] = m[2]!.trim();
  }
  return out;
}

function flattenJson(obj: Record<string, unknown>, prefix = '--'): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') out[`${prefix}${k}`] = v;
    else if (typeof v === 'object' && v !== null)
      Object.assign(out, flattenJson(v as Record<string, unknown>, `${prefix}${k}-`));
  }
  return out;
}

describe('design tokens', () => {
  it('CSS variables and JSON mirror have identical key sets and values', () => {
    const css = readFileSync(tokensCssPath, 'utf8');
    const json = JSON.parse(readFileSync(tokensJsonPath, 'utf8'));
    const cssVars = parseCssVars(css);
    const jsonVars = flattenJson(json);
    expect(Object.keys(cssVars).sort()).toEqual(Object.keys(jsonVars).sort());
    for (const key of Object.keys(cssVars)) {
      expect(jsonVars[key]).toBe(cssVars[key]);
    }
  });

  it('every component-layer alias resolves to a foundation token', () => {
    const css = readFileSync(tokensCssPath, 'utf8');
    const cssVars = parseCssVars(css);
    for (const [, value] of Object.entries(cssVars)) {
      const ref = value.match(/^var\((--[a-z0-9-]+)\)$/i);
      if (ref) {
        expect(cssVars[ref[1]!]).toBeDefined();
      }
    }
  });

  it('declares the eight foundation colours', () => {
    const css = readFileSync(tokensCssPath, 'utf8');
    const cssVars = parseCssVars(css);
    for (const k of [
      '--color-brand',
      '--color-brand-active',
      '--color-content-text',
      '--color-content-background',
      '--color-content-font',
      '--color-error',
      '--color-vanity-metric-like',
      '--color-vanity-metric-retweet',
    ]) {
      expect(cssVars[k]).toMatch(/^#[0-9a-f]{3,6}$/i);
    }
  });
});
