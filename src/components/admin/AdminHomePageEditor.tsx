'use client';

import type { DragEvent } from 'react';
import type { HomePageContent, HomeTestimonial } from '@/lib/cms-types';
import { HOME_MINISTRY_CARD_DEFAULTS } from '@/lib/site-placeholder-catalog';
import { HOME_COPY } from '@/lib/site-content';
import AdminImageUrlField from '@/components/admin/AdminImageUrlField';
import AdminReorderButtons from '@/components/admin/AdminReorderButtons';
import AdminUrlListEditor from '@/components/admin/AdminUrlListEditor';
import { swapArrayItems } from '@/lib/reorder-array';

interface AdminHomePageEditorProps {
  home: HomePageContent;
  onChange: (next: HomePageContent) => void;
  onSwapMinistryCards?: (from: number, to: number) => void;
  onUpload?: (file: File, onUrl: (url: string) => void) => void;
  onDragOver?: (e: DragEvent) => void;
}

function emptyTestimonial(): HomeTestimonial {
  return { quote: '', name: '', role: '', imageUrl: '' };
}

export default function AdminHomePageEditor({
  home,
  onChange,
  onSwapMinistryCards,
  onUpload,
  onDragOver,
}: AdminHomePageEditorProps) {
  const testimonials = home.testimonials?.length ? home.testimonials : [emptyTestimonial()];

  function patch(partial: Partial<HomePageContent>) {
    onChange({ ...home, ...partial });
  }

  function updateTestimonial(index: number, partial: Partial<HomeTestimonial>) {
    const next = testimonials.map((row, i) => (i === index ? { ...row, ...partial } : row));
    patch({ testimonials: next });
  }

  function updateMinistryCard(index: number, field: string, value: string) {
    const cards = [...(home.ministryCards ?? [])];
    while (cards.length <= index) cards.push({});
    cards[index] = { ...cards[index], [field]: value };
    patch({ ministryCards: cards });
  }

  return (
    <div className="admin-card space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-[var(--primary-dark)]">Hero &amp; main sections</h3>
        <p className="mt-1 text-sm text-black/55">
          Headline, mission quote, and purpose block. Hero photos are under <strong>Placeholders</strong> or{' '}
          <strong>Imagery</strong>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="admin-field-label">Hero headline</label>
          <input
            className="admin-input"
            value={home.heroTitle ?? ''}
            onChange={(e) => patch({ heroTitle: e.target.value })}
            placeholder={HOME_COPY.heroTitle}
          />
        </div>
        <div>
          <label className="admin-field-label">Purpose section title</label>
          <input
            className="admin-input"
            value={home.purposeTitle ?? ''}
            onChange={(e) => patch({ purposeTitle: e.target.value })}
            placeholder="Our Purpose"
          />
        </div>
        <div className="md:col-span-2">
          <label className="admin-field-label">Mission quote (video strip)</label>
          <textarea
            className="admin-input min-h-[72px]"
            value={home.forumMissionQuote ?? ''}
            onChange={(e) => patch({ forumMissionQuote: e.target.value })}
            placeholder={HOME_COPY.mission}
          />
        </div>
        <div className="md:col-span-2">
          <label className="admin-field-label">Purpose subtitle (vision)</label>
          <textarea
            className="admin-input min-h-[72px]"
            value={home.purposeSubtitle ?? ''}
            onChange={(e) => patch({ purposeSubtitle: e.target.value })}
            placeholder={HOME_COPY.vision}
          />
        </div>
      </div>

      <div className="border-t border-black/10 pt-6">
        <h3 className="text-lg font-semibold text-[var(--primary-dark)]">Ministry cards (3 columns)</h3>
        <p className="mt-1 text-sm text-black/55">Card images can also be changed under Placeholders.</p>
      </div>

      {HOME_MINISTRY_CARD_DEFAULTS.map((defaults, index) => {
        const row = home.ministryCards?.[index] ?? {};
        const ministryCount = HOME_MINISTRY_CARD_DEFAULTS.length;
        return (
          <div
            key={`ministry-card-${index}`}
            className="rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[var(--primary-dark)]">
                Card {index + 1} · {defaults.title}
              </p>
              <AdminReorderButtons
                index={index}
                total={ministryCount}
                label={`ministry card ${index + 1}`}
                onMoveUp={() => onSwapMinistryCards?.(index, index - 1)}
                onMoveDown={() => onSwapMinistryCards?.(index, index + 1)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="admin-field-label">Card title</label>
                <input
                  className="admin-input"
                  value={row.title ?? ''}
                  onChange={(e) => updateMinistryCard(index, 'title', e.target.value)}
                  placeholder={defaults.title}
                />
              </div>
              <div>
                <label className="admin-field-label">Tag</label>
                <input
                  className="admin-input"
                  value={row.tag ?? ''}
                  onChange={(e) => updateMinistryCard(index, 'tag', e.target.value)}
                  placeholder={defaults.tag}
                />
              </div>
              <div className="md:col-span-2">
                <label className="admin-field-label">Description</label>
                <textarea
                  className="admin-input min-h-[80px]"
                  value={row.copy ?? ''}
                  onChange={(e) => updateMinistryCard(index, 'copy', e.target.value)}
                  placeholder={defaults.copy}
                />
              </div>
              <div className="md:col-span-2">
                <label className="admin-field-label">Link path</label>
                <input
                  className="admin-input"
                  value={row.href ?? ''}
                  onChange={(e) => updateMinistryCard(index, 'href', e.target.value)}
                  placeholder={defaults.href}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="border-t border-black/10 pt-6">
        <h3 className="text-lg font-semibold text-[var(--primary-dark)]">Relive the Feast</h3>
        <p className="mt-1 text-sm text-black/55">
          Rotating 3×3 photo grid on the homepage. Add at least nine Cloudinary URLs; the grid never shows the same
          photo in two cells at once. Use ↑ / ↓ to reorder, upload or paste URLs, then save under Site pages.
        </p>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[var(--primary)]"
          checked={home.showReliveFeast !== false}
          onChange={(e) => patch({ showReliveFeast: e.target.checked })}
        />
        Show Relive the Feast section
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="admin-field-label">Section title</label>
          <input
            className="admin-input"
            value={home.reliveFeastTitle ?? ''}
            onChange={(e) => patch({ reliveFeastTitle: e.target.value })}
            placeholder="Relive the Feast"
          />
        </div>
        <div>
          <label className="admin-field-label">Section subtitle</label>
          <input
            className="admin-input"
            value={home.reliveFeastSubtitle ?? ''}
            onChange={(e) => patch({ reliveFeastSubtitle: e.target.value })}
          />
        </div>
      </div>

      <AdminUrlListEditor
        label="Relive image URLs"
        hint="At least 9 unique URLs (30 bundled by default). Extra URLs give the grid more variety when rotating."
        urls={home.reliveFeastImageUrls ?? []}
        onChange={(reliveFeastImageUrls) => patch({ reliveFeastImageUrls })}
        onUpload={onUpload}
        onDragOver={onDragOver}
        addLabel="Add relive photo"
      />

      <div className="border-t border-black/10 pt-6">
        <h3 className="text-lg font-semibold text-[var(--primary-dark)]">Testimonials marquee</h3>
        <p className="mt-1 text-sm text-black/55">Scrolling quotes below the countdown on the homepage.</p>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[var(--primary)]"
          checked={home.showTestimonials !== false}
          onChange={(e) => patch({ showTestimonials: e.target.checked })}
        />
        Show testimonials section
      </label>

      <div>
        <label className="admin-field-label">Testimonials heading</label>
        <input
          className="admin-input"
          value={home.testimonialsTitle ?? ''}
          onChange={(e) => patch({ testimonialsTitle: e.target.value })}
          placeholder="Voices from the gathering"
        />
      </div>

      <div className="space-y-4">
        {testimonials.map((row, index) => (
          <div
            key={`testimonial-${index}`}
            className="rounded-xl border border-[rgba(194,24,91,0.12)] bg-white/65 p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[var(--primary-dark)]">
                Testimonial {index + 1}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <AdminReorderButtons
                  index={index}
                  total={testimonials.length}
                  label={`testimonial ${index + 1}`}
                  onMoveUp={() => patch({ testimonials: swapArrayItems(testimonials, index, index - 1) })}
                  onMoveDown={() =>
                    patch({ testimonials: swapArrayItems(testimonials, index, index + 1) })
                  }
                />
                {testimonials.length > 1 ? (
                  <button
                    type="button"
                    className="admin-btn-ghost text-xs"
                    onClick={() => patch({ testimonials: testimonials.filter((_, i) => i !== index) })}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="admin-field-label">Quote</label>
                <textarea
                  className="admin-input min-h-[88px]"
                  value={row.quote}
                  onChange={(e) => updateTestimonial(index, { quote: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-field-label">Name</label>
                <input
                  className="admin-input"
                  value={row.name}
                  onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-field-label">Role / location</label>
                <input
                  className="admin-input"
                  value={row.role ?? ''}
                  onChange={(e) => updateTestimonial(index, { role: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="admin-field-label">Portrait URL (optional)</label>
                <AdminImageUrlField
                  value={row.imageUrl ?? ''}
                  onChange={(imageUrl) => updateTestimonial(index, { imageUrl })}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn-ghost"
          onClick={() => patch({ testimonials: [...testimonials, emptyTestimonial()] })}
        >
          Add testimonial
        </button>
      </div>
    </div>
  );
}
