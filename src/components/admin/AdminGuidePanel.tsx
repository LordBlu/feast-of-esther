'use client';

export default function AdminGuidePanel() {
  return (
    <div className="space-y-6">
      <section className="admin-card space-y-3 border-2 border-amber-600/30 bg-amber-50/80">
        <h2>Vercel: connect Blob before Save works</h2>
        <p className="text-sm leading-relaxed text-[#4a4f5c]">
          On the live site (feast-of-esther.vercel.app), <strong>every Save button</strong> needs Vercel Blob
          storage connected to this project (<code className="text-xs">feast-of-esther-blob</code>, Private). If
          saves fail, open Storage → connect store → <strong>Redeploy</strong>. A yellow banner appears when Blob
          is missing.
        </p>
      </section>

      <section className="admin-card space-y-3">
        <h2>Relive the Feast (homepage photo grid)</h2>
        <p className="text-sm leading-relaxed text-[#4a4f5c]">
          <strong>Site pages → Home</strong> → <strong>Relive image URLs</strong>. The 3×3 grid uses at least 9
          photos and never shows the same image in two cells at once. Thirty photos are bundled by default; add,
          remove, or reorder URLs, then <strong>Save site page copy</strong>. Hard refresh the homepage to preview.
        </p>
        <p className="text-sm text-[#5c6370]">
          Popup flyer image is under the <strong>Popup</strong> tab, not Relive.
        </p>
      </section>

      <section className="admin-card space-y-4 border-2 border-[rgba(194,24,91,0.2)]">
        <h2>See your changes on the website</h2>
        <p className="text-sm leading-relaxed text-[#5c6370]">
          After you save in Admin, the public site may still show an old version in your browser. Do a{' '}
          <strong>hard refresh</strong> before assuming something is broken.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--primary)]">Windows</p>
            <p className="mt-2 font-mono text-sm text-[var(--primary-dark)]">
              Ctrl + F5
              <br />
              or Ctrl + Shift + R
            </p>
          </div>
          <div className="rounded-xl bg-white/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--primary)]">Mac</p>
            <p className="mt-2 font-mono text-sm text-[var(--primary-dark)]">Cmd + Shift + R</p>
          </div>
        </div>
        <p className="text-sm text-[#5c6370]">
          On a phone: close the browser tab completely and open the site again. If it still looks wrong, try a
          private/incognito window.
        </p>
      </section>

      <section className="admin-card space-y-4">
        <h2>Reset the website after mistakes</h2>
        <p className="text-sm leading-relaxed text-[#5c6370]">
          Open the <strong>Versions</strong> tab. <strong>Registration records are never reverted.</strong>
        </p>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[#4a4f5c]">
          <li>
            <strong>Undo last change</strong> — steps back one save (up to 30 saves kept).
          </li>
          <li>
            <strong>Set Zero from current</strong> — when the site looks perfect, save that as your “known good”
            snapshot.
          </li>
          <li>
            <strong>Restore Zero</strong> — rolls back all content to that snapshot if later edits go wrong.
          </li>
          <li>
            <strong>Saved slots (1–30)</strong> — name a slot, click Save before big edits; Restore that slot to
            return.
          </li>
        </ol>
      </section>

      <section className="admin-card space-y-4">
        <h2>After the conference ends</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4a4f5c]">
          <li>
            <strong>Countdown</strong> tab → turn off “Show countdown on the home page”.
          </li>
          <li>
            <strong>Popup</strong> tab → disable or change message to gallery / thank-you.
          </li>
          <li>
            <strong>Events</strong> → mark event as Past; link gallery slug when photos are ready.
          </li>
          <li>
            <strong>Site pages → Home</strong> — Relive the Feast URLs (9+; 30 defaults), testimonials; turn off
            Relive if you hide the section.
          </li>
          <li>
            Homepage <strong>hotel block</strong> has no off switch yet — ask a developer to hide it or replace it
            (gallery highlights, quotes, recap video) so the page does not feel empty.
          </li>
          <li>Hard refresh: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac).</li>
        </ul>
      </section>

      <section className="admin-card space-y-3">
        <h2>Tab quick reference</h2>
        <dl className="grid gap-2 text-sm text-[#4a4f5c] sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Events</dt>
            <dd>Conferences, flyers, register links, draft/published</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Countdown</dt>
            <dd>Homepage flip clock on/off and target event</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Popup</dt>
            <dd>Welcome modal on home</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Imagery</dt>
            <dd>Hero poster, hotel photo, founder carousel list, video URL</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Gallery</dt>
            <dd>Collections for /gallery; past-event photos sync to Events</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Placeholders</dt>
            <dd>Demo photos for Home, About sidebar, Founder, Events — upload or clear</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Social Links</dt>
            <dd>Footer icons</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">About Page</dt>
            <dd>Story, mission, leadership JSON, hero image</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Executives</dt>
            <dd>Chairperson hero + committee grid on /executive</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Site pages</dt>
            <dd>Home copy, Relive photo URLs, Founder bio, page headlines, About sidebar visuals</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Donations</dt>
            <dd>Donate-page click log (not payments)</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Registrations</dt>
            <dd>View / export CSV only</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--primary-dark)]">Versions</dt>
            <dd>Undo, Zero, save slots</dd>
          </div>
        </dl>
      </section>

      <section className="admin-card space-y-3">
        <h2>Cannot edit here (developer needed)</h2>
        <p className="text-sm text-[#5c6370]">
          Nav menu, announcement bar, event programme schedule, Sister Chapters map, and Founder{' '}
          <strong>Ministry Focus</strong> tab labels (Global Impact / Mission Outreach / Rehabilitation) are still in
          code. Homepage hero headline, mission quote, purpose block, and ministry card text are editable under{' '}
          <strong>Site pages → Home</strong>.
        </p>
        <p className="text-sm text-[#5c6370]">
          Full reference for your team:{' '}
          <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">ADMIN_GUIDE.md</code> in the project
          repository.
        </p>
      </section>
    </div>
  );
}
