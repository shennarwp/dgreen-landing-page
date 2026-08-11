# D'Green Niravakuta — Landing Page

Landing page for **D'Green Niravakuta**, a boutique hotel in Kuta, Bali.

Live at: [https://dgreenniravakuta.com/](https://dgreenniravakuta.com/)

## Tech Stack

Plain HTML/CSS/JS — no build step, no frameworks. A static site served by GitHub Pages.

## Project Structure

```
├── index.html             # Single-page markup (all sections)
├── styles/style.css       # All styles (sage-green/cream palette)
├── js/main.js             # Bilingual i18n, scroll-spy, reveal, lightbox, nav toggle
├── images/                # WebP images (optimized)
├── fonts/                 # Self-hosted Cinzel & Montserrat webfonts (fonts.css)
├── fontawesome/           # Self-hosted FontAwesome 6.4 (css + webfonts)
└── CNAME                  # Custom domain (dgreenniravakuta.com)
```

## Features

- **Bilingual** — English / Indonesian switcher; updates text, image `alt`s, `<html lang>` and title
- **Sections** — hero, amenities strip, about, gallery lightbox, suites, reviews, FAQ (accordion), location + Google Maps
- **Booking** — direct link to the partner booking engine (secure-booking-engine.com) plus WhatsApp CTAs
- **SEO** — meta description, canonical, OpenGraph, JSON-LD (Hotel + FAQPage schema)
- **Accessibility** — `<main>` landmark, ARIA roles on lightbox/nav toggle, `prefers-reduced-motion` support, keyboard-friendly lightbox
- **Performance** — lazy-loaded images, explicit `width`/`height` (no CLS), self-hosted fonts (zero third-party asset requests besides analytics)

## Site Map / Navigation

`About` · `Gallery` · `Our Suites` · `Find Us` (location)

## Deployment

Deployed automatically via **GitHub Pages** from the `master` branch. The `CNAME` file maps the custom domain.

## Contributing / Workflow

- Changes are made on feature branches and shipped as pull requests against `master`.
- Keep HTML structure balanced and run a sanity check on `js/main.js` (syntax + translation key parity) after touching markup.