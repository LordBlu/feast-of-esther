/** Shared static data for the About Us page (`/about`, case-study layout) — chapter locations. */

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
