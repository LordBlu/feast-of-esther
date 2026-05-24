# Future notes (for agents / new chats)

## Workflow

- **Build before pairing:** The maintainer runs `npm run build` before starting a chat with the coding agent, to confirm the app compiles and to preview how the site looks. Assume the latest local build has already been checked unless they say otherwise.
- **Lint on Windows:** Use PowerShell syntax, e.g. `Set-Location "path\to\feast-of-esther"; npm run lint` — not `cd /d` (that is CMD-only).
- **Git push failed (`No space left on device`):** Free space on `C:` first (delete project `.next`, empty Recycle Bin, Disk Cleanup). Safe dev cleanup: `Remove-Item -Recurse -Force .next` from repo root. If `.git\index.lock` remains after a failed commit, delete it only when no other git process is running. Then `git add`, `git commit`, `git push` again.

## Project (one line)

- **feast-of-esther:** Next.js (App Router) site for Feast of Esther — North America; JSON-backed CMS under `data/cms-data.json`, admin routes under `src/app/api/admin/`. **Hadassah** assistant: `OLLAMA_API_KEY` (+ optional `OLLAMA_CHAT_MODEL`) for `POST /api/hadassah` → Ollama Cloud.

## Progress so far

- **Handoff (May 2026):** Resume from **`FUTURE_NOTES.md`** + **`ADMIN_GUIDE.md`** + in-app **Guide** tab. **Docs synced** (May 24): gallery collection reorder. **Latest shipped (May 24):**
  - **Gallery reorder:** **↑ Up** / **↓ Down** on each collection in Admin → **Gallery** (`AdminGalleryEditor.tsx`, `5484ecc`). Public `/gallery` order follows `galleryCollections` array order after **Save gallery**.
- **Earlier (May 23):** Relive grid + Blob persistence + gallery draft preview fix (`318766c`). **May 23 details:**
  - **Vercel Blob CMS:** `src/lib/cms-persistence.ts` + `@vercel/blob` — production saves go to private Blob (`feast-of-esther/cms-data.json`, history JSON). Requires **Blob store connected** + `BLOB_READ_WRITE_TOKEN` + redeploy. Admin yellow banner + clear API errors when missing. Local dev still uses `data/cms-data.json`.
  - **Stale public site fix:** `layout.tsx` `force-dynamic`; Blob `get()` with `useCache: false`; no fallback to bundled JSON on Vercel when Blob mode is on (`b21b82d`).
  - **Relive the Feast:** **30** default Cloudinary URLs in `src/lib/relive-feast-grid.ts`; 3×3 grid assigns **9 unique** images on load; rotation picks a random URL **not used by another cell** (`3285ce9`). Editable: Admin → **Site pages → Home** → Relive image URLs → **Save site page copy**.
- **Earlier (May 20):**
  - **`/executive` (Executives page):** Chairperson hero (photo left, bio right) + 3×3 committee grid with **per-cell** slideshow timing (kaleidoscopic stagger in `HomeReliveFeast.tsx` uses the same idea). CMS field **`executives`** in `cms-data.json`; Admin → **Executives** tab (`AdminExecutivesEditor.tsx`, `PUT /api/admin/executives`). Nav link: **Executives**.
  - **Admin → Placeholders:** Bundled demo images for Home hero/ministry, About sidebar, Founder, Events fallbacks (`site-placeholder-catalog.ts`, `placeholderUrls` on `SiteImages`).
  - **Admin → Site pages → Home:** Hero headline, mission quote, purpose block, ministry card text, Relive URLs, testimonials (`AdminHomePageEditor.tsx`, `pageContent.home`).
  - **Admin → Site pages → Founder:** Bio paragraphs + ministry panel copy (`AdminFounderPageEditor.tsx`); carousel still under **Imagery**.
  - **Performance / security batch:** Server-loaded CMS in root layout (`SiteShellProvider`); `SiteImage` + Cloudinary widths; filtered `GET /api/site-config`; rate limits on login/registrations/donate/Hadassah; production admin auth required; security headers in `next.config.ts`.
  - **Donate page:** Visitor-friendly offline giving copy; canonical contact **`feastofesthernaa@gmail.com`** in `SITE.contactEmail` (`site-content.ts`). Zeffy embed via Admin **Site pages → Donate** or `NEXT_PUBLIC_ZEFFY_EMBED_URL`; PayPal via `NEXT_PUBLIC_PAYPAL_DONATE_URL` on Vercel.
  - **Relive the Feast:** 3×3 grid — per-cell staggered timers; **no duplicate images across cells** at once; hide when fewer than 9 URLs or `showReliveFeast === false`. See `relive-feast-grid.ts`, `HomeReliveFeast.tsx`.
  - **Countdown:** Section hidden after target time passes (`FlipClockCountdown.tsx` returns null).
