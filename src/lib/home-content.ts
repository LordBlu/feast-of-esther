import type { GalleryCollection, HomePageContent, HomeTestimonial } from '@/lib/cms-types';
import { resolveGalleryItems } from '@/lib/gallery-data';
import { dedupeReliveImageUrls, DEFAULT_RELIVE_FEAST_IMAGES } from '@/lib/relive-feast-grid';

export { DEFAULT_RELIVE_FEAST_IMAGES };

export const DEFAULT_HOME_TESTIMONIALS: HomeTestimonial[] = [
  {
    quote:
      'Feast of Esther renewed my calling. I left with clarity, courage, and sisters who still pray with me across states.',
    name: 'Pastor Grace M.',
    role: 'Women in Ministry, Texas',
  },
  {
    quote:
      'The worship was deep, the teaching was practical, and the fellowship felt like family. This gathering is a gift to the church.',
    name: 'Rev. Dr. Felicia A.',
    role: 'Maryland Chapter',
  },
  {
    quote:
      'We stood in the gap together for our churches and nations. I have never experienced intercession like this among women leaders.',
    name: 'Pastor Mabel O.',
    role: 'Virginia Chapter',
  },
  {
    quote:
      'From the opening night to the final altar call, every session pointed us back to purpose. I am already preparing for next year.',
    name: 'Minister Sarah K.',
    role: 'North Carolina',
  },
];

export function resolveReliveFeastImages(
  home: HomePageContent | undefined,
  galleryCollections: GalleryCollection[] | undefined,
): string[] {
  const fromCms = dedupeReliveImageUrls(home?.reliveFeastImageUrls ?? []);
  if (fromCms.length >= 9) return fromCms;

  const fromGallery = resolveGalleryItems(galleryCollections).flatMap((item) => item.images);
  const merged =
    fromCms.length > 0
      ? [...fromCms, ...fromGallery, ...DEFAULT_RELIVE_FEAST_IMAGES]
      : [...fromGallery, ...DEFAULT_RELIVE_FEAST_IMAGES];

  const unique = dedupeReliveImageUrls(merged);
  return unique.length >= 9 ? unique : [...DEFAULT_RELIVE_FEAST_IMAGES];
}

export function resolveHomeTestimonials(home: HomePageContent | undefined): HomeTestimonial[] {
  const rows = home?.testimonials?.filter((t) => t.quote?.trim() && t.name?.trim());
  return rows?.length ? rows : DEFAULT_HOME_TESTIMONIALS;
}
