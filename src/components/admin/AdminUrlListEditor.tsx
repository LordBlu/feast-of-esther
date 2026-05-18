'use client';

import type { DragEvent } from 'react';
import { AdminImagePreviewList } from '@/components/admin/AdminImagePreview';
import AdminImageUrlField from '@/components/admin/AdminImageUrlField';

interface AdminUrlListEditorProps {
  label: string;
  hint?: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  onUpload?: (file: File, onUrl: (url: string) => void) => void;
  onDragOver?: (e: DragEvent) => void;
  addLabel?: string;
}

export default function AdminUrlListEditor({
  label,
  hint,
  urls,
  onChange,
  onUpload,
  onDragOver,
  addLabel = 'Add image',
}: AdminUrlListEditorProps) {
  const rows = urls.length > 0 ? urls : [''];

  function updateAt(index: number, value: string) {
    const next = [...rows];
    next[index] = value;
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="admin-field-label">{label}</label>
        {hint ? <p className="mt-1 text-xs text-black/50">{hint}</p> : null}
      </div>
      {rows.map((url, index) => (
        <div
          key={`url-row-${index}`}
          className="rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[var(--primary-dark)]">Image {index + 1}</span>
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
          <AdminImageUrlField value={url} onChange={(v) => updateAt(index, v)} />
          {onUpload && onDragOver ? (
            <div
              className="admin-drop mt-2"
              onDragOver={onDragOver}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file?.type.startsWith('image/')) {
                  onUpload(file, (uploaded) => updateAt(index, uploaded));
                }
              }}
            >
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--blush)] file:px-3 file:py-2"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file, (uploaded) => updateAt(index, uploaded));
                }}
              />
            </div>
          ) : null}
        </div>
      ))}
      <button type="button" className="admin-btn-ghost" onClick={() => onChange([...rows, ''])}>
        {addLabel}
      </button>
      <AdminImagePreviewList urls={rows.filter(Boolean)} max={8} />
    </div>
  );
}
