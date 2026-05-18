'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminPreviewCanvas from '@/components/admin/AdminPreviewCanvas';
import {
  ADMIN_PREVIEW_DRAFT_EVENT,
  type AdminPreviewDraft,
  readAdminPreviewDraft,
} from '@/lib/admin-preview-draft';

function AdminPreviewInner() {
  const params = useSearchParams();
  const view = params.get('view') ?? '/';
  const [draft, setDraft] = useState<AdminPreviewDraft | null>(null);

  useEffect(() => {
    const sync = () => setDraft(readAdminPreviewDraft());
    sync();
    window.addEventListener(ADMIN_PREVIEW_DRAFT_EVENT, sync);
    const interval = window.setInterval(sync, 400);
    return () => {
      window.removeEventListener(ADMIN_PREVIEW_DRAFT_EVENT, sync);
      window.clearInterval(interval);
    };
  }, []);

  return <AdminPreviewCanvas view={view} draft={draft} />;
}

export default function AdminPreviewPage() {
  return (
    <Suspense fallback={<p className="p-4 text-sm text-black/50">Loading preview…</p>}>
      <AdminPreviewInner />
    </Suspense>
  );
}
