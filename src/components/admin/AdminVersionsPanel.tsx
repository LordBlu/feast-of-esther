'use client';

import { useCallback, useEffect, useState } from 'react';
import { MAX_SAVED_STATES, type CmsHistorySummary } from '@/lib/cms-history-constants';

interface AdminVersionsPanelProps {
  onReload: () => Promise<void>;
  onMessage: (text: string) => void;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AdminVersionsPanel({ onReload, onMessage }: AdminVersionsPanelProps) {
  const [summary, setSummary] = useState<CmsHistorySummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [slotNames, setSlotNames] = useState<string[]>(() =>
    Array.from({ length: MAX_SAVED_STATES }, (_, i) => `Save ${i + 1}`)
  );

  const loadSummary = useCallback(async () => {
    const res = await fetch('/api/admin/history');
    if (!res.ok) return;
    const data = await res.json();
    setSummary(data.summary ?? null);
    const slots = data.summary?.savedSlots as CmsHistorySummary['savedSlots'] | undefined;
    if (slots) {
      setSlotNames((prev) =>
        prev.map((name, i) => (slots[i]?.label && slots[i]!.label !== `Save ${i + 1}` ? slots[i]!.label : name))
      );
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  async function runAction(
    label: string,
    request: () => Promise<Response>,
    confirmText?: string
  ): Promise<boolean> {
    if (confirmText && !window.confirm(confirmText)) return false;
    setBusy(true);
    try {
      const res = await request();
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onMessage(data.error ?? `Could not ${label}.`);
        return false;
      }
      onMessage(`${label} succeeded. Reloading editor…`);
      await onReload();
      await loadSummary();
      return true;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="admin-card space-y-4">
        <h2>Zero baseline</h2>
        <p className="text-sm leading-relaxed text-[#5c6370]">
          <strong>Zero</strong> is the saved “known good” state of the public site (events, copy, images,
          popup, etc.). Registrations are never reverted. Set Zero when the site is exactly how you want it
          before others edit; use <strong>Restore Zero</strong> to roll back accidental changes.
        </p>
        {summary?.zero ? (
          <p className="text-sm text-[var(--primary-dark)]">
            Zero set: <strong>{summary.zero.label}</strong> · {formatWhen(summary.zero.savedAt)}
          </p>
        ) : (
          <p className="text-sm font-medium text-amber-800">Zero is not set yet.</p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            className="admin-btn-primary"
            onClick={() =>
              void runAction(
                'Set Zero from current site',
                () => fetch('/api/admin/history/zero', { method: 'PUT' }),
                'Save the current site content as Zero? This replaces the previous Zero baseline.'
              )
            }
          >
            Set Zero from current
          </button>
          <button
            type="button"
            disabled={busy || !summary?.zero}
            className="admin-btn-ghost"
            onClick={() =>
              void runAction(
                'Restore Zero',
                () => fetch('/api/admin/history/zero', { method: 'POST' }),
                'Restore the entire site content from Zero? Your current content will be pushed to undo history first.'
              )
            }
          >
            Restore Zero
          </button>
        </div>
      </section>

      <section className="admin-card space-y-4">
        <h2>Undo ({summary?.undoCount ?? 0} / 30)</h2>
        <p className="text-sm leading-relaxed text-[#5c6370]">
          Each time you save in the admin (events, popup, images, pages, etc.), the previous version is kept.
          Undo steps back one save at a time (up to 30).
        </p>
        {summary && summary.undoLabels.length > 0 ? (
          <ul className="max-h-40 overflow-y-auto rounded-lg border border-[rgba(194,24,91,0.12)] bg-white/60 p-3 text-xs text-[#4a4f5c]">
            {summary.undoLabels.map((line, i) => (
              <li key={`${line}-${i}`} className="border-b border-[rgba(0,0,0,0.06)] py-1.5 last:border-0">
                {i + 1}. {line}
              </li>
            ))}
          </ul>
        ) : null}
        <button
          type="button"
          disabled={busy || !summary?.undoCount}
          className="admin-btn-primary"
          onClick={() =>
            void runAction('Undo', () => fetch('/api/admin/history/undo', { method: 'POST' }))
          }
        >
          Undo last change
        </button>
      </section>

      <section className="admin-card space-y-4">
        <h2>Saved states (30 slots)</h2>
        <p className="text-sm leading-relaxed text-[#5c6370]">
          Name and save the current site into any slot — useful before big edits. Restore replaces live content
          (registrations stay).
        </p>
        <div className="grid gap-3">
          {Array.from({ length: MAX_SAVED_STATES }, (_, index) => {
            const slot = summary?.savedSlots[index] ?? null;
            return (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border border-[rgba(194,24,91,0.12)] bg-white/50 p-3 sm:flex-row sm:items-center"
              >
                <span className="w-8 shrink-0 text-xs font-bold text-[var(--primary)]">{index + 1}</span>
                <input
                  type="text"
                  className="admin-input min-w-0 flex-1"
                  placeholder={`Label for slot ${index + 1}`}
                  value={slotNames[index] ?? ''}
                  onChange={(e) =>
                    setSlotNames((prev) => {
                      const next = [...prev];
                      next[index] = e.target.value;
                      return next;
                    })
                  }
                />
                <span className="min-w-0 flex-1 text-xs text-[#6b7280]">
                  {slot ? `${slot.label} · ${formatWhen(slot.savedAt)}` : 'Empty'}
                </span>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    className="admin-btn-primary text-xs"
                    onClick={() =>
                      void runAction(`Save slot ${index + 1}`, () =>
                        fetch('/api/admin/history/saved', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ slotIndex: index, name: slotNames[index] }),
                        })
                      )
                    }
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={busy || !slot}
                    className="admin-btn-ghost text-xs"
                    onClick={() =>
                      void runAction(
                        `Restore slot ${index + 1}`,
                        () =>
                          fetch('/api/admin/history/saved', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ slotIndex: index }),
                          }),
                        `Restore site content from "${slot?.label}"? Current content goes to undo history first.`
                      )
                    }
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    disabled={busy || !slot}
                    className="admin-btn-ghost text-xs"
                    onClick={() =>
                      void runAction(`Clear slot ${index + 1}`, () =>
                        fetch(`/api/admin/history/saved?slotIndex=${index}`, { method: 'DELETE' })
                      )
                    }
                  >
                    Clear
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
