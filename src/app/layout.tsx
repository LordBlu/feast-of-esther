import type { Metadata } from 'next';
import './globals.css';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { readCmsData } from '@/lib/cms-store';
import { buildPublicSiteConfig } from '@/lib/public-site-config';

/** Shell (popup, countdown, footer links) reads CMS on every request — not build-time JSON. */
export const dynamic = 'force-dynamic';

const FONT_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap';

export const metadata: Metadata = {
  title: 'Feast of Esther — North America',
  description:
    'A global gathering of Women in Ministry. Join us for the Feast of Esther — a celebration of faith, community, and purpose led by Pastor Mrs Folu Adeboye.',
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await readCmsData();
  const siteConfig = buildPublicSiteConfig(data);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONT_STYLESHEET} rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ConditionalLayout siteConfig={siteConfig}>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
