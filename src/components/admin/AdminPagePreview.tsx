'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  type AdminPreviewDraft,
  resolveAdminPreviewPath,
  writeAdminPreviewDraft,
} from '@/lib/admin-preview-draft';

interface AdminPagePreviewProps {
  tab: string;
  pageSection?: string;
  draft: AdminPreviewDraft;
  registrationsCount?: number;
}

type PreviewMode = 'draft' | 'live';

export default function AdminPagePreview({
  tab,
  pageSection,
  draft,
  registrationsCount = 0,
}: AdminPagePreviewProps) {
  const [mode, setMode] = useState<PreviewMode>('draft');
  const [refreshKey, setRefreshKey] = useState(0);

  const path = useMemo(() => resolveAdminPreviewPath(tab, pageSection), [tab, pageSection]);

  useEffect(() => {
    const id = window.setTimeout(() => writeAdminPreviewDraft(draft), 200);
    return () => window.clearTimeout(id);
  }, [draft]);

  const draftSrc = path
    ? `/admin/preview?view=${encodeURIComponent(path)}&t=${draft.updatedAt}`
    : null;

  const liveSrc = path ? `${path}?preview=1&k=${refreshKey}` : null;
  const iframeSrc = mode === 'draft' ? draftSrc : liveSrc;

  if (!path) {
    return (
      <aside className="admin-preview-panel" aria-label="Preview">
        <div className="admin-preview-toolbar">
          <p className="admin-preview-label">Summary</p>
        </div>
        <div className="px-4 py-5 text-sm text-black/60 space-y-2">
          {tab === 'registrations' ? (
            <p>
              <strong>{registrationsCount}</strong> registration{registrationsCount === 1 ? '' : 's'} on file.
            </p>
          ) : null}
          {tab === 'versions' ? <p>Version history has no page preview.</p> : null}
          {tab !== 'registrations' && tab !== 'versions' ? (
            <p>Edit the form on the left; use another tab for a page preview.</p>
          ) : null}
        </div>
      </aside>
    );
  }

  return (
    <aside className="admin-preview-panel" aria-label="Preview">
      <div className="admin-preview-toolbar">
        <p className="admin-preview-label">Preview</p>
        <div className="admin-preview-mode">
          <button
            type="button"
            className={mode === 'draft' ? 'admin-preview-mode-active' : ''}
            onClick={() => setMode('draft')}
          >
            Draft
          </button>
          <button
            type="button"
            className={mode === 'live' ? 'admin-preview-mode-active' : ''}
            onClick={() => setMode('live')}
          >
            Live site
          </button>
        </div>
        {mode === 'live' ? (
          <button type="button" className="admin-btn-ghost text-xs" onClick={() => setRefreshKey((k) => k + 1)}>
            Refresh
          </button>
        ) : null}
      </div>
      <p className="admin-preview-path">
        {path}
        {mode === 'draft' ? ' · unsaved edits' : ' · saved on site'}
      </p>
      <div className="admin-preview-frame-wrap">
        {iframeSrc ? (
          <iframe
            key={iframeSrc}
            title={mode === 'draft' ? `Draft preview of ${path}` : `Live preview of ${path}`}
            src={iframeSrc}
            className="admin-preview-iframe"
          />
        ) : null}
      </div>
    </aside>
  );
}
