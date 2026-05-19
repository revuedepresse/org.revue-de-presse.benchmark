'use client';

import { useEffect } from 'react';

// Fetch and inline the design-system SVG sprite once on first mount so
// design-system <Icon> components can resolve <use href="#name">.
// Mirrors nuxt/plugins/sprite.client.ts (which is also client-only).
export default function SpriteInjector() {
  useEffect(() => {
    if (document.getElementById('rdp-icon-sprite-host')) return;
    fetch('/icons/sprite.svg')
      .then((r) => r.text())
      .then((svg) => {
        if (document.getElementById('rdp-icon-sprite-host')) return;
        const host = document.createElement('div');
        host.id = 'rdp-icon-sprite-host';
        host.style.display = 'none';
        host.innerHTML = svg;
        document.body.appendChild(host);
      })
      .catch(() => {
        console.warn('[sprite] failed to fetch /icons/sprite.svg');
      });
  }, []);

  return null;
}
