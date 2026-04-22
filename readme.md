# Shivam Enterprises — Business Website

A modern, high-performance single-page website for **Shivam Enterprises**, a printing and graphic design business based in Faridabad, Haryana, India.

## Overview

Premium, conversion-optimized website featuring:
- Sticky navbar with mobile hamburger menu
- Animated hero section with delivery badge
- Services grid (24 services across 3 categories)
- Testimonials carousel with dynamic review injection
- Review submission form (frontend state)
- Contact section with Google Maps embed
- Floating WhatsApp & Call Now buttons

## Tech Stack

| Technology | Purpose |
|---|---|
| Vanilla HTML5 | Semantic, SEO-optimized structure |
| CSS3 (custom) | Full design system, animations, responsive layout |
| Vanilla JavaScript | Carousel, form validation, scroll reveal |
| Google Fonts | Barlow Condensed (display) + DM Sans (body) |
| Netlify | Static hosting, instant CDN |

## Business Info

- **Business**: Shivam Enterprises, Faridabad, HR
- **Phone**: 8700065396 / 9315348319
- **Email**: shivam.enterbusiness@gmail.com
- **Address**: 1st Floor, MCF-4178, Sanjay Colony, Sector-23, Near Lakhani Chowk, Faridabad

## Running Locally

No build step needed — this is a pure static site.

```bash
# Option 1: Python simple server
python3 -m http.server 8000
# Then open http://localhost:8000

# Option 2: Netlify Dev (recommended — emulates all Netlify features)
netlify dev
# Then open http://localhost:8888

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

## Deployment

The site is configured for Netlify static hosting via `netlify.toml`.

**Deploy via Netlify CLI:**
```bash
netlify deploy --dir=. --prod
```

**Deploy via Netlify UI:**
1. Drag the project folder to [app.netlify.com/drop](https://app.netlify.com/drop)

**Deploy via GitHub:**
1. Push to GitHub
2. Connect repo on Netlify — auto-deploys on every push

## SEO Features

- Meta title + description optimized for Faridabad printing keywords
- Local Business JSON-LD schema markup
- Semantic heading hierarchy (H1 → H4)
- All images have descriptive `alt` attributes
- Google Maps embed for local SEO
- Canonical URL set

## Performance

- No JavaScript frameworks (zero bundle overhead)
- CSS `transform`/`opacity`-only animations (GPU-accelerated)
- Lazy loading on images (`loading="lazy"`)
- Font preconnect for Google Fonts
- Intersection Observer for scroll reveals (no scroll event thrashing)
- Target: Lighthouse 90+
