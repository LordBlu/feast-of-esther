import { revalidatePath } from 'next/cache';

/** Bust Next.js static cache after CMS writes so public pages show fresh JSON. */
export function revalidateAfterCmsSave(paths: string[] = ['/']) {
  const seen = new Set<string>();
  for (const path of paths) {
    if (!path || seen.has(path)) continue;
    seen.add(path);
    revalidatePath(path);
  }
  // Root layout loads popup/images/countdown — always invalidate after any CMS save.
  revalidatePath('/', 'layout');
}

export const CMS_PAGE_PATHS = {
  home: ['/'],
  gallery: ['/gallery', '/'],
  events: ['/events', '/'],
  about: ['/about', '/'],
  executive: ['/executive'],
  founder: ['/founder', '/'],
  donate: ['/donate'],
  contact: ['/contact'],
  registration: ['/registration'],
} as const;
