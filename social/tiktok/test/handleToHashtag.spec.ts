import { describe, expect, it } from 'vitest';
import { handleToHashtag } from '../src/handleToHashtag.ts';

describe('handleToHashtag', () => {
  const rows: Array<[string, string]> = [
    ['lemonde.fr',          '#LeMonde'],
    ['mediapart.fr',        '#Mediapart'],
    ['franceculture.fr',    '#FranceCulture'],
    ['liberation.fr',       '#Libération'],
    ['lefigaro.fr',         '#LeFigaro'],
    ['lequipe.fr',          '#LÉquipe'],
    ['arretsurimages.net',  '#ArrêtSurImages'],
    ['unknown-source.fr',   '#UnknownSource'],
  ];

  it.each(rows)('%s -> %s', (handle, expected) => {
    expect(handleToHashtag(handle)).toBe(expected);
  });

  it('matches the allowed hashtag regex', () => {
    for (const [handle] of rows) {
      expect(handleToHashtag(handle)).toMatch(/^#[\p{L}\p{N}_]+$/u);
    }
  });
});
