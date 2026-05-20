import type {
  AboutPageContent,
  About2PageContent,
  HomePageContent,
  PopupContent,
  SiteEvent,
  SiteImages,
  SocialLink,
} from '@/lib/cms-types';
import type { CmsData } from '@/lib/cms-types';
import { resolveCountdownForPublic } from '@/lib/countdown-resolve';

export type PublicCountdown = {
  enabled: boolean;
  sourceEventId: string | null;
  fallbackTargetAt: string;
  targetAt: string | null;
};

/** Public API + client shell — never expose draft events or admin-only fields. */
export type PublicSiteConfig = {
  popup: PopupContent;
  images: SiteImages;
  events: SiteEvent[];
  countdown: PublicCountdown;
  about: AboutPageContent;
  socialLinks: SocialLink[];
  pageContent: {
    home: HomePageContent;
    about2: About2PageContent;
  };
};

export function buildPublicSiteConfig(data: CmsData): PublicSiteConfig {
  const resolved = resolveCountdownForPublic(data);
  return {
    popup: data.popup,
    images: data.images,
    events: data.events.filter((e) => e.status === 'published'),
    countdown: {
      enabled: data.countdown.enabled,
      sourceEventId: data.countdown.sourceEventId,
      fallbackTargetAt: data.countdown.fallbackTargetAt,
      targetAt: resolved.targetAt,
    },
    about: data.about,
    socialLinks: data.socialLinks,
    pageContent: {
      home: data.pageContent.home ?? {},
      about2: data.pageContent.about2 ?? {},
    },
  };
}
