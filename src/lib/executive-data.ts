import { randomUUID } from 'node:crypto';
import type { ExecutiveProfile, ExecutivesPageContent } from '@/lib/cms-types';

export const EXECUTIVE_IMAGES = {
  grace:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778084218/founder_m47pqn.jpg',
  exco1:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761831/20260221_001220_is6nla.jpg',
  exco2:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761828/20260221_001107_p9wmvi.jpg',
  exco3:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761791/20260220_131152_jvhb9z.jpg',
  exco4:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761778/20260220_125214_h54x2b.jpg',
  exco5:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761723/20260219_124935_cr7o7g.jpg',
  exco6:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761714/20260219_114039_w1bvck.jpg',
  exco7:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761682/20250712_083226_bgqeac.jpg',
} as const;

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
      name: 'Pastor Mrs. Grace Okonrende',
      title: 'Chairperson (President)',
      subtitle: 'Country Coordinator · Feast of Esther USA',
      imageUrl: EXECUTIVE_IMAGES.grace,
      responsibilities: [
        'Provides overall leadership and direction.',
        'Presides over board meetings and ensures productive discussions.',
        'Facilitates decision-making and ensures board resolutions are implemented.',
        'Represents the organization at official events, partnerships, and engagements.',
        'Makes key decisions and oversees strategy.',
      ],
      bioParagraphs: [
        'Pastor Grace Okonrende is a dynamic evangelist and Deliverance Minister. She and her husband are gifted marriage counselors who have served the Lord faithfully over many years.',
        'She was used by God to pioneer churches in Nigeria and the UK, and was instrumental in taking RCCG to the Republic of Ireland. She started the first RCCG Yoruba/English Church in London.',
        'The Lord established RCCG expressions in Sacramento, Oakland, and Stockton through Pastor Grace and her husband. They currently co-pastor in Sugar Land, Texas.',
        'Her ministry has impacted many nations through healing, deliverance, and revival. She was promoted as the first female regional evangelist in RCCG and later as the first female continental evangelist in RCCG America.',
      ],
    },
    committee: [
      {
        id: 'vice-chair',
        name: 'Pastor Anthonia Adeyeye',
        title: 'Vice Chairperson (Assistant President)',
        imageUrl: EXECUTIVE_IMAGES.exco1,
        responsibilities: [
          'Supports the Chairperson and assumes their responsibilities when absent.',
          'May oversee specific committees or strategic initiatives.',
          'Serves as a key advisor and sounding board for the President.',
          'Steps in to lead board meetings and official duties when the President is absent.',
          'Collaborates with the President to develop and implement strategic objectives.',
        ],
      },
      {
        id: 'secretary',
        name: 'Pastor Favor Winner',
        title: 'Secretary',
        imageUrl: EXECUTIVE_IMAGES.exco2,
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
        imageUrl: EXECUTIVE_IMAGES.exco3,
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
        imageUrl: EXECUTIVE_IMAGES.exco4,
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
        imageUrl: EXECUTIVE_IMAGES.exco5,
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
        imageUrl: EXECUTIVE_IMAGES.exco6,
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
        imageUrl: EXECUTIVE_IMAGES.exco7,
        responsibilities: [
          'Oversee financial transactions and accounting.',
          'Manage budgets and financial planning.',
          'Ensure financial transparency and accountability.',
        ],
      },
    ],
  };
}

export function mergeExecutivesContent(
  incoming: Partial<ExecutivesPageContent> | undefined,
): ExecutivesPageContent {
  const defaults = buildDefaultExecutivesContent();
  const patch = incoming ?? {};
  const chair = { ...defaults.chairperson, ...patch.chairperson };
  const committee = Array.isArray(patch.committee)
    ? patch.committee.map((row) => ({
        ...row,
        id: row.id?.trim() || randomUUID(),
        responsibilities: Array.isArray(row.responsibilities)
          ? row.responsibilities.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
          : [],
        bioParagraphs: Array.isArray(row.bioParagraphs)
          ? row.bioParagraphs.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
          : undefined,
      }))
    : defaults.committee;

  return {
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
}
