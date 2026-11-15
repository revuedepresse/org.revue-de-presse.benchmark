// A permalink can run past a hundred characters — the address of an article
// carries its whole title. A post card shows a readable form of it, while the
// link still points at the address itself.
//
// Cards sit in a grid of fixed-width columns, so a token longer than the
// column would either widen the card or spill out of it. Dropping the scheme
// and `www.` buys back a dozen characters, which is how a browser's address
// bar and Bluesky itself show links too.

export const URL_DISPLAY_MAX = 48;

export function displayUrl(url: string): string {
  const bare = url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');

  if (bare.length <= URL_DISPLAY_MAX) {
    return bare;
  }

  return `${bare.slice(0, URL_DISPLAY_MAX - 1)}…`;
}
