'use client';

import { DragEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AboutPageContent,
  EventCategory,
  EventStatus,
  GalleryCollection,
  LeadershipProfile,
  PopupContent,
  PopupTextStyle,
  RegistrationRecord,
  SitePageContents,
  SocialLink,
  SiteCountdownSettings,
  SiteEvent,
  SiteImages,
} from '@/lib/cms-types';

const emptySitePageContents = (): SitePageContents => ({
  gallery: {},
  events: {},
  contact: {},
  donate: {},
  registration: {},
  founder: {},
  about2: {},
});

const emptyEvent: Omit<SiteEvent, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  category: 'upcoming',
  theme: '',
  scripture: '',
  description: '',
  dateLabel: '',
  venue: '',
  registrationUrl: '/registration',
  ctaLabel: 'Register Now',
  heroImageUrl: '',
  imageUrl: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778244638/Save_thedate_mkpbnu.jpg',
  gallerySlug: '',
  countdownTargetAt: '',
  status: 'published',
};

const emptyPopup: PopupContent = {
  enabled: true,
  title: '',
  scripture: '',
  body: '',
  bodyFooter: 'Seats are limited — secure your place today.',
  ctaLabel: 'Register Now',
  ctaUrl: '/registration',
  imageUrl: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778244638/Save_thedate_mkpbnu.jpg',
  rightKicker: 'Upcoming Event',
  leftEyebrow: 'Save the Date',
  leftSubtitle: '',
  leftFootline: 'North America',
  leftShowLogo: true,
};

const emptyCountdown: SiteCountdownSettings = {
  enabled: true,
  sourceEventId: null,
  fallbackTargetAt: '2026-06-18T14:00:00.000Z',
};

const emptyAbout: AboutPageContent = {
  heroEyebrow: 'ABOUT US',
  heroTitle: 'We are the Feast of Esther.',
  heroImageUrl: '',
  storyTitle: 'Our Story',
  storyParagraphs: [],
  missionEyebrow: 'Mission and Values',
  missionTitle: 'For such a time as this.',
  missionIntro: '',
  missionBody: '',
  leadershipEyebrow: 'Our Leadership',
  leadershipTitle: 'Leading with grace and conviction',
  leadershipProfiles: [],
};

const defaultSocialLinks: SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', enabled: true },
  { id: 'facebook', label: 'Facebook', url: 'https://facebook.com', enabled: true },
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com', enabled: true },
  { id: 'x', label: 'X (Twitter)', url: 'https://x.com', enabled: true },
  { id: 'youtube', label: 'YouTube', url: 'https://youtube.com', enabled: true },
  { id: 'tiktok', label: 'TikTok', url: 'https://tiktok.com', enabled: true },
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/18323720860', enabled: true },
];

function preventDragDefaults(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
}

