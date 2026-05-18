'use client';

import { useMemo, useState } from 'react';

const TAB_PREVIEW_PATH: Record<string, string | null> = {
  guide: '/',
  events: '/events',
  countdown: '/',
  popup: '/',
  images: '/',
  gallery: '/gallery',
  social: '/',
  about: '/about',
  pages: '/gallery',
  donations: '/donate',
  registrations: null,
  versions: null,
};

interface AdminPagePreviewProps {
  tab: string;
  pageSection?: string;
}

export default function AdminPagePreview({ tab, pageSection }: AdminPagePreviewProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const path = useMemo(() => {
    if (tab === 'pages' && pageSection) {
      const map: Record<string, string> = {
        gallery: '/gallery',
        events: '/events',
        contact: '/contact',
        donate: '/donate',
        registration: '/registration',
        founder: '/founder',
        about2: '/about-2',
      };
      return map[pageSection] ?? '/';
    }
    return TAB_PREVIEW_PATH[tab] ?? '/';
  }, [tab, pageSection]);

  if (!path) {
    return (
      <aside className="admin-preview-panel" aria-label="Live preview">
        <p className="admin-preview-label">Preview</p>
        <p className="text-xs text-black/45 p-4">No live preview for this section.</p>
      </aside>
    );
  }

  const src = `${path}?preview=1&k=${refreshKey}`;

  return (
    <aside className="admin-preview-panel" aria-label="Live preview">
      <div className="admin-preview-toolbar">
        <p className="admin-preview-label">Live preview</p>
        <button type="button" className="admin-btn-ghost text-xs" onClick={() => setRefreshKey((k) => k + 1)}>
          Refresh
        </button>
      </div>
      <p className="admin-preview-path">{path}</p>
      <div className="admin-preview-frame-wrap">
        <iframe title={`Preview of ${path}`} src={src} className="admin-preview-iframe" />
      </div>
    </aside>
  );
}
