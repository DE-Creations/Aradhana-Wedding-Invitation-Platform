# Wedding Invitation — Frontend (React SPA)

A cinematic, luxury wedding-invitation single-page app built with **Vite + React**.
It consumes the Laravel API (see `../backend`) and renders a full-screen,
animated invitation experience.

## Tech stack

- **Vite** + **React 19**
- **Framer Motion** — scroll reveals, envelope open, gallery, RSVP modal
- **GSAP** / `@gsap/react` — available for advanced timelines
- **react-tsparticles** (`tsparticles` slim engine, lazy-loaded) — rose petals
- **Lenis** (`@studio-freight/lenis`) — smooth scrolling
- **Howler.js** — background music
- **Tailwind CSS v4** (`@tailwindcss/vite`) — layout & theme tokens
- **lucide-react** — icons
- **react-router-dom** — routing
- **axios** — API client

## Getting started

```bash
npm install
cp .env.example .env   # optional; only needed to point at a remote API
npm run dev
```

Then open:

- `http://localhost:5173/wedding/demo` — preview using bundled **mock data**
  (no backend needed)
- `http://localhost:5173/wedding/{slug}` — live invitation from the API
- `http://localhost:5173/wedding/{slug}/guest/{token}` — personalized (guest) view

During development `/api` and `/storage` are proxied to `http://localhost:8000`
(the Laravel backend). Change the target in `vite.config.js` if needed.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run oxlint |

## Project structure

```
src/
├── main.jsx / App.jsx          # entry + routing
├── index.css                   # Tailwind v4 theme tokens
├── lib/api.js                  # axios instance + media URL helper
├── data/mockData.js            # sample invitation (dev fallback)
├── styles/wedding-theme.css    # reusable luxury styling + animations
└── templates/wedding/
    ├── WeddingInvitation.jsx   # main template wrapper
    ├── utils.js                # date words, calendar & map URLs
    ├── sections/               # 10 full-screen sections
    ├── components/             # petals, music, scroll progress, reveal wrapper, ornaments
    └── hooks/                  # useInvitationData, useCountdown, useSmoothScroll
```

## Design system

Colors and fonts are exposed as Tailwind v4 tokens in `src/index.css`
(`--color-gold`, `font-script`, etc.) and as helper classes in
`src/styles/wedding-theme.css`.

- **Palette**: charcoal `#0D0D0D`, wine `#1A0A0F`, gold `#C9A96E`,
  gold-light `#E8D5A3`, ivory `#FAF7F2`, blush `#F5E6E0`, rose `#8B3A4A`
- **Fonts**: Great Vibes (names), Playfair Display (headings), Cormorant
  Garamond (body) — loaded via Google Fonts in `index.html`

## Notes

- **Performance**: the tsParticles engine is code-split and lazy-loaded; the
  initial JS bundle is ~160 KB gzipped. Images use `loading="lazy"`; music loads
  only after the envelope is opened.
- **Reduced motion**: all animations respect `prefers-reduced-motion`.
- **Offline**: after first load, fonts and assets are cached by the browser; a
  service worker can be added if full offline support is required.
- **Mock fallback**: if the API is unreachable in development, the UI falls back
  to `data/mockData.js` so it can be built without the backend.
```
