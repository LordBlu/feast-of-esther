'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminPreviewCanvas from '@/components/admin/AdminPreviewCanvas';
import {
  ADMIN_PREVIEW_DRAFT_EVENT,
  type AdminPreviewDraft,
  isAdminPreviewDraftMessage,
  readAdminPreviewDraft,
} from '@/lib/admin-preview-draft';

function AdminPreviewInner() {
  const params = useSearchParams();
  const view = params.get('view') ?? '/';
  const [draft, setDraft] = useState<AdminPreviewDraft | null>(() => readAdminPreviewDraft());
  const [waitingForParent, setWaitingForParent] = useState(true);

  useEffect(() => {
    const sync = () => {
      const next = readAdminPreviewDraft();
      if (next) {
        setDraft(next);
        setWaitingForParent(false);
      }
    };
    sync();
    window.addEventListener(ADMIN_PREVIEW_DRAFT_EVENT, sync);
    const interval = window.setInterval(sync, 250);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isAdminPreviewDraftMessage(event.data)) return;
      setDraft(event.data.draft);
      setWaitingForParent(false);
    };
    window.addEventListener('message', onMessage);

    const waitTimer = window.setTimeout(() => setWaitingForParent(false), 1200);

    return () => {
      window.removeEventListener(ADMIN_PREVIEW_DRAFT_EVENT, sync);
      window.removeEventListener('message', onMessage);
      window.clearInterval(interval);
      window.clearTimeout(waitTimer);
    };
  }, []);

  return <AdminPreviewCanvas view={view} draft={draft} waitingForParent={waitingForParent} />;
}

export default function AdminPreviewPage() {
  return (
    <Suspense fallback={<p className="p-4 text-sm text-black/50">Loading preview…</p>}>
      <AdminPreviewInner />
    </Suspense>
  );
}
