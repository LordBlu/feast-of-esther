import { SITE } from '@/lib/site-content';

export type HadassahQuickReply = {
  id: string;
  label: string;
  cannedId?: string;
  href?: string;
};

export type HadassahCanned = {
  content: string;
  quickReplies?: HadassahQuickReply[];
};

export const HADASSAH_INTRO =
  "Hi — I'm Hadassah, your Feast of Esther assistant. What would you like to do?";

export const HADASSAH_STARTER_REPLIES: HadassahQuickReply[] = [
  { id: 'contact', label: 'Contact Us', cannedId: 'contact' },
  { id: 'feast', label: 'Want to know about the Feast', cannedId: 'feast' },
];

export const HADASSAH_CANNED: Record<string, HadassahCanned> = {
  contact: {
    content:
      `Reach us anytime — email ${SITE.contactEmail} or call ${SITE.contactPhoneDisplay}. Our contact page has the full form and address.`,
    quickReplies: [
      { id: 'contact-page', label: 'Open contact page', href: '/contact' },
      { id: 'feast', label: 'Want to know about the Feast', cannedId: 'feast' },
    ],
  },
  feast: {
    content:
      'Feast of Esther 2026 is June 18–20 at the Dallas/Fort Worth Airport Marriott in Irving, Texas — a gathering of women in ministry across North America. Registration is open.',
    quickReplies: [
      { id: 'register', label: 'Register', href: '/registration' },
      { id: 'events', label: 'View events', href: '/events' },
      { id: 'contact', label: 'Contact Us', cannedId: 'contact' },
    ],
  },
  registration: {
    content:
      'Registration is $150 per person. Head to our registration page to sign up — we will follow up with event details.',
    quickReplies: [
      { id: 'register-go', label: 'Go to registration', href: '/registration' },
      { id: 'feast', label: 'About the Feast', cannedId: 'feast' },
    ],
  },
  events: {
    content:
      'Our Events page has the latest schedule, venue notes, and hospitality details for the 2026 gathering.',
    quickReplies: [
      { id: 'events-go', label: 'Open events', href: '/events' },
      { id: 'register', label: 'Register', href: '/registration' },
    ],
  },
};
