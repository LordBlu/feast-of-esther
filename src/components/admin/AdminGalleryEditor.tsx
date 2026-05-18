'use client';

import type { DragEvent } from 'react';
import type { GalleryCollection } from '@/lib/cms-types';
import { isGalleryPlaceholderUrl } from '@/lib/gallery-data';
import AdminImageUrlField from '@/components/admin/AdminImageUrlField';
import styles from './AdminGalleryEditor.module.css';

const emptyCollection = (): GalleryCollection => ({
  slug: '',
  title: '',
  year: new Date().getFullYear().toString(),
  description: '',
  imageUrls: [''],
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
  const rows = collections.length > 0 ? collections : [emptyCollection()];

  function updateCollection(index: number, patch: Partial<GalleryCollection>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function updateImage(collectionIndex: number, imageIndex: number, url: string) {
    const collection = rows[collectionIndex];
    const urls = [...(collection.imageUrls ?? [])];
    urls[imageIndex] = url;
    updateCollection(collectionIndex, { imageUrls: urls });
  }

  function addImage(collectionIndex: number) {
    const collection = rows[collectionIndex];
    updateCollection(collectionIndex, {
      imageUrls: [...(collection.imageUrls ?? []), ''],
    });
  }

  function removeImage(collectionIndex: number, imageIndex: number) {
    const collection = rows[collectionIndex];
    const urls = (collection.imageUrls ?? []).filter((_, i) => i !== imageIndex);
    updateCollection(collectionIndex, { imageUrls: urls.length > 0 ? urls : [''] });
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-black/55">
        Each collection is one folder on the Gallery page.{' '}
        <strong className="text-[#7a5a00]">Yellow-highlighted</strong> images are demo placeholders — replace or
        delete them when you have real photos.
      </p>
      {rows.map((collection, cIndex) => (
        <section key={`gallery-c-${cIndex}`} className={styles.collection}>
          <header className={styles.collectionHeader}>
            <h3 className={styles.collectionTitle}>
              Collection {cIndex + 1}
              {collection.title.trim() ? ` · ${collection.title.trim()}` : ''}
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="admin-field-label">URL slug</label>
              <input
                className="admin-input"
                placeholder="feast-2025-opening-night"
                value={collection.slug}
                onChange={(e) => updateCollection(cIndex, { slug: e.target.value })}
              />
            </div>
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
      ))}
      <button type="button" className="admin-btn-ghost" onClick={() => onChange([...rows, emptyCollection()])}>
        Add collection
      </button>
    </div>
  );
}
