// Loaded once per story iframe.
// 1. Brings in foundation tokens so every component reads its CSS
//    variables (`--button-bg-primary`, etc.) and renders with the
//    design-system palette instead of bare browser defaults.
// 2. Inlines the icon sprite into the iframe body so any `<Icon>`
//    or `<Button icon="...">` instance can resolve its `<use href="#...">`.
import '../src/tokens/tokens.css';
import spriteRaw from '../src/icons/sprite.svg?raw';

if (typeof document !== 'undefined' && !document.getElementById('rdp-icon-sprite-host')) {
  const host = document.createElement('div');
  host.id = 'rdp-icon-sprite-host';
  host.style.display = 'none';
  host.innerHTML = spriteRaw;
  document.body.appendChild(host);
}
