// design-system/scripts/__tests__/emit-compose-tokens.test.mjs
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generate } from '../emit-compose-tokens.mjs';

describe('emit-compose-tokens', () => {
  it('emits RdpColors with 0xAARRGGBB Color constructor calls', () => {
    const tokens = { source: 'x', captured: '2026-05-06',
                     color: { white: '#fff', brand: '#006663' },
                     spacing: {}, radius: {}, size: {}, type: {} };
    const out = generate(tokens);
    assert.match(out, /package org\.revue_2_presse\.design/);
    assert.match(out, /val White\s+= Color\(0xFFFFFFFF\)/);
    assert.match(out, /val Brand\s+= Color\(0xFF006663\)/);
  });

  it('translates px to dp and writes header with captured date', () => {
    const tokens = { source: 'x', captured: '2026-05-06',
                     color: {}, spacing: { 'separation-1': '8px' },
                     radius: { default: '8px' }, size: {}, type: {} };
    const out = generate(tokens);
    assert.match(out, /captured: 2026-05-06/);
    assert.match(out, /val Separation1\s+= 8\.dp/);
    assert.match(out, /val Default\s+= 8\.dp/);
  });

  it('translates px to sp for type sizes and unitless ratio for line-height-base', () => {
    const tokens = { source: 'x', captured: '2026-05-06',
                     color: {}, spacing: {}, radius: {}, size: {},
                     type: { 'font-size-content': '14px',
                             'line-height-base': '1.4em',
                             'line-spacing-content': '16px' } };
    const out = generate(tokens);
    assert.match(out, /val FontSizeContent\s+= 14\.sp/);
    assert.match(out, /val LineHeightBase\s+= 1\.4f/);
    assert.match(out, /val LineSpacingContent\s+= 16\.sp/);
  });
});
