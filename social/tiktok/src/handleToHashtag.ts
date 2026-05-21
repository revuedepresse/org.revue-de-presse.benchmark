import { handleToDisplayName } from './displayNames.ts';

export function handleToHashtag(handle: string): string {
  const display = handleToDisplayName(handle);
  const words = display
    .normalize('NFC')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
  const camel = words
    .map((w) => {
      if (/^[\p{Lu}][\p{L}\p{N}]*$/u.test(w)) return w;
      return w.charAt(0).toLocaleUpperCase('fr-FR') + w.slice(1).toLocaleLowerCase('fr-FR');
    })
    .join('');
  return `#${camel}`;
}
