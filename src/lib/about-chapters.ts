/** Shared static data for the About Us page (`/about`, case-study layout) — chapters + leadership carousel. */

export type ChapterKey =
  | 'Texas'
  | 'Florida'
  | 'North Carolina'
  | 'Delaware'
  | 'New York / New Jersey'
  | 'Kentucky'
  | 'Maryland'
  | 'Georgia'
  | 'Oregon'
  | 'California'
  | 'The Caribbean';

export const CHAPTERS: Record<ChapterKey, string[]> = {
  Texas: ['Houston', 'Dallas'],
  Florida: ['Orlando', 'Jacksonville', 'Hollywood', 'Tallahassee', 'Miami'],
  'North Carolina': ['Charlotte', 'Raleigh'],
  Delaware: [],
  'New York / New Jersey': [],
  Kentucky: ['Louisville'],
  Maryland: [],
  Georgia: ['Atlanta'],
  Oregon: ['Salem'],
  California: ['Oakland'],
  'The Caribbean': ['Jamaica'],
};

export const CAROUSEL_IMAGES = [
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761734/20260219_131617_ocrby8.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761505/20250221_200317_el9dzk.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761510/20250221_200448_xfsekz.jpg',
] as const;
