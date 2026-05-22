'use client';

import type { DragEvent } from 'react';
import type { LeadershipProfile } from '@/lib/cms-types';
import AdminImageUrlField from '@/components/admin/AdminImageUrlField';
import AdminReorderButtons from '@/components/admin/AdminReorderButtons';
import { swapArrayItems } from '@/lib/reorder-array';

const emptyProfile = (): LeadershipProfile => ({
  name: '',
  role: '',
  imageUrl: '',
  blurb: '',
});

interface AdminLeadershipEditorProps {
  profiles: LeadershipProfile[];
  onChange: (profiles: LeadershipProfile[]) => void;
  onUploadImage: (file: File, onUrl: (url: string) => void) => void;
  onDragOver: (e: DragEvent) => void;
}

export default function AdminLeadershipEditor({
  profiles,
  onChange,
  onUploadImage,
  onDragOver,
}: AdminLeadershipEditorProps) {
  const rows = profiles.length > 0 ? profiles : [emptyProfile()];

  function updateAt(index: number, patch: Partial<LeadershipProfile>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-black/50">
        <strong>Leader 1</strong> is the large featured profile on About (left column + sidebar photo as you
        scroll). <strong>Leaders 2–4</strong> appear in the row of circles. Use ↑ / ↓ to reorder, then click{' '}
        <strong>Save About page</strong> below.
      </p>
      {rows.map((profile, index) => (
        <article
          key={`leader-${index}`}
          className="rounded-xl border border-[rgba(194,24,91,0.15)] bg-white/70 p-4 shadow-sm"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[var(--primary-dark)]">
              {index === 0 ? 'Featured leader' : `Leader ${index + 1}`}
              {profile.name.trim() ? ` · ${profile.name.trim()}` : ''}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <AdminReorderButtons
                index={index}
                total={rows.length}
                label={`leader ${index + 1}`}
                onMoveUp={() => onChange(swapArrayItems(rows, index, index - 1))}
                onMoveDown={() => onChange(swapArrayItems(rows, index, index + 1))}
              />
              {rows.length > 1 ? (
                <button
                  type="button"
                  className="admin-btn-ghost text-xs"
                  onClick={() => onChange(rows.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="admin-field-label">Name</label>
              <input
                className="admin-input"
                value={profile.name}
                onChange={(e) => updateAt(index, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-field-label">Role / title</label>
              <input
                className="admin-input"
                value={profile.role}
                onChange={(e) => updateAt(index, { role: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="admin-field-label">Photo</label>
            <AdminImageUrlField
              value={profile.imageUrl}
              onChange={(url) => updateAt(index, { imageUrl: url })}
            />
            <div
              className="admin-drop mt-2"
              onDragOver={onDragOver}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file?.type.startsWith('image/')) {
                  onUploadImage(file, (url) => updateAt(index, { imageUrl: url }));
                }
              }}
            >
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--blush)] file:px-3 file:py-2 file:text-[0.65rem] file:font-semibold file:uppercase"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadImage(file, (url) => updateAt(index, { imageUrl: url }));
                }}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="admin-field-label">Short bio</label>
            <textarea
              rows={5}
              className="admin-textarea"
              value={profile.blurb}
              onChange={(e) => updateAt(index, { blurb: e.target.value })}
              placeholder="A few sentences about their ministry and calling…"
            />
          </div>
        </article>
      ))}
      <button type="button" className="admin-btn-ghost" onClick={() => onChange([...rows, emptyProfile()])}>
        Add leader
      </button>
    </div>
  );
}
