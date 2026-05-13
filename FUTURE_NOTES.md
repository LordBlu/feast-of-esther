# Future notes (for agents / new chats)

## Workflow

- **Build before pairing:** The maintainer runs `npm run build` before starting a chat with the coding agent, to confirm the app compiles and to preview how the site looks. Assume the latest local build has already been checked unless they say otherwise.
- **Lint on Windows:** Use PowerShell syntax, e.g. `Set-Location "path\to\feast-of-esther"; npm run lint` — not `cd /d` (that is CMD-only).

## Project (one line)

- **feast-of-esther:** Next.js (App Router) site for Feast of Esther — North America; JSON-backed CMS under `data/cms-data.json`, admin routes under `src/app/api/admin/`.

## Progress so far

- **Events page — Programme block:** Replaced the old alternating “Event Schedule” timeline with a **Programme** section modeled on the Alamein-style layout: three clickable **day cards** (18–20 June 2026), **Next →** cycles days, **time | status dot | title/details** timeline, accent `#006699`, responsive stacking on small screens. Implementation: `src/components/events/ProgrammeSection.tsx` + `ProgrammeSection.module.css`, wired from `src/app/events/page.tsx`. Schedule copy in the component is **placeholder** until final programme is confirmed.
- **Events page:** Still includes hero, info card, hotel block, past events grid; programme sits between info card and hotel.
- **This file:** Created to capture workflow and context for future sessions.

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
