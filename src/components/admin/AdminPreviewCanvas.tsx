'use client';

import type { AdminPreviewDraft } from '@/lib/admin-preview-draft';
import { resolveGalleryItems } from '@/lib/gallery-data';
import styles from './AdminPreviewCanvas.module.css';

interface AdminPreviewCanvasProps {
  view: string;
  draft: AdminPreviewDraft | null;
}

function PreviewShell({
  title,
  path,
  children,
}: {
  title: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Draft preview</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.path}>{path}</p>
      </header>
      {children}
      <p className={styles.note}>Unsaved changes · not on the live site until you save</p>
    </div>
  );
}

export default function AdminPreviewCanvas({ view, draft }: AdminPreviewCanvasProps) {
  if (!draft) {
    return (
      <div className={styles.root}>
        <p className={styles.empty}>Start editing to see a draft preview here.</p>
      </div>
    );
  }

  if (view === '/about') {
    const a = draft.about;
    return (
      <PreviewShell title={a?.heroTitle || 'About'} path="/about">
        {a?.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.heroImageUrl} alt="" className={styles.hero} />
        ) : null}
        <p className={styles.kicker}>{a?.heroEyebrow}</p>
        <h2 className={styles.headline}>{a?.heroTitle}</h2>
        <h3 className={styles.subhead}>{a?.storyTitle}</h3>
        {(a?.storyParagraphs ?? []).slice(0, 2).map((p, i) => (
          <p key={i} className={styles.body}>
            {p}
          </p>
        ))}
        <h3 className={styles.subhead}>{a?.leadershipTitle}</h3>
        <div className={styles.leaderGrid}>
          {(a?.leadershipProfiles ?? []).slice(0, 4).map((leader, i) => (
            <article key={i} className={styles.leaderCard}>
              {leader.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={leader.imageUrl} alt="" className={styles.leaderThumb} />
              ) : null}
              <strong>{leader.name || 'Name'}</strong>
              <span>{leader.role}</span>
            </article>
          ))}
        </div>
      </PreviewShell>
    );
  }

  if (view === '/gallery') {
    const collections = draft.images?.galleryCollections ?? [];
    const items = resolveGalleryItems(collections.length > 0 ? collections : undefined).slice(0, 6);
    const g = draft.pageContent?.gallery;
    return (
      <PreviewShell title={g?.pageTitle || 'Gallery'} path="/gallery">
        <p className={styles.body}>{g?.pageSubtitle}</p>
        <div className={styles.galleryGrid}>
          {items.map((item) => (
            <article key={item.slug} className={styles.galleryCard}>
              {item.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.coverImage} alt="" className={styles.galleryThumb} />
              ) : null}
              <strong>{item.title}</strong>
              <span>{item.year}</span>
            </article>
          ))}
        </div>
      </PreviewShell>
    );
  }

  if (view === '/donate') {
    const d = draft.pageContent?.donate;
    return (
      <PreviewShell title={d?.asideTitle || 'Donate'} path="/donate">
        <p className={styles.body}>{d?.asideLead}</p>
        <ul className={styles.list}>
          <li>{d?.bullet1}</li>
          <li>{d?.bullet2}</li>
          <li>{d?.bullet3}</li>
        </ul>
        <p className={styles.kicker}>{d?.sectionMethod}</p>
        <div className={styles.chips}>
          <span className={styles.chip}>{d?.methodZeffy ?? 'Zeffy'}</span>
          <span className={styles.chip}>{d?.methodPaypal ?? 'PayPal'}</span>
        </div>
      </PreviewShell>
    );
  }

  if (view === '/events') {
    const e = draft.pageContent?.events;
    const list = (draft.events ?? []).slice(0, 5);
    return (
      <PreviewShell title={e?.hotelSectionTitle || 'Events'} path="/events">
        <p className={styles.body}>{e?.hotelSectionSubtitle}</p>
        <ul className={styles.list}>
          {list.map((ev) => (
            <li key={ev.id}>
              <strong>{ev.title}</strong> — {ev.dateLabel}
            </li>
          ))}
        </ul>
      </PreviewShell>
    );
  }

  if (view === '/founder') {
    const f = draft.pageContent?.founder;
    const urls = (draft.images?.founderCarouselUrls ?? []).filter(Boolean);
    return (
      <PreviewShell title="Founder" path="/founder">
        {f?.heroBackgroundUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={f.heroBackgroundUrl} alt="" className={styles.hero} />
        ) : null}
        <p className={styles.body}>{f?.storyP1}</p>
        <div className={styles.carousel}>
          {urls.slice(0, 5).map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt="" className={styles.carouselImg} />
          ))}
        </div>
      </PreviewShell>
    );
  }

  if (view === '/contact') {
    const c = draft.pageContent?.contact;
    return (
      <PreviewShell title={c?.formTitle || 'Contact'} path="/contact">
        <p className={styles.body}>{c?.aboutCardText}</p>
        <p className={styles.body}>{c?.email}</p>
      </PreviewShell>
    );
  }

  if (view === '/registration') {
    const r = draft.pageContent?.registration;
    return (
      <PreviewShell title={r?.asideTitle || 'Register'} path="/registration">
        <p className={styles.body}>{r?.asideLead}</p>
      </PreviewShell>
    );
  }

  if (view === '/about-2') {
    const a = draft.pageContent?.about2;
    return (
      <PreviewShell title={a?.chromeTitle || 'About Us'} path="/about-2">
        <p className={styles.kicker}>{a?.megaAccent}</p>
        <p className={styles.body}>{a?.ctaBarText}</p>
        <ul className={styles.list}>
          <li>{a?.focusItem1}</li>
          <li>{a?.focusItem2}</li>
          <li>{a?.focusItem3}</li>
        </ul>
      </PreviewShell>
    );
  }

  if (view === '/') {
    const h = draft.pageContent?.home;
    const popup = draft.popup;
    return (
      <PreviewShell title="Homepage" path="/">
        {draft.images?.heroPosterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.images.heroPosterUrl} alt="" className={styles.hero} />
        ) : null}
        <p className={styles.body}>{h?.reliveFeastTitle}</p>
        <p className={styles.body}>{h?.reliveFeastSubtitle}</p>
        {popup?.enabled ? (
          <div className={styles.popupMock}>
            <strong>{popup.title}</strong>
            <p>{popup.body}</p>
            <span className={styles.chip}>{popup.ctaLabel}</span>
          </div>
        ) : null}
      </PreviewShell>
    );
  }

  return (
    <PreviewShell title="Preview" path={view}>
      <p className={styles.body}>Draft snapshot for this page is shown on the live site tab.</p>
    </PreviewShell>
  );
}
