'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageViewTransition from '@/components/PageViewTransition';
import { SiteShellProvider } from '@/components/SiteShellContext';
import SiteFooter from '@/components/SiteFooter';
import type { PublicSiteConfig } from '@/lib/public-site-config';

const EventPopup = dynamic(() => import('@/components/EventPopup'), { ssr: false });
const HadassahChat = dynamic(() => import('@/components/HadassahChat'), { ssr: false });

function ConditionalLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  if (isAdmin) {
    return <div className="admin-root min-h-screen">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <EventPopup />
      <main className="site-main w-full flex-1 overflow-x-hidden">
        <PageViewTransition>{children}</PageViewTransition>
      </main>
      <SiteFooter />
      <HadassahChat />
    </div>
  );
}

export function ConditionalLayout({
  children,
  siteConfig,
}: {
  children: React.ReactNode;
  siteConfig?: PublicSiteConfig | null;
}) {
  const inner = (
    <Suspense fallback={<main className="site-main w-full overflow-x-hidden">{children}</main>}>
      <ConditionalLayoutInner>{children}</ConditionalLayoutInner>
    </Suspense>
  );

  if (!siteConfig) {
    return inner;
  }

  return <SiteShellProvider value={siteConfig}>{inner}</SiteShellProvider>;
}
