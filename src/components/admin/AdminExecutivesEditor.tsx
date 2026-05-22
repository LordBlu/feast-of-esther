'use client';

import type { DragEvent } from 'react';
import type { ExecutiveProfile, ExecutivesPageContent } from '@/lib/cms-types';
import AdminImageUrlField from '@/components/admin/AdminImageUrlField';
import AdminReorderButtons from '@/components/admin/AdminReorderButtons';
import { swapArrayItems } from '@/lib/reorder-array';

function linesToList(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function listToLines(items: string[]): string {
  return items.join('\n');
}

function emptyMember(): ExecutiveProfile {
  return {
    id: crypto.randomUUID(),
    name: '',
    title: '',
    subtitle: '',
    imageUrl: '',
    responsibilities: [],
  };
}

interface AdminExecutivesEditorProps {
  content: ExecutivesPageContent;
  onChange: (next: ExecutivesPageContent) => void;
  onUploadImage: (file: File, onUrl: (url: string) => void) => void;
  onDragOver: (e: DragEvent) => void;
}

function MemberFields({
  label,
  member,
  onChange,
  onUploadImage,
  onDragOver,
  showBio,
  onRemove,
  onReorder,
}: {
  label: string;
  member: ExecutiveProfile;
  onChange: (next: ExecutiveProfile) => void;
  onUploadImage: (file: File, onUrl: (url: string) => void) => void;
  onDragOver: (e: DragEvent) => void;
  showBio?: boolean;
  onRemove?: () => void;
  onReorder?: {
    index: number;
    total: number;
    onMoveUp: () => void;
    onMoveDown: () => void;
  };
}) {
  return (
    <article className="rounded-xl border border-[rgba(194,24,91,0.15)] bg-white/70 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--primary-dark)]">
          {label}
          {member.name.trim() ? ` · ${member.name.trim()}` : ''}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {onReorder ? (
            <AdminReorderButtons
              index={onReorder.index}
              total={onReorder.total}
              label={label}
              onMoveUp={onReorder.onMoveUp}
              onMoveDown={onReorder.onMoveDown}
            />
          ) : null}
          {onRemove ? (
            <button type="button" className="admin-btn-ghost text-xs" onClick={onRemove}>
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
            value={member.name}
            onChange={(e) => onChange({ ...member, name: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-field-label">Role / title</label>
          <input
            className="admin-input"
            value={member.title}
            onChange={(e) => onChange({ ...member, title: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-3">
        <label className="admin-field-label">Subtitle (optional)</label>
        <input
          className="admin-input"
          value={member.subtitle ?? ''}
          onChange={(e) => onChange({ ...member, subtitle: e.target.value })}
          placeholder="e.g. Assisted by …"
        />
      </div>
      <div className="mt-3">
        <label className="admin-field-label">Photo</label>
        <AdminImageUrlField
          value={member.imageUrl}
          onChange={(url) => onChange({ ...member, imageUrl: url })}
        />
        <div
          className="admin-drop mt-2"
          onDragOver={onDragOver}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files?.[0];
            if (file?.type.startsWith('image/')) {
              onUploadImage(file, (url) => onChange({ ...member, imageUrl: url }));
            }
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--blush)] file:px-3 file:py-2 file:text-[0.65rem] file:font-semibold file:uppercase"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadImage(file, (url) => onChange({ ...member, imageUrl: url }));
            }}
          />
        </div>
      </div>
      {showBio ? (
        <div className="mt-3">
          <label className="admin-field-label">Biography (one paragraph per blank line)</label>
          <textarea
            className="admin-input min-h-[140px]"
            value={(member.bioParagraphs ?? []).join('\n\n')}
            onChange={(e) =>
              onChange({
                ...member,
                bioParagraphs: e.target.value
                  .split(/\n\n+/)
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
      ) : null}
      <div className="mt-3">
        <label className="admin-field-label">Responsibilities (one per line)</label>
        <textarea
          className="admin-input min-h-[120px]"
          value={listToLines(member.responsibilities)}
          onChange={(e) => onChange({ ...member, responsibilities: linesToList(e.target.value) })}
        />
      </div>
    </article>
  );
}

export default function AdminExecutivesEditor({
  content,
  onChange,
  onUploadImage,
  onDragOver,
}: AdminExecutivesEditorProps) {
  const committee = content.committee.length > 0 ? content.committee : [emptyMember()];

  return (
    <div className="space-y-8">
      <p className="text-sm text-black/55">
        Edit names, titles, photos, biography (chairperson only), and responsibilities (one per line). Changes
        go live after you click <strong>Save Executives page</strong> at the bottom of this tab.
      </p>
      <section className="space-y-3">
        <h3 className="text-base font-semibold text-[var(--primary-dark)]">Page headings</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ['heroEyebrow', 'Hero eyebrow'],
              ['heroTitle', 'Hero title'],
              ['gridTitle', 'Grid section title'],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="admin-field-label">{label}</label>
              <input
                className="admin-input"
                value={content[key] ?? ''}
                onChange={(e) => onChange({ ...content, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div>
          <label className="admin-field-label">Grid intro</label>
          <textarea
            className="admin-input min-h-[72px]"
            value={content.gridLead ?? ''}
            onChange={(e) => onChange({ ...content, gridLead: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-field-label">Extra hero badges (one per line)</label>
          <textarea
            className="admin-input min-h-[64px]"
            value={listToLines(content.heroBadges ?? [])}
            onChange={(e) => onChange({ ...content, heroBadges: linesToList(e.target.value) })}
            placeholder="Continental Evangelist · RCCG America"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-[var(--primary-dark)]">Chairperson / Chairman (hero)</h3>
        <p className="text-xs text-black/50">
          Large photo left, biography right on the public Executives page.
        </p>
        <MemberFields
          label="Chairperson"
          member={content.chairperson}
          onChange={(chairperson) => onChange({ ...content, chairperson })}
          onUploadImage={onUploadImage}
          onDragOver={onDragOver}
          showBio
        />
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[var(--primary-dark)]">Committee (grid)</h3>
          <button
            type="button"
            className="admin-btn-ghost text-sm"
            onClick={() => onChange({ ...content, committee: [...committee, emptyMember()] })}
          >
            + Add executive
          </button>
        </div>
        <p className="text-xs text-black/50">
          Four profiles per row on desktop. Visitors hover to see responsibilities.
        </p>
        {committee.map((member, index) => (
          <MemberFields
            key={member.id || `exco-${index}`}
            label={`Executive ${index + 1}`}
            member={member}
            onChange={(next) =>
              onChange({
                ...content,
                committee: committee.map((row, i) => (i === index ? next : row)),
              })
            }
            onUploadImage={onUploadImage}
            onDragOver={onDragOver}
            onRemove={
              committee.length > 1
                ? () =>
                    onChange({
                      ...content,
                      committee: committee.filter((_, i) => i !== index),
                    })
                : undefined
            }
            onReorder={{
              index,
              total: committee.length,
              onMoveUp: () =>
                onChange({
                  ...content,
                  committee: swapArrayItems(committee, index, index - 1),
                }),
              onMoveDown: () =>
                onChange({
                  ...content,
                  committee: swapArrayItems(committee, index, index + 1),
                }),
            }}
          />
        ))}
      </section>
    </div>
  );
}
