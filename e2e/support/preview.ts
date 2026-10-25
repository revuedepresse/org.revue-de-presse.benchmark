// The Coop Médias lists and the newsletter are only shown while the address
// carries ?apercu=1, until their release; nothing remembers it.
export const PREVIEW_COOKIE = 'rdp_apercu';

export function withPreview(path: string): string {
  return `${path}${path.includes('?') ? '&' : '?'}apercu=1`;
}
