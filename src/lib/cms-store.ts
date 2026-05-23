import { randomUUID } from 'node:crypto';
import {
  ensureCmsDataFileExists,
  readCmsDataRaw,
  writeCmsDataRaw,
} from '@/lib/cms-persistence';
import {
  DEFAULT_ANTHONIA_LEADERSHIP_PROFILE,
  DEFAULT_GRACE_LEADERSHIP_PROFILE,
  EXECUTIVE_IMAGES,
  mergeExecutivesContent,
} from '@/lib/executive-data';
import type {
  AboutPageContent,
  CmsData,
  DonationIntent,
  LeadershipProfile,
  SitePageContents,
  SocialLink,
  SiteCountdownSettings,
  SiteEvent,
} from '@/lib/cms-types';
import { DEFAULT_RELIVE_FEAST_IMAGES } from '@/lib/relive-feast-grid';

const defaultCountdown: SiteCountdownSettings = {
  enabled: true,
  sourceEventId: null,
  fallbackTargetAt: '2026-06-18T14:00:00.000Z',
};

const defaultLeadershipProfiles: LeadershipProfile[] = [
  { ...DEFAULT_ANTHONIA_LEADERSHIP_PROFILE },
  { ...DEFAULT_GRACE_LEADERSHIP_PROFILE },
  {
    name: 'Pastor Favour Winner',
    role: 'Secretary',
    imageUrl: EXECUTIVE_IMAGES.favour,
    blurb: '',
  },
  {
    name: 'Pastor Kemi Ojo',
    role: 'Prayer Co-ordinator',
    imageUrl: EXECUTIVE_IMAGES.kemi,
    blurb: '',
  },
  {
    name: 'Dr. Banks',
    role: 'Virginia Chapter',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761835/20260221_002014_nethgk.jpg',
    blurb: '',
  },
];

const defaultAbout: AboutPageContent = {
  heroEyebrow: 'ABOUT US',
  heroTitle: 'We are the Feast of Esther.',
  heroImageUrl:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778084218/founder_m47pqn.jpg',
  storyTitle: 'Our Story',
  storyParagraphs: [
    'Feast of Esther is an annual divine assignment organized by Pastor (Mrs.) Folu Adeboye, wife of the General Overseer of the Redeemed Christian Church of God.',
    'Since its inception in 2002, the gathering has expanded from Nigeria across Africa, Europe, and North America, strengthening women in ministry through worship, prayer, and fellowship.',
  ],
  missionEyebrow: 'Mission and Values',
  missionTitle: 'For such a time as this.',
  missionIntro:
    'A forum where women in ministry learn to accomplish their calling, stand in the gap, and impact the church for revival in the nation.',
  missionBody:
    'To develop excellent Ministry Skills in women who are called to support and impact the church of God for nation building and stand as pillars in the house of God to accomplish great things for the kingdom.',
  leadershipEyebrow: 'Our Leadership',
  leadershipTitle: 'Leading with grace and conviction',
  leadershipProfiles: defaultLeadershipProfiles,
};

const emptyPageContent: SitePageContents = {
  gallery: {},
  events: {},
  contact: {},
  donate: {},
  registration: {},
  founder: {},
  about2: {},
  home: {
    reliveFeastImageUrls: [...DEFAULT_RELIVE_FEAST_IMAGES],
    showReliveFeast: true,
  },
};

function mergeSitePageContents(patch: Partial<SitePageContents> | undefined): SitePageContents {
  const p = patch ?? {};
  return {
    gallery: { ...emptyPageContent.gallery, ...p.gallery },
    events: { ...emptyPageContent.events, ...p.events },
    contact: { ...emptyPageContent.contact, ...p.contact },
    donate: { ...emptyPageContent.donate, ...p.donate },
    registration: { ...emptyPageContent.registration, ...p.registration },
    founder: { ...emptyPageContent.founder, ...p.founder },
    about2: { ...emptyPageContent.about2, ...p.about2 },
    home: { ...emptyPageContent.home, ...p.home },
  };
}

