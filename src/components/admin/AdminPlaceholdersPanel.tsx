'use client';

import type { DragEvent } from 'react';
import type {
  About2PageContent,
  AboutPageContent,
  SiteImages,
  SitePageContents,
} from '@/lib/cms-types';
import { isSitePlaceholderUrl } from '@/lib/site-placeholders';
import {
  ABOUT_SIDEBAR_VISUAL_DEFAULTS,
  getImagePlaceholderCatalog,
  type PlaceholderGroup,
} from '@/lib/site-placeholder-catalog';
import { isGalleryPlaceholderUrl } from '@/lib/gallery-data';
import AdminImageUrlField from '@/components/admin/AdminImageUrlField';
import { AdminImagePreview } from '@/components/admin/AdminImagePreview';
import styles from './AdminPlaceholdersPanel.module.css';

const GROUP_LABELS: Record<PlaceholderGroup, string> = {
  home: 'Homepage',
  about: 'About Us',
  founder: 'The Founder',
  events: 'Events',
};

interface AdminPlaceholdersPanelProps {
  images: SiteImages;
  onImagesChange: (next: SiteImages) => void;
  about: AboutPageContent;
  onAboutChange: (next: AboutPageContent) => void;
  pageContent: SitePageContents;
  onPageContentChange: (next: SitePageContents) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => void;
  onDragOver: (e: DragEvent) => void;
}

function isDemoUrl(url: string, defaultUrl: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return !defaultUrl;
  if (defaultUrl && trimmed === defaultUrl) return true;
  return isSitePlaceholderUrl(trimmed) || isGalleryPlaceholderUrl(trimmed);
}

export default function AdminPlaceholdersPanel({
  images,
  onImagesChange,
  about,
  onAboutChange,
  pageContent,
  onPageContentChange,
  onUpload,
  onDragOver,
}: AdminPlaceholdersPanelProps) {
  const map = images.placeholderUrls ?? {};
  const catalog = getImagePlaceholderCatalog().filter((s) => s.id !== 'home-hero-poster');

  function setPlaceholderUrl(id: string, url: string) {
    onImagesChange({
      ...images,
      placeholderUrls: { ...map, [id]: url },
    });
  }

  function clearPlaceholderUrl(id: string) {
    const next = { ...map };
    delete next[id];
    onImagesChange({ ...images, placeholderUrls: next });
  }

  function effectiveUrl(id: string, defaultUrl: string): string {
    if (id === 'home-hero-poster') return images.heroPosterUrl?.trim() || '';
    if (id in map) return map[id]?.trim() ?? '';
    return defaultUrl;
  }

  const groups: PlaceholderGroup[] = ['home', 'about', 'founder', 'events'];

  return (
    <div className="space-y-8">
      <p className="text-sm text-black/55">
        These are the bundled demo photos and copy used on the public site before you replace them.
        Slots marked <strong className="text-[#7a5a00]">Demo</strong> still match the original placeholders.
        Clear a URL field and save to restore the default image. Gallery collections stay on the{' '}
        <strong>Gallery</strong> tab.
      </p>

      {groups.map((group) => {
        const slots = catalog.filter((s) => s.group === group);
        const about2Rows = group === 'about' ? ABOUT_SIDEBAR_VISUAL_DEFAULTS : [];

        if (slots.length === 0 && about2Rows.length === 0) return null;

        return (
          <section key={group} className={styles.group}>
            <h3 className={styles.groupTitle}>{GROUP_LABELS[group]}</h3>

            {group === 'home' ? (
              <div className={`${styles.slot} mb-4`}>
                <div className={styles.slotHead}>
                  <span className={styles.slotLabel}>Homepage hero — first slide (poster)</span>
                </div>
                <p className={styles.slotHint}>Also under Imagery → Hero poster.</p>
                <AdminImageUrlField
                  value={images.heroPosterUrl ?? ''}
                  onChange={(url) => onImagesChange({ ...images, heroPosterUrl: url })}
                />
                {images.heroPosterUrl?.trim() ? (
                  <AdminImagePreview url={images.heroPosterUrl} label="Preview" compact />
                ) : null}
              </div>
            ) : null}

            {slots.map((slot) => {
              const current = effectiveUrl(slot.id, slot.defaultUrl);
              const demo = isDemoUrl(current, slot.defaultUrl);
              return (
                <div key={slot.id} className={styles.slot}>
                  <div className={styles.slotHead}>
                    <span className={styles.slotLabel}>{slot.label}</span>
                    {demo ? <span className={styles.demoBadge}>Demo</span> : null}
                  </div>
                  {slot.hint ? <p className={styles.slotHint}>{slot.hint}</p> : null}
                  <AdminImageUrlField
                    value={current}
                    onChange={(url) => setPlaceholderUrl(slot.id, url)}
                  />
                  {current ? <AdminImagePreview url={current} label="Preview" compact /> : null}
                  <div className={styles.slotActions}>
                    <button
                      type="button"
                      className="admin-btn-ghost text-xs"
                      onClick={() => clearPlaceholderUrl(slot.id)}
                    >
                      Use default image
                    </button>
                  </div>
                  <div
                    className="admin-drop mt-2"
                    onDragOver={onDragOver}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file?.type.startsWith('image/')) {
                        onUpload(file, (url) => setPlaceholderUrl(slot.id, url));
                      }
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--blush)] file:px-3 file:py-2"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload(file, (url) => setPlaceholderUrl(slot.id, url));
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {about2Rows.map((row) => {
              const current = pageContent.about2?.[row.key]?.trim() ?? '';
              const demo = isDemoUrl(current, row.defaultUrl);
              return (
                <div key={row.key} className={styles.slot}>
                  <div className={styles.slotHead}>
                    <span className={styles.slotLabel}>{row.label}</span>
                    {demo ? <span className={styles.demoBadge}>Demo</span> : null}
                  </div>
                  <AdminImageUrlField
                    value={current}
                    onChange={(url) =>
                      onPageContentChange({
                        ...pageContent,
                        about2: { ...pageContent.about2, [row.key]: url },
                      })
                    }
                  />
                  {current ? <AdminImagePreview url={current} label="Preview" compact /> : null}
                </div>
              );
            })}

            {group === 'about' ? (
              <div className={styles.slot}>
                <div className={styles.slotHead}>
                  <span className={styles.slotLabel}>About page — top hero image</span>
                </div>
                <p className={styles.slotHint}>Full story copy is under the About Page tab.</p>
                <AdminImageUrlField
                  value={about.heroImageUrl ?? ''}
                  onChange={(url) => onAboutChange({ ...about, heroImageUrl: url })}
                />
              </div>
            ) : null}

            {group === 'founder' ? (
              <div className={styles.slot}>
                <div className={styles.slotHead}>
                  <span className={styles.slotLabel}>Founder — pinned hero (Site pages)</span>
                </div>
                <AdminImageUrlField
                  value={pageContent.founder?.heroBackgroundUrl ?? ''}
                  onChange={(url) =>
                    onPageContentChange({
                      ...pageContent,
                      founder: { ...pageContent.founder, heroBackgroundUrl: url },
                    })
                  }
                />
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
