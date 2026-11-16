# ANAS_TIME

Premium one-page website for Moroccan bodybuilding athlete and coach **Anasse Time** — a dark, photographic, editorial experience built around verified public information, a clear coaching offer, and an honest application flow.

> **Status:** complete and verified locally. Not yet deployed, and no production domain is asserted.
> **Last verified:** 15 November 2026

---

## What is in the site

- Cinematic hero with supplied athlete photography and verified competition credentials
- Athlete profile, coaching services, four-step process, and training philosophy
- Gallery with keyboard-accessible lightbox
- Static Instagram archive section — clearly not presented as a live feed
- Coaching application form with validation, review, WhatsApp/Instagram/copy fallback, and an optional real endpoint
- Contact section with published WhatsApp and Instagram only
- Fixed session-time progress rail, responsive navigation, footer, and share image
- Self-hosted fonts, optimized responsive images, reduced-motion support

All public copy lives in `src/content/site.ts`. Research and content boundaries are documented in [`docs/anas-time-research.md`](docs/anas-time-research.md).

---

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Motion | GSAP + ScrollTrigger + Lenis |
| Styling | Modular CSS with custom properties |
| Fonts | `@fontsource` — Bebas Neue, Manrope, Space Grotesk |
| Images | Sharp-generated WebP/JPEG + blurred LQIP placeholders |
| QA | Playwright + axe-core |

No UI framework, CSS framework, or analytics package is included.

---

## Requirements

- **Node.js 20.19+ or 22.12+** (Vite 7 requirement)
- npm

---

## Quick start

```bash
npm install
npm run dev
```

The dev server runs at `http://127.0.0.1:5173`.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite on `127.0.0.1:5173` |
| `npm run build` | Type-check with `tsc --noEmit`, then build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run optimize:images` | Regenerate responsive images and LQIP JSON from the four source JPEGs at the repo root |

`optimize:images` expects the original files to still be present:

```
profil.jpeg
WhatsApp Image 2026-11-15 at 19.00.40.jpeg
WhatsApp Image 2026-11-15 at 19.00.40 (1).jpeg
WhatsApp Image 2026-11-15 at 19.00.40 (2).jpeg
```

If they are archived elsewhere, update `scripts/optimize-images.mjs` before running it.

---

## Configuration

Copy `.env.example` to `.env.local` and fill only what is confirmed.

```bash
# Optional: receives a JSON POST; 2xx means success.
VITE_COACHING_ENDPOINT=

# Optional: adds a "Send by email" fallback. Only use a confirmed, monitored address.
VITE_CONTACT_EMAIL=
```

### Without an endpoint

The form validates, then shows the complete application with:

- a prefilled WhatsApp link
- an Instagram DM link
- a copy-to-clipboard action
- a visible statement that **nothing has been sent yet**

There is no fake success state.

### With an endpoint

The form POSTs JSON and shows success only after a 2xx response. Network errors and non-2xx responses show an error with a WhatsApp fallback. The full contract, payload, CORS notes, and test checklist are in [`docs/coaching-form.md`](docs/coaching-form.md).

> `VITE_*` values are public in the client bundle. Never place an API secret there. Rate-limit and validate on the server.

---

## Content and assets

- `src/content/site.ts` — every public string, link, and verified fact
- `src/content/image-lqip.json` — generated placeholders; do not edit by hand
- `public/images/` — responsive `profile`, `athlete-side`, `athlete-front-double`, and `athlete-front-lat` sets
- `public/og-image.jpg` — 1200×630 share image captured from the real hero
- `public/favicon.svg`, `public/brand/monogram.svg` — brand marks

### Content rules

1. Do not add prices, testimonials, transformation claims, certifications, emails, or domains that the athlete has not confirmed.
2. Keep the competition record exactly as stated in the Instagram bio; do not expand it into "wins" or titles without a source.
3. Keep the WhatsApp number and Instagram handle as the only contact routes until another is verified.
4. Do not reintroduce the poster's "guaranteed results" claim.
5. Use only the supplied athlete photography; no stock or AI-generated athlete images.

---

## Deployment

The repository includes `vercel.json` with:

- SPA rewrites to `index.html`
- immutable caching for `/images/*` and `/brand/*`

Deploy with any static host that supports SPA fallback. Build command: `npm run build`; output directory: `dist`.

### Domain note

`canonical`, `og:url`, and the JSON-LD `url` were deliberately removed because no domain has been verified. Once the final domain is confirmed:

1. Add `<link rel="canonical" href="https://your-domain/" />`.
2. Add an absolute `og:url`.
3. Change `og:image` and `twitter:image` to absolute URLs.
4. Add the `url` back to the Person JSON-LD if appropriate.

Do not publish `anastime.com` or any other guess as the canonical site.

---

## Quality status

Verified on 15 November 2026:

- `npm run build` passes (TypeScript + Vite)
- axe-core: **0 violations** at 1440×900 and 390×844 (WCAG A/AA + best practice)
- No horizontal overflow at 320, 390, 834, 900, 1024, 1280, or 1440 px
- Mobile menu open/Escape/focus return, mobile lightbox, form validation, review state, copy, WhatsApp deep link, and edit/reset all pass
- Reduced-motion mode skips Lenis, reveals, parallax, and the pinned process
- All visible images load; no console errors in tested flows

Remaining manual checks before launch: real endpoint (if used), final domain metadata, confirmed contact details, and a last read-through with the athlete.

---

## Documentation

- [Research and content verification](docs/anas-time-research.md)
- [Coaching form behavior and endpoint contract](docs/coaching-form.md)
- [Design system](docs/design-system.md)

---

## Ownership

Private client project. Athlete photography supplied for this site; all rights remain with the athlete and the original photographers. Do not reuse the imagery or brand assets elsewhere without permission.
