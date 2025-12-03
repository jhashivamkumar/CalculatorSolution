Performance & Accessibility (A11y) Report — Quick Guide

How to run Lighthouse locally (Chrome):

1. Open Chrome and visit the page you want to test (e.g., http://localhost:8000/)
2. Open DevTools (F12) → "Lighthouse" tab
3. Choose Device (Mobile/Desktop), select categories (Performance, Accessibility, Best Practices, SEO)
4. Click "Generate report"

CLI (optional):

```bash
# Install lighthouse if not installed
npm install -g lighthouse
# Run an audit
lighthouse http://localhost:8000/ --output html --output-path ./lighthouse-report.html --only-categories=performance,accessibility,seo
```

Priority fixes (high → medium → low)

- High
  - Reduce render-blocking CSS: inline critical CSS for hero and prefetch the rest; add `rel="preload"` for key CSS/fonts.
  - Compress and properly size images (use WebP/AVIF) and add width/height attributes to prevent layout shifts.
  - Ensure server sets cache headers for static assets (CSS/JS/images).

- Medium
  - Defer non-critical JS where possible (use `defer`/`async`) and avoid large libraries in the critical path.
  - Use `rel="canonical"` and `og:` tags on important pages (done for homepage and template).
  - Serve modern image formats and add `loading="lazy"` for offscreen images.

- Low
  - Add more semantic headings and ARIA labels where needed.
  - Improve color contrast for small text (check WCAG AA).

Accessibility quick checks

- Keyboard navigation: ensure all interactive elements (cards, hero links) are keyboard-focusable (use `role=button`, `tabindex=0` where needed).
- Contrast: validate color contrast for text over backgrounds.
- Labels: ensure inputs have labels or `aria-label` attributes (already present on search input).

Suggested next steps

1. Run Lighthouse on homepage and one representative calculator page.
2. Implement the high-priority fixes: preload critical CSS, compress images, enable caching.
3. Re-run Lighthouse and iterate until scores are acceptable for mobile.

If you want, I can implement the following automatically now:
- Add `rel="preload"` for `assets/style.css` and a small critical-inline CSS block into `index.html` (and template) to reduce render blocking.
- Add `loading="lazy"` to images and set width/height where image tags exist.

Tell me which automated changes you want me to apply next and I'll proceed.
