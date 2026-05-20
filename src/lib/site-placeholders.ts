import type {
  About2PageContent,
  AboutPageContent,
  FounderMinistryCard,
  FounderPageContent,
  HomeMinistryCard,
  HomePageContent,
  SiteImages,
} from '@/lib/cms-types';
import {
  ABOUT_SIDEBAR_VISUAL_DEFAULTS,
  EVENTS_DEFAULT_FLYER,
  EVENTS_DEFAULT_HERO,
  FOUNDER_MINISTRY_DEFAULTS,
  getAllBundledPlaceholderUrls,
  getImagePlaceholderCatalog,
  HOME_HERO_EXTRA_SLIDES,
  HOME_MINISTRY_CARD_DEFAULTS,
} from '@/lib/site-placeholder-catalog';
import {
  FOUNDER_CAROUSEL_DEFAULTS,
  FOUNDER_HERO_CLOUDINARY,
  HERO_CLOUDINARY_SLIDES,
  HOME_COPY,
} from '@/lib/site-content';
import { resolveFounderCarouselSlides } from '@/lib/founder-carousel-resolve';

function normalizeUrl(url: string): string {
  return (url.split('?')[0] ?? url).trim();
}

export function isSitePlaceholderUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  const base = normalizeUrl(trimmed);
  return getAllBundledPlaceholderUrls().some((sample) => {
    const sampleBase = normalizeUrl(sample);
    return base === sampleBase || base.endsWith(sampleBase.split('/').pop() ?? '');
  });
}

export function getPlaceholderOverride(
  map: Record<string, string | undefined> | undefined,
  id: string,
): string | undefined {
  if (!map || !(id in map)) return undefined;
  return map[id]?.trim();
}

/** Effective URL: override if set; empty override = use default; missing key = default only. */
export function resolvePlaceholderImage(
  map: Record<string, string | undefined> | undefined,
  id: string,
  defaultUrl: string,
): string {
  if (!map || !(id in map)) return defaultUrl;
  const override = map[id]?.trim();
  if (!override) return defaultUrl;
  return override;
}

export function resolveHomeHeroSlides(images: SiteImages): string[] {
  const poster = images.heroPosterUrl?.trim();
  const map = images.placeholderUrls;

  const extras = HOME_HERO_EXTRA_SLIDES.map((url, i) =>
    resolvePlaceholderImage(map, `home-hero-extra-${i}`, url),
  ).filter(Boolean);

  const cloud = HERO_CLOUDINARY_SLIDES.map((url, i) =>
    resolvePlaceholderImage(map, `home-hero-cloud-${i}`, url),
  ).filter(Boolean);

  const slides = [...extras, ...cloud];
  if (poster) return [poster, ...slides.filter((u) => u !== poster)];
  return slides;
}

export function resolveHomeMinistryCards(
  home: HomePageContent | undefined,
  map?: Record<string, string | undefined>,
): HomeMinistryCard[] {
  return HOME_MINISTRY_CARD_DEFAULTS.map((defaults, i) => {
    const row = home?.ministryCards?.[i];
    return {
      title: row?.title?.trim() || defaults.title,
      tag: row?.tag?.trim() || defaults.tag,
      href: row?.href?.trim() || defaults.href,
      copy: row?.copy?.trim() || defaults.copy,
      imageUrl:
        row?.imageUrl?.trim() ||
        resolvePlaceholderImage(map, `home-ministry-${i}`, defaults.imageUrl),
    };
  });
}

export function resolveHomeCopy(home: HomePageContent | undefined) {
  return {
    heroTitle: home?.heroTitle?.trim() || HOME_COPY.heroTitle,
    forumMissionQuote: home?.forumMissionQuote?.trim() || HOME_COPY.mission,
    purposeTitle: home?.purposeTitle?.trim() || 'Our Purpose',
    purposeSubtitle: home?.purposeSubtitle?.trim() || HOME_COPY.vision,
  };
}

export function resolveEventsDefaultHero(map?: Record<string, string | undefined>): string {
  return resolvePlaceholderImage(map, 'events-default-hero', EVENTS_DEFAULT_HERO);
}

export function resolveEventsDefaultFlyer(map?: Record<string, string | undefined>): string {
  return resolvePlaceholderImage(map, 'events-default-flyer', EVENTS_DEFAULT_FLYER);
}

export function resolveFounderHeroBackground(
  founder: FounderPageContent | undefined,
  map?: Record<string, string | undefined>,
): string {
  const fromPage = founder?.heroBackgroundUrl?.trim();
  if (fromPage) return fromPage;
  return resolvePlaceholderImage(map, 'founder-hero', FOUNDER_HERO_CLOUDINARY);
}

export function resolveFounderMinistryCards(
  founder: FounderPageContent | undefined,
  map?: Record<string, string | undefined>,
): FounderMinistryCard[] {
  return FOUNDER_MINISTRY_DEFAULTS.map((defaults, i) => {
    const row = founder?.ministryCards?.[i];
    const imageFromMap = resolvePlaceholderImage(map, `founder-ministry-${i}`, defaults.imageUrl);
    return {
      title: row?.title?.trim() || defaults.title,
      text: row?.text?.trim() || defaults.text,
      imageUrl: row?.imageUrl?.trim() || imageFromMap,
    };
  });
}

export function resolveAboutSidebarVisuals(
  about2: About2PageContent | undefined,
  map?: Record<string, string | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const row of ABOUT_SIDEBAR_VISUAL_DEFAULTS) {
    const fromAbout2 = about2?.[row.key]?.trim();
    if (fromAbout2) {
      out[row.key] = fromAbout2;
      continue;
    }
    out[row.key] = resolvePlaceholderImage(map, `about-visual-${row.key}`, row.defaultUrl);
  }
  return out;
}

export function resolveAboutHeroImage(
  about: AboutPageContent,
  map?: Record<string, string | undefined>,
): string {
  const fromAbout = about.heroImageUrl?.trim();
  if (fromAbout && !isSitePlaceholderUrl(fromAbout)) return fromAbout;
  if (fromAbout) return fromAbout;
  return about.heroImageUrl?.trim() || '';
}

/** Founder carousel: Imagery list wins; else per-slot placeholder overrides; else bundled defaults. */
export function resolveFounderCarouselFromPlaceholders(
  founderCarouselUrls: string[] | undefined,
  map?: Record<string, string | undefined>,
): string[] {
  const fromImagery = resolveFounderCarouselSlides(founderCarouselUrls);
  if (founderCarouselUrls?.length) return fromImagery;

  const fromSlots = FOUNDER_CAROUSEL_DEFAULTS.map((url, i) =>
    resolvePlaceholderImage(map, `founder-carousel-${i}`, url),
  ).filter(Boolean);

  return fromSlots.length ? fromSlots : [...FOUNDER_CAROUSEL_DEFAULTS];
}
