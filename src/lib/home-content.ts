import type { GalleryCollection, HomePageContent, HomeTestimonial } from '@/lib/cms-types';
import { resolveGalleryItems } from '@/lib/gallery-data';

export const DEFAULT_RELIVE_FEAST_IMAGES: readonly string[] = [
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778152795/foe_group_2_q6pcp8.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777728539/20250710_090859_b81076.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761752/20260219_223539_aetz6w.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761661/20250711_200106_dxgplr.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761505/20250221_200317_el9dzk.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761734/20260219_131617_ocrby8.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778132653/foe_Group_foto_twphtz.png',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790070/MA_m27h6y.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790078/MA3_txk1xd.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761811/20260220_131922_g3apl3.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761751/20260219_223504_wkb6xn.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761721/20260219_114313_rsn8hi.jpg',
];

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
  galleryCollections: GalleryCollection[] | undefined
): string[] {
  const fromCms = (home?.reliveFeastImageUrls ?? []).map((u) => u.trim()).filter(Boolean);
  if (fromCms.length >= 9) return fromCms;

  const fromGallery = resolveGalleryItems(galleryCollections).flatMap((item) => item.images);
  const merged =
    fromCms.length > 0
      ? [...fromCms, ...fromGallery, ...DEFAULT_RELIVE_FEAST_IMAGES]
      : [...fromGallery, ...DEFAULT_RELIVE_FEAST_IMAGES];
  const unique: string[] = [];
  for (const url of merged) {
    if (!unique.includes(url)) unique.push(url);
  }
  return unique.length >= 9 ? unique : [...DEFAULT_RELIVE_FEAST_IMAGES];
}

export function resolveHomeTestimonials(home: HomePageContent | undefined): HomeTestimonial[] {
  const rows = home?.testimonials?.filter((t) => t.quote?.trim() && t.name?.trim());
  return rows?.length ? rows : DEFAULT_HOME_TESTIMONIALS;
}
