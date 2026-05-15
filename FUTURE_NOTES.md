# Future notes (for agents / new chats)

## Workflow

- **Build before pairing:** The maintainer runs `npm run build` before starting a chat with the coding agent, to confirm the app compiles and to preview how the site looks. Assume the latest local build has already been checked unless they say otherwise.
- **Lint on Windows:** Use PowerShell syntax, e.g. `Set-Location "path\to\feast-of-esther"; npm run lint` — not `cd /d` (that is CMD-only).

## Project (one line)

- **feast-of-esther:** Next.js (App Router) site for Feast of Esther — North America; JSON-backed CMS under `data/cms-data.json`, admin routes under `src/app/api/admin/`. **Hadassah** assistant: `OLLAMA_API_KEY` (+ optional `OLLAMA_CHAT_MODEL`) for `POST /api/hadassah` → Ollama Cloud.

## Progress so far

- **Handoff (Cursor / maintainer resting):** About Us is a **single** route — **`/about`** serves the Huge-style case study (`AboutHugeCaseStudy`). **`/about-2`** **`permanentRedirect`s** to **`/about`** for old links. Navbar shows one **About Us** item. **Site pages** CMS tab edits `pageContent` (gallery copy, events hotel block, contact, donate, registration, founder hero + bio, About headline tweaks). Original **AboutSleek** layout removed. *Update this file when you ship more.*
- **Events page — Programme block:** Replaced the old alternating “Event Schedule” timeline with a **Programme** section modeled on the Alamein-style layout: three clickable **day cards** (18–20 June 2026), **Next →** cycles days, **time | status dot | title/details** timeline, accent `#006699`, responsive stacking on small screens. Implementation: `src/components/events/ProgrammeSection.tsx` + `ProgrammeSection.module.css`, wired from `src/app/events/page.tsx`. Schedule copy in the component is **placeholder** until final programme is confirmed.
- **Events page:** Still includes hero, info card, hotel block, past events grid; programme sits between info card and hotel.
- **Gallery — index (`/gallery`):** Removed the small eyebrow “Gallery” above “Moments From the Feast” (`GalleryVerticalFeed.tsx`); top nav **GALLERY** link unchanged.
- **Gallery — collection detail (`/gallery/[slug]`):** Responsive **image grid** with hover enlarge + blur siblings (`GalleryImageGrid.tsx` + `.module.css`). **Back** control: `GalleryBackUnderLogo.tsx` — fixed under the 68px nav, aligned with `max-w-7xl` / logo padding; label is **“Back”** (not “Gallery”).
- **About Us (`/about`):** Huge-inspired **sticky left visual rail** + scroll narrative (`AboutHugeCaseStudy.tsx` + `AboutHugeCaseStudy.module.css` under `src/app/about/`). **Chrome bar** (woman-led gathering title + Close) **removed** for now. **Leadership:** first profile = featured bio block; **regional row** (3 names, one line) with **circular portraits** (~165px desktop / ~135px mobile, pink double ring border) + name/role; sidebar photo follows scroll/hover per leader (`data-leader-profile`). No auto-rotating carousel. **CMS:** `about.leadershipProfiles` JSON (name, role, imageUrl, blurb) on Admin **About** tab; `pageContent.about2` for mega/focus/CTA + **per-section sidebar image URLs** (Site pages → About Us).
- **Global route transitions:** Public `<main>` content wrapped in **`PageViewTransition`** (Framer Motion `AnimatePresence` keyed by pathname) — see **Route transitions** section. **`/admin`** is excluded (no animation wrapper).
- **This file:** Living context for agents and follow-up sessions — **update it** when you ship meaningful UX or infra changes.

## Likely next steps (“the rest”)

- Final **programme copy** (times, titles, bullets) in `ProgrammeSection.tsx` or move data to CMS if editors need to change it without deploys.
- **README** — starter section replaced with project pointers; extend with env var table / deploy checklist when useful.
- **Production hardening:** `ADMIN_DASHBOARD_PASSWORD` / `ADMIN_DASHBOARD_TOKEN` set on host; understand JSON file persistence on serverless (Vercel: use persistent storage or external DB if registrations must survive).
- **Client preview URL** — see below.

---

## Sharing the site with a client (no `npm run dev` on your machine)

