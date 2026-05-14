'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageViewTransition from '@/components/PageViewTransition';
import SiteFooter from '@/components/SiteFooter';
import EventPopup from '@/components/EventPopup';
import HadassahChat from '@/components/HadassahChat';

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

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<main className="site-main w-full overflow-x-hidden">{children}</main>}>
      <ConditionalLayoutInner>{children}</ConditionalLayoutInner>
    </Suspense>
  );
}
