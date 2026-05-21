import type {
  AboutPageContent,
  PopupContent,
  SiteCountdownSettings,
  SiteEvent,
  SiteImages,
  SitePageContents,
  SocialLink,
} from '@/lib/cms-types';

export const ADMIN_PREVIEW_DRAFT_KEY = 'feast_admin_preview_draft';
export const ADMIN_PREVIEW_DRAFT_EVENT = 'feast-admin-draft-update';

export type AdminPreviewDraft = {
  version: 1;
  updatedAt: number;
  tab: string;
  pageSection?: string;
  about?: AboutPageContent;
  images?: SiteImages;
  popup?: PopupContent;
  pageContent?: SitePageContents;
  events?: SiteEvent[];
  socialLinks?: SocialLink[];
  countdown?: SiteCountdownSettings;
};

export function writeAdminPreviewDraft(draft: AdminPreviewDraft): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_PREVIEW_DRAFT_KEY, JSON.stringify(draft));
  window.dispatchEvent(new CustomEvent(ADMIN_PREVIEW_DRAFT_EVENT));
}

export function readAdminPreviewDraft(): AdminPreviewDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_PREVIEW_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminPreviewDraft;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

/** Public path shown in the preview iframe for each admin tab. */
export function resolveAdminPreviewPath(tab: string, pageSection?: string): string | null {
  if (tab === 'pages' && pageSection) {
    const map: Record<string, string> = {
      gallery: '/gallery',
      events: '/events',
      contact: '/contact',
      donate: '/donate',
      registration: '/registration',
      founder: '/founder',
      about2: '/about-2',
      home: '/',
    };
    return map[pageSection] ?? '/';
  }

  const paths: Record<string, string | null> = {
    guide: '/',
    events: '/events',
    countdown: '/',
    popup: '/',
    images: '/founder',
    gallery: '/gallery',
    social: '/contact',
    about: '/about',
    executives: '/executive',
    pages: '/gallery',
    donations: '/donate',
    registrations: null,
    versions: null,
  };

  return paths[tab] ?? '/';
}
