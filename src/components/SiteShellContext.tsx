'use client';

import { createContext, useContext } from 'react';
import type { PublicSiteConfig } from '@/lib/public-site-config';

const SiteShellContext = createContext<PublicSiteConfig | null>(null);

export function SiteShellProvider({
  value,
  children,
}: {
  value: PublicSiteConfig;
  children: React.ReactNode;
}) {
  return <SiteShellContext.Provider value={value}>{children}</SiteShellContext.Provider>;
}

export function useSiteShell(): PublicSiteConfig {
  const ctx = useContext(SiteShellContext);
  if (!ctx) {
    throw new Error('useSiteShell must be used within SiteShellProvider');
  }
  return ctx;
}
