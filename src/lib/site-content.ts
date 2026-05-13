/**
 * Public marketing copy aligned with feastofestherna.com (live site).
 * Adjust here to stay in sync with published messaging.
 */

export const SITE = {
  name: 'Feast of Esther',
  chapter: 'North America',
  year: '2026',
  /** Live site uses “June 18th-20th, 2026” */
  dateRange: 'June 18–20, 2026',
  dateRangeLong: 'June 18th–20th, 2026',
  themePhrase: '…the anointing that endures',
  scriptureRef: '2 Kings 13:20–21',
  venueName: 'Dallas/Fort Worth Airport Marriott',
  venueAddress: '8440 Freeport Parkway, Irving, Texas, USA, 75063',
  hotelBookingUrl:
    'https://app.marriott.com/reslink?id=1775501475543&key=GRP&app=resvlink',
} as const;

/** Hero background rotation — Cloudinary (q_auto / f_auto). */
export const HERO_CLOUDINARY_SLIDES = [
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777728541/20250220_221435_szxzfr.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777728539/20250710_090859_b81076.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777728538/20250219_195034_httr3s.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777728539/20250220_221437_et7xj9.jpg',
] as const;

/** Full-bleed pinned hero on /founder (Cloudinary). */
export const FOUNDER_HERO_CLOUDINARY =
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790097/205A6376_ucpyqt.jpg';

/** Shown on /founder when Admin “Founder carousel” list is empty (and no env override). */
export const FOUNDER_CAROUSEL_DEFAULTS: readonly string[] = [
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790070/MA_m27h6y.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790073/MA1_pgqf35.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790078/MA3_txk1xd.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790096/_MG_3358-2_hz4xxv.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790096/205A6045_irlj0v.jpg',
] as const;

export const HOME_COPY = {
  /** Hero headline — single line preferred for minimal hero */
  heroTitle: 'Welcome to Feast of Esther',
  accommodationLead:
    'Experience comfort and convenience at our official hotel for Feast of Esther 2026. Enjoy special rates for our attendees when booking through the official link.',
  accommodationBullets: [
    'Conference venue',
    'Special group rate',
    'Premium accommodations',
  ] as const,
  aboutLead:
    'Feast of Esther is an annual Feast organized by the wife of the General Overseer of the Redeemed Christian Church of God, Pastor (Mrs.) Folu Adeboye.',
  aboutBridge:
    'Feast of Esther North America is a branch of Feast of Esther Worldwide — a gathering for wives of General Overseers, Senior Pastors, Heads of Ministries, and Women Leaders: worship, fellowship, prayer, and renewal.',
  vision:
    'To develop excellent ministry skills in women who are called to support and impact the church of God for nation building and stand as pillars in the house of God to accomplish great things for the kingdom.',
  mission:
    'A forum where women in ministry learn to accomplish their calling, stand in the gap, and impact the church for revival in the nation.',
  joinBlurb:
    'Be part of this transformative experience that combines spiritual growth, fellowship, and empowerment.',
} as const;

export const EVENT_HIGHLIGHTS = [
  { title: 'Worship', desc: 'Praise and prayer together' },
  { title: 'Fellowship', desc: 'Connect across North America' },
  { title: 'Empowerment', desc: 'Teaching for women in ministry' },
] as const;
