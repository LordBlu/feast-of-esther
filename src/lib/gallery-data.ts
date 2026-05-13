import type { GalleryCollection } from '@/lib/cms-types';

export interface GalleryItem {
  slug: string;
  title: string;
  year: string;
  subtitle: string;
  coverImage: string;
  description: string;
  images: string[];
}

const CLOUDINARY_GALLERY_POOL = [
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790070/MA_m27h6y.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790073/MA1_pgqf35.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790078/MA3_txk1xd.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790096/_MG_3358-2_hz4xxv.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790096/205A6045_irlj0v.jpg',
] as const;

const galleryTemplates = [
  {
    slug: 'feast-2025-opening-night',
    title: 'Opening Night Worship',
    year: '2025',
    subtitle: 'A night of prayer, worship, and prophetic declaration.',
    description:
      'Highlights from the first evening as women in ministry gathered in one heart for worship and renewal.',
  },
  {
    slug: 'feast-2025-leadership-lab',
    title: 'Leadership Lab',
    year: '2025',
    subtitle: 'Practical sessions for women called to steward influence.',
    description:
      'Workshop moments from strategic mentoring and leadership activation sessions.',
  },
  {
    slug: 'feast-2025-intercession-watch',
    title: 'Intercession Watch',
    year: '2025',
    subtitle: 'Midnight prayer expressions and altar moments.',
    description:
      'A visual journey through prayer watches, worship sets, and prophetic declarations.',
  },
  {
    slug: 'feast-2024-testimonies',
    title: 'Testimony Moments',
    year: '2024',
    subtitle: 'Powerful testimonies of transformation and healing.',
    description:
      'Captured moments where participants shared how God moved in their ministries and families.',
  },
  {
    slug: 'feast-2024-worship-fire',
    title: 'Worship Fire',
    year: '2024',
    subtitle: 'Praise sessions marked by joy and surrender.',
    description:
      'Editorial highlights from extended worship sessions and ministry responses.',
  },
  {
    slug: 'feast-2024-daughters-banquet',
    title: "Daughters' Banquet",
    year: '2024',
    subtitle: 'Celebration dinner honoring women in ministry.',
    description:
      'Elegant banquet moments celebrating grace, calling, and kingdom service.',
  },
  {
    slug: 'feast-2023-leadership-sessions',
    title: 'Leadership Sessions',
    year: '2023',
    subtitle: 'Teaching and mentoring for women called to lead.',
    description:
      'Snapshots from strategy sessions and panel teachings focused on ministry growth and nation impact.',
  },
  {
    slug: 'feast-2023-panel-conversations',
    title: 'Panel Conversations',
    year: '2023',
    subtitle: 'Real conversations around calling, marriage, and ministry.',
    description:
      'Captured moments from deeply practical conversations with senior women leaders.',
  },
  {
    slug: 'feast-2023-healing-altar',
    title: 'Healing Altar',
    year: '2023',
    subtitle: 'Prayer moments with tenderness and power.',
    description:
      'Stories in images from altar calls, healing prayers, and personal ministry.',
  },
  {
    slug: 'feast-2022-celebration-day',
    title: 'Celebration Day',
    year: '2022',
    subtitle: 'Joyful fellowship and ministry celebration.',
    description:
      'A colorful collection from celebration day featuring joyful praise, fellowship, and ministry honors.',
  },
  {
    slug: 'feast-2022-breakout-rooms',
    title: 'Breakout Rooms',
    year: '2022',
    subtitle: 'Small-group encounters and practical counsel.',
    description:
      'Intimate moments from breakout rooms where women received direction and encouragement.',
  },
  {
    slug: 'feast-2022-anointing-service',
    title: 'Anointing Service',
    year: '2022',
    subtitle: 'Commissioning moments for ministry assignments.',
    description:
      'A visual record of commissioning prayers and fresh consecration.',
  },
  {
    slug: 'feast-2021-foundations',
    title: 'Foundation Year',
    year: '2021',
    subtitle: 'Early gatherings that birthed momentum.',
    description:
      'Scenes from foundational moments that shaped the North America expression.',
  },
  {
    slug: 'feast-2021-welcome-night',
    title: 'Welcome Night',
    year: '2021',
    subtitle: 'Arrival moments and first encounters.',
    description:
      'A collage of joyful arrivals, reunions, and opening-night anticipation.',
  },
  {
    slug: 'feast-2020-online-edition',
    title: 'Online Edition Highlights',
    year: '2020',
    subtitle: 'Digital gathering with global participation.',
    description:
      'Screens, prayer circles, and panel captures from the online conference season.',
  },
  {
    slug: 'feast-2019-legacy-honours',
    title: 'Legacy Honours',
    year: '2019',
    subtitle: 'Celebrating women who paved the way.',
    description:
      'Portraits and stage moments from a night of thanksgiving and honour.',
  },
  {
    slug: 'feast-2018-prayer-summit',
    title: 'Prayer Summit',
    year: '2018',
    subtitle: 'Extended intercession for church and nation.',
    description:
      'A deeply prayerful collection from summit sessions and solemn assemblies.',
  },
];

export const galleryItems: GalleryItem[] = galleryTemplates.map((template, index) => ({
  ...template,
  coverImage: CLOUDINARY_GALLERY_POOL[index % CLOUDINARY_GALLERY_POOL.length],
  images: Array.from({ length: 7 }, (_, i) => CLOUDINARY_GALLERY_POOL[(index + i) % CLOUDINARY_GALLERY_POOL.length]),
}));

export function getGalleryItem(slug: string) {
  return galleryItems.find((item) => item.slug === slug);
}

export function resolveGalleryItems(cmsCollections: GalleryCollection[] | undefined): GalleryItem[] {
  type Candidate = {
    slug?: string;
    title?: string;
    year?: string;
    description?: string;
    images: string[];
  };
  const isComplete = (
    row: Candidate
  ): row is { slug: string; title: string; year: string; description: string; images: string[] } =>
    Boolean(row.slug && row.title && row.year && row.description && row.images.length > 0);

  const fromCms = (cmsCollections ?? [])
    .map((collection): Candidate => ({
      slug: collection.slug?.trim(),
      title: collection.title?.trim(),
      year: collection.year?.trim(),
      description: collection.description?.trim(),
      images: (collection.imageUrls ?? []).map((u) => u.trim()).filter(Boolean),
    }))
    .filter(isComplete)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      year: c.year,
      subtitle: `${c.year} Collection`,
      coverImage: c.images[0],
      description: c.description,
      images: c.images,
    }));

  if (fromCms.length > 0) return fromCms;
  return galleryItems;
}
