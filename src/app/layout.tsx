import type { Metadata } from 'next';
import './fonts.css';
import './globals.css';
import { ConditionalLayout } from '@/components/ConditionalLayout';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
