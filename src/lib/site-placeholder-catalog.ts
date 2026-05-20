import {
  FOUNDER_CAROUSEL_DEFAULTS,
  FOUNDER_HERO_CLOUDINARY,
  HERO_CLOUDINARY_SLIDES,
  HOME_COPY,
} from '@/lib/site-content';
import type { About2PageContent } from '@/lib/cms-types';

/** Bundled demo image URLs used before CMS overrides (Gallery has its own helper). */
export const HOME_HERO_EXTRA_SLIDES = [
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761811/20260220_131922_g3apl3.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761751/20260219_223504_wkb6xn.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761721/20260219_114313_rsn8hi.jpg',
] as const;

export const HOME_MINISTRY_CARD_DEFAULTS = [
  {
    title: 'About Us',
    tag: 'About',
    href: '/about',
    copy: HOME_COPY.aboutLead,
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778152795/foe_group_2_q6pcp8.jpg',
  },
  {
    title: 'The Visionary',
    tag: 'Visionary',
    href: '/founder',
    copy: 'Pastor Mrs Folu Adeboye is the wife of the General Overseer of the Redeemed Christian Church of God (RCCG) Worldwide.',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761734/20260219_131617_ocrby8.jpg',
  },
  {
    title: 'Feast Of Esther 2026',
    tag: '2026',
    href: '/events',
    copy: 'Feast of Esther Annual Conference — see Events for dates and venue.',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777728539/20250710_090859_b81076.jpg',
  },
] as const;

export const EVENTS_DEFAULT_HERO =
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777728539/20250710_090859_b81076.jpg';

export const EVENTS_DEFAULT_FLYER =
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778244638/Save_thedate_mkpbnu.jpg';

export const ABOUT_SIDEBAR_VISUAL_DEFAULTS: {
  key: keyof About2PageContent;
  label: string;
  defaultUrl: string;
}[] = [
  {
    key: 'visualAbout',
    label: 'Sidebar — Intro (About)',
    defaultUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778152795/foe_group_2_q6pcp8.jpg',
  },
  {
    key: 'visualOurJourney',
    label: 'Sidebar — Our Journey',
    defaultUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761752/20260219_223539_aetz6w.jpg',
  },
  {
    key: 'visualWhoWeAre',
    label: 'Sidebar — Who We Are',
    defaultUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761661/20250711_200106_dxgplr.jpg',
  },
  {
    key: 'visualOurVision',
    label: 'Sidebar — Our Vision',
    defaultUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778153398/foe_logo_mlmi16.jpg',
  },
  {
    key: 'visualMission',
    label: 'Sidebar — Mission',
    defaultUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761505/20250221_200317_el9dzk.jpg',
  },
  {
    key: 'visualLeadership',
    label: 'Sidebar — Leadership (fallback)',
    defaultUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761734/20260219_131617_ocrby8.jpg',
  },
  {
    key: 'visualOutreach',
    label: 'Sidebar — Chapters / Outreach',
    defaultUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778132653/foe_Group_foto_twphtz.png',
  },
];

export const FOUNDER_MINISTRY_DEFAULTS = [
  {
    title: 'Global Impact',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790070/MA_m27h6y.jpg',
    text: "The school is well spread in all states of Nigeria and has spread to many countries of the world especially across West Africa, Europe, the UK and Ireland, Hong Kong and North America, to mention a few.\n\nMummy GO is in charge of Women Affairs. She hosts the annual Women in Ministry program for all female ministers in the RCCG all over the world. She's the President of a welfare ministry called Certain Women in Nigeria.",
  },
  {
    title: 'Mission Outreach',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790078/MA3_txk1xd.jpg',
    text: 'Her heart of compassion drove her to establish mission outreaches. She established African missions which seek to promote the spread of the gospel worldwide; promote the development of sustainable holistic programs; and promote services that improve the quality of life of children, youth, and families.',
  },
  {
    title: 'Rehabilitation Ministry',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790096/_MG_3358-2_hz4xxv.jpg',
    text: 'She established the Habitation of Hope — a home for the rehabilitation of boys taken off the streets and to give them a future and a hope in Christ. These children, who lived and slept on the beach, were involved in petty crime and substance use. In addition to academic education, the program offers vocational training.',
  },
] as const;

export type PlaceholderGroup = 'home' | 'about' | 'founder' | 'events';

export interface ImagePlaceholderSlot {
  id: string;
  group: PlaceholderGroup;
  label: string;
  hint?: string;
  defaultUrl: string;
}

/** Image slots stored in `SiteImages.placeholderUrls[id]`. */
export function getImagePlaceholderCatalog(): ImagePlaceholderSlot[] {
  const slots = [
    {
      id: 'home-hero-poster',
      group: 'home' as const,
      label: 'Homepage hero — first slide (poster)',
      hint: 'Also editable under Imagery. Replaces the first carousel frame when set.',
      defaultUrl: '',
    },
    ...HOME_HERO_EXTRA_SLIDES.map((url, i) => ({
      id: `home-hero-extra-${i}`,
      group: 'home' as const,
      label: `Homepage hero — extra slide ${i + 1}`,
      defaultUrl: url,
    })),
    ...HERO_CLOUDINARY_SLIDES.map((url, i) => ({
      id: `home-hero-cloud-${i}`,
      group: 'home' as const,
      label: `Homepage hero — Cloudinary slide ${i + 1}`,
      defaultUrl: url,
    })),
    ...HOME_MINISTRY_CARD_DEFAULTS.map((card, i) => ({
      id: `home-ministry-${i}`,
      group: 'home' as const,
      label: `Homepage ministry card — ${card.title}`,
      defaultUrl: card.imageUrl,
    })),
    {
      id: 'events-default-hero',
      group: 'events' as const,
      label: 'Events page — hero background (fallback)',
      hint: 'Used when the featured event has no hero image.',
      defaultUrl: EVENTS_DEFAULT_HERO,
    },
    {
      id: 'events-default-flyer',
      group: 'events' as const,
      label: 'Events page — info card flyer (fallback)',
      defaultUrl: EVENTS_DEFAULT_FLYER,
    },
    {
      id: 'founder-hero',
      group: 'founder' as const,
      label: 'Founder page — pinned hero background',
      hint: 'Also under Site pages → Founder. Falls back to this demo photo.',
      defaultUrl: FOUNDER_HERO_CLOUDINARY,
    },
    ...FOUNDER_CAROUSEL_DEFAULTS.map((url, i) => ({
      id: `founder-carousel-${i}`,
      group: 'founder' as const,
      label: `Founder carousel — slide ${i + 1}`,
      hint: 'When you add URLs under Imagery → Founder carousel, those replace the full set.',
      defaultUrl: url,
    })),
    ...FOUNDER_MINISTRY_DEFAULTS.map((card, i) => ({
      id: `founder-ministry-${i}`,
      group: 'founder' as const,
      label: `Founder ministry panel — ${card.title}`,
      defaultUrl: card.imageUrl,
    })),
    ...ABOUT_SIDEBAR_VISUAL_DEFAULTS.map((row) => ({
      id: `about-visual-${row.key}`,
      group: 'about' as const,
      label: row.label,
      hint: 'Also under Site pages → About Us.',
      defaultUrl: row.defaultUrl,
    })),
  ] satisfies ImagePlaceholderSlot[];

  return slots;
}

export function getAllBundledPlaceholderUrls(): string[] {
  const urls = new Set<string>();
  for (const slot of getImagePlaceholderCatalog()) {
    if (slot.defaultUrl.trim()) urls.add(slot.defaultUrl.trim());
  }
  return [...urls];
}
