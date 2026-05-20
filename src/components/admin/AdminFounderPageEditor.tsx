'use client';

import type { FounderPageContent } from '@/lib/cms-types';
import { FOUNDER_MINISTRY_DEFAULTS } from '@/lib/site-placeholder-catalog';

interface AdminFounderPageEditorProps {
  founder: FounderPageContent;
  onChange: (next: FounderPageContent) => void;
}

export default function AdminFounderPageEditor({ founder, onChange }: AdminFounderPageEditorProps) {
  function patch(partial: Partial<FounderPageContent>) {
    onChange({ ...founder, ...partial });
  }

  function updateMinistry(index: number, field: 'title' | 'text', value: string) {
    const cards = [...(founder.ministryCards ?? [])];
    while (cards.length <= index) cards.push({});
    cards[index] = { ...cards[index], [field]: value };
    patch({ ministryCards: cards });
  }

  return (
    <div className="space-y-6 border-t border-black/10 pt-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--primary-dark)]">Ministry panels</h3>
        <p className="mt-1 text-sm text-black/55">
          Rotating tabs on /founder. Panel photos are under <strong>Placeholders</strong>.
        </p>
      </div>
      {FOUNDER_MINISTRY_DEFAULTS.map((defaults, index) => {
        const row = founder.ministryCards?.[index] ?? {};
        return (
          <div
            key={defaults.title}
            className="rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-4"
          >
            <p className="mb-3 text-xs font-semibold text-[var(--primary-dark)]">{defaults.title}</p>
            <div>
              <label className="admin-field-label">Panel title</label>
              <input
                className="admin-input"
                value={row.title ?? ''}
                onChange={(e) => updateMinistry(index, 'title', e.target.value)}
                placeholder={defaults.title}
              />
            </div>
            <div className="mt-3">
              <label className="admin-field-label">Panel text</label>
              <textarea
                className="admin-input min-h-[140px]"
                value={row.text ?? ''}
                onChange={(e) => updateMinistry(index, 'text', e.target.value)}
                placeholder={defaults.text}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
