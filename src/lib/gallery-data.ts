import type { GalleryCollection } from '@/lib/cms-types';
import { slugifyPathSegment } from '@/lib/slugify';

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
];

export const galleryItems: GalleryItem[] = galleryTemplates.map((template, index) => ({
  ...template,
  coverImage: CLOUDINARY_GALLERY_POOL[index % CLOUDINARY_GALLERY_POOL.length],
  images: Array.from({ length: 7 }, (_, i) => CLOUDINARY_GALLERY_POOL[(index + i) % CLOUDINARY_GALLERY_POOL.length]),
}));

export function getGalleryItem(slug: string) {
  return galleryItems.find((item) => item.slug === slug);
}

/** URLs from bundled demo gallery — highlight these in Admin so editors can replace them. */
export function getGalleryPlaceholderUrls(): string[] {
  const urls = new Set<string>(CLOUDINARY_GALLERY_POOL);
  for (const item of galleryItems) {
    urls.add(item.coverImage);
    for (const img of item.images) urls.add(img);
  }
  return [...urls];
}

export function isGalleryPlaceholderUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  const normalized = trimmed.split('?')[0] ?? trimmed;
  return getGalleryPlaceholderUrls().some((sample) => {
    const sampleBase = sample.split('?')[0] ?? sample;
    return normalized === sampleBase || normalized.endsWith(sampleBase.split('/').pop() ?? '');
  });
}

/** URL-safe slug for /gallery/[slug] (auto-filled from title in Admin when empty). */
export function slugifyGallerySlug(input: string): string {
  return slugifyPathSegment(input);
}

export function normalizeGalleryCollection(item: GalleryCollection): GalleryCollection {
  const title = String(item.title ?? '').trim();
  const rawSlug = String(item.slug ?? '').trim();
  return {
    slug: slugifyGallerySlug(rawSlug || title),
    title,
    year: String(item.year ?? '').trim(),
    description: String(item.description ?? '').trim(),
    imageUrls: (item.imageUrls ?? []).map((u) => String(u).trim()).filter(Boolean),
    collectionType: item.collectionType === 'event' ? 'event' : 'general',
    linkedEventId: item.linkedEventId?.trim() || undefined,
    eventDateLabel: String(item.eventDateLabel ?? '').trim(),
    eventVenue: String(item.eventVenue ?? '').trim(),
  };
}

export function getGalleryCollectionValidationErrors(item: GalleryCollection): string[] {
  const n = normalizeGalleryCollection(item);
  const errors: string[] = [];
  if (!n.slug) errors.push('URL slug');
  if (!n.title) errors.push('title');
  if (!n.year) errors.push('year');
  if (!n.description) errors.push('description');
  if (n.imageUrls.length === 0) errors.push('at least one photo');
  return errors;
}

export function isGalleryCollectionComplete(item: GalleryCollection): boolean {
  return getGalleryCollectionValidationErrors(item).length === 0;
}

/** Starter collections for Admin when CMS has none saved yet (matches public fallback). */
export function getDefaultGalleryCollections(): GalleryCollection[] {
  return galleryItems.map((item) => ({
    slug: item.slug,
    title: item.title,
    year: item.year,
    description: item.description,
    imageUrls: [...item.images],
  }));
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

export type GalleryPreviewItem = GalleryItem & {
  isDraft: boolean;
  missingFields: string[];
};

/** Admin draft preview — all CMS rows, including incomplete drafts (never bundled demo fallbacks). */
export function resolveGalleryPreviewItems(
  cmsCollections: GalleryCollection[] | undefined,
): GalleryPreviewItem[] {
  const rows = cmsCollections ?? [];
  return rows.map((collection, index) => {
    const normalized = normalizeGalleryCollection(collection);
    const missingFields = getGalleryCollectionValidationErrors(normalized);
    const images = normalized.imageUrls;
    const slug = normalized.slug || `draft-${index + 1}`;
    return {
      slug,
      title: normalized.title || `Collection ${index + 1}`,
      year: normalized.year || '—',
      subtitle: normalized.year ? `${normalized.year} Collection` : 'Draft collection',
      coverImage: images[0] ?? '',
      description: normalized.description || 'Still missing required fields.',
      images,
      isDraft: missingFields.length > 0,
      missingFields,
    };
  });
}
