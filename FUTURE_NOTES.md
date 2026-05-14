# Future notes (for agents / new chats)

## Workflow

- **Build before pairing:** The maintainer runs `npm run build` before starting a chat with the coding agent, to confirm the app compiles and to preview how the site looks. Assume the latest local build has already been checked unless they say otherwise.
- **Lint on Windows:** Use PowerShell syntax, e.g. `Set-Location "path\to\feast-of-esther"; npm run lint` — not `cd /d` (that is CMD-only).

## Project (one line)

- **feast-of-esther:** Next.js (App Router) site for Feast of Esther — North America; JSON-backed CMS under `data/cms-data.json`, admin routes under `src/app/api/admin/`.

## Progress so far

- **Events page — Programme block:** Replaced the old alternating “Event Schedule” timeline with a **Programme** section modeled on the Alamein-style layout: three clickable **day cards** (18–20 June 2026), **Next →** cycles days, **time | status dot | title/details** timeline, accent `#006699`, responsive stacking on small screens. Implementation: `src/components/events/ProgrammeSection.tsx` + `ProgrammeSection.module.css`, wired from `src/app/events/page.tsx`. Schedule copy in the component is **placeholder** until final programme is confirmed.
- **Events page:** Still includes hero, info card, hotel block, past events grid; programme sits between info card and hotel.
- **Gallery — index (`/gallery`):** Removed the small eyebrow “Gallery” above “Moments From the Feast” (`GalleryVerticalFeed.tsx`); top nav **GALLERY** link unchanged.
- **Gallery — collection detail (`/gallery/[slug]`):** Responsive **image grid** with hover enlarge + blur siblings (`GalleryImageGrid.tsx` + `.module.css`). **Back** control: `GalleryBackUnderLogo.tsx` — fixed under the 68px nav, aligned with `max-w-7xl` / logo padding; label is **“Back”** (not “Gallery”).
- **About:** Original split-column + right text nav restored (`/about`, `AboutSleek.module.css`). A prior full-width **AboutSleekSplit** experiment was **reverted** by maintainer request.
- **About 2 (`/about-2`):** Huge-inspired **sticky left visual rail** + scroll narrative; see table below. **Second polish:** rail vignette (`::after`), TOC blur + focus ring, `prefers-reduced-motion` on rail layers, leadership **carousel auto-advance only while Leadership section is active**, `decoding="async"` on rail images.
- **Global route transitions:** Public `<main>` content wrapped in **`PageViewTransition`** (Framer Motion `AnimatePresence` keyed by pathname) — see **Route transitions** section. **`/admin`** is excluded (no animation wrapper).
- **This file:** Living context for agents and follow-up sessions — **update it** when you ship meaningful UX or infra changes.

## Likely next steps (“the rest”)

- Final **programme copy** (times, titles, bullets) in `ProgrammeSection.tsx` or move data to CMS if editors need to change it without deploys.
- **README** tailored to this project (run, env vars, admin login, deployment).
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

## About pages (two variants)

| Route | Role |
|-------|------|
| `/about` | **Original** About Us: bordered sections, inline images, slim **text-only** right nav (`AboutSleek.module.css`). |
| `/about-2` | **Huge-style case study:** ~34% **left** sticky **sharp** full-bleed imagery (stacked crossfade + leadership carousel in rail only). **Right:** sticky **chrome** (logo tile + title em-dash + **Close → /**), horizontal section anchors, **mega headline** + **Gathering focus / Overview** two-column block with **pink arrow** list, **black CTA bar** (Register), then monochrome sections (`AboutHugeCaseStudy.tsx` + module). Nav bar: **About 2**. |

**Shared data:** `src/lib/about-chapters.ts` — `CHAPTERS`, `CAROUSEL_IMAGES`, `ChapterKey` (used by both About routes).

**Implementation files (About 2):** `src/app/about-2/page.tsx`, `AboutHugeCaseStudy.tsx`, `AboutHugeCaseStudy.module.css`.

**Nav:** `Navbar.tsx` — link **“About 2”** immediately after **“About Us”** (`href="/about-2"`). Mobile drawer lists the same `links` array.

---

## Quick file map (high-signal)

| Area | Files |
|------|--------|
| Layout shell | `src/components/ConditionalLayout.tsx`, `PageViewTransition.tsx` |
| Top nav | `src/components/Navbar.tsx` |
| About (original) | `src/app/about/page.tsx`, `AboutSleek.module.css` |
| About 2 | `src/app/about-2/*`, shared `src/lib/about-chapters.ts` |
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

When choosing one About permanently, either remove `/about-2` and the nav link or replace `/about` content and delete the unused route.

---

## Route transitions (global)

- **Implementation:** `src/components/PageViewTransition.tsx` wraps page `children` inside `<main>` in `ConditionalLayout.tsx` (public site only; **not** `/admin`).
- **Tech:** [Framer Motion](https://www.framer.com/motion/) `AnimatePresence` + `motion.div` keyed by `usePathname()` — **opacity-only** enter/exit (soft crossfade). **`useReducedMotion()`** shortens to a near-instant opacity tick.
- **Do not animate `transform` / `filter` on this wrapper:** A non-`none` `transform` or `filter` on an ancestor creates a new containing block in CSS, so **`position: fixed`** (e.g. `/about` right rail) and **`position: sticky`** (e.g. `/about-2` visual rail) pin to the animated box instead of the viewport and appear to scroll away. Keep this wrapper to opacity (or isolate motion inside leaf components).
- **`AnimatePresence`:** `initial={false}` so the **first load** of a URL does not play an enter animation (avoids a flash on cold visits).
- **Why not Huge’s source:** We do not copy [Huge](https://www.hugeinc.com/)’s bundles. Native React `ViewTransition` + `experimental.viewTransition` in Next is an alternative once you confirm React exports it for your exact versions.
