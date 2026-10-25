export const EXIT = { OK: 0, ALREADY_POSTED: 1, UPSTREAM: 2, BLUESKY: 3, CONFIG: 4, DUPLICATE_CONTENT: 5 };

// A failure on one list wins over a benign skip on another (already posted,
// or the same top 3 as last time), which the cron entry reports as success.
export function worstExit(codes: number[]): number {
  const benign = [EXIT.OK, EXIT.ALREADY_POSTED, EXIT.DUPLICATE_CONTENT];
  const failures = codes.filter((c) => !benign.includes(c));
  return failures.length > 0 ? Math.max(...failures) : Math.max(EXIT.OK, ...codes);
}
