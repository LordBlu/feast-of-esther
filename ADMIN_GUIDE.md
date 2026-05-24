# Feast of Esther — Admin guide

This document is for anyone editing the public site through **`/admin`**. A shorter copy also lives inside the dashboard under the **Guide** tab.

---

## Sign in

1. Open **`/admin/login`** on your site (e.g. `https://yoursite.com/admin/login`).
2. Enter the admin passphrase (set by your host as `ADMIN_DASHBOARD_PASSWORD` — not editable in the UI).
3. Use **Log out** when you are done on a shared computer.

---

## Hosting on Vercel (required for Save to work)

On **Vercel**, the app cannot write to `data/cms-data.json` on disk. Every Admin **Save** (Placeholders, Executives, Events, Imagery, About, etc.) needs **Vercel Blob** storage:

1. Open your project in the [Vercel dashboard](https://vercel.com).
2. Go to **Storage** → **Create** → **Blob**.
3. **Connect** the Blob store to the **feast-of-esther** project (this sets `BLOB_READ_WRITE_TOKEN`).
4. **Redeploy** the site (Deployments → … → Redeploy).

The first time Blob is connected, the site copies the existing `data/cms-data.json` from the deployment into Blob. After that, saves update Blob and the live site reads from there.

If Blob is missing, Admin shows a yellow warning and Save returns an error explaining what to do.

**Local development** (`npm run dev`) still saves to `data/cms-data.json` on your computer — no Blob needed.

---

## See your changes on the live site

Saving in Admin updates site content (on disk locally, or in **Vercel Blob** in production). Your browser may still show an **old cached** page.

### Hard refresh (do this first)

| System | Action |
|--------|--------|
| **Windows** | `Ctrl + F5` or `Ctrl + Shift + R` |
| **Mac** | `Cmd + Shift + R` |
| **Phone** | Close the tab completely and reopen the site |

### If it still looks wrong

1. Confirm you clicked **Save** on the correct tab (Events, Popup, Imagery, etc.).
2. Try a **private/incognito** window.
3. Wait a minute if you use a CDN/host cache (Vercel etc.) — redeploys can take a moment.
4. On **Vercel**, confirm **Blob storage** is connected (see above). Without it, Save will always fail.
5. Ask a developer to confirm a save succeeded (check Blob or `data/cms-data.json` locally).

---

## Reset or undo site content

All of these are under Admin → **Versions**. **Registration records are never reverted.**

### Undo last save (quick fix)

- Each time you save in Admin, the previous content is kept (up to **30** steps).
- Click **Undo last change** to step back one save.

### Zero baseline (full rollback)

1. When the site looks exactly right, go to **Versions** → **Set Zero from current** (confirm).
2. Later, if edits go wrong: **Restore Zero** — restores all CMS content to that snapshot (registrations stay).

### Named save slots (before big edits)

1. **Versions** → pick a slot (1–30), enter a label (e.g. `Before June popup`).
2. Click **Save** on that slot.
3. To go back: **Restore** on that slot (current content goes to undo history first).

---

## Dashboard tabs — what you can edit

### Events

Create/edit/delete conferences. Controls hero on `/events`, flyers, register links, draft vs published, and optional **countdown target** datetime for the homepage clock. Past events can link to a gallery slug (`/gallery/your-slug`).

### Countdown

Turn the homepage flip clock **on/off**. Choose which published event supplies the target time, or set a **fallback** date.

### Popup

Welcome modal on the homepage: text, image, CTA, on/off, and optional typography per block.

### Imagery

Hero poster, hotel photo on home, founder image, popup fallback, YouTube embed URL, and **founder carousel** (one image per row — add URL or upload). **Gallery folders are edited on the Gallery tab**, not here.

### Placeholders

Bundled **demo photos** used before you upload real ones (Home hero slides, ministry cards, About sidebar sections, Founder, Events fallbacks). Yellow **Demo** badges mean the original placeholder is still active. Upload or paste a URL to replace; **Use default image** clears your override.

### Executives

Edits the public **Executives** page (`/executive`):

1. **Page headings** — hero title, grid intro, optional extra badges under the chairperson name.
2. **Chairperson (hero)** — name, roles, photo, biography (one paragraph per blank line), responsibilities list.
3. **Committee (grid)** — one card per executive: name, title, optional subtitle, photo, responsibilities (one per line). Use **+ Add executive** / **Remove** as needed.
4. Click **Save Executives page**.

Visitors **hover** a committee photo to read responsibilities in place.

### Social Links

Footer icons: URL, label, enable/disable, add/remove.

### Gallery

Each **collection** is one folder on `/gallery` and its own page `/gallery/your-slug`. **Order on the public gallery** follows the list in the editor (top = first).

1. Fill **URL slug**, **title**, **year**, **description**, and **at least one photo** (Cloudinary URL or upload).
2. Choose collection type:
   - **General photos** — gallery only.
   - **Past event** — also appears on the **Events** page under “Past Events” (no need to create the same event twice under Events).
3. For **Past event**, add **Event dates** (e.g. `June 18–20, 2025`) and optional **venue**.
4. Use **↑ Up** / **↓ Down** on each collection to reorder how folders appear on `/gallery`.
5. Wait for the **Live on site** badge (not **Draft**), then click **Save gallery**.

**Draft** means something is still missing — the yellow hint lists what’s needed. **Yellow-highlighted** photos are demo placeholders you can replace or delete.

**Preview (right side on a wide screen):** **Draft** shows unsaved edits; **Live site** shows what visitors see after save. Hard refresh (`Ctrl + F5`) if the live preview looks stale.

### About Page

Hero, mission lines, **story paragraphs** (one box per paragraph — add/remove), and **leadership** (one card per person: name, role, photo, short bio).  
**Note:** Some hero fields are stored but **not shown** on the current `/about` layout — use **Site pages → About Us** for the case-study page.

### Site pages

Pick a section from the dropdown, then edit and save.

| Section | What you can change |
|---------|---------------------|
| **Home** | Hero headline, mission quote, purpose title/subtitle, ministry card text (title, tag, copy, link), **Relive the Feast** photo URLs (need **9+** unique URLs; **30** bundled by default), testimonials, show/hide Relive & testimonials |
| **Founder** | Hero image URL, biography paragraphs, ministry panel titles/text |
| **Gallery** | Page title and subtitle |
| **Donate** | Labels, Zeffy embed URL, offline giving hint template |
| **Contact** | Contact details shown on `/contact` |
| **About Us** | Sidebar photo per scroll section (Intro, Journey, …) |
| **Events / Register** | Supporting labels where used |

**Contact email default:** `feastofesthernaa@gmail.com` (also used on Donate offline text and Hadassah). Override under **Contact** if needed.

### Donations

View people who used the donate page: chose **Zeffy** or **PayPal**, clicked **Give**, or opened PayPal. This is a **log only** — not payment processing.

**Online giving setup:**

- **Zeffy:** **Site pages → Donate** → **Zeffy embed URL** (iframe `src` from Zeffy), or ask your host to set `NEXT_PUBLIC_ZEFFY_EMBED_URL`.
- **PayPal:** Host must set `NEXT_PUBLIC_PAYPAL_DONATE_URL` (full PayPal donation link) — not in Admin UI yet.

### Registrations

View and search sign-ups; **Download CSV**. You cannot edit or delete rows here.

### Versions

Undo, Zero, and 30 save slots — see [Reset or undo](#reset-or-undo-site-content) above.

---

## Homepage sections (what exists today)

**Order on `/`:** hero → mission video strip → Our Purpose + ministry cards → **Relive the Feast** (3×3 photo grid) → hotel block → countdown (hides automatically after the target time) → **testimonials** marquee.

### Relive the Feast (homepage grid)

- **3×3 grid** of photos; each cell rotates on its **own** timer (staggered rhythm).
- The grid **never shows the same image in two cells at once** (needs at least **9** URLs in the pool; more URLs = more variety when rotating).
- **Edit:** **Site pages → Home** → **Relive image URLs** (paste Cloudinary links, upload, or reorder with ↑ / ↓) → **Save site page copy**.
- **Defaults:** 30 Cloudinary photos are bundled in the CMS; you can replace or extend the list in Admin.
- **Not the same as Placeholders:** Relive URLs live under **Site pages → Home**. **Placeholders** is for demo hero/ministry/About/Founder slots elsewhere.
- **Popup image** is under the **Popup** tab (`popup.imageUrl`), not Relive.

| Section | Editable in Admin? |
|---------|---------------------|
| Hero headline, mission quote, purpose, ministry cards | **Yes** — **Site pages → Home** |
| Relive the Feast (≥9 URLs, on/off) | **Yes** — **Site pages → Home** |
| Home hero / ministry **demo** photos | **Yes** — **Placeholders** tab |
| Testimonials | **Yes** — **Site pages → Home** |
| Hotel block | **Partial** — Imagery (hotel photo); **no off switch** |
| Countdown | **Yes** — Countdown tab |
| Welcome popup image | **Yes** — **Popup** tab |

After any homepage change, hard refresh (`Ctrl + Shift + R` on Windows). On Vercel, also **Save site page copy** so Blob storage updates.

---

## What you cannot change in Admin (needs a developer)

- Navigation menu order/labels (except content on pages), global colors, fonts.
- Top **announcement bar** text.
- **Event programme** schedule (days/times on `/events`).
- **Sister Chapters** map on About (states/cities in code).
- **Founder → Ministry Focus** cards (Global Impact / Mission Outreach / Rehabilitation) — hardcoded today; see below.
- **Hadassah** chat content/behavior.
- Admin password and hosting settings.

---

## After the conference (post-event checklist)

1. **Countdown** — Admin → Countdown → uncheck **Show countdown on the home page** → Save.
2. **Popup** — Disable or update to “Thank you / see gallery” messaging.
3. **Events** — Mark the conference as **Past**; add gallery slug if you have photos.
4. **Hotel block on home** — There is **no off switch yet**; the “Reserve Your Stay” section always shows unless a developer hides it or repurposes it. Plan a replacement section before removing it (see ideas below).
5. Hard refresh your browser (`Ctrl + Shift + R`).

---

## Homepage ideas when countdown + hotel are removed

**Already live:** Relive the Feast grid + testimonials — edit under **Site pages → Home**.

**Still optional (developer):**

| Idea | Why it works |
|------|----------------|
| **Video highlight** | Promote one recap in the existing YouTube block |
| **Next steps row** | Cards: Gallery · About · Donate · Contact |
| **Stay connected** | Mailing list or social CTA using footer links |
| **Ministry impact stats** | Simple numbers (nations, attendees, years) |
| **“Save the date” for next year** | Light CTA before details exist |
| **Hotel off switch** | Hide “Reserve Your Stay” post-conference without a deploy |

---

## Founder page — Ministry Focus section

The tabbed block at the bottom of `/founder` is **`FounderMinistryCards.tsx`** (styles in `FounderMinistryCards.module.css`).

| Detail | Current behavior |
|--------|------------------|
| Section title | **“Her Ministry Worldwide”** (centered) |
| Tabs | Global Impact · Mission Outreach · Rehabilitation Ministry (centered row) |
| Rotation | **15 seconds** per tab (respects “reduce motion”) |
| Content | Text + background images are **fixed in code**, not Admin |
| Layout | Card grows with the longest tab; body copy is **left-aligned** in a **wide** column so long text (e.g. Global Impact) fits comfortably |

**Editor requests (developer):**

- Wire tab labels / auto-rotate timing to Admin.
- Turn off auto-rotate or add a fourth card if needed.

---

## Image uploads

- Paste a **Cloudinary** (or any HTTPS) URL, or upload a file.
- When **Cloudinary API keys** are set on the host, uploads go to your Cloudinary account (best for production).
- Otherwise files may save under `/public/uploads/` on the server (may not persist on Vercel after redeploy).

---

## Quick troubleshooting

| Problem | Try |
|---------|-----|
| Changes not visible | Hard refresh; incognito |
| Gallery not saving / missing on site | Fill all fields + one photo; check **Draft** vs **Live** badge; read toast after **Save gallery** |
| Gallery order wrong on `/gallery` | **Gallery** tab → **↑ Up** / **↓ Down** → **Save gallery** → hard refresh |
| Past event not on Events page | Set type **Past event**, complete all fields, **Save gallery** |
| Countdown wrong time | Set target on the **event** + pick it under Countdown |
| Broke the whole site | Versions → Undo or Restore Zero |
| Lost registrations | Registrations are separate — undo does not delete them |
| `git` “no space left on device” | Free disk space on `C:` (delete `.next`, empty Recycle Bin, run Disk Cleanup) — not a site bug |

---

## For developers

- **CMS storage:** `data/cms-data.json` locally; on **Vercel**, `src/lib/cms-persistence.ts` reads/writes **private Blob** (`feast-of-esther/cms-data.json`, `feast-of-esther/cms-history.json`) when `BLOB_READ_WRITE_TOKEN` is set. `GET /api/admin/cms-status` reports whether saves are writable.
- **No separate CMS database** — Admin `PUT` handlers call `readCmsData` / `writeCmsData` in `src/lib/cms-store.ts` (with `cmsErrorResponse` on failure)
- **Cache:** Root `layout.tsx` uses `force-dynamic`; Blob reads use `useCache: false`; `revalidateAfterCmsSave` invalidates `/` layout after writes
- **Gallery + events sync:** `src/lib/gallery-event-sync.ts` from `PUT /api/admin/images` when `galleryCollections` is present; types on `GalleryCollection` (`collectionType`, `linkedEventId`, `eventDateLabel`, `eventVenue`)
- **Gallery validation:** `normalizeGalleryCollection`, `isGalleryCollectionComplete` in `src/lib/gallery-data.ts`
- **Gallery reorder:** `AdminReorderButtons` + `swapArrayItems` in `AdminGalleryEditor.tsx` (array order = `/gallery` index order)
- **Slugs:** `src/lib/slugify.ts`, `AdminSlugField.tsx`
- **Donate intents:** `POST /api/donate/intent` → `appendDonationIntent`; admin list `GET /api/admin/donations`
- **Preview iframe:** `src/app/admin/preview/page.tsx` + `admin-preview-draft` (localStorage + postMessage)
- History: `src/lib/cms-history.ts`, UI: `src/components/admin/AdminVersionsPanel.tsx`
- Homepage: `HomeClient.tsx`, `src/lib/home-content.ts`, `src/lib/relive-feast-grid.ts` (`DEFAULT_RELIVE_FEAST_IMAGES`, unique grid helpers), `AdminHomePageEditor.tsx`, `HomeReliveFeast.tsx` (per-cell timers — use `number` for `setInterval` ids in browser code)
- Executives: `src/app/executive/`, `src/lib/executive-data.ts`, `PUT /api/admin/executives`, `AdminExecutivesEditor.tsx`
- Placeholders: `src/lib/site-placeholder-catalog.ts`, `site-placeholders.ts`, `AdminPlaceholdersPanel.tsx`
- Contact email constant: `SITE.contactEmail` in `src/lib/site-content.ts` (`feastofesthernaa@gmail.com`)
- Public read API: `GET /api/site-config`
- Admin APIs: `src/app/api/admin/*`
- **Quality check:** `npx tsc --noEmit`, `npm run lint`, `npm run build` after substantive changes

Update this file when new Admin fields or toggles are added.

---

*Last updated: May 23, 2026 — Vercel Blob CMS persistence, Relive the Feast 30-photo pool + unique 3×3 grid, admin save errors/banner, stale-cache fixes for production.*