You do **not** need a custom domain to give them a link. You need a **hosted deployment**; the host gives you a URL like `your-project.vercel.app`.

**Recommended: Vercel (fits Next.js)**

1. Push the repo to **GitHub** (Vercel connects to GitHub; each push can auto-deploy).
2. Sign up at [vercel.com](https://vercel.com), **Import** the repository, accept defaults for Next.js.
3. Vercel runs `npm run build` in the cloud and serves the app 24/7. You get a **stable preview URL** you can email the client. You can turn deployments **public** so they see the latest main branch, or use **Preview Deployments** per branch/PR.
4. **Domain later:** In Vercel, add the real domain when ready; the `.vercel.app` URL can keep working or redirect.

**Important for “all the features” on the preview**

- **Admin + JSON writes:** If the admin dashboard writes to `data/cms-data.json`, on Vercel the filesystem is **ephemeral** — changes may not persist across deploys/restarts unless you add external storage (database, blob, or Vercel KV / similar). For a **read-only marketing preview**, public pages are fine; for **testing admin saves**, call that out or use a staging setup with persistent storage.
- Set **environment variables** in the Vercel project settings for anything the build or server needs (e.g. admin secrets), same as you would locally in `.env`.

**Alternatives**

- **Netlify**, **Cloudflare Pages** — also support Next.js with varying feature parity; check their Next docs for App Router + server features you use.
- **Temporary tunnel (not ideal for “real” client review):** Tools like **ngrok** can expose `localhost:3000` with a public URL while your PC runs `npm run dev` — good for a quick peek, not for “leave it up for a week” without your machine on.

**Summary:** Push to GitHub → deploy to Vercel (or similar) → send the **`.vercel.app`** link. No domain required until you are ready; no need to keep `npm run dev` running once it is deployed.

---

## About Us (single route)

| Route | Role |
|-------|------|
| `/about` | **Huge-style case study:** ~34% **left** sticky **sharp** full-bleed imagery (stacked crossfade by scroll section; leadership rail uses active leader `imageUrl`). **Right:** **no top chrome bar** (removed); **mega headline** + **Gathering focus / Overview** + **black CTA bar**, then sections (Journey, Who we are, Vision, Mission, **Leadership**, Chapters). **Leadership:** Grace-style featured leader + **3-up row** (Mabel, Felicia, Banks) with tiny circular headshots. Files: `src/app/about/page.tsx`, `AboutHugeCaseStudy.tsx`, `AboutHugeCaseStudy.module.css`. |
| `/about-2` | **Legacy URL only:** `permanentRedirect('/about')` in `src/app/about-2/page.tsx` — no duplicate layout. |

**Shared data:** `src/lib/about-chapters.ts` — `CHAPTERS`, `ChapterKey` (chapter locations for Outreach section).

**Nav:** `Navbar.tsx` — one link: **About Us** → `/about` (desktop + mobile `links` array).

**CMS (long-form About copy):** Main narrative + **`leadershipProfiles`** array (`name`, `role`, `imageUrl`, `blurb`) from **`about`** in `cms-data.json` / Admin **About Page** tab. **`pageContent.about2`:** mega accent, focus bullets, CTA bar, optional **`visualAbout` / `visualOurJourney` / …** sidebar URLs (Admin **Site pages → About Us**). `chromeTitle` still in schema but unused while chrome bar is hidden.

---

## Quick file map (high-signal)

| Area | Files |
|------|--------|
| Layout shell | `src/components/ConditionalLayout.tsx`, `PageViewTransition.tsx` |
| Top nav | `src/components/Navbar.tsx` |
| About Us | `src/app/about/page.tsx`, `AboutHugeCaseStudy.tsx`, `AboutHugeCaseStudy.module.css`; redirect stub `src/app/about-2/page.tsx` |
| Shared chapter map | `src/lib/about-chapters.ts` |
| Gallery index | `src/components/GalleryVerticalFeed.tsx`, `GalleryMosaic.module.css` |
| Gallery detail | `src/app/gallery/[slug]/page.tsx`, `GalleryImageGrid.tsx`, `GalleryBackUnderLogo.tsx` |

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

- **Storage:** Merged into `data/cms-data.json` under `pageContent` (nested keys: `gallery`, `events`, `contact`, `donate`, `registration`, `founder`, `about2`).
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
