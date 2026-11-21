import { describe, expect, it } from 'vitest';
import { EXIT, worstExit } from '../src/exitCodes.ts';

describe('worstExit', () => {
  it('is OK when every list posted', () => {
    expect(worstExit([EXIT.OK, EXIT.OK])).toBe(EXIT.OK);
  });

  it('keeps a benign skip when nothing failed', () => {
    expect(worstExit([EXIT.OK, EXIT.DUPLICATE_CONTENT])).toBe(EXIT.DUPLICATE_CONTENT);
  });

  it('never lets a benign skip on one list hide a failure on another', () => {
    expect(worstExit([EXIT.DUPLICATE_CONTENT, EXIT.BLUESKY])).toBe(EXIT.BLUESKY);
    expect(worstExit([EXIT.ALREADY_POSTED, EXIT.UPSTREAM])).toBe(EXIT.UPSTREAM);
  });
});
