# CalculatorSolution — Calculators Site

This repository provides a lightweight static site scaffold for many calculators (finance, health, daily utilities, education). It's built with pure HTML/CSS/JS and a small Node generator to produce SEO-friendly static pages.

What's included
- `index.html` — universal landing page and category list
- `assets/style.css` and `assets/app.js` — frontend styling and index population
- `template.html` — HTML template for individual calculator pages
- `calculators.json` — metadata and content for calculators (sample entries included)
- `generate.js` — Node script to render `dist/*.html` pages and sitemap

Quick start (requires Node.js installed)
1. The generated static pages are in `dist/`. Copy everything to your web host (or push to GitHub Pages). Example: upload `dist/*` to your server and set root to `dist/`.

SEO & ranking tips
- Each calculator should have a unique `slug` and a dedicated HTML page with proper `<title>` and `<meta description>`.
- Include 300–400 words of helpful explanation (user-centric), formula section, at least 5 FAQs per page (these can be converted to FAQ schema).
- Use `JSON-LD` (schema.org) as provided in `calculators.json` to help Google understand pages and surface rich results.
- Generate `sitemap.xml` and ensure `robots.txt` references it.
- Serve pages gzipped and enable caching headers on your host; fast pages rank better.
- Build backlinks and submit sitemap to Google Search Console. Target low-competition long-tail keywords for quick ranking.