const defaultSocialLinks: SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', enabled: true },
  { id: 'facebook', label: 'Facebook', url: 'https://facebook.com', enabled: true },
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com', enabled: true },
  { id: 'x', label: 'X (Twitter)', url: 'https://x.com', enabled: true },
  { id: 'youtube', label: 'YouTube', url: 'https://youtube.com', enabled: true },
  { id: 'tiktok', label: 'TikTok', url: 'https://tiktok.com', enabled: true },
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/18323720860', enabled: true },
];

const defaultData: CmsData = {
  events: [],
  popup: {
    enabled: true,
    title: '"...the anointing that endures"',
    scripture: '2 Kings 13:20-21',
    body: 'Three days of powerful worship, fellowship, and renewal.',
    bodyFooter: 'Seats are limited — secure your place today.',
    ctaLabel: 'Register Now',
    ctaUrl: '/registration',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778244638/Save_thedate_mkpbnu.jpg',
    rightKicker: 'Upcoming Event',
    leftEyebrow: 'Save the Date',
    leftSubtitle: '',
    leftFootline: 'North America',
    leftShowLogo: true,
  },
  images: {
    heroPosterUrl: '/images/hero-poster.jpg',
    homeVideoEmbedUrl: 'https://www.youtube.com/embed/UVRoPXdUSC8',
    founderImageUrl: '',
    popupImageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778244638/Save_thedate_mkpbnu.jpg',
    hotelRoomUrl: '',
    founderCarouselUrls: [],
    galleryCollections: [],
  },
  registrations: [],
  donationIntents: [],
  countdown: defaultCountdown,
  about: defaultAbout,
  executives: mergeExecutivesContent(undefined),
  socialLinks: defaultSocialLinks,
  pageContent: emptyPageContent,
};

export async function readCmsData(): Promise<CmsData> {
  await ensureCmsDataFileExists(JSON.stringify(defaultData, null, 2));
  const content = await readCmsDataRaw();
  const parsed = JSON.parse(content) as Partial<CmsData>;

  const rawEvents = parsed.events ?? [];
  const events: SiteEvent[] = rawEvents.map((e) => {
    const row = e as SiteEvent;
    return {
      ...row,
      category: row.category === 'past' ? 'past' : 'upcoming',
      status: row.status === 'draft' ? 'draft' : 'published',
    };
  });

  return {
    ...defaultData,
    ...parsed,
    popup: { ...defaultData.popup, ...parsed.popup },
    images: { ...defaultData.images, ...parsed.images },
    countdown: { ...defaultData.countdown, ...parsed.countdown },
    about: {
      ...defaultData.about,
      ...parsed.about,
      leadershipProfiles:
        parsed.about?.leadershipProfiles?.length
          ? parsed.about.leadershipProfiles
          : defaultData.about.leadershipProfiles,
    },
    executives: mergeExecutivesContent(parsed.executives),
    socialLinks:
      parsed.socialLinks?.map((row) => ({
        id: String(row.id ?? '').trim(),
        label: String(row.label ?? '').trim(),
        url: String(row.url ?? '').trim(),
        enabled: row.enabled !== false,
      })) ?? defaultData.socialLinks,
    events,
    registrations: parsed.registrations ?? [],
    donationIntents: parsed.donationIntents ?? [],
    pageContent: mergeSitePageContents(parsed.pageContent as Partial<SitePageContents> | undefined),
  };
}

export async function appendDonationIntent(
  intent: Omit<DonationIntent, 'id' | 'createdAt'>
): Promise<DonationIntent> {
  const data = await readCmsData();
  const record: DonationIntent = {
    ...intent,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const existing = data.donationIntents ?? [];
  data.donationIntents = [record, ...existing].slice(0, 500);
  await writeCmsData(data, { recordHistory: false });
  return record;
}

export type WriteCmsDataOptions = {
  /** When false, skips undo history (public registration, version restore). Default true. */
  recordHistory?: boolean;
};

export async function writeCmsData(data: CmsData, options?: WriteCmsDataOptions): Promise<void> {
  if (options?.recordHistory !== false) {
    try {
      const current = await readCmsData();
      const { recordUndoBeforeWrite } = await import('@/lib/cms-history');
      await recordUndoBeforeWrite(current);
    } catch {
      /* history must not block saves */
    }
  }
  await writeCmsDataRaw(JSON.stringify(data, null, 2));
}
