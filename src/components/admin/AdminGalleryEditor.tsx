'use client';

import { useEffect, type DragEvent } from 'react';
import type { GalleryCollection, GalleryCollectionType } from '@/lib/cms-types';
import {
  getGalleryCollectionValidationErrors,
  isGalleryCollectionComplete,
  isGalleryPlaceholderUrl,
  slugifyGallerySlug,
} from '@/lib/gallery-data';
import AdminImageUrlField from '@/components/admin/AdminImageUrlField';
import AdminSlugField from '@/components/admin/AdminSlugField';
import styles from './AdminGalleryEditor.module.css';

const emptyCollection = (): GalleryCollection => ({
  slug: '',
  title: '',
  year: new Date().getFullYear().toString(),
  description: '',
  imageUrls: [''],
  collectionType: 'general',
});

interface AdminGalleryEditorProps {
  collections: GalleryCollection[];
  onChange: (collections: GalleryCollection[]) => void;
  onUploadImage: (file: File, onUrl: (url: string) => void) => void;
  onDragOver: (e: DragEvent) => void;
}

export default function AdminGalleryEditor({
  collections,
  onChange,
  onUploadImage,
  onDragOver,
}: AdminGalleryEditorProps) {
  useEffect(() => {
    if (collections.length === 0) {
      onChange([emptyCollection()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when gallery is empty
  }, [collections.length]);

  function workingRows(): GalleryCollection[] {
    return collections.length > 0 ? collections : [emptyCollection()];
  }

  const rows = workingRows();
  const liveCount = rows.filter(isGalleryCollectionComplete).length;
  const draftCount = rows.length - liveCount;

  function updateCollection(index: number, patch: Partial<GalleryCollection>) {
    onChange(workingRows().map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function updateImage(collectionIndex: number, imageIndex: number, url: string) {
    const collection = workingRows()[collectionIndex];
    const urls = [...(collection.imageUrls ?? [])];
    urls[imageIndex] = url;
    updateCollection(collectionIndex, { imageUrls: urls });
  }

  function addImage(collectionIndex: number) {
    const collection = workingRows()[collectionIndex];
    updateCollection(collectionIndex, {
      imageUrls: [...(collection.imageUrls ?? []), ''],
    });
  }

  function removeImage(collectionIndex: number, imageIndex: number) {
    const collection = workingRows()[collectionIndex];
    const urls = (collection.imageUrls ?? []).filter((_, i) => i !== imageIndex);
    updateCollection(collectionIndex, { imageUrls: urls.length > 0 ? urls : [''] });
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-black/55">
        Each collection becomes its own page at <strong>/gallery/your-slug</strong>. Choose{' '}
        <strong>Past event</strong> to also list it on the Events page — no need to add it again under Events.{' '}
        <strong className="text-[#7a5a00]">Yellow-highlighted</strong> images are demo placeholders.
      </p>
      <p className={`${styles.summaryStrip} text-xs`}>
        <strong>{rows.length}</strong> collection{rows.length === 1 ? '' : 's'} in editor ·{' '}
        <strong>{liveCount}</strong> live on /gallery · <strong>{draftCount}</strong> draft
        {draftCount > 0 ? ' (drafts appear in preview but stay hidden on the public site until complete)' : ''}
      </p>
      {rows.map((collection, cIndex) => {
        const complete = isGalleryCollectionComplete(collection);
        const missing = getGalleryCollectionValidationErrors(collection);
        const isEvent = collection.collectionType === 'event';
        return (
        <section
          key={`gallery-c-${cIndex}`}
          className={`${styles.collection} ${isEvent ? styles.collectionEvent : ''} ${complete ? '' : styles.collectionDraft}`}
        >
          <header className={styles.collectionHeader}>
            <h3 className={styles.collectionTitle}>
              Collection {cIndex + 1}
              {collection.title.trim() ? ` · ${collection.title.trim()}` : ''}
              {complete ? (
                <span className={`${styles.liveBadge} ml-2`}>Live on site</span>
              ) : (
                <span className={`${styles.draftBadge} ml-2`}>Draft</span>
              )}
              {isEvent ? <span className={`${styles.eventBadge} ml-2`}>Past event</span> : null}
            </h3>
            {rows.length > 1 ? (
              <button
                type="button"
                className="admin-btn-ghost text-xs"
                onClick={() => onChange(rows.filter((_, i) => i !== cIndex))}
              >
                Remove collection
              </button>
            ) : null}
          </header>
          {!complete && missing.length > 0 ? (
            <p className={styles.draftHint}>Still needed: {missing.join(', ')}.</p>
          ) : null}
          <div className={styles.typeRow}>
            <span className="admin-field-label mb-0 self-center">Collection type</span>
            {(
              [
                ['general', 'General photos'],
                ['event', 'Past event'],
              ] as const
            ).map(([type, label]) => (
              <button
                key={type}
                type="button"
                className={`${styles.typeBtn} ${(collection.collectionType ?? 'general') === type ? styles.typeBtnActive : ''}`}
                onClick={() =>
                  updateCollection(cIndex, {
                    collectionType: type as GalleryCollectionType,
                  })
                }
              >
                {label}
              </button>
            ))}
          </div>
          {isEvent ? (
            <div className="mb-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="admin-field-label">Event dates (Events page)</label>
                <input
                  className="admin-input"
                  placeholder="June 18–20, 2025"
                  value={collection.eventDateLabel ?? ''}
                  onChange={(e) => updateCollection(cIndex, { eventDateLabel: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-field-label">Venue (optional)</label>
                <input
                  className="admin-input"
                  placeholder="City, State"
                  value={collection.eventVenue ?? ''}
                  onChange={(e) => updateCollection(cIndex, { eventVenue: e.target.value })}
                />
              </div>
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminSlugField
              label="URL slug"
              value={collection.slug}
              onChange={(slug) => updateCollection(cIndex, { slug })}
              pathPrefix="/gallery/"
              placeholder="feast-2025-opening-night"
            />
            <div>
              <label className="admin-field-label">Year</label>
              <input
                className="admin-input"
                value={collection.year}
                onChange={(e) => updateCollection(cIndex, { year: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="admin-field-label">Title</label>
            <input
              className="admin-input"
              value={collection.title}
              onChange={(e) => updateCollection(cIndex, { title: e.target.value })}
              onBlur={(e) => {
                const title = e.target.value.trim();
                if (!collection.slug.trim() && title) {
                  updateCollection(cIndex, { title, slug: slugifyGallerySlug(title) });
                }
              }}
            />
          </div>
          <div className="mt-3">
            <label className="admin-field-label">Description (shown on hover)</label>
            <textarea
              rows={3}
              className="admin-textarea"
              value={collection.description}
              onChange={(e) => updateCollection(cIndex, { description: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <label className="admin-field-label">Photos in this collection</label>
            <div className={styles.imageGrid}>
              {(collection.imageUrls?.length ? collection.imageUrls : ['']).map((url, iIndex) => {
                const isPlaceholder = isGalleryPlaceholderUrl(url);
                return (
                  <div
                    key={`img-${cIndex}-${iIndex}`}
                    className={`${styles.imageCard} ${isPlaceholder ? styles.imageCardPlaceholder : ''}`}
                  >
                    {isPlaceholder ? <span className={styles.placeholderBadge}>Placeholder</span> : null}
                    {url.trim() ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url.trim()} alt="" className={styles.thumb} />
                    ) : (
                      <div className={styles.thumb} aria-hidden />
                    )}
                    <AdminImageUrlField
                      value={url}
                      onChange={(next) => updateImage(cIndex, iIndex, next)}
                      inputClassName="admin-input mt-2 text-[0.65rem]"
                      previewLabel=""
                    />
                    <div className={styles.imageActions}>
                      <button
                        type="button"
                        className="admin-btn-ghost"
                        onClick={() => removeImage(cIndex, iIndex)}
                      >
                        Delete
                      </button>
                      <div
                        className="admin-drop flex-1 min-w-[6rem] p-1"
                        onDragOver={onDragOver}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file?.type.startsWith('image/')) {
                            onUploadImage(file, (uploaded) => updateImage(cIndex, iIndex, uploaded));
                          }
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-[0.55rem]"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUploadImage(file, (uploaded) => updateImage(cIndex, iIndex, uploaded));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button type="button" className="admin-btn-ghost mt-3" onClick={() => addImage(cIndex)}>
              Add photo to this collection
            </button>
          </div>
        </section>
      );
      })}
      <button type="button" className="admin-btn-ghost" onClick={() => onChange([...workingRows(), emptyCollection()])}>
        Add collection
      </button>
    </div>
  );
}
