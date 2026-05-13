import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  AboutPageContent,
  CmsData,
  LeadershipProfile,
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
    role: 'Country Coordinator Feast of Esther USA',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778084218/founder_m47pqn.jpg',
    blurb:
      'Continental Evangelist RCCG America and a seasoned ministry leader with global impact across evangelism, revival, and women mentorship.',
  },
  {
    name: 'Regional Leadership Team',
    role: 'Chapter Leadership',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761835/20260221_002014_nethgk.jpg',
    blurb: 'Women across chapters serving with unity, grace, and conviction.',
  },
  {
    name: 'Feast of Esther Fellowship',
    role: 'Women in Ministry Network',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761813/20260220_131948_hjl3jz.jpg',
    blurb: 'A faith-forward community building women for kingdom impact.',
  },
  {
    name: 'Conference Leadership Circle',
    role: 'Event and Care Team',
    imageUrl:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761762/20260219_223755_odcohd.jpg',
    blurb: 'Supporting hospitality, prayer, and leadership formation at every gathering.',
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
    'We develop excellent ministry skills in women called to support and impact the church of God for nation building, helping them stand as pillars in the house of God.',
  leadershipEyebrow: 'Our Leadership',
  leadershipTitle: 'Leading with grace and conviction',
  leadershipProfiles: defaultLeadershipProfiles,
};

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
    events,
    registrations: parsed.registrations ?? [],
  };
}

export async function writeCmsData(data: CmsData): Promise<void> {
  await ensureDataFile();
  await writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}
