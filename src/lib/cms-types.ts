export type EventStatus = 'draft' | 'published';
export type EventCategory = 'upcoming' | 'past';

export interface SiteEvent {
  id: string;
  title: string;
  category: EventCategory;
  theme?: string;
  scripture?: string;
  description: string;
  dateLabel: string;
  venue: string;
  registrationUrl: string;
  ctaLabel?: string;
  heroImageUrl?: string;
  imageUrl?: string;
  /** When category is "past", this links into /gallery/[slug]. */
  gallerySlug?: string;
  /** ISO 8601 — moment the homepage flip countdown counts down to (when this event is selected as source). */
  countdownTargetAt?: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

/** Per-block typography for the welcome popup (admin-controlled). */
export interface PopupTextStyle {
  fontSizeRem?: number;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
  /** Serif display vs sans UI */
  useDisplayFont?: boolean;
}

export interface PopupContent {
  enabled: boolean;
  title: string;
  scripture?: string;
  body: string;
  /** Small line under body (e.g. urgency note) */
  bodyFooter?: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl?: string;
  /** Right column eyebrow */
  rightKicker?: string;
  /** Left panel overlay — shown on top of artwork */
  leftEyebrow?: string;
  leftSubtitle?: string;
  leftFootline?: string;
  leftShowLogo?: boolean;
  leftEyebrowStyle?: PopupTextStyle;
  leftTitleStyle?: PopupTextStyle;
  leftScriptureStyle?: PopupTextStyle;
  leftFootlineStyle?: PopupTextStyle;
  rightKickerStyle?: PopupTextStyle;
  rightTitleStyle?: PopupTextStyle;
  rightScriptureStyle?: PopupTextStyle;
  rightBodyStyle?: PopupTextStyle;
  rightFooterStyle?: PopupTextStyle;
}

/** Homepage flip clock — tie to an event’s `countdownTargetAt` or use fallback ISO. */
export interface SiteCountdownSettings {
  enabled: boolean;
  /** When set, target = that event’s `countdownTargetAt` (must be set on the event). */
  sourceEventId: string | null;
  /** Used when off / no event / event missing target (ISO 8601, e.g. ends with Z). */
  fallbackTargetAt: string;
}

export interface SiteImages {
  heroPosterUrl?: string;
  /** Homepage YouTube embed URL (used in the video spotlight iframe). */
  homeVideoEmbedUrl?: string;
  founderImageUrl?: string;
  popupImageUrl?: string;
  /** Homepage “Official accommodation” hotel photo (optional). */
  hotelRoomUrl?: string;
  /** Founder page carousel — one or more image URLs (optional; falls back to site defaults). */
  founderCarouselUrls?: string[];
  /**
   * Gallery collections editable from Admin.
   * Each item is a "folder/event" with a slug, description, and one or more image URLs.
   */
  galleryCollections?: GalleryCollection[];
}

export interface GalleryCollection {
  slug: string;
  title: string;
  year: string;
  description: string;
  imageUrls: string[];
}

export interface RegistrationRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  church?: string;
  city?: string;
  country?: string;
  notes?: string;
  createdAt: string;
}

export interface LeadershipProfile {
  name: string;
  role: string;
  imageUrl: string;
  blurb: string;
}

export interface AboutPageContent {
  heroEyebrow: string;
  heroTitle: string;
  heroImageUrl: string;
  storyTitle: string;
  storyParagraphs: string[];
  missionEyebrow: string;
  missionTitle: string;
  missionIntro: string;
  missionBody: string;
  leadershipEyebrow: string;
  leadershipTitle: string;
  leadershipProfiles: LeadershipProfile[];
}

export interface CmsData {
  events: SiteEvent[];
  popup: PopupContent;
  images: SiteImages;
  registrations: RegistrationRecord[];
  countdown: SiteCountdownSettings;
  about: AboutPageContent;
}
