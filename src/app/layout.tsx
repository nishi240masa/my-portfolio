// app/layout.tsx
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Hina_Mincho, Noto_Sans_JP, JetBrains_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import Script from 'next/script';
import ClientLayout from './_components/ClientLayout';
import type { ThemeMode } from './theme';
import { profileRepo } from '@/lib/repositories';
import { personJsonLd, serializeJsonLd } from '@/lib/jsonld';

const hinaMincho = Hina_Mincho({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-mincho-next',
  fallback: ['Hiragino Mincho ProN', 'Yu Mincho', 'serif'],
});

const notoSansJp = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans-next',
  fallback: ['Hiragino Sans', 'Yu Gothic', 'sans-serif'],
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono-next',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
const SITE_NAME = 'west · Portfolio';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'west · Portfolio — Masaki Nishio',
    template: '%s | west · Portfolio',
  },
  description: '未来のある開発を、意味のある人生を。— 西尾 匡生のポートフォリオ',
  alternates: {
    languages: {
      ja: '/',
      en: '/en',
      'x-default': '/',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ja_JP',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf8f3' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1614' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const themeMode: ThemeMode =
    cookieStore.get('theme-mode')?.value === 'dark' ? 'dark' : 'light';
  const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

  // SEO: Schema.org Person を JSON-LD としてページ全体に注入する
  const profile = await profileRepo.get();
  const personLd = personJsonLd(profile);

  return (
    <html
      lang="ja"
      data-theme={themeMode}
      className={`${hinaMincho.variable} ${notoSansJp.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=document.cookie.match(/(?:^|; )theme-mode=([^;]+)/);if(!c){var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personLd) }}
        />
        <ClientLayout initialMode={themeMode}>{children}</ClientLayout>
        {cfBeaconToken ? (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cfBeaconToken })}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
