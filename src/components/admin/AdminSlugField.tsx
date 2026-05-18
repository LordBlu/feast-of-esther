'use client';

import { slugifyPathSegment } from '@/lib/slugify';

interface AdminSlugFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** e.g. `/gallery/` → shows `/gallery/your-slug` */
  pathPrefix: string;
  placeholder?: string;
  hint?: string;
  /** Existing slugs for autocomplete (gallery collections, etc.) */
  suggestions?: string[];
}

export default function AdminSlugField({
  label,
  value,
  onChange,
  pathPrefix,
  placeholder = 'my-page-slug',
  hint,
  suggestions = [],
}: AdminSlugFieldProps) {
  const normalized = slugifyPathSegment(value);
  const pathPreview = `${pathPrefix.replace(/\/$/, '')}/${normalized || '…'}`;

  return (
    <div>
      <label className="admin-field-label">{label}</label>
      {hint ? <p className="mb-1 text-xs text-black/50">{hint}</p> : null}
      <input
        className="admin-input"
        list={suggestions.length > 0 ? `slug-suggestions-${label.replace(/\s+/g, '-')}` : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => {
          const next = slugifyPathSegment(e.target.value);
          if (next !== value) onChange(next);
        }}
      />
      {suggestions.length > 0 ? (
        <datalist id={`slug-suggestions-${label.replace(/\s+/g, '-')}`}>
          {suggestions.map((slug) => (
            <option key={slug} value={slug} />
          ))}
        </datalist>
      ) : null}
      <p className="mt-1 text-[0.65rem] text-black/45">Page: {pathPreview}</p>
    </div>
  );
}
