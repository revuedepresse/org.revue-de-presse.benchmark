import type { Metadata, Viewport } from 'next';
import SpriteInjector from '@/components/SpriteInjector';
import './globals.css';

const TITLE = 'Revue de presse - revue-de-presse.org';
const DESCRIPTION =
  'Chaque jour, une revue de presse des 10 publications des médias les plus marquantes';
const BANNER = 'https://revue-de-presse.org/revue-de-presse-banner.jpg';
const ICON = '/logo-revue-de-presse.png';

export const metadata: Metadata = {
  metadataBase: new URL('https://revue-de-presse.org'),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: '@revue_2_presse' }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/logo-revue-de-presse.svg', type: 'image/svg+xml' },
      { url: ICON, type: 'image/png' },
    ],
    apple: '/revue-de-presse_512x512_006663.png',
    shortcut: ICON,
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: TITLE,
    description: DESCRIPTION,
    images: [BANNER],
    siteName: TITLE,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@revue_2_presse',
    creator: '@revue_2_presse',
    title: TITLE,
    description: DESCRIPTION,
    images: [BANNER],
  },
  appleWebApp: {
    capable: true,
    title: TITLE,
    statusBarStyle: 'default',
  },
  applicationName: TITLE,
  other: { 'msapplication-TileColor': '#006663' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#006663',
};

// Inside <noscript>, the browser parses children only when scripting is
// disabled. The inline <style> there hides the SSR'd app shell so the
// fallback banner is the only visible content — no half-rendered, inert UI.
const NOSCRIPT_BANNER_HTML = `
  <style>
    body > *:not(noscript) { display: none !important; }
    .rdp-noscript-banner {
      position: fixed; inset: 0; z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
      margin: 0; padding: 24px;
      background: #006663; color: #fff;
      font: 16px/1.5 'Roboto', system-ui, -apple-system, sans-serif;
      text-align: center;
    }
    .rdp-noscript-banner-inner { max-width: 560px; }
    .rdp-noscript-banner h1 {
      margin: 0 0 12px;
      font: 600 1.5rem/1.3 'Signika', system-ui, sans-serif;
    }
    .rdp-noscript-banner p { margin: 0; opacity: 0.92; }
  </style>
  <div class="rdp-noscript-banner" role="alert" aria-live="polite">
    <div class="rdp-noscript-banner-inner">
      <h1>JavaScript requis</h1>
      <p>Revue de presse nécessite JavaScript pour son bon fonctionnement.</p>
    </div>
  </div>
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="preload"
          href="/fonts/signika-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/roboto-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </head>
      <body>
        <SpriteInjector />
        {children}
        <noscript
          dangerouslySetInnerHTML={{
            __html: NOSCRIPT_BANNER_HTML,
          }}
        />
      </body>
    </html>
  );
}
