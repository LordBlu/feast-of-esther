'use client';

import { useState } from 'react';
import styles from './AdminImagePreview.module.css';

function normalizeUrl(raw: string): string {
  return raw.trim();
}

function looksLikeImageUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

interface AdminImagePreviewProps {
  url: string;
  label?: string;
  compact?: boolean;
}

export function AdminImagePreview({ url, label = 'Preview', compact = false }: AdminImagePreviewProps) {
  const src = normalizeUrl(url);
  const [failed, setFailed] = useState(false);

  const frameClass = `${styles.frame} ${compact ? styles.frameCompact : ''}`;

  if (!src) {
    return (
      <div className={styles.preview} aria-hidden>
        <div className={`${frameClass} ${styles.placeholder}`}>Paste a URL to preview</div>
      </div>
    );
  }

  if (!looksLikeImageUrl(src)) {
    return (
      <div className={styles.preview}>
        <div className={`${frameClass} ${styles.error}`}>URL must start with http:// or https://</div>
      </div>
    );
  }

  return (
    <div className={styles.preview}>
      <div className={frameClass}>
        {failed ? (
          <div className={styles.error}>Could not load image — check the link</div>
        ) : (
          <img
            src={src}
            alt=""
            className={styles.img}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            onLoad={() => setFailed(false)}
          />
        )}
      </div>
      {!compact ? <p className={styles.caption}>{label}</p> : null}
    </div>
  );
}

interface AdminImagePreviewListProps {
  urls: string[];
  max?: number;
}

export function AdminImagePreviewList({ urls, max = 12 }: AdminImagePreviewListProps) {
  const unique = [...new Set(urls.map(normalizeUrl).filter(Boolean))].slice(0, max);
  if (!unique.length) return null;

  return (
    <div className={styles.grid} role="list" aria-label="Image previews">
      {unique.map((src) => (
        <div key={src} className={styles.gridItem} role="listitem">
          <AdminImagePreview url={src} compact />
        </div>
      ))}
    </div>
  );
}
