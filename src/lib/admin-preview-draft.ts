import type {
  AboutPageContent,
  ExecutivesPageContent,
  PopupContent,
  SiteCountdownSettings,
  SiteEvent,
  SiteImages,
  SitePageContents,
  SocialLink,
} from '@/lib/cms-types';

export const ADMIN_PREVIEW_DRAFT_KEY = 'feast_admin_preview_draft';
export const ADMIN_PREVIEW_DRAFT_EVENT = 'feast-admin-draft-update';
/** postMessage type — iframes cannot read parent sessionStorage; message + localStorage both sync draft. */
export const ADMIN_PREVIEW_DRAFT_MESSAGE = 'feast-admin-preview-draft';

export type AdminPreviewDraft = {
  version: 1;
  updatedAt: number;
  tab: string;
  pageSection?: string;
  about?: AboutPageContent;
  executives?: ExecutivesPageContent;
  images?: SiteImages;
  popup?: PopupContent;
  pageContent?: SitePageContents;
  events?: SiteEvent[];
  socialLinks?: SocialLink[];
  countdown?: SiteCountdownSettings;
};

function parseAdminPreviewDraft(raw: string | null): AdminPreviewDraft | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AdminPreviewDraft;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

/** localStorage is shared with same-origin iframes; sessionStorage is not. */
export function writeAdminPreviewDraft(draft: AdminPreviewDraft): void {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify(draft);
  try {
    localStorage.setItem(ADMIN_PREVIEW_DRAFT_KEY, payload);
  } catch {
    /* quota — postMessage still works */
  }
  try {
    sessionStorage.setItem(ADMIN_PREVIEW_DRAFT_KEY, payload);
  } catch {
    /* legacy */
  }
  window.dispatchEvent(new CustomEvent(ADMIN_PREVIEW_DRAFT_EVENT));
}

export function readAdminPreviewDraft(): AdminPreviewDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const fromLocal = parseAdminPreviewDraft(localStorage.getItem(ADMIN_PREVIEW_DRAFT_KEY));
    if (fromLocal) return fromLocal;
    const fromSession = parseAdminPreviewDraft(sessionStorage.getItem(ADMIN_PREVIEW_DRAFT_KEY));
    if (fromSession) {
      writeAdminPreviewDraft(fromSession);
      return fromSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function isAdminPreviewDraftMessage(data: unknown): data is {
  type: typeof ADMIN_PREVIEW_DRAFT_MESSAGE;
  draft: AdminPreviewDraft;
} {
  if (!data || typeof data !== 'object') return false;
  const row = data as { type?: string; draft?: AdminPreviewDraft };
  return row.type === ADMIN_PREVIEW_DRAFT_MESSAGE && row.draft?.version === 1;
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
      about2: '/about',
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
    placeholders: '/',
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
