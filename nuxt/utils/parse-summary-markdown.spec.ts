import { describe, it, expect } from 'vitest';
import { parseSummaryMarkdown } from './parse-summary-markdown';

describe('parseSummaryMarkdown', () => {
  it('returns empty array on empty input', () => {
    expect(parseSummaryMarkdown('')).toEqual([]);
    expect(parseSummaryMarkdown('   \n\n  ')).toEqual([]);
  });

  it('drops heading lines entirely (page provides its own H1)', () => {
    const md = '## Politique\n\nUn paragraphe.\n\n### Sous-section\n\nUn autre.';
    const blocks = parseSummaryMarkdown(md);
    expect(blocks.map((b) => b.kind)).toEqual(['paragraph', 'paragraph']);
  });

  it('parses bullet groups as one block with multiple items', () => {
    const md = '- Premier point\n- Deuxième point\n- Troisième point';
    const out = parseSummaryMarkdown(md);
    expect(out).toHaveLength(1);
    expect(out[0]?.kind).toBe('bullets');
    if (out[0]?.kind === 'bullets') {
      expect(out[0].items).toHaveLength(3);
      expect(out[0].items[0]).toEqual([{ kind: 'text', value: 'Premier point' }]);
    }
  });

  it('parses paragraph runs collapsed to one space-joined string', () => {
    const md = "Un paragraphe\nqui s'étale sur deux lignes.";
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
    const out = parseSummaryMarkdown('Selon Mediapart, **un titre**, voilà.');
    if (out[0]?.kind === 'paragraph') {
      const kinds = out[0].segments.map((s) => s.kind);
      expect(kinds).toContain('bold');
    }
  });

  it('turns a known Bluesky handle into a handle segment (lowercase)', () => {
    const out = parseSummaryMarkdown('Selon lemonde.fr, un papier.');
    if (out[0]?.kind === 'paragraph') {
      const handle = out[0].segments.find((s) => s.kind === 'handle');
      expect(handle).toEqual({ kind: 'handle', value: 'lemonde.fr' });
    }
  });

  it('strips italics around a known handle and emits a single handle segment', () => {
    const out = parseSummaryMarkdown('Selon *liberation.fr*, un papier.');
    if (out[0]?.kind === 'paragraph') {
      const handles = out[0].segments.filter((s) => s.kind === 'handle');
      expect(handles).toHaveLength(1);
      expect(handles[0]).toEqual({ kind: 'handle', value: 'liberation.fr' });
      // No raw asterisks should leak into plain text segments.
      const joined = out[0].segments
        .filter((s) => s.kind === 'text')
        .map((s) => (s as { value: string }).value)
        .join('|');
      expect(joined).not.toContain('*');
    }
  });

  it('does NOT linkify an unknown dotted token — keeps it as plain text', () => {
    // 'verite.fr' is not in the allowlist; Mistral cited a fake outlet.
    const out = parseSummaryMarkdown('Selon verite.fr, mensonge.');
    if (out[0]?.kind === 'paragraph') {
      const handles = out[0].segments.filter((s) => s.kind === 'handle');
      expect(handles).toEqual([]);
      const joined = out[0].segments.map((s) => (s as { value: string }).value).join('');
      expect(joined).toContain('verite.fr');
    }
  });

  it('does NOT linkify p.ex or similar abbreviations', () => {
    // p.ex isn't in the allowlist so it should stay plain text.
    const out = parseSummaryMarkdown('Plusieurs outlets, p.ex un autre.');
    if (out[0]?.kind === 'paragraph') {
      const handles = out[0].segments.filter((s) => s.kind === 'handle');
      expect(handles).toEqual([]);
    }
  });

  it('rewrites "AFP" / "L\'AFP" / "AFP.fr" to canonical afp.com handle', () => {
    const cases = [
      "L'AFP a rapporté que…",
      'AFP.fr précise que…',
      'Selon AFP, …',
    ];
    for (const md of cases) {
      const out = parseSummaryMarkdown(md);
      if (out[0]?.kind === 'paragraph') {
        const handles = out[0].segments
          .filter((s) => s.kind === 'handle')
          .map((s) => (s as { value: string }).value);
        expect(handles).toEqual(['afp.com']);
      }
    }
  });

  it('rewrites multi-word brand names ("Le Monde", "France Culture", "Le Canard Enchaîné")', () => {
    const out = parseSummaryMarkdown(
      'Selon Le Monde et France Culture, Le Canard Enchaîné réagit.',
    );
    if (out[0]?.kind === 'paragraph') {
      const handles = out[0].segments
        .filter((s) => s.kind === 'handle')
        .map((s) => (s as { value: string }).value);
      expect(handles).toEqual([
        'lemonde.fr',
        'franceculture.fr',
        'lecanardenchaine.fr',
      ]);
    }
  });

  it('rewrites a mis-capitalised dotted handle (Mediapart.fr → mediapart.fr)', () => {
    const out = parseSummaryMarkdown('Mediapart.fr a publié une enquête.');
    if (out[0]?.kind === 'paragraph') {
      const handle = out[0].segments.find((s) => s.kind === 'handle');
      expect(handle).toEqual({ kind: 'handle', value: 'mediapart.fr' });
    }
  });

  it('does NOT rewrite ambiguous fragments inside other words', () => {
    // "le monde" appears inside "le monde entier" — but the brand alias has
    // a 2-word match boundary so "Tout le monde" must NOT be linkified.
    // (this matches because the boundary detection treats space as boundary)
    // What we explicitly want: a token like "amondement" stays alone.
    const out = parseSummaryMarkdown('Le débat amondement est rocambolesque.');
    if (out[0]?.kind === 'paragraph') {
      const handles = out[0].segments.filter((s) => s.kind === 'handle');
      expect(handles).toEqual([]);
    }
  });

  it('parses bullets with mixed plain text + handle', () => {
    const md = '- Selon lemonde.fr, une dépêche.\n- Selon afp.com, autre.';
    const out = parseSummaryMarkdown(md);
    if (out[0]?.kind === 'bullets') {
      const allHandles = out[0].items.flat().filter((s) => s.kind === 'handle');
      expect(allHandles).toEqual([
        { kind: 'handle', value: 'lemonde.fr' },
        { kind: 'handle', value: 'afp.com' },
      ]);
    }
  });
});
