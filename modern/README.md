# Modern Portfolio (Astro)

This folder contains a modern rebuild of the portfolio using Astro + Tailwind.

It is **side-by-side** with the current static HTML site, so nothing at the repo root is overwritten yet.

## Local dev

```bash
cd modern
npm install
cp .env.example .env.local
npm run dev
```

## Auth0 setup

Set `modern/.env.local`:

```bash
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

In Auth0 application settings (Single Page Application), include:
- Allowed Callback URLs: `https://treyhelmer.com/login/`, `http://localhost:4321/login/`
- Allowed Logout URLs: `https://treyhelmer.com/`, `http://localhost:4321/`
- Allowed Web Origins: `https://treyhelmer.com`, `http://localhost:4321`

## Build

```bash
cd modern
npm run build
npm run preview
```

## Deploy (later)

This repo includes a GitHub Actions workflow that can deploy the Astro build output to GitHub Pages.

Cutover checklist (GitHub UI):
1) Repo Settings → Pages → **Build and deployment** → Source: **GitHub Actions**
2) (If needed) Repo Settings → Pages → Custom domain: `treyhelmer.com`
3) (If needed) Keep GoDaddy DNS pointed at GitHub Pages (no DNS change if it already is)

Notes:
- Custom domain support is handled via `public/CNAME` so the deployed site includes the CNAME file.
- Auth0 callback/logout/web-origin URLs must include the deployed and local URLs above.
