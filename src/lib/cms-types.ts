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

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
}

/** Optional marketing copy for /gallery (collections still live under Imagery). */
export interface GalleryPageContent {
  pageTitle?: string;
  pageSubtitle?: string;
}

/** Static strings on /events beyond the featured CMS event row. */
export interface EventsPageContent {
  hotelSectionTitle?: string;
  hotelSectionSubtitle?: string;
  hotelName?: string;
  hotelBody?: string;
  bookStayUrl?: string;
  pastEventsTitle?: string;
  pastEventsSubtitle?: string;
  audienceLine?: string;
  heroRegisterCta?: string;
}

/** Left column + contact strip on /contact (form labels stay in code). */
export interface ContactPageContent {
  formTitle?: string;
  infoHeading?: string;
  aboutCardTitle?: string;
  aboutCardText?: string;
  addressLine1?: string;
  addressLine2?: string;
  phone1Display?: string;
  phone1Href?: string;
  phone2Display?: string;
  phone2Href?: string;
  email?: string;
  websiteUrl?: string;
  websiteDisplay?: string;
  mapEmbedUrl?: string;
  followLabel?: string;
}

/** Sidebar + quotes + hints on /donate. Use {{amount}} in offline hint template. */
export interface DonatePageContent {
  asideTitle?: string;
  asideLead?: string;
  quoteText?: string;
  quoteCite?: string;
  bullet1?: string;
  bullet2?: string;
  bullet3?: string;
  sectionChooseAmount?: string;
  sectionCustomAmount?: string;
  sectionMethod?: string;
  methodCard?: string;
  methodPaypal?: string;
  sectionDetails?: string;
  hintOnline?: string;
  /** When no donate URL; supports {{amount}} and {{methodNote}} (e.g. PayPal). */
  hintOfflineTemplate?: string;
  finePrint?: string;
  featureImpactTitle?: string;
  featureImpactText?: string;
  featureStewardshipTitle?: string;
  featureStewardshipText?: string;
  featureSecureTitle?: string;
  featureSecureText?: string;
}

/** Sidebar + step hints + success panel on /registration. */
export interface RegistrationPageContent {
  asideTitle?: string;
  asideLead?: string;
  successTitle?: string;
  /** Supports {{firstName}} */
  successBody?: string;
  step0Hint?: string;
  step1Hint?: string;
  step2Hint?: string;
  step3Hint?: string;
}

/** Hero image + biography paragraphs on /founder (carousel stays under Imagery). */
export interface FounderPageContent {
  heroBackgroundUrl?: string;
  storyP1?: string;
  storyP2?: string;
  storyP3?: string;
}

/** High-visibility strings + sidebar photography on the About Us case-study page (`/about`). */
export interface About2PageContent {
  chromeTitle?: string;
  megaAccent?: string;
  focusItem1?: string;
  focusItem2?: string;
  focusItem3?: string;
  ctaBarText?: string;
  /** Sidebar image per scroll section (Cloudinary or any HTTPS URL). */
  visualAbout?: string;
  visualOurJourney?: string;
  visualWhoWeAre?: string;
  visualOurVision?: string;
  visualMission?: string;
  visualLeadership?: string;
  visualOutreach?: string;
}

export interface SitePageContents {
  gallery: GalleryPageContent;
  events: EventsPageContent;
  contact: ContactPageContent;
  donate: DonatePageContent;
  registration: RegistrationPageContent;
  founder: FounderPageContent;
  about2: About2PageContent;
}

export interface CmsData {
  events: SiteEvent[];
  popup: PopupContent;
  images: SiteImages;
  registrations: RegistrationRecord[];
  countdown: SiteCountdownSettings;
  about: AboutPageContent;
  socialLinks: SocialLink[];
  pageContent: SitePageContents;
}