- **Earlier (still relevant):** Gallery tab + past-event sync; About leadership 3-up row; Donations click log; Draft/Live preview; Versions/Guide; `FounderMinistryCards` ministry tabs still partly hardcoded.
- **CMS:** `data/cms-data.json` + `src/app/api/admin/*` — no separate DB. **QA:** `npm run build` after pulls (Vercel runs full TS check). **Build gotcha:** browser timer IDs use `number`, not `ReturnType<typeof setInterval>` (Node vs DOM types). **Not from this app:** MetaMask `inpage.js` = browser extension. *Update this file when you ship more.*
- **Events page — Programme block:** Replaced the old alternating “Event Schedule” timeline with a **Programme** section modeled on the Alamein-style layout: three clickable **day cards** (18–20 June 2026), **Next →** cycles days, **time | status dot | title/details** timeline, accent `#006699`, responsive stacking on small screens. Implementation: `src/components/events/ProgrammeSection.tsx` + `ProgrammeSection.module.css`, wired from `src/app/events/page.tsx`. Schedule copy in the component is **placeholder** until final programme is confirmed.
- **Events page:** Still includes hero, info card, hotel block, past events grid; programme sits between info card and hotel.
- **Homepage (`/`):** Hero + CTAs; copy from **`pageContent.home`** (Admin **Site pages → Home**). **Relive the Feast** 3×3 grid with **staggered** per-cell slideshow (`HomeReliveFeast.tsx`). Then hotel → countdown (hides when ended) → testimonials. Fallbacks: `site-content.ts`, `home-content.ts`, `site-placeholders.ts`.
- **Gallery — index (`/gallery`):** **No Back** control (Back only on collection pages). **Header** top padding **halved** vs old layout. Title + **left-aligned** gospel-style subtitle (`gallery-page-header--index`, default in `GalleryVerticalFeed.tsx`); editable via **Site pages → Gallery**. **Mosaic tiles** link to **`/gallery/[slug]`** (folders) — **not** lightbox on index. Default **9** collections in `gallery-data.ts` (2025–2023); more via Admin **Gallery** tab (reorder with ↑ / ↓, then **Save gallery**).
- **Gallery — collection detail (`/gallery/[slug]`):** **Lightbox** on individual photos (`GalleryImageLightbox.tsx`) with prev/next + keyboard. Grid hover enlarge + blur siblings (`GalleryImageGrid.tsx`). **Back:** `GalleryPageBack.tsx` — **sticky** under nav (`top: 68px`), links to `/gallery`. Re-export: `GalleryBackUnderLogo.tsx`.
- **About Us (`/about`):** Huge-inspired **sticky left visual rail** + scroll narrative. **Chrome bar** (woman-led gathering + Close) **removed**. **Leadership:** featured leader (Grace Okonrende) + **3-up row** (Mabel Odigie, Rev. Dr. Felicia Ajayi, Dr. Banks) — circular portraits **~165px** desktop / **~135px** mobile, pink ring border; sidebar image on scroll/hover (`data-leader-profile`). No carousel. **CMS:** `about.leadershipProfiles` + `pageContent.about2` sidebar image URLs.
- **Global UI:** Nav active link = **full bar height** fill (no lift/glow). **Footer** compact padding on all pages (`.site-footer` in `globals.css`). **Hadassah:** launcher/window title **“Hadassah”** only (no portrait image).
- **Admin — Versions:** Undo stack + named save slots (`src/lib/cms-history.ts`, `AdminVersionsPanel.tsx`); constants in `cms-history-constants.ts` (do not import `cms-history.ts` from client — uses `node:fs`).
- **Global route transitions:** Public `<main>` content wrapped in **`PageViewTransition`** (Framer Motion `AnimatePresence` keyed by pathname) — see **Route transitions** section. **`/admin`** is excluded (no animation wrapper).
- **This file:** Living context for agents and follow-up sessions — **update it** when you ship meaningful UX or infra changes.

## Admin dashboard (May 2026 — editor-friendly)

