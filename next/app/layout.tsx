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
        <noscript>
          Revue de presse nécessite JavaScript pour son bon fonctionnement.
        </noscript>
      </body>
    </html>
  );
}
