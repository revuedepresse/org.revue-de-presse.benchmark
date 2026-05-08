// Inline the design-system icon sprite into <body> on the client. Mitosis-
// emitted Vue components reference symbols via <use href="#name">, which only
// resolve when the symbols live in the same document.
import spriteRaw from '@icons/sprite.svg?raw';

export default defineNuxtPlugin(() => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('rdp-icon-sprite-host')) return;
  const host = document.createElement('div');
  host.id = 'rdp-icon-sprite-host';
  host.style.display = 'none';
  host.innerHTML = spriteRaw;
  document.body.appendChild(host);
});
