'use client';

interface AdminStoryParagraphsEditorProps {
  paragraphs: string[];
  onChange: (paragraphs: string[]) => void;
}

export default function AdminStoryParagraphsEditor({
  paragraphs,
  onChange,
}: AdminStoryParagraphsEditorProps) {
  const rows = paragraphs.length > 0 ? paragraphs : [''];

  return (
    <div className="space-y-3">
      <p className="text-xs text-black/50">
        Add one paragraph at a time. Blank paragraphs are removed when you save.
      </p>
      {rows.map((text, index) => (
        <div
          key={`story-p-${index}`}
          className="rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-4"
        >
          <label className="admin-field-label">Paragraph {index + 1}</label>
          <textarea
            rows={4}
            className="admin-textarea mt-1"
            value={text}
            onChange={(e) => {
              const next = [...rows];
              next[index] = e.target.value;
              onChange(next);
            }}
          />
          {rows.length > 1 ? (
            <button
              type="button"
              className="admin-btn-ghost mt-2"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
            >
              Remove paragraph
            </button>
          ) : null}
        </div>
      ))}
      <button
        type="button"
        className="admin-btn-ghost"
        onClick={() => onChange([...rows, ''])}
      >
        Add paragraph
      </button>
    </div>
  );
}
