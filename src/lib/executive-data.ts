import type { ExecutiveProfile, ExecutivesPageContent } from '@/lib/cms-types';

function newExecutiveId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `exco-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export const EXECUTIVE_IMAGES = {
  anthonia:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779463665/photo_7_2026-05-22_16-05-49_y1vjex.jpg',
  grace:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778084218/founder_m47pqn.jpg',
  favour:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779463582/photo_2_2026-05-22_16-05-46_wjgzev.jpg',
  kemi:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779463573/photo_6_2026-05-22_16-05-48_xewiyc.jpg',
  elizabeth:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779463627/photo_1_2026-05-22_16-05-46_wc4k8s.jpg',
  jumoke:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779464456/photo_5_2026-05-22_16-05-48_qrszam.jpg',
  temitosan:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779463658/photo_3_2026-05-22_16-05-46_skm6di.jpg',
  christie:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779463620/photo_4_2026-05-22_16-05-46_k0lpd3.jpg',
} as const;

const CHAIR_RESPONSIBILITIES = [
  'Provides overall leadership and direction.',
  'Presides over board meetings and ensures productive discussions.',
  'Facilitates decision-making and ensures board resolutions are implemented.',
  'Represents the organization at official events, partnerships, and engagements.',
  'Makes key decisions and oversees strategy.',
] as const;

const VICE_RESPONSIBILITIES = [
  'Supports the Chairperson and assumes their responsibilities when absent.',
  'May oversee specific committees or strategic initiatives.',
  'Serves as a key advisor and sounding board for the President.',
  'Steps in to lead board meetings and official duties when the President is absent.',
  'Collaborates with the President to develop and implement strategic objectives.',
] as const;

/** Former chair copy — now on Pastor Anthonia Adeyeye (Chairman). */
const GRACE_CHAIR_BIO: string[] = [
  'Pastor Grace Okonrende is a dynamic evangelist and Deliverance Minister. She and her husband are gifted marriage counselors who have served the Lord faithfully over many years.',
  'She was used by God to pioneer churches in Nigeria and the UK, and was instrumental in taking RCCG to the Republic of Ireland. She started the first RCCG Yoruba/English Church in London.',
  'The Lord established RCCG expressions in Sacramento, Oakland, and Stockton through Pastor Grace and her husband. They currently co-pastor in Sugar Land, Texas.',
  'Her ministry has impacted many nations through healing, deliverance, and revival. She was promoted as the first female regional evangelist in RCCG and later as the first female continental evangelist in RCCG America.',
];

/** Short vice-era copy — now on Pastor Grace as Vice Chairperson. */
const ANTHONIA_VICE_BIO: string[] = [
  'Pastor Anthonia Adeyeye serves as Chairman (President) of the Feast of Esther USA Executive Committee.',
  'She provides overall leadership and direction for the national body, presides over board meetings, and represents the organization at official engagements.',
];

export function buildDefaultExecutivesContent(): ExecutivesPageContent {
  return {
    heroEyebrow: 'Feast of Esther USA',
    heroTitle: 'Our Executive Committee',
    gridTitle: 'Roles & Responsibilities',
    gridLead:
      'Hover over a leader to read their responsibilities. Move away to return to their profile.',
    heroBadges: ['Continental Evangelist · RCCG America'],
    chairperson: {
      id: 'chairperson',
      name: 'Pastor Anthonia Adeyeye',
      title: 'Chairperson (President)',
      subtitle: 'Country Coordinator · Feast of Esther USA',
      imageUrl: EXECUTIVE_IMAGES.anthonia,
      responsibilities: [...CHAIR_RESPONSIBILITIES],
      bioParagraphs: GRACE_CHAIR_BIO.map((p) =>
        p
          .replace(/Pastor Grace Okonrende/g, 'Pastor Anthonia Adeyeye')
          .replace(/through Pastor Grace and her husband/g, 'through Pastor Anthonia and her husband')
          .replace(/Pastor Grace/g, 'Pastor Anthonia'),
      ),
    },
    committee: [
      {
        id: 'vice-chair',
        name: 'Pastor Mrs. Grace Okonrende',
        title: 'Vice Chairperson (Assistant President)',
        imageUrl: EXECUTIVE_IMAGES.grace,
        responsibilities: [...VICE_RESPONSIBILITIES],
      },
      {
        id: 'secretary',
        name: 'Pastor Favour Winner',
        title: 'Secretary',
        imageUrl: EXECUTIVE_IMAGES.favour,
        responsibilities: [
          'Handles correspondence and communication.',
          'Maintains records and documents.',
          'Provides administrative support.',
          'Records meeting minutes accurately.',
        ],
      },
      {
        id: 'prayer',
        name: 'Pastor Kemi Ojo',
        title: 'Prayer Coordinator',
        imageUrl: EXECUTIVE_IMAGES.kemi,
        responsibilities: [
          'Organizes corporate prayer sessions for FOE members.',
          'Encourages intercessory prayers for members and initiatives.',
          'Establishes a structured prayer plan to support the organization’s mission and vision.',
          'Coordinates prayer gatherings and meetings.',
          'Creates a prayer calendar focused on key events.',
        ],
      },
      {
        id: 'strategic',
        name: 'Pastor Elizabeth Ojuolape',
        title: 'Director of Strategic Coordination',
        imageUrl: EXECUTIVE_IMAGES.elizabeth,
        responsibilities: [
          'Coordination and alignment across leadership.',
          'Facilitation of communication among leaders and their teams.',
          'Participation in strategic discussions and development of initiatives.',
          'Follow-up on agreed action points to support effective execution.',
          'Plans and coordinates events and programs; ensures timely execution.',
          'Manages logistics for events and meetings; collaborates with other team members.',
        ],
      },
      {
        id: 'marketing',
        name: 'Pastor Jumoke Elkanah',
        title: 'Marketing & Social Media Coordinator',
        subtitle: 'Assisted by Pastor Temitosan Abimbola',
        imageUrl: EXECUTIVE_IMAGES.jumoke,
        responsibilities: [
          'Develop and implement a comprehensive social media strategy across Facebook, Instagram, and other platforms.',
          'Manage the FOE website.',
          'Create, schedule, and manage posts aligned with organizational goals.',
          'Engage with followers, respond to comments and messages, and foster online community growth.',
          'Monitor social media trends and adjust strategies accordingly.',
          'Develop and execute marketing campaigns for events, programs, and initiatives.',
          'Design promotional materials, including flyers, graphics, and advertisements.',
        ],
      },
      {
        id: 'hospitality',
        name: 'Pastor Temitosan Abimbola',
        title: 'Hospitality Coordinator',
        imageUrl: EXECUTIVE_IMAGES.temitosan,
        responsibilities: [
          'Coordinate hospitality arrangements for guest speakers, ministers, and special guests.',
          'Ensure guests are warmly welcomed and properly attended to.',
          'Oversee accommodation, transportation, meals, and comfort needs when required.',
          'Recruit, train, and supervise hospitality team volunteers.',
        ],
      },
      {
        id: 'finance',
        name: 'Evangelist Christie Ohuabunwa',
        title: 'Finance Coordinator',
        imageUrl: EXECUTIVE_IMAGES.christie,
        responsibilities: [
          'Oversee financial transactions and accounting.',
          'Manage budgets and financial planning.',
          'Ensure financial transparency and accountability.',
        ],
      },
    ],
  };
}

/** About page featured leader — Anthonia with Grace’s public role + bio. */
export const DEFAULT_ANTHONIA_LEADERSHIP_PROFILE = {
  name: 'Pastor Anthonia Adeyeye',
  role: 'Chairperson (President) · Country Coordinator Feast of Esther USA · Continental Evangelist RCCG America',
  imageUrl: EXECUTIVE_IMAGES.anthonia,
  blurb:
    'Pastor Anthonia Adeyeye is a dynamic evangelist and Deliverance Minister; she and her husband are gifted marriage counselors, serving the Lord from her youthful days.\n\nShe pioneered churches in Nigeria and the UK, took RCCG to Ireland, and established RCCG in Sacramento, Oakland, and Stockton, California. She co-pastors the Pavilion of Redemption in Sugar Land, Texas.',
} as const;

export const DEFAULT_GRACE_LEADERSHIP_PROFILE = {
  name: 'Pastor Mrs. Grace Okonrende',
  role: 'Vice Chairperson',
  imageUrl: EXECUTIVE_IMAGES.grace,
  blurb: '',
} as const;

export function mergeExecutivesContent(
  incoming: Partial<ExecutivesPageContent> | undefined,
): ExecutivesPageContent {
  const defaults = buildDefaultExecutivesContent();
  const patch = incoming ?? {};
  const chair = { ...defaults.chairperson, ...patch.chairperson };
  const committee = Array.isArray(patch.committee)
    ? patch.committee.map((row) => ({
        ...row,
        id: row.id?.trim() || newExecutiveId(),
        responsibilities: Array.isArray(row.responsibilities)
          ? row.responsibilities.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
          : [],
        bioParagraphs: Array.isArray(row.bioParagraphs)
          ? row.bioParagraphs.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
          : undefined,
      }))
    : defaults.committee;

  const merged: ExecutivesPageContent = {
    heroEyebrow: patch.heroEyebrow?.trim() || defaults.heroEyebrow,
    heroTitle: patch.heroTitle?.trim() || defaults.heroTitle,
    gridTitle: patch.gridTitle?.trim() || defaults.gridTitle,
    gridLead: patch.gridLead?.trim() || defaults.gridLead,
    heroBadges: Array.isArray(patch.heroBadges)
      ? patch.heroBadges.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
      : defaults.heroBadges,
    chairperson: {
      ...chair,
      id: chair.id?.trim() || 'chairperson',
      responsibilities: Array.isArray(chair.responsibilities)
        ? chair.responsibilities.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        : defaults.chairperson.responsibilities,
      bioParagraphs: Array.isArray(chair.bioParagraphs)
        ? chair.bioParagraphs.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        : defaults.chairperson.bioParagraphs,
    },
    committee: committee.length > 0 ? committee : defaults.committee,
  };

  return applyExecutivePhotoDefaults(merged, defaults);
}

function namesMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function applyExecutivePhotoDefaults(
  content: ExecutivesPageContent,
  defaults: ExecutivesPageContent,
): ExecutivesPageContent {
  const chair = {
    ...content.chairperson,
    imageUrl: content.chairperson.imageUrl?.trim() || defaults.chairperson.imageUrl,
    title: content.chairperson.title?.trim() || defaults.chairperson.title,
    subtitle: content.chairperson.subtitle?.trim() || defaults.chairperson.subtitle,
    bioParagraphs: content.chairperson.bioParagraphs?.length
      ? content.chairperson.bioParagraphs
      : defaults.chairperson.bioParagraphs,
    responsibilities: content.chairperson.responsibilities?.length
      ? content.chairperson.responsibilities
      : defaults.chairperson.responsibilities,
  };

  const committee = content.committee.map((member) => {
    const defaultRow = defaults.committee.find(
      (d) => (member.id && d.id === member.id) || namesMatch(d.name, member.name),
    );
    if (!defaultRow) return member;
    return {
      ...member,
      imageUrl: member.imageUrl?.trim() || defaultRow.imageUrl,
      title: member.title?.trim() || defaultRow.title,
      subtitle: member.subtitle?.trim() || defaultRow.subtitle,
      responsibilities: member.responsibilities?.length
        ? member.responsibilities
        : defaultRow.responsibilities,
    };
  });

  return {
    ...content,
    chairperson: chair,
    committee,
    heroBadges: content.heroBadges?.length ? content.heroBadges : defaults.heroBadges,
  };
}
