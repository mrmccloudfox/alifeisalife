# Life Is A Life Benefit Website

React/Vite landing page for the “A life is a life, no matter how small” benefit concept supporting Hope House Colorado.

## Local Development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

The local Express/Vite server runs on `http://localhost:3000` by default. Use `PORT=3001 npm run dev` if port 3000 is busy.

## Production Preview

```bash
npm run build
PORT=3001 npm run start
```

## Vercel Deployment

This repo includes `vercel.json` and serverless functions under `api/`.

Vercel settings:

- Framework preset: `Vite`
- Build command: `npm run build:client`
- Output directory: `dist`
- Node version: `20.x`

Optional environment variable:

- `GEMINI_API_KEY`: enables Gemini-generated support-board responses. Without it, the app returns a local fallback response.

## Source Links

- What happened: https://x.com/libsoftiktok/status/2056919525107355654?s=20
- Why it is personal: https://x.com/libsoftiktok/status/2056937291919041009?s=20
- Poem reading: https://x.com/libsoftiktok/status/2056927043099459792?s=20
- Rocky Mountain Voice article: https://rockymountainvoice.com/2026/05/21/jeffco-student-barred-from-reading-pro-life-poem-after-school-calls-it-too-politically-charged/
- Hope House Colorado: https://hopehousecolorado.org/
