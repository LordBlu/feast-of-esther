/** Shared props for editorial / gallery / event rails */
export interface ShowcaseItem {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  href?: string;
  hrefLabel?: string;
}
