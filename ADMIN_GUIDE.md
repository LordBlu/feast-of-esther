# Feast of Esther — Admin guide

This document is for anyone editing the public site through **`/admin`**. A shorter copy also lives inside the dashboard under the **Guide** tab.

---

## Sign in

1. Open **`/admin/login`** on your site (e.g. `https://yoursite.com/admin/login`).
2. Enter the admin passphrase (set by your host as `ADMIN_DASHBOARD_PASSWORD` — not editable in the UI).
3. Use **Log out** when you are done on a shared computer.

---

## See your changes on the live site

Saving in Admin updates **`data/cms-data.json`** on the server. Your browser may still show an **old cached** page.

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
4. Ask a developer to confirm the server saved `data/cms-data.json` (on some hosts, file writes do not persist without extra storage).

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

### Social Links

Footer icons: URL, label, enable/disable, add/remove.

### Gallery

Each **collection** is one folder on `/gallery` and its own page `/gallery/your-slug`.

1. Fill **URL slug**, **title**, **year**, **description**, and **at least one photo** (Cloudinary URL or upload).
2. Choose collection type:
   - **General photos** — gallery only.
   - **Past event** — also appears on the **Events** page under “Past Events” (no need to create the same event twice under Events).
3. For **Past event**, add **Event dates** (e.g. `June 18–20, 2025`) and optional **venue**.
4. Wait for the **Live on site** badge (not **Draft**), then click **Save gallery**.

**Draft** means something is still missing — the yellow hint lists what’s needed. **Yellow-highlighted** photos are demo placeholders you can replace or delete.

**Preview (right side on a wide screen):** **Draft** shows unsaved edits; **Live site** shows what visitors see after save. Hard refresh (`Ctrl + F5`) if the live preview looks stale.

### About Page

Hero, mission lines, **story paragraphs** (one box per paragraph — add/remove), and **leadership** (one card per person: name, role, photo, short bio).  
**Note:** Some hero fields are stored but **not shown** on the current `/about` layout — use **Site pages → About Us** for the case-study page.

### Site pages

Copy for Gallery, Events (hotel block labels, etc.), Contact, Donate, Register, Founder (hero URL + bio paragraphs), About Us (focus bullets, mega accent, CTA bar, sidebar photos per section).

### Donations

View people who used the donate page: chose **Zeffy** or **PayPal**, clicked **Give**, or opened PayPal. This is a **log only** — not payment processing. Edit donate page **wording** under **Site pages → Donate**.

### Registrations

View and search sign-ups; **Download CSV**. You cannot edit or delete rows here.

### Versions

Undo, Zero, and 30 save slots — see [Reset or undo](#reset-or-undo-site-content) above.

---

## Homepage sections (what exists today)

**Order on `/`:** ministry cards → **Relive the Feast** (3×3 photo grid, rotates every 3s) → hotel block → countdown → **testimonials** marquee (below countdown).

| Section | Editable in Admin? |
|---------|---------------------|
| Hero, mission quote, Our Purpose, ministry cards | **No** — `src/lib/site-content.ts` |
| Relive the Feast (image URLs) | **Partial** — `pageContent.home` in JSON; **no dedicated Admin tab yet** (developer) |
| Testimonials (quotes + names) | **Partial** — same `home` object in JSON |
| Hotel block | **Partial** — Imagery + Site pages → Events labels; **no off switch** |
| Countdown | **Yes** — Countdown tab |

After any homepage change, hard refresh (`Ctrl + Shift + R` on Windows).

---

## What you cannot change in Admin (needs a developer)

- Homepage headline, mission quote, “Our Purpose” text, and ministry card copy (in code: `src/lib/site-content.ts`).
- Navigation menu labels/routes, page layout, colors, fonts.
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

**Already live:** Relive the Feast grid + testimonials marquee (see table above). Wire URLs/quotes through Admin when a **Home** tab is added, or edit `pageContent.home` in `cms-data.json` with developer help.

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

- Wire card text/images to **Site pages → Founder** or Imagery.
- Add Admin **Home** tab for Relive URLs / testimonials JSON.
- Turn off auto-rotate or add a fourth card if needed.

---

## Image uploads

- Paste a **Cloudinary** (or any HTTPS) URL, or upload a file (stored under `/uploads/...` on your server).
- Prefer Cloudinary for production so images survive redeploys.

---

## Quick troubleshooting

| Problem | Try |
|---------|-----|
| Changes not visible | Hard refresh; incognito |
| Gallery not saving / missing on site | Fill all fields + one photo; check **Draft** vs **Live** badge; read toast after **Save gallery** |
| Past event not on Events page | Set type **Past event**, complete all fields, **Save gallery** |
| Countdown wrong time | Set target on the **event** + pick it under Countdown |
| Broke the whole site | Versions → Undo or Restore Zero |
| Lost registrations | Registrations are separate — undo does not delete them |
| `git` “no space left on device” | Free disk space on `C:` (delete `.next`, empty Recycle Bin, run Disk Cleanup) — not a site bug |

---

## For developers

- **CMS file:** `data/cms-data.json` (events, popup, images, about, social, registrations, `donationIntents`, `pageContent`, …)
- **No separate CMS database** — Admin `PUT` handlers call `readCmsData` / `writeCmsData` in `src/lib/cms-store.ts`
- **Gallery + events sync:** `src/lib/gallery-event-sync.ts` from `PUT /api/admin/images` when `galleryCollections` is present; types on `GalleryCollection` (`collectionType`, `linkedEventId`, `eventDateLabel`, `eventVenue`)
- **Gallery validation:** `normalizeGalleryCollection`, `isGalleryCollectionComplete` in `src/lib/gallery-data.ts`
- **Slugs:** `src/lib/slugify.ts`, `AdminSlugField.tsx`
- **Donate intents:** `POST /api/donate/intent` → `appendDonationIntent`; admin list `GET /api/admin/donations`
- **Preview iframe:** `src/app/admin/preview/page.tsx` + `admin-preview-draft` sessionStorage key
- History: `src/lib/cms-history.ts`, UI: `src/components/admin/AdminVersionsPanel.tsx`
- Homepage extras: `src/lib/home-content.ts`, `HomeReliveFeast.tsx`, `HomeTestimonialsMarquee.tsx`, `pageContent.home` in `cms-types.ts`
- Public read API: `GET /api/site-config`
- Admin APIs: `src/app/api/admin/*`
- **Quality check:** `npx tsc --noEmit`, `npm run lint`, `npm run build` after substantive changes

Update this file when new Admin fields or toggles are added.

---

*Last updated: May 2026 — Admin Gallery tab, past-event sync, friendly About/leadership editors, Donations log, Draft/Live preview.*
