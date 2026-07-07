# CLAUDE.md

Guidance for working in this repo. Keep it accurate — update it when conventions change.

## What this is

Hamza Memon's personal **portfolio website** — a static site (no build step) whose job is to
**convert freelance clients**. Deployed via **GitHub Pages** at
`https://hamza-memon-0.github.io/my-portfolio/` from the `main` branch of
`HAMZA-MEMON-0/my-portfolio`. **Push to `main` = deploy.**

Stack: plain **HTML + CSS + vanilla JS**. External CDNs only (Google Fonts, Font Awesome, AOS).
Dark "neon gradient" brand theme.

## Files

- `index.html` — all page markup (hero, about, stats, services, projects, skills, contact, footer, project modal).
- `script.js` — the projects data + all behavior (project grid, filters, modal gallery, demo-credential copy).
- `style.css` — all styles (design tokens in `:root`, responsive at 1024px / 768px).
- `images/Projects/<key>/` — per-project screenshots, numbered `1.png`, `2.png`, … (`.jpeg` allowed).
- `favicon.svg`, `og-image.png`, `README.md`.

## Projects data model (script.js)

Projects live in the `projectsData` array. Each entry:

```js
{
  key: 'hms',                 // matches images/Projects/hms/ folder + PROJECT_ORDER
  title: '...',
  category: 'live' | 'fullstack' | 'landing' | 'desktop' | 'ai',  // drives filter buttons
  featured: true,             // optional -> "Featured" badge
  live: 'https://…',          // optional -> "Live" badge, frame-URL, "Visit Live Site" button
  mobile: true,               // optional -> phone-style card (backdrop blur); use for app-with-phone-shots
  demo: { email, password },  // optional -> click-to-copy "Live demo login" box in modal
  icon: 'fa-solid fa-…',      // Font Awesome; used as placeholder if an image fails
  images: ['images/Projects/hms/1.png', …],
  desc: '…',                  // 2–3 sentences, client/benefit-oriented
  features: ['…', …],         // 5–6 bullets
  tags: [['.NET Core','tag-net'], …]   // [label, css-class]
}
```

**Display order** is controlled by the `PROJECT_ORDER` array (keys), applied via a sort right
after `projectsData`. The **first 6** are the default-visible showcase; the rest are behind
"Show More". Strongest full-stack products lead — **HMS is #1**. To re-prioritize, edit
`PROJECT_ORDER`, not the array position.

Tag CSS classes (colors) live in `style.css`: `tag-net, tag-angular, tag-sql, tag-azure,
tag-html, tag-js, tag-python, tag-ai, tag-shopify, tag-winforms, tag-netlify, tag-multitenant`.
Unknown classes still render with the base `.tag` style.

## Conventions & rules

- **Screenshots: landscape viewport shots only.** Do NOT use full-page captures (they're extremely
  tall and render as ugly slivers/random center-bands under `object-fit: cover`). Portrait phone
  shots are OK only as secondary gallery images, or on cards with `mobile: true`. Lead each project
  with its strongest landscape hero.
- **Relivora: never mention Laravel / PHP / MySQL.** It's built in Laravel but that's not Hamza's
  niche — present it as a generic "Full-Stack Web App". (Tags: Full-Stack · PayPal · Responsive · Live.)
- **Demo credentials** are shown via the optional `demo` field → rendered as a click-to-copy box in
  the modal. Only HMS uses it currently. Don't paste live passwords into other shareable docs.
- Match the existing code style, comment density, and the client-facing tone of descriptions.

## Adding / updating a project

1. Copy curated **landscape** screenshots into `images/Projects/<key>/` as `1.png`, `2.png`, …
   (a labeled contact-sheet montage via PIL is the fast way to pick good ones from a big folder).
2. Add/edit the entry in `projectsData` (lead image first).
3. Add the `key` to `PROJECT_ORDER` at the right priority.
4. Verify (below), then commit + push.

## Verify (before pushing)

Static site — serve it and drive it with Playwright (Chromium is cached under `~/AppData/Local/ms-playwright`):

```bash
python -m http.server 8899 --bind 127.0.0.1   # in this folder, background
node --check script.js                          # JS syntax
# Playwright: goto http://127.0.0.1:8899/, expand "Show More", assert card
# count/order, listen for console errors + 4xx on /images/Projects/, open a
# modal and confirm images load + (for HMS) the demo box scrolls into view.
```

The project **modal** must stay scrollable: the dialog is a flex column, `.modal-body` uses
`grid-template-rows: minmax(0,1fr)`, and `.modal-gallery`/`.modal-content` have `min-height:0` +
`min-width:0` + `overflow-y:auto`. On ≤1024px the whole body scrolls as one column. Don't remove
those or the right panel clips with no scrollbar.

## Deploy

`git push origin main` → GitHub Pages rebuilds in ~1–2 min. Only commit when asked.

## Known follow-ups

- Screenshots are heavy PNGs (some 2–7 MB) — a WebP compression pass would speed up mobile load.
- No testimonials / social-proof section yet (highest-impact conversion improvement).
