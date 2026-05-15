import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  AboutPageContent,
  CmsData,
  LeadershipProfile,
  SitePageContents,
  SocialLink,
  SiteCountdownSettings,
  SiteEvent,
} from '@/lib/cms-types';

const dataDirectory = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDirectory, 'cms-data.json');

const defaultCountdown: SiteCountdownSettings = {
  enabled: true,
  sourceEventId: null,
  fallbackTargetAt: '2026-06-18T14:00:00.000Z',
};

const defaultLeadershipProfiles: LeadershipProfile[] = [
  {
    name: 'Pastor Mrs. Grace Okonrende',
    role: 'Country Coordinator Feast of Esther USA · Continental Evangelist RCCG America',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761734/20260219_131617_ocrby8.jpg',
    blurb:
      'Pastor Grace Okonrende is a dynamic evangelist and Deliverance Minister; she and her husband are gifted marriage counselors, serving the Lord from her youthful days.\n\nShe pioneered churches in Nigeria and the UK, took RCCG to Ireland, and established RCCG in Sacramento, Oakland, and Stockton, California. She co-pastors the Pavilion of Redemption in Sugar Land, Texas.',
  },
  {
    name: 'Pastor Mabel Odigie',
    role: 'Chapter Coordinator — Richmond, Virginia',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761505/20250221_200317_el9dzk.jpg',
    blurb: '',
  },
  {
    name: 'Rev. Dr. Felicia Ajayi',
    role: 'Maryland',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761510/20250221_200448_xfsekz.jpg',
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
  countdown: defaultCountdown,
  about: defaultAbout,
  socialLinks: defaultSocialLinks,
  pageContent: emptyPageContent,
};

async function ensureDataFile() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    await readFile(dataFilePath, 'utf8');
  } catch {
    await writeFile(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

export async function readCmsData(): Promise<CmsData> {
  await ensureDataFile();
  const content = await readFile(dataFilePath, 'utf8');
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
    about: { ...defaultData.about, ...parsed.about },
    socialLinks:
      parsed.socialLinks?.map((row) => ({
        id: String(row.id ?? '').trim(),
        label: String(row.label ?? '').trim(),
        url: String(row.url ?? '').trim(),
        enabled: row.enabled !== false,
      })) ?? defaultData.socialLinks,
    events,
    registrations: parsed.registrations ?? [],
    pageContent: mergeSitePageContents(parsed.pageContent as Partial<SitePageContents> | undefined),
  };
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
  await ensureDataFile();
  await writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}
