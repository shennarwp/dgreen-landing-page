# Smoke Tests

Dependency-free smoke tests for both `/` (EN) and `/id/` (ID) pages.

## What it covers

**65 assertions** across static HTML structure, security headers, and runtime behavior.

### Static checks (both pages)
- `lang`, `canonical`, `hreflang` (EN ↔ ID)
- No leftover `[data-translate]` or inline styles
- Language switcher active state + relative links
- Junior/suite card-image classes
- Sticky booking bar: present, standalone, `target="_blank"`
- WhatsApp: 5 anchors with `data-wa-msg` wired in `.sticky-actions`
- Back-to-top present in DOM above WhatsApp
- Gallery: all 5 images have `srcset` and `sizes`
- Footer logos: both have `srcset`
- Hero preloads: separate mobile/desktop viewport sizes
- CSP: present with correct `script-src`, `frame-src`, `object-src 'none'`
- All `target="_blank"` links have `noopener`
- No hardcoded WhatsApp number in HTML source
- Analytics script present

### Behavioral checks (same-origin iframe)
- Lightbox opens on gallery click, correct first image
- Swipe advances lightbox (EN: left-swipe, ID: right-swipe)
- WhatsApp `href` built from centralized number at runtime
- Back-to-top gets `show` class after scrolling past 600px
- Back-to-top positioned directly above WhatsApp (same x-axis)

## How to run

The test is a single HTML file with zero dependencies.

### Against a local server

```bash
cd dgreen-landing-page
python3 -m http.server 8080
# open http://localhost:8080/tests/smoke.html
```

### Against production

Pass the live URL via the query string:

```
http://localhost:8080/tests/smoke.html?base=https://dgreenniravakuta.com
```

The page auto-loads and runs on open. Scroll the log for layout measurements.

### Programmatic (with Playwright)

A headless runner is available at `/tmp/opencode/smoke-run2.cjs`.
Abort heavy external resources (images, fonts, Maps) to avoid resource exhaustion in headless mode:

```js
await page.route(/\.(png|jpe?g|webp|gif|ico|woff2?|ttf)(\?|$)/, r => r.abort());
await page.route('https://stats.rwpiri.com/**', r => r.abort());
await page.route('**://*.google.com/**', r => r.abort());
```

## Notes

- **CORS:** fetching pages cross-origin works against production (GitHub Pages sends `Access-Control-Allow-Origin: *`).
- **Local `file://`** protocol blocks `fetch()` of HTML files — always serve over http.
- **Headless Chrome:** loading two full pages (all images + Google Maps iframe) can exhaust resources. The abort-based runner above avoids this.