function toDatetimeLocalValue(iso: string | undefined): string {
  if (!iso?.trim()) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function PopupTypoFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: PopupTextStyle;
  onChange: (next: PopupTextStyle) => void;
}) {
  const v = value ?? {};
  return (
    <details className="rounded-lg border border-[rgba(194,24,91,0.15)] bg-white/50 p-3">
      <summary className="cursor-pointer text-xs font-semibold text-[var(--primary-dark)]">{label}</summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="admin-field-label">Font size (rem)</label>
          <input
            type="number"
            step={0.05}
            min={0.5}
            max={4}
            className="admin-input"
            value={v.fontSizeRem ?? ''}
            onChange={(e) =>
              onChange({
                ...v,
                fontSizeRem: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="admin-field-label">Align</label>
          <select
            className="admin-select"
            value={v.align ?? ''}
            onChange={(e) => {
              const a = e.target.value as 'center' | 'left' | 'right' | '';
              onChange({ ...v, align: a === '' ? undefined : a });
            }}
          >
            <option value="">Default</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="flex flex-wrap items-end gap-4 pt-4 sm:col-span-2 lg:col-span-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--primary)]"
              checked={v.bold === true}
              onChange={(e) => onChange({ ...v, bold: e.target.checked ? true : undefined })}
            />
            Bold
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--primary)]"
              checked={v.italic === true}
              onChange={(e) => onChange({ ...v, italic: e.target.checked ? true : undefined })}
            />
            Italic
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--primary)]"
              checked={v.useDisplayFont === true}
              onChange={(e) =>
                onChange({ ...v, useDisplayFont: e.target.checked ? true : undefined })
              }
            />
            Serif (display) font
          </label>
        </div>
      </div>
    </details>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<
    'events' | 'countdown' | 'popup' | 'images' | 'social' | 'about' | 'pages' | 'registrations'
  >('events');
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [eventFilter, setEventFilter] = useState<'all' | EventStatus>('all');
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupContent>(emptyPopup);
  const [countdown, setCountdown] = useState<SiteCountdownSettings>(emptyCountdown);
  const [countdownFallbackLocal, setCountdownFallbackLocal] = useState('');
  const [images, setImages] = useState<SiteImages>({});
  const [galleryCollectionsRaw, setGalleryCollectionsRaw] = useState('[]');
  const [about, setAbout] = useState<AboutPageContent>(emptyAbout);
  const [aboutStoryRaw, setAboutStoryRaw] = useState('[]');
  const [aboutLeadersRaw, setAboutLeadersRaw] = useState('[]');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);
  const [pageContent, setPageContent] = useState<SitePageContents>(emptySitePageContents);
  const [pageEditSection, setPageEditSection] = useState<keyof SitePageContents>('gallery');
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [regTotal, setRegTotal] = useState(0);
  const [regPage, setRegPage] = useState(1);
  const [regTotalPages, setRegTotalPages] = useState(1);
  const [regSearch, setRegSearch] = useState('');
  const [regSearchInput, setRegSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadEvents = useCallback(async () => {
    const q = eventFilter === 'all' ? '' : `?status=${eventFilter}`;
    const eventsRes = await fetch(`/api/admin/events${q}`);
    if (eventsRes.status === 401) {
      router.push('/admin/login');
      return;
    }
    const eventsData = await eventsRes.json();
    setEvents(eventsData.events ?? []);
  }, [eventFilter, router]);

  const loadCore = useCallback(async () => {
    const [popupRes, imagesRes, countdownRes, aboutRes, socialRes, pagesRes] = await Promise.all([
      fetch('/api/admin/popup'),
      fetch('/api/admin/images'),
      fetch('/api/admin/countdown'),
      fetch('/api/admin/about'),
      fetch('/api/admin/social'),
      fetch('/api/admin/page-content'),
    ]);
    if ([popupRes, imagesRes, countdownRes, aboutRes, socialRes, pagesRes].some((res) => res.status === 401)) {
      router.push('/admin/login');
      return;
    }
    const [popupData, imagesData, countdownData, aboutData, socialData, pagesData] = await Promise.all([
      popupRes.json(),
      imagesRes.json(),
      countdownRes.json(),
      aboutRes.json(),
      socialRes.json(),
      pagesRes.json(),
    ]);
    setPopup({ ...emptyPopup, ...(popupData.popup ?? {}) });
    setImages(imagesData.images ?? {});
    setGalleryCollectionsRaw(JSON.stringify(imagesData.images?.galleryCollections ?? [], null, 2));
    const cd = countdownData.countdown ?? emptyCountdown;
    setCountdown({ ...emptyCountdown, ...cd });
    setCountdownFallbackLocal(toDatetimeLocalValue(cd.fallbackTargetAt));
    const aboutNext = { ...emptyAbout, ...(aboutData.about ?? {}) };
    setAbout(aboutNext);
    setAboutStoryRaw(JSON.stringify(aboutNext.storyParagraphs ?? [], null, 2));
    setAboutLeadersRaw(JSON.stringify(aboutNext.leadershipProfiles ?? [], null, 2));
    setSocialLinks(
      Array.isArray(socialData.socialLinks) && socialData.socialLinks.length > 0
        ? socialData.socialLinks
        : defaultSocialLinks
    );
    setPageContent({
      ...emptySitePageContents(),
      ...(pagesData.pageContent as SitePageContents | undefined),
      gallery: { ...emptySitePageContents().gallery, ...(pagesData.pageContent?.gallery ?? {}) },
      events: { ...emptySitePageContents().events, ...(pagesData.pageContent?.events ?? {}) },
      contact: { ...emptySitePageContents().contact, ...(pagesData.pageContent?.contact ?? {}) },
      donate: { ...emptySitePageContents().donate, ...(pagesData.pageContent?.donate ?? {}) },
      registration: {
        ...emptySitePageContents().registration,
        ...(pagesData.pageContent?.registration ?? {}),
      },
      founder: { ...emptySitePageContents().founder, ...(pagesData.pageContent?.founder ?? {}) },
      about2: { ...emptySitePageContents().about2, ...(pagesData.pageContent?.about2 ?? {}) },
    });
  }, [router]);

  const loadRegistrations = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(regPage),
      pageSize: '12',
    });
    if (regSearch.trim()) params.set('search', regSearch.trim());
    const res = await fetch(`/api/admin/registrations?${params.toString()}`);
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    const data = await res.json();
    setRegistrations(data.registrations ?? []);
    setRegTotal(data.total ?? 0);
    setRegTotalPages(data.totalPages ?? 1);
  }, [regPage, regSearch, router]);

  useEffect(() => {
    async function boot() {
      setLoading(true);
      await Promise.all([loadEvents(), loadCore()]);
      setLoading(false);
    }
    boot();
  }, [loadEvents, loadCore]);

  useEffect(() => {
    if (tab !== 'registrations') return;
    loadRegistrations();
  }, [tab, loadRegistrations]);

  async function addEvent(event: FormEvent) {
    event.preventDefault();
    setMessage('');

    const response = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...eventForm,
        id: editingEventId ?? undefined,
        countdownTargetAt: eventForm.countdownTargetAt?.trim()
          ? new Date(eventForm.countdownTargetAt).toISOString()
          : null,
      }),
    });

    if (!response.ok) {
      setMessage('Could not save event.');
      return;
    }

    const data = await response.json();
    setEvents((prev) => [data.event, ...prev.filter((item) => item.id !== data.event.id)]);
    setEventForm(emptyEvent);
    setEditingEventId(null);
    setMessage(editingEventId ? 'Event updated.' : 'Event created.');
    await loadEvents();
  }

  function startEditEvent(ev: SiteEvent) {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      category: ev.category === 'past' ? 'past' : 'upcoming',
      theme: ev.theme ?? '',
      scripture: ev.scripture ?? '',
      description: ev.description,
      dateLabel: ev.dateLabel,
      venue: ev.venue,
      registrationUrl: ev.registrationUrl,
      ctaLabel: ev.ctaLabel ?? 'Register Now',
      heroImageUrl: ev.heroImageUrl ?? '',
      imageUrl: ev.imageUrl ?? '',
      gallerySlug: ev.gallerySlug ?? '',
      countdownTargetAt: toDatetimeLocalValue(ev.countdownTargetAt),
      status: ev.status === 'draft' ? 'draft' : 'published',
    });
  }

  function clearEventEditor() {
    setEditingEventId(null);
    setEventForm(emptyEvent);
  }

  async function deleteEvent(id: string) {
    const response = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
    if (!response.ok) return;
    setEvents((prev) => prev.filter((item) => item.id !== id));
    if (editingEventId === id) clearEventEditor();
    await loadEvents();
  }

  async function savePopup() {
    const response = await fetch('/api/admin/popup', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(popup),
    });
    if (response.ok) setMessage('Popup updated.');
  }

  async function saveCountdown() {
    const fallbackIso = countdownFallbackLocal.trim()
      ? new Date(countdownFallbackLocal).toISOString()
      : countdown.fallbackTargetAt;
    const response = await fetch('/api/admin/countdown', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...countdown,
        fallbackTargetAt: fallbackIso,
      }),
    });
    if (!response.ok) {
      setMessage('Could not save countdown.');
      return;
    }
    const data = await response.json();
    setCountdown({ ...emptyCountdown, ...data.countdown });
    setMessage(
      data.resolved?.targetAt
        ? `Countdown saved · target ${new Date(data.resolved.targetAt).toLocaleString()}`
        : 'Countdown saved (off or no target).'
    );
  }

  async function saveImages() {
    try {
      JSON.parse(galleryCollectionsRaw);
    } catch {
      setMessage('Gallery JSON is invalid. Please fix it before saving.');
      return;
    }
    const response = await fetch('/api/admin/images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(images),
    });
    if (response.ok) setMessage('Images updated.');
  }

  async function saveAbout() {
    let parsedStory: string[] = [];
    let parsedLeaders: LeadershipProfile[] = [];
    try {
      const story = JSON.parse(aboutStoryRaw) as unknown;
      if (!Array.isArray(story) || story.some((item) => typeof item !== 'string')) {
        throw new Error('story');
      }
      parsedStory = story.map((item) => item.trim()).filter(Boolean);
    } catch {
      setMessage('About story JSON must be an array of strings.');
      return;
    }
    try {
      const leaders = JSON.parse(aboutLeadersRaw) as unknown;
      if (!Array.isArray(leaders)) throw new Error('leaders');
      parsedLeaders = leaders.map((item) => {
        const row = item as Partial<LeadershipProfile>;
        return {
          name: String(row.name ?? '').trim(),
          role: String(row.role ?? '').trim(),
          imageUrl: String(row.imageUrl ?? '').trim(),
          blurb: String(row.blurb ?? '').trim(),
        };
      });
    } catch {
      setMessage('Leadership JSON is invalid. Use an array of profile objects.');
      return;
    }

    const payload: AboutPageContent = {
      ...about,
      storyParagraphs: parsedStory,
      leadershipProfiles: parsedLeaders,
    };
    const response = await fetch('/api/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      setMessage('Could not save About page content.');
      return;
    }
    const data = await response.json();
    const aboutNext = { ...emptyAbout, ...(data.about ?? payload) };
    setAbout(aboutNext);
    setAboutStoryRaw(JSON.stringify(aboutNext.storyParagraphs ?? [], null, 2));
    setAboutLeadersRaw(JSON.stringify(aboutNext.leadershipProfiles ?? [], null, 2));
    setMessage('About page content updated.');
  }

  async function savePageContent() {
    const response = await fetch('/api/admin/page-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageContent }),
    });
    if (!response.ok) {
      setMessage('Could not save site page copy.');
      return;
    }
    const data = await response.json();
    const next = data.pageContent as SitePageContents;
    setPageContent({
      ...emptySitePageContents(),
      ...next,
      gallery: { ...emptySitePageContents().gallery, ...next.gallery },
      events: { ...emptySitePageContents().events, ...next.events },
      contact: { ...emptySitePageContents().contact, ...next.contact },
      donate: { ...emptySitePageContents().donate, ...next.donate },
      registration: { ...emptySitePageContents().registration, ...next.registration },
      founder: { ...emptySitePageContents().founder, ...next.founder },
      about2: { ...emptySitePageContents().about2, ...next.about2 },
    });
    setMessage('Site page copy saved.');
  }

  async function saveSocialLinks() {
    const cleaned = socialLinks
      .map((item) => ({
        ...item,
        id: item.id.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
        label: item.label.trim(),
        url: item.url.trim(),
      }))
      .filter((item) => item.label && item.url);

    const response = await fetch('/api/admin/social', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ socialLinks: cleaned }),
    });
    if (!response.ok) {
      setMessage('Could not save social links.');
      return;
    }
    const data = await response.json();
    setSocialLinks(data.socialLinks ?? cleaned);
    setMessage('Social links updated.');
  }

  async function uploadImage(file: File, onUploaded: (url: string) => void) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      setMessage('Upload failed.');
      return;
    }
    const data = await response.json();
    onUploaded(data.url);
    setMessage('Image uploaded.');
  }

  function dropFile(
    e: DragEvent<HTMLDivElement>,
    onFile: (file: File) => void
  ) {
    preventDragDefaults(e);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) onFile(file);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  function applyRegSearch() {
    setRegPage(1);
    setRegSearch(regSearchInput);
  }

  if (loading) {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center">
        <p className="admin-title text-center">Preparing your studio…</p>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <header className="admin-hero">
          <div>
            <p className="eyebrow mb-2" style={{ color: 'var(--primary)' }}>
              Admin · Content Studio
            </p>
            <h1 className="admin-title">Feast of Esther</h1>
            <p className="admin-sub">
              Curate events, imagery, and the welcome popup — all in one calm, editorial workspace.
            </p>
          </div>
          <button type="button" onClick={logout} className="admin-btn-ghost shrink-0">
            Log out
          </button>
        </header>

        <nav className="admin-tabs" aria-label="Dashboard sections">
          {(['events', 'countdown', 'popup', 'images', 'social', 'about', 'pages', 'registrations'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`admin-tab ${tab === key ? 'admin-tab-active' : ''}`}
            >
              {key === 'events' && 'Events'}
              {key === 'countdown' && 'Countdown'}
              {key === 'popup' && 'Popup'}
              {key === 'images' && 'Imagery'}
              {key === 'social' && 'Social Links'}
              {key === 'about' && 'About Page'}
              {key === 'pages' && 'Site pages'}
              {key === 'registrations' && 'Registrations'}
            </button>
          ))}
        </nav>

        {message ? <div className="admin-toast">{message}</div> : null}

        {tab === 'events' ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <form onSubmit={addEvent} className="admin-card space-y-4">
              <h2>{editingEventId ? 'Edit event' : 'New event'}</h2>

              <div>
                <label className="admin-field-label">Title</label>
                <input
                  className="admin-input"
                  value={eventForm.title}
                  onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-field-label">Theme</label>
                  <input
                    className="admin-input"
                    value={eventForm.theme}
                    onChange={(e) => setEventForm((p) => ({ ...p, theme: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="admin-field-label">Scripture</label>
                  <input
                    className="admin-input"
                    value={eventForm.scripture}
                    onChange={(e) => setEventForm((p) => ({ ...p, scripture: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-field-label">Dates</label>
                  <input
                    className="admin-input"
                    value={eventForm.dateLabel}
                    onChange={(e) => setEventForm((p) => ({ ...p, dateLabel: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="admin-field-label">Category</label>
                  <select
                    className="admin-select"
                    value={eventForm.category}
                    onChange={(e) =>
                      setEventForm((p) => ({
                        ...p,
                        category: e.target.value as EventCategory,
                      }))
                    }
                  >
                    <option value="upcoming">Upcoming event</option>
                    <option value="past">Past event</option>
                  </select>
                </div>
                <div>
                  <label className="admin-field-label">Status</label>
                  <select
                    className="admin-select"
                    value={eventForm.status}
                    onChange={(e) =>
                      setEventForm((p) => ({
                        ...p,
                        status: e.target.value as EventStatus,
                      }))
                    }
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="admin-field-label">Venue</label>
                <input
                  className="admin-input"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm((p) => ({ ...p, venue: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="admin-field-label">Registration URL</label>
                <input
                  className="admin-input"
                  value={eventForm.registrationUrl}
                  onChange={(e) => setEventForm((p) => ({ ...p, registrationUrl: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-field-label">CTA Label</label>
                  <input
                    className="admin-input"
                    value={eventForm.ctaLabel ?? ''}
                    onChange={(e) => setEventForm((p) => ({ ...p, ctaLabel: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="admin-field-label">Past event gallery slug</label>
                  <input
                    className="admin-input"
                    placeholder="feast-2025-opening-night"
                    value={eventForm.gallerySlug ?? ''}
                    onChange={(e) => setEventForm((p) => ({ ...p, gallerySlug: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="admin-field-label">Countdown target (optional)</label>
                <input
                  type="datetime-local"
                  className="admin-input"
                  value={eventForm.countdownTargetAt ?? ''}
                  onChange={(e) =>
                    setEventForm((p) => ({ ...p, countdownTargetAt: e.target.value }))
                  }
                />
                <p className="mt-1 text-xs text-black/50">
                  Exact moment the homepage flip clock counts down to when this event is chosen under
                  Countdown. Clear the field to remove.
                </p>
              </div>
              <div>
                <label className="admin-field-label">Flyer / info image</label>
                <input
                  className="admin-input mb-2"
                  placeholder="Image URL"
                  value={eventForm.imageUrl}
                  onChange={(e) => setEventForm((p) => ({ ...p, imageUrl: e.target.value }))}
                />
                <div
                  className="admin-drop"
                  onDragOver={preventDragDefaults}
                  onDrop={(e) =>
                    dropFile(e, (file) => uploadImage(file, (url) => setEventForm((p) => ({ ...p, imageUrl: url }))))
                  }
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--blush)] file:px-3 file:py-2 file:text-[0.65rem] file:font-semibold file:uppercase file:tracking-wide"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file, (url) => setEventForm((p) => ({ ...p, imageUrl: url })));
                    }}
                  />
                  <p className="mt-2 text-xs opacity-80">Or drop an image file here</p>
                </div>
              </div>
              <div>
                <label className="admin-field-label">Events page hero image</label>
                <input
                  className="admin-input"
                  placeholder="Large top banner image URL"
                  value={eventForm.heroImageUrl ?? ''}
                  onChange={(e) => setEventForm((p) => ({ ...p, heroImageUrl: e.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label">Description</label>
                <textarea
                  className="admin-textarea"
                  value={eventForm.description}
                  onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))}
                  required
                />
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <button type="submit" className="btn-primary rounded-full px-8">
                  {editingEventId ? 'Update event' : 'Save event'}
                </button>
                {editingEventId ? (
                  <button type="button" onClick={clearEventEditor} className="admin-btn-ghost">
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="admin-card">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="!mb-0">Your events</h2>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'published', 'draft'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setEventFilter(f)}
                      className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide transition ${
                        eventFilter === f
                          ? 'border-transparent bg-white/90 text-[var(--primary-dark)] shadow-sm'
                          : 'border-white/40 bg-white/30 text-[var(--primary-dark)]/80 hover:bg-white/50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-xl border border-[rgba(194,24,91,0.15)] bg-white/70 p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[var(--primary-dark)]">{ev.title}</p>
                        <p className="text-sm text-black/55">
                          {ev.dateLabel} · {ev.venue}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-black/45">
                          {ev.category === 'past' ? 'Past event' : 'Upcoming event'}
                          {ev.category === 'past' && ev.gallerySlug ? ` · /gallery/${ev.gallerySlug}` : ''}
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide ${
                            ev.status === 'draft'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditEvent(ev)}
                          className="rounded-full border border-[var(--primary)]/30 px-3 py-1 text-xs font-semibold text-[var(--primary-dark)] hover:bg-[var(--blush)]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEvent(ev.id)}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {!events.length ? (
                  <p className="text-sm text-black/50">No events match this filter yet.</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {tab === 'countdown' ? (
          <div className="admin-card max-w-3xl space-y-5">
            <h2>Homepage flip countdown</h2>
            <p className="text-sm text-black/55">
              Switch the timer off when there is nothing to promote. When a new season opens, pick the
              published event that should own the countdown and set its target datetime on the Events
              tab. If that event has no target, the fallback below is used.
            </p>
            <label className="mb-2 flex cursor-pointer items-center gap-3 rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/60 px-4 py-3">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
                checked={countdown.enabled}
                onChange={(e) => setCountdown((p) => ({ ...p, enabled: e.target.checked }))}
              />
              <span className="text-sm font-medium text-[var(--primary-dark)]">
                Show countdown on the home page
              </span>
            </label>
            <div>
              <label className="admin-field-label">Countdown source event</label>
              <select
                className="admin-select"
                value={countdown.sourceEventId ?? ''}
                onChange={(e) =>
                  setCountdown((p) => ({
                    ...p,
                    sourceEventId: e.target.value === '' ? null : e.target.value,
                  }))
                }
              >
                <option value="">None — use fallback only</option>
                {events
                  .filter((ev) => ev.status === 'published')
                  .map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.dateLabel})
                      {!ev.countdownTargetAt ? ' — no target' : ''}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="admin-field-label">Fallback date &amp; time</label>
              <input
                type="datetime-local"
                className="admin-input"
                value={countdownFallbackLocal}
                onChange={(e) => setCountdownFallbackLocal(e.target.value)}
              />
              <p className="mt-1 text-xs text-black/50">
                Your browser&apos;s local timezone is stored as UTC. Used when no event is selected or
                the event has no countdown target.
              </p>
            </div>
            <button type="button" onClick={saveCountdown} className="btn-primary rounded-full px-10">
              Save countdown
            </button>
          </div>
        ) : null}

        {tab === 'popup' ? (
          <div className="admin-card max-w-3xl">
            <h2>Welcome popup</h2>
            <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/60 px-4 py-3">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
                checked={popup.enabled}
                onChange={(e) => setPopup((p) => ({ ...p, enabled: e.target.checked }))}
              />
              <span className="text-sm font-medium text-[var(--primary-dark)]">Show popup on the home page</span>
            </label>
            <div className="space-y-4">
              <div>
                <label className="admin-field-label">Headline</label>
                <input
                  className="admin-input"
                  value={popup.title}
                  onChange={(e) => setPopup((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label">Scripture line</label>
                <input
                  className="admin-input"
                  value={popup.scripture}
                  onChange={(e) => setPopup((p) => ({ ...p, scripture: e.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label">Body</label>
                <textarea
                  className="admin-textarea"
                  value={popup.body}
                  onChange={(e) => setPopup((p) => ({ ...p, body: e.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label">Body footer (small line under body)</label>
                <input
                  className="admin-input"
                  value={popup.bodyFooter ?? ''}
                  onChange={(e) => setPopup((p) => ({ ...p, bodyFooter: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-field-label">Right column eyebrow</label>
                  <input
                    className="admin-input"
                    value={popup.rightKicker ?? ''}
                    onChange={(e) => setPopup((p) => ({ ...p, rightKicker: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="admin-field-label">Left panel eyebrow</label>
                  <input
                    className="admin-input"
                    value={popup.leftEyebrow ?? ''}
                    onChange={(e) => setPopup((p) => ({ ...p, leftEyebrow: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-field-label">Left subtitle (under title, optional)</label>
                  <input
                    className="admin-input"
                    value={popup.leftSubtitle ?? ''}
                    onChange={(e) => setPopup((p) => ({ ...p, leftSubtitle: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="admin-field-label">Left footline (e.g. region)</label>
                  <input
                    className="admin-input"
                    value={popup.leftFootline ?? ''}
                    onChange={(e) => setPopup((p) => ({ ...p, leftFootline: e.target.value }))}
                  />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/60 px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--primary)]"
                  checked={popup.leftShowLogo !== false}
                  onChange={(e) => setPopup((p) => ({ ...p, leftShowLogo: e.target.checked }))}
                />
                <span className="text-sm font-medium text-[var(--primary-dark)]">
                  Show FOE circle on left artwork
                </span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-field-label">Button label</label>
                  <input
                    className="admin-input"
                    value={popup.ctaLabel}
                    onChange={(e) => setPopup((p) => ({ ...p, ctaLabel: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="admin-field-label">Button link</label>
                  <input
                    className="admin-input"
                    value={popup.ctaUrl}
                    onChange={(e) => setPopup((p) => ({ ...p, ctaUrl: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="admin-field-label">Artwork</label>
                <input
                  className="admin-input mb-2"
                  value={popup.imageUrl}
                  onChange={(e) => setPopup((p) => ({ ...p, imageUrl: e.target.value }))}
                />
                <div
                  className="admin-drop"
                  onDragOver={preventDragDefaults}
                  onDrop={(e) =>
                    dropFile(e, (file) => uploadImage(file, (url) => setPopup((p) => ({ ...p, imageUrl: url }))))
                  }
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--blush)] file:px-3 file:py-2 file:text-[0.65rem] file:font-semibold file:uppercase"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file, (url) => setPopup((p) => ({ ...p, imageUrl: url })));
                    }}
                  />
                  <p className="mt-2 text-xs opacity-80">Drop a polished flyer or portrait here</p>
                </div>
              </div>
              <div className="space-y-3 border-t border-[rgba(194,24,91,0.12)] pt-6">
                <p className="text-sm font-semibold text-[var(--primary-dark)]">Typography — left panel</p>
                <PopupTypoFields
                  label="Left eyebrow"
                  value={popup.leftEyebrowStyle}
                  onChange={(next) => setPopup((p) => ({ ...p, leftEyebrowStyle: next }))}
                />
                <PopupTypoFields
                  label="Left title (same text as headline)"
                  value={popup.leftTitleStyle}
                  onChange={(next) => setPopup((p) => ({ ...p, leftTitleStyle: next }))}
                />
                <PopupTypoFields
                  label="Left scripture / date line"
                  value={popup.leftScriptureStyle}
                  onChange={(next) => setPopup((p) => ({ ...p, leftScriptureStyle: next }))}
                />
                <PopupTypoFields
                  label="Left footline"
                  value={popup.leftFootlineStyle}
                  onChange={(next) => setPopup((p) => ({ ...p, leftFootlineStyle: next }))}
                />
              </div>
              <div className="space-y-3 border-t border-[rgba(194,24,91,0.12)] pt-6">
                <p className="text-sm font-semibold text-[var(--primary-dark)]">Typography — right panel</p>
                <PopupTypoFields
                  label="Right eyebrow"
                  value={popup.rightKickerStyle}
                  onChange={(next) => setPopup((p) => ({ ...p, rightKickerStyle: next }))}
                />
                <PopupTypoFields
                  label="Right title"
                  value={popup.rightTitleStyle}
                  onChange={(next) => setPopup((p) => ({ ...p, rightTitleStyle: next }))}
                />
                <PopupTypoFields
                  label="Right scripture line"
                  value={popup.rightScriptureStyle}
                  onChange={(next) => setPopup((p) => ({ ...p, rightScriptureStyle: next }))}
                />
                <PopupTypoFields
                  label="Right body"
                  value={popup.rightBodyStyle}
                  onChange={(next) => setPopup((p) => ({ ...p, rightBodyStyle: next }))}
                />
                <PopupTypoFields
                  label="Right footer"
                  value={popup.rightFooterStyle}
                  onChange={(next) => setPopup((p) => ({ ...p, rightFooterStyle: next }))}
                />
              </div>
            </div>
            <button type="button" onClick={savePopup} className="btn-primary mt-6 rounded-full px-10">
              Save popup
            </button>
          </div>
        ) : null}

        {tab === 'images' ? (
          <div className="admin-card max-w-3xl space-y-6">
            <h2>Site imagery</h2>
            <p className="text-sm text-black/55">
              These power the hero poster, homepage accommodation photo, founder portrait, and the default popup visual.
              Paste a URL or upload — your choice.
            </p>
            {(
              [
                { key: 'heroPosterUrl' as const, label: 'Hero poster (first slide / overrides first Cloudinary slide)' },
                { key: 'hotelRoomUrl' as const, label: 'Homepage — Official accommodation (hotel room)' },
                { key: 'founderImageUrl' as const, label: 'Founder column image' },
                { key: 'popupImageUrl' as const, label: 'Popup fallback image' },
              ] as const
            ).map(({ key, label }) => (
              <div key={key} className="rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-4">
                <label className="admin-field-label">{label}</label>
                <input
                  className="admin-input mb-2"
                  value={images[key] ?? ''}
                  onChange={(e) => setImages((p) => ({ ...p, [key]: e.target.value }))}
                />
                <div
                  className="admin-drop"
                  onDragOver={preventDragDefaults}
                  onDrop={(e) =>
                    dropFile(e, (file) =>
                      uploadImage(file, (url) => setImages((p) => ({ ...p, [key]: url })))
                    )
                  }
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--blush)] file:px-3 file:py-2 file:text-[0.65rem] file:font-semibold file:uppercase"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file, (url) => setImages((p) => ({ ...p, [key]: url })));
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-4">
              <label className="admin-field-label">Homepage — YouTube embed URL</label>
              <p className="mb-2 text-xs text-black/50">
                Paste either an embed link (recommended) or a normal YouTube watch link. This controls the video spotlight on `/`.
              </p>
              <input
                className="admin-input"
                placeholder="https://www.youtube.com/embed/..."
                value={images.homeVideoEmbedUrl ?? ''}
                onChange={(e) => setImages((p) => ({ ...p, homeVideoEmbedUrl: e.target.value }))}
              />
            </div>
            <div className="rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-4">
              <label className="admin-field-label">Founder page — carousel (one URL per line)</label>
              <p className="mb-2 text-xs text-black/50">
                Auto-advances on /founder. Leave empty to use the default Cloudinary images from the site. Paste new
                Cloudinary links here when ready.
              </p>
              <textarea
                rows={6}
                className="admin-input font-mono text-[0.7rem] leading-relaxed"
                placeholder="https://res.cloudinary.com/..."
                value={(images.founderCarouselUrls ?? []).join('\n')}
                onChange={(e) => {
                  const lines = e.target.value
                    .split(/\r?\n/)
                    .map((s) => s.trim())
                    .filter(Boolean);
                  setImages((p) => ({ ...p, founderCarouselUrls: lines }));
                }}
              />
            </div>
            <div className="rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-4">
              <label className="admin-field-label">Gallery collections JSON (editable folders/events)</label>
              <p className="mb-2 text-xs text-black/50">
                Each collection becomes one event folder on `/gallery`. Hovering any image shows that collection&apos;s
                description, and clicking opens its event page with all photos.
              </p>
              <textarea
                rows={14}
                className="admin-input font-mono text-[0.7rem] leading-relaxed"
                value={galleryCollectionsRaw}
                onChange={(e) => {
                  const nextRaw = e.target.value;
                  setGalleryCollectionsRaw(nextRaw);
                  try {
                    const parsed = JSON.parse(nextRaw) as GalleryCollection[];
                    if (!Array.isArray(parsed)) throw new Error('Must be an array.');
                    const sanitized = parsed.map((item) => ({
                      slug: String(item.slug ?? '').trim(),
                      title: String(item.title ?? '').trim(),
                      year: String(item.year ?? '').trim(),
                      description: String(item.description ?? '').trim(),
                      imageUrls: Array.isArray(item.imageUrls)
                        ? item.imageUrls.map((url) => String(url).trim()).filter(Boolean)
                        : [],
                    }));
                    setImages((p) => ({ ...p, galleryCollections: sanitized }));
                    setMessage('');
                  } catch {
                    // Keep typing fluid while showing parse guidance.
                    setMessage('Invalid gallery JSON. Fix format before saving.');
                  }
                }}
                placeholder={`[
  {
    "slug": "feast-2025-opening-night",
    "title": "Opening Night Worship",
    "year": "2025",
    "description": "Highlights from the opening service.",
    "imageUrls": [
      "https://res.cloudinary.com/...",
      "https://res.cloudinary.com/..."
    ]
  }
]`}
              />
            </div>
            <button type="button" onClick={saveImages} className="btn-primary rounded-full px-10">
              Save imagery
            </button>
          </div>
        ) : null}

        {tab === 'social' ? (
          <div className="admin-card max-w-4xl space-y-6">
            <h2>Footer social links</h2>
            <p className="text-sm text-black/55">
              Manage the links shown in the bottom footer. Add, remove, reorder, or disable any platform.
            </p>
            <div className="space-y-3">
              {socialLinks.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="grid gap-3 rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-4 md:grid-cols-[1fr_1.4fr_auto_auto]"
                >
                  <input
                    className="admin-input"
                    placeholder="Label (e.g. Instagram)"
                    value={item.label}
                    onChange={(e) =>
                      setSocialLinks((prev) =>
                        prev.map((row, i) => (i === index ? { ...row, label: e.target.value } : row))
                      )
                    }
                  />
                  <input
                    className="admin-input"
                    placeholder="https://..."
                    value={item.url}
                    onChange={(e) =>
                      setSocialLinks((prev) =>
                        prev.map((row, i) => (i === index ? { ...row, url: e.target.value } : row))
                      )
                    }
                  />
                  <label className="flex cursor-pointer items-center gap-2 px-1 text-sm font-medium text-[var(--primary-dark)]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--primary)]"
                      checked={item.enabled}
                      onChange={(e) =>
                        setSocialLinks((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, enabled: e.target.checked } : row))
                        )
                      }
                    />
                    Enabled
                  </label>
                  <button
                    type="button"
                    className="admin-btn-ghost"
                    onClick={() => setSocialLinks((prev) => prev.filter((_, i) => i !== index))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="admin-btn-ghost"
                onClick={() =>
                  setSocialLinks((prev) => [
                    ...prev,
                    {
                      id: `social-${prev.length + 1}`,
                      label: 'New platform',
                      url: '',
                      enabled: true,
                    },
                  ])
                }
              >
                Add social platform
              </button>
              <button type="button" onClick={saveSocialLinks} className="btn-primary rounded-full px-10">
                Save social links
              </button>
            </div>
          </div>
        ) : null}

        {tab === 'about' ? (
          <div className="admin-card max-w-4xl space-y-6">
            <h2>About page content</h2>
            <p className="text-sm text-black/55">
              Control the merged About + Leadership page: hero text/image, story, mission, and leadership profiles.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="admin-field-label">Hero eyebrow</label>
                <input
                  className="admin-input"
                  value={about.heroEyebrow}
                  onChange={(e) => setAbout((p) => ({ ...p, heroEyebrow: e.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label">Hero title</label>
                <input
                  className="admin-input"
                  value={about.heroTitle}
                  onChange={(e) => setAbout((p) => ({ ...p, heroTitle: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="admin-field-label">Hero image URL</label>
              <input
                className="admin-input mb-2"
                value={about.heroImageUrl}
                onChange={(e) => setAbout((p) => ({ ...p, heroImageUrl: e.target.value }))}
              />
              <div
                className="admin-drop"
                onDragOver={preventDragDefaults}
                onDrop={(e) =>
                  dropFile(e, (file) =>
                    uploadImage(file, (url) => setAbout((p) => ({ ...p, heroImageUrl: url })))
                  )
                }
              >
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--blush)] file:px-3 file:py-2 file:text-[0.65rem] file:font-semibold file:uppercase"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file, (url) => setAbout((p) => ({ ...p, heroImageUrl: url })));
                  }}
                />
              </div>
            </div>
            <div>
              <label className="admin-field-label">Story title</label>
              <input
                className="admin-input"
                value={about.storyTitle}
                onChange={(e) => setAbout((p) => ({ ...p, storyTitle: e.target.value }))}
              />
            </div>
            <div>
              <label className="admin-field-label">Story paragraphs JSON (array of strings)</label>
              <textarea
                rows={8}
                className="admin-input font-mono text-[0.72rem] leading-relaxed"
                value={aboutStoryRaw}
                onChange={(e) => setAboutStoryRaw(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="admin-field-label">Mission eyebrow</label>
                <input
                  className="admin-input"
                  value={about.missionEyebrow}
                  onChange={(e) => setAbout((p) => ({ ...p, missionEyebrow: e.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label">Mission title</label>
                <input
                  className="admin-input"
                  value={about.missionTitle}
                  onChange={(e) => setAbout((p) => ({ ...p, missionTitle: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="admin-field-label">Mission intro</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={about.missionIntro}
                onChange={(e) => setAbout((p) => ({ ...p, missionIntro: e.target.value }))}
              />
            </div>
            <div>
              <label className="admin-field-label">Mission body</label>
              <textarea
                rows={4}
                className="admin-textarea"
                value={about.missionBody}
                onChange={(e) => setAbout((p) => ({ ...p, missionBody: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="admin-field-label">Leadership eyebrow</label>
                <input
                  className="admin-input"
                  value={about.leadershipEyebrow}
                  onChange={(e) => setAbout((p) => ({ ...p, leadershipEyebrow: e.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label">Leadership title</label>
                <input
                  className="admin-input"
                  value={about.leadershipTitle}
                  onChange={(e) => setAbout((p) => ({ ...p, leadershipTitle: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="admin-field-label">
                Leadership profiles JSON (array: name, role, imageUrl, blurb)
              </label>
              <textarea
                rows={12}
                className="admin-input font-mono text-[0.72rem] leading-relaxed"
                value={aboutLeadersRaw}
                onChange={(e) => setAboutLeadersRaw(e.target.value)}
              />
            </div>
            <button type="button" onClick={saveAbout} className="btn-primary rounded-full px-10">
              Save About page
            </button>
          </div>
        ) : null}

        {tab === 'pages' ? (
          <div className="space-y-6">
            <div className="admin-card space-y-3">
              <h2>Site pages</h2>
              <p className="text-sm text-black/55">
                Update headlines and supporting text visitors see on Gallery, Events, Contact, Donate, Register, Founder,
                and About Us. Images for collections and carousels still live under <strong>Imagery</strong>; paste image
                URLs here for the founder hero.
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['gallery', 'Gallery'],
                    ['events', 'Events'],
                    ['contact', 'Contact'],
                    ['donate', 'Donate'],
                    ['registration', 'Register'],
                    ['founder', 'Founder'],
                    ['about2', 'About Us'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPageEditSection(id)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      pageEditSection === id
                        ? 'border-[var(--primary)] bg-[rgba(252,228,236,0.85)] text-[var(--primary-dark)]'
                        : 'border-black/10 bg-white/70 text-black/55 hover:border-[var(--primary)]/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {pageEditSection === 'gallery' ? (
              <div className="admin-card grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="admin-field-label">Gallery page title</label>
                  <input
                    className="admin-input"
                    value={pageContent.gallery.pageTitle ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, gallery: { ...p.gallery, pageTitle: e.target.value } }))
                    }
                    placeholder="Moments From the Feast"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="admin-field-label">Gallery subtitle</label>
                  <textarea
                    className="admin-input min-h-[88px]"
                    value={pageContent.gallery.pageSubtitle ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, gallery: { ...p.gallery, pageSubtitle: e.target.value } }))
                    }
                  />
                </div>
              </div>
            ) : null}

            {pageEditSection === 'events' ? (
              <div className="admin-card grid gap-4 md:grid-cols-2">
                {(
                  [
                    ['hotelSectionTitle', 'Hotel section title'],
                    ['hotelSectionSubtitle', 'Hotel section subtitle'],
                    ['hotelName', 'Hotel name'],
                    ['hotelBody', 'Hotel body'],
                    ['bookStayUrl', 'Book stay URL'],
                    ['pastEventsTitle', 'Past events title'],
                    ['pastEventsSubtitle', 'Past events subtitle'],
                    ['audienceLine', 'Audience line (icon row)'],
                    ['heroRegisterCta', 'Hero register button text'],
                  ] as const
                ).map(([key, lab]) => (
                  <div key={key} className={key === 'hotelBody' || key === 'bookStayUrl' ? 'md:col-span-2' : ''}>
                    <label className="admin-field-label">{lab}</label>
                    {key === 'hotelBody' ? (
                      <textarea
                        className="admin-input min-h-[80px]"
                        value={String(pageContent.events[key] ?? '')}
                        onChange={(e) =>
                          setPageContent((p) => ({
                            ...p,
                            events: { ...p.events, [key]: e.target.value },
                          }))
                        }
                      />
                    ) : (
                      <input
                        className="admin-input"
                        value={String(pageContent.events[key] ?? '')}
                        onChange={(e) =>
                          setPageContent((p) => ({
                            ...p,
                            events: { ...p.events, [key]: e.target.value },
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            {pageEditSection === 'contact' ? (
              <div className="admin-card grid gap-4 md:grid-cols-2">
                <div>
                  <label className="admin-field-label">Form title</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.formTitle ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, formTitle: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Info column heading</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.infoHeading ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, infoHeading: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">About card title</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.aboutCardTitle ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, aboutCardTitle: e.target.value } }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="admin-field-label">About card text</label>
                  <textarea
                    className="admin-input min-h-[100px]"
                    value={pageContent.contact.aboutCardText ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, aboutCardText: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Address line 1</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.addressLine1 ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, addressLine1: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Address line 2</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.addressLine2 ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, addressLine2: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Phone 1 display</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.phone1Display ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, phone1Display: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Phone 1 link (tel:…)</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.phone1Href ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, phone1Href: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Phone 2 display (blank = hide)</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.phone2Display ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, phone2Display: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Phone 2 link (tel:…)</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.phone2Href ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, phone2Href: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Email</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.email ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, email: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Website URL</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.websiteUrl ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, websiteUrl: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Website label (optional)</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.websiteDisplay ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, websiteDisplay: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Map embed URL</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.mapEmbedUrl ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, mapEmbedUrl: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Follow label</label>
                  <input
                    className="admin-input"
                    value={pageContent.contact.followLabel ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, contact: { ...p.contact, followLabel: e.target.value } }))
                    }
                  />
                </div>
                <p className="md:col-span-2 text-xs text-black/50">
                  Instagram, TikTok, Facebook, and YouTube buttons use your <strong>Social Links</strong> tab when
                  those IDs are enabled.
                </p>
              </div>
            ) : null}

            {pageEditSection === 'donate' ? (
              <div className="admin-card grid gap-4 md:grid-cols-2">
                {(
                  [
                    ['asideTitle', 'Sidebar title'],
                    ['asideLead', 'Sidebar intro'],
                    ['quoteText', 'Quote (without curly quotes)'],
                    ['quoteCite', 'Quote cite'],
                    ['bullet1', 'Bullet 1'],
                    ['bullet2', 'Bullet 2'],
                    ['bullet3', 'Bullet 3'],
                    ['sectionChooseAmount', '“Choose amount” heading'],
                    ['sectionCustomAmount', 'Custom amount label'],
                    ['sectionMethod', 'Method heading'],
                    ['methodCard', 'Card / bank label'],
                    ['methodPaypal', 'PayPal label'],
                    ['sectionDetails', 'Details heading'],
                    ['hintOnline', 'Hint when online URL set'],
                    ['finePrint', 'Fine print (plain text; replaces default with contact link)'],
                    ['featureImpactTitle', 'Feature 1 title'],
                    ['featureImpactText', 'Feature 1 text'],
                    ['featureStewardshipTitle', 'Feature 2 title'],
                    ['featureStewardshipText', 'Feature 2 text'],
                    ['featureSecureTitle', 'Feature 3 title'],
                    ['featureSecureText', 'Feature 3 text'],
                  ] as const
                ).map(([key, lab]) => (
                  <div
                    key={key}
                    className={
                      key === 'asideLead' || key === 'hintOnline' || key === 'finePrint' ? 'md:col-span-2' : ''
                    }
                  >
                    <label className="admin-field-label">{lab}</label>
                    {key === 'asideLead' || key === 'hintOnline' || key === 'finePrint' ? (
                      <textarea
                        className="admin-input min-h-[72px]"
                        value={String(pageContent.donate[key] ?? '')}
                        onChange={(e) =>
                          setPageContent((p) => ({
                            ...p,
                            donate: { ...p.donate, [key]: e.target.value },
                          }))
                        }
                      />
                    ) : (
                      <input
                        className="admin-input"
                        value={String(pageContent.donate[key] ?? '')}
                        onChange={(e) =>
                          setPageContent((p) => ({
                            ...p,
                            donate: { ...p.donate, [key]: e.target.value },
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="admin-field-label">
                    Offline giving template (use {'{{amount}}'} and {'{{methodNote}}'})
                  </label>
                  <textarea
                    className="admin-input min-h-[100px] font-mono text-[0.75rem]"
                    value={pageContent.donate.hintOfflineTemplate ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({
                        ...p,
                        donate: { ...p.donate, hintOfflineTemplate: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            ) : null}

            {pageEditSection === 'registration' ? (
              <div className="admin-card grid gap-4 md:grid-cols-2">
                <div>
                  <label className="admin-field-label">Sidebar title</label>
                  <input
                    className="admin-input"
                    value={pageContent.registration.asideTitle ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({
                        ...p,
                        registration: { ...p.registration, asideTitle: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="admin-field-label">Sidebar intro</label>
                  <textarea
                    className="admin-input min-h-[88px]"
                    value={pageContent.registration.asideLead ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({
                        ...p,
                        registration: { ...p.registration, asideLead: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Success title</label>
                  <input
                    className="admin-input"
                    value={pageContent.registration.successTitle ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({
                        ...p,
                        registration: { ...p.registration, successTitle: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="admin-field-label">Success message (use {'{{firstName}}'})</label>
                  <textarea
                    className="admin-input min-h-[88px]"
                    value={pageContent.registration.successBody ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({
                        ...p,
                        registration: { ...p.registration, successBody: e.target.value },
                      }))
                    }
                  />
                </div>
                {(['step0Hint', 'step1Hint', 'step2Hint', 'step3Hint'] as const).map((key, i) => (
                  <div key={key} className="md:col-span-2">
                    <label className="admin-field-label">Step {i + 1} hint</label>
                    <textarea
                      className="admin-input min-h-[64px]"
                      value={String(pageContent.registration[key] ?? '')}
                      onChange={(e) =>
                        setPageContent((p) => ({
                          ...p,
                          registration: { ...p.registration, [key]: e.target.value },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {pageEditSection === 'founder' ? (
              <div className="admin-card grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="admin-field-label">Pinned hero image URL</label>
                  <input
                    className="admin-input"
                    value={pageContent.founder.heroBackgroundUrl ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({
                        ...p,
                        founder: { ...p.founder, heroBackgroundUrl: e.target.value },
                      }))
                    }
                  />
                  <div
                    className="mt-2 cursor-pointer rounded-lg border border-dashed border-black/15 bg-black/[0.02] px-3 py-6 text-center text-xs text-black/45"
                    onDragOver={preventDragDefaults}
                    onDrop={(e) =>
                      dropFile(e, (file) => void uploadImage(file, (url) => setPageContent((p) => ({ ...p, founder: { ...p.founder, heroBackgroundUrl: url } }))))
                    }
                  >
                    Drop an image here to upload and set the hero URL
                  </div>
                </div>
                {(['storyP1', 'storyP2', 'storyP3'] as const).map((key, i) => (
                  <div key={key} className="md:col-span-2">
                    <label className="admin-field-label">Biography paragraph {i + 1}</label>
                    <textarea
                      className="admin-input min-h-[120px]"
                      value={String(pageContent.founder[key] ?? '')}
                      onChange={(e) =>
                        setPageContent((p) => ({
                          ...p,
                          founder: { ...p.founder, [key]: e.target.value },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {pageEditSection === 'about2' ? (
              <div className="admin-card grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="admin-field-label">Top bar line</label>
                  <input
                    className="admin-input"
                    value={pageContent.about2.chromeTitle ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, about2: { ...p.about2, chromeTitle: e.target.value } }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="admin-field-label">Accent line after main title</label>
                  <textarea
                    className="admin-input min-h-[72px]"
                    value={pageContent.about2.megaAccent ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, about2: { ...p.about2, megaAccent: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Focus bullet 1</label>
                  <input
                    className="admin-input"
                    value={pageContent.about2.focusItem1 ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, about2: { ...p.about2, focusItem1: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Focus bullet 2</label>
                  <input
                    className="admin-input"
                    value={pageContent.about2.focusItem2 ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, about2: { ...p.about2, focusItem2: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="admin-field-label">Focus bullet 3</label>
                  <input
                    className="admin-input"
                    value={pageContent.about2.focusItem3 ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, about2: { ...p.about2, focusItem3: e.target.value } }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="admin-field-label">CTA bar sentence</label>
                  <textarea
                    className="admin-input min-h-[72px]"
                    value={pageContent.about2.ctaBarText ?? ''}
                    onChange={(e) =>
                      setPageContent((p) => ({ ...p, about2: { ...p.about2, ctaBarText: e.target.value } }))
                    }
                  />
                </div>
              </div>
            ) : null}

            <div className="admin-card flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-black/55">Saves all sections above in one file with your other CMS data.</p>
              <button type="button" onClick={() => void savePageContent()} className="btn-primary rounded-full px-10">
                Save site page copy
              </button>
            </div>
          </div>
        ) : null}

        {tab === 'registrations' ? (
          <div className="admin-card">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="!mb-1">Registrations</h2>
                <p className="text-sm text-black/55">
                  Showing {registrations.length} of {regTotal} · Page {regPage} of {regTotalPages}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-2">
                  <input
                    className="admin-input max-w-xs"
                    placeholder="Search name, email, church…"
                    value={regSearchInput}
                    onChange={(e) => setRegSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyRegSearch()}
                  />
                  <button type="button" onClick={applyRegSearch} className="btn-primary shrink-0 rounded-full px-5">
                    Search
                  </button>
                </div>
                <a
                  href="/api/admin/registrations/export"
                  className="admin-btn-ghost inline-flex items-center justify-center text-center"
                >
                  Download CSV
                </a>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[rgba(194,24,91,0.1)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/80 text-[0.65rem] font-semibold uppercase tracking-wide text-black/45">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Church</th>
                    <th className="px-4 py-3">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(194,24,91,0.08)] bg-white/60">
                  {registrations.map((item) => (
                    <tr key={item.id} className="hover:bg-[rgba(252,228,236,0.45)]">
                      <td className="px-4 py-3 font-medium text-[var(--primary-dark)]">{item.fullName}</td>
                      <td className="px-4 py-3 text-black/70">{item.email}</td>
                      <td className="px-4 py-3 text-black/60">{item.phone}</td>
                      <td className="px-4 py-3 text-black/60">{item.church}</td>
                      <td className="px-4 py-3 text-black/50 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {regTotalPages > 1 ? (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={regPage <= 1}
                  onClick={() => setRegPage((p) => Math.max(1, p - 1))}
                  className="admin-btn-ghost disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold uppercase tracking-wide text-black/45">
                  Page {regPage}
                </span>
                <button
                  type="button"
                  disabled={regPage >= regTotalPages}
                  onClick={() => setRegPage((p) => p + 1)}
                  className="admin-btn-ghost disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
