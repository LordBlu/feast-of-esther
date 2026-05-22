This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Feast of Esther — North America

- **Run locally:** `npm run dev` → [http://localhost:3000](http://localhost:3000)
- **Content:** JSON-backed CMS in `data/cms-data.json` (events, popup, imagery, about, **executives**, social, registrations, **`pageContent`**). **Admin:** `/admin` — see **`ADMIN_GUIDE.md`**.
- **Public routes (high-signal):** `/` home · `/about` · `/executive` Executives · `/founder` · `/gallery` · `/events` · `/donate` · `/contact` · `/registration`
- **Hadassah (AI chat):** **`OLLAMA_API_KEY`** on the server. Optional **`OLLAMA_CHAT_MODEL`** (`POST /api/hadassah`).
- **Donations:** Zeffy embed via Admin or `NEXT_PUBLIC_ZEFFY_EMBED_URL`; PayPal via `NEXT_PUBLIC_PAYPAL_DONATE_URL`.
- **Agent / maintainer notes:** **`FUTURE_NOTES.md`** (latest features, env vars, Vercel caveats).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
