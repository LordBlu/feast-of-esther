import { FOUNDER_CAROUSEL_DEFAULTS } from '@/lib/site-content';

/**
 * Resolves /founder carousel image URLs. Order: Admin CMS → env (comma-separated) → code defaults.
 * Env: `NEXT_PUBLIC_FOUNDER_CAROUSEL_URLS` = `https://...,https://...` (all on one line).
 */
export function resolveFounderCarouselSlides(cmsUrls: string[] | undefined): string[] {
  const fromCms = cmsUrls?.map((u) => u.trim()).filter(Boolean) ?? [];
  if (fromCms.length > 0) return fromCms;

  const raw = process.env.NEXT_PUBLIC_FOUNDER_CAROUSEL_URLS?.trim();
  if (raw) {
    const fromEnv = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (fromEnv.length > 0) return fromEnv;
  }

  return [...FOUNDER_CAROUSEL_DEFAULTS];
}