| Tab | What it does |
|-----|----------------|
| **Guide** | Short in-app help (links to `ADMIN_GUIDE.md`) |
| **Events** | Upcoming/past events; optional **gallery slug** links to `/gallery/[slug]` |
| **Countdown** | Homepage flip clock |
| **Popup** | Welcome modal |
| **Imagery** | Hero, YouTube, founder carousel URLs, hotel, etc. — **not** gallery folders |
| **Gallery** | Collections → `/gallery/[slug]`; **General photos** or **Past event** (syncs Events page); **↑ / ↓ reorder** |
| **Social Links** | Footer icons |
| **About Page** | Hero, story **paragraphs** (list), **leadership** (per-person cards), mission |
| **Placeholders** | Replace/clear bundled demo photos (Home, About sidebar, Founder, Events) |
| **Executives** | Chairperson + committee on `/executive` |
| **Site pages** | **Home**, Founder, Gallery, Donate, Contact, About sidebar, … |
| **Donations** | Log of donate-page interactions (`donationIntents` in JSON) |
| **Registrations** | Sign-ups + CSV export |
| **Versions** | Undo / Zero / 30 save slots |

**Save rules (Gallery):** Every field required for public listing: slug, title, year, description, **≥1 photo URL**. Incomplete rows save as **Draft** (stored but hidden on `/gallery`). Toast explains live vs draft counts. **`PUT /api/admin/images`** runs `syncGalleryCollectionsToEvents` and `revalidatePath` for `/gallery` + `/events`.

**Preview (wide screens):** Right column — **Draft** (unsaved, `/admin/preview`) vs **Live site** (saved JSON).

**No separate “big backend”:** Admin → Next.js API routes → read/write `data/cms-data.json` (+ Cloudinary for images). See `ADMIN_GUIDE.md` for maintainers.

---

## Likely next steps (“the rest”)

- **Founder → Ministry Focus** tabbed cards (`FounderMinistryCards.tsx`) — tab labels/15s rotation still in code; partial CMS via Site pages + Placeholders.
- **Hotel block** off toggle on homepage post-event.
- **PayPal URL** in Admin UI (today: `NEXT_PUBLIC_PAYPAL_DONATE_URL` on Vercel only).
- Final **programme copy** in `ProgrammeSection.tsx` or CMS.
- ~~**Vercel persistence**~~ **Done:** private Vercel Blob (`cms-persistence.ts`). Confirm `feast-of-esther-blob` stays connected after domain changes.
- **Env checklist** — see table below.

## Vercel / local environment variables (high-signal)

