import { describe, it, expect } from 'vitest';
import { parseSummaryMarkdown } from './parse-summary-markdown';

describe('parseSummaryMarkdown', () => {
  it('returns empty array on empty input', () => {
    expect(parseSummaryMarkdown('')).toEqual([]);
    expect(parseSummaryMarkdown('   \n\n  ')).toEqual([]);
  });

  it('parses ## headings into a heading block at the right level', () => {
    const out = parseSummaryMarkdown('## Politique\n');
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ kind: 'heading', level: 2 });
    if (out[0]?.kind === 'heading') {
      expect(out[0].segments).toEqual([{ kind: 'text', value: 'Politique' }]);
    }
  });

  it('parses # and ### too, capped at level 3', () => {
    const out = parseSummaryMarkdown('# Top\n### Deep');
    expect(out.map((b) => ('level' in b ? b.level : undefined))).toEqual([1, 3]);
  });

  it('parses bullet groups as one block with multiple items', () => {
    const md = `- Premier point
- Deuxième point
- Troisième point`;
    const out = parseSummaryMarkdown(md);
    expect(out).toHaveLength(1);
    expect(out[0]?.kind).toBe('bullets');
    if (out[0]?.kind === 'bullets') {
      expect(out[0].items).toHaveLength(3);
      expect(out[0].items[0]).toEqual([{ kind: 'text', value: 'Premier point' }]);
    }
  });

  it('parses paragraph runs collapsed to one space-joined string', () => {
    const md = `Un paragraphe
qui s'étale sur deux lignes.`;
    const out = parseSummaryMarkdown(md);
    expect(out).toHaveLength(1);
    expect(out[0]?.kind).toBe('paragraph');
    if (out[0]?.kind === 'paragraph') {
      expect(out[0].segments[0]).toEqual({
        kind: 'text',
        value: "Un paragraphe qui s'étale sur deux lignes.",
      });
    }
  });

  it('parses **bold** inline segments', () => {
    const out = parseSummaryMarkdown('Selon **Le Monde** et Mediapart.');
    if (out[0]?.kind === 'paragraph') {
      expect(out[0].segments).toEqual([
        { kind: 'text', value: 'Selon ' },
        { kind: 'bold', value: 'Le Monde' },
        { kind: 'text', value: ' et Mediapart.' },
      ]);
    }
  });

  it('separates heading / paragraph / bullets correctly', () => {
    const md = `## Politique

Un premier paragraphe.

- bullet A
- bullet B

### Sous-section

Autre paragraphe.`;
    const blocks = parseSummaryMarkdown(md);
    expect(blocks.map((b) => b.kind)).toEqual([
      'heading',
      'paragraph',
      'bullets',
      'heading',
      'paragraph',
    ]);
  });
});