| Variable | Purpose |
|----------|---------|
| `ADMIN_DASHBOARD_PASSWORD` | Required in production for `/admin` login |
| `ADMIN_DASHBOARD_TOKEN` | Session cookie signing (set a long random value) |
| `OLLAMA_API_KEY` | Hadassah chat (`POST /api/hadassah`) |
| `OLLAMA_CHAT_MODEL` | Optional; default `qwen3-coder:480b-cloud` |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Preferred image uploads (CDN URLs) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_UPLOAD_FOLDER` | Optional Cloudinary config |
| `NEXT_PUBLIC_ZEFFY_EMBED_URL` | Donate page Zeffy iframe (or set in Admin → Site pages → Donate) |
| `NEXT_PUBLIC_PAYPAL_DONATE_URL` | Donate page PayPal button link |
| `BLOB_READ_WRITE_TOKEN` | **Production CMS writes** (auto-set when Blob store is connected to the Vercel project) |

---

## Sharing the site with a client (no `npm run dev` on your machine)

You do **not** need a custom domain to give them a link. You need a **hosted deployment**; the host gives you a URL like `your-project.vercel.app`.

**Recommended: Vercel (fits Next.js)**

1. Push the repo to **GitHub** (Vercel connects to GitHub; each push can auto-deploy).
2. Sign up at [vercel.com](https://vercel.com), **Import** the repository, accept defaults for Next.js.
3. Vercel runs `npm run build` in the cloud and serves the app 24/7. You get a **stable preview URL** you can email the client. You can turn deployments **public** so they see the latest main branch, or use **Preview Deployments** per branch/PR.
4. **Domain later:** In Vercel, add the real domain when ready; the `.vercel.app` URL can keep working or redirect.

**Important for “all the features” on the preview**

- **Admin + CMS writes:** On Vercel, connect **Blob** storage to the project (see `ADMIN_GUIDE.md`). Saves update `feast-of-esther/cms-data.json` in Blob; the bundled repo JSON is only a seed. Without Blob, every Save fails (yellow banner in Admin).
- Set **environment variables** in the Vercel project settings for anything the build or server needs (e.g. admin secrets), same as you would locally in `.env`.

**Alternatives**

- **Netlify**, **Cloudflare Pages** — also support Next.js with varying feature parity; check their Next docs for App Router + server features you use.
- **Temporary tunnel (not ideal for “real” client review):** Tools like **ngrok** can expose `localhost:3000` with a public URL while your PC runs `npm run dev` — good for a quick peek, not for “leave it up for a week” without your machine on.

**Summary:** Push to GitHub → deploy to Vercel (or similar) → send the **`.vercel.app`** link. No domain required until you are ready; no need to keep `npm run dev` running once it is deployed.

---

## About Us (single route)

| Route | Role |
|-------|------|
| `/about` | **Huge-style case study:** left sticky imagery (per section + per leader); **no chrome bar**; mega headline + focus/overview + CTA bar; Leadership with featured bio + **3-up** regional row (~165px avatars). Files: `src/app/about/page.tsx`, `AboutHugeCaseStudy.tsx`, `AboutHugeCaseStudy.module.css`. |
| `/about-2` | **Legacy URL only:** `permanentRedirect('/about')` in `src/app/about-2/page.tsx` — no duplicate layout. |

**Shared data:** `src/lib/about-chapters.ts` — `CHAPTERS`, `ChapterKey` (chapter locations for Outreach section).

**Nav:** `Navbar.tsx` — Home, About Us, **Executives** (`/executive`), Founder, Gallery, Events, Contact (+ Register/Donate buttons).

**CMS (long-form About copy):** Main narrative + **`leadershipProfiles`** array (`name`, `role`, `imageUrl`, `blurb`) from **`about`** in `cms-data.json` / Admin **About Page** tab. **`pageContent.about2`:** mega accent, focus bullets, CTA bar, optional **`visualAbout` / `visualOurJourney` / …** sidebar URLs (Admin **Site pages → About Us**). `chromeTitle` still in schema but unused while chrome bar is hidden.

---

## Quick file map (high-signal)

| Area | Files |
|------|--------|
| Layout shell | `src/components/ConditionalLayout.tsx`, `PageViewTransition.tsx`, `SiteFooter.tsx` |
| Top nav | `src/components/Navbar.tsx` (`globals.css` `.navbar-link*`) |
| Homepage | `src/app/page.tsx`, `HomeClient.tsx`, `HomeReliveFeast.tsx`, `src/lib/relive-feast-grid.ts`, `HomeTestimonialsMarquee.tsx`, `HomeReserveStay.tsx`, `FlipClockCountdown.tsx`, `src/lib/site-content.ts`, `src/lib/home-content.ts`, `src/lib/site-placeholders.ts`, `src/lib/cms-persistence.ts` |
| Executives | `src/app/executive/page.tsx`, `ExecutiveClient.tsx`, `src/lib/executive-data.ts`, `cms-data.executives`, `PUT /api/admin/executives` |
| Founder | `src/app/founder/page.tsx`, `FounderHero.tsx`, `FounderCarousel.tsx`, `FounderMinistryCards.tsx` + `.module.css` |
| Placeholders | `src/lib/site-placeholder-catalog.ts`, `AdminPlaceholdersPanel.tsx`, `images.placeholderUrls` |
| About Us | `src/app/about/page.tsx`, `AboutHugeCaseStudy.tsx`, `AboutHugeCaseStudy.module.css`; redirect `src/app/about-2/page.tsx` |
| Shared chapter map | `src/lib/about-chapters.ts` |
| Gallery index | `src/components/GalleryVerticalFeed.tsx`, `GalleryMosaic.module.css` |
| Gallery detail | `src/app/gallery/[slug]/page.tsx`, `GalleryImageGrid.tsx`, `GalleryImageLightbox.tsx`, `GalleryPageBack.tsx` |
| Hadassah | `src/components/HadassahChat.tsx`, `POST /api/hadassah` |
| Admin gallery | `AdminGalleryEditor.tsx`, `gallery-event-sync.ts`, `gallery-data.ts` (`slugifyGallerySlug`, validation) |
| Admin preview | `AdminPagePreview.tsx`, `AdminPreviewCanvas.tsx`, `src/app/admin/preview/page.tsx` |
| Donate tracking | `src/app/api/donate/intent/route.ts`, `AdminDonationsPanel.tsx`, `donationIntents` in CMS |
| CMS history | `src/lib/cms-history.ts`, `cms-snapshot.ts`, `src/app/api/admin/history/*`, `AdminVersionsPanel.tsx` |

---

## Huge Inc.–style effects (reference only)

**We do not have access to [Huge](https://www.hugeinc.com/)’s proprietary source code** (minified bundles are not licensed for reuse). For “similar” motion and layout, reimplement **patterns** in our stack (CSS + React + optional `IntersectionObserver`).

### Patterns we already use / can extend

1. **Scroll-spy → visual state** — `IntersectionObserver` on section roots with `rootMargin` like `-28% 0px -58% 0px` so the “current” block is the one near the middle of the viewport; update React state to drive which full-bleed image layer has `opacity: 1` (others `0`). See `AboutHugeCaseStudy.tsx`.
2. **Sticky split column** — `position: sticky; top: 68px; height: calc(100vh - 68px)` on the visual rail so it pins under the main nav while the right column scrolls (`AboutHugeCaseStudy.module.css`).
3. **Layered crossfade** — multiple absolutely positioned `<figure>`s in a stack; `.active` class toggles opacity + slight `scale()` for a case-study feel.
4. **Route-level “swoosh”** — **implemented** globally on the public site via `PageViewTransition.tsx` (Framer Motion), not via copying Huge’s JS. Optional future upgrade: React **`ViewTransition`** + Next **`experimental.viewTransition`** when the stack clearly supports it end-to-end.

### Snippet: observer driving active section (concept)

```ts
useEffect(() => {
  const nodes = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const id = visible[0]?.target.id;
      if (id) setActiveSection(id);
    },
    { rootMargin: '-28% 0px -58% 0px', threshold: [0.08, 0.2, 0.45] },
  );
  nodes.forEach((n) => observer.observe(n));
  return () => observer.disconnect();
}, []);
```

### Snippet: stacked image layers (concept)

```css
.visualStack { position: relative; width: 100%; height: 100%; }
.visualLayer {
  position: absolute; inset: 0; opacity: 0; transform: scale(1.05);
  transition: opacity 0.65s ease, transform 1s ease;
}
.visualLayer.active { opacity: 1; transform: scale(1); }
```

---

## CMS — Site pages (`pageContent`)

- **Storage:** `pageContent` nested keys (`gallery`, `events`, `contact`, `donate`, `registration`, `founder`, `about2`, **`home`**) plus top-level **`executives`**, **`about`**, **`images`**, events, popup, countdown, etc.
- **Admin:** Dashboard tab **Site pages** — save calls **`PUT /api/admin/page-content`** (auth required).
- **Public:** **`GET /api/site-config`** returns `pageContent` for client pages that fetch it; server pages use `readCmsData()` from `src/lib/cms-store.ts`.
- **Typecheck note:** `tsconfig.json` includes `.next/types/**`. Run **`next build`** or **`next dev`** once so those files exist before **`npx tsc --noEmit`** on a clean tree.

---

## Route transitions (global)

- **Implementation:** `src/components/PageViewTransition.tsx` wraps page `children` inside `<main>` in `ConditionalLayout.tsx` (public site only; **not** `/admin`).
- **Tech:** [Framer Motion](https://www.framer.com/motion/) `AnimatePresence` + `motion.div` keyed by `usePathname()` — **opacity-only** enter/exit (soft crossfade). **`useReducedMotion()`** shortens to a near-instant opacity tick.
- **Do not animate `transform` / `filter` on this wrapper:** A non-`none` `transform` or `filter` on an ancestor creates a new containing block in CSS, so **`position: fixed`** and **`position: sticky`** (e.g. **About Us** visual rail on `/about`) pin to the animated box instead of the viewport and appear to scroll away. Keep this wrapper to opacity (or isolate motion inside leaf components).
- **`AnimatePresence`:** `initial={false}` so the **first load** of a URL does not play an enter animation (avoids a flash on cold visits).
- **Why not Huge’s source:** We do not copy [Huge](https://www.hugeinc.com/)’s bundles. Native React `ViewTransition` + `experimental.viewTransition` in Next is an alternative once you confirm React exports it for your exact versions.
