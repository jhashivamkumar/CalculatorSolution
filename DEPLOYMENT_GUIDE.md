# Deployment Guide — Which Files to Deploy

## Quick Answer
Deploy **everything in the project root `d:\sam\cal\`** to your web server's root directory.

---

## Directory Structure to Deploy

```
d:\sam\cal\
├── index.html                    ✅ DEPLOY (homepage)
├── sitemap.xml                   ✅ DEPLOY (search engines)
├── robots.txt                    ✅ DEPLOY (search bots)
├── calculators.json              ✅ DEPLOY (calculator data)
│
├── assets/                       ✅ DEPLOY (all files)
│   ├── style.css
│   ├── app.js
│   ├── calculators-complete.js
│   └── calculators.js
│
├── dist/                         ✅ DEPLOY (all generated pages)
│   ├── index.json                (calculator index for frontend)
│   ├── sitemap.xml               (redundant but recommended)
│   ├── robots.txt                (redundant but recommended)
│   ├── percentage-calculator.html
│   ├── loan-emi-calculator.html
│   ├── bmi-calculator.html
│   ├── [... 71 more calculators ...]
│   ├── privacy-policy.html
│   ├── terms-of-service.html
│   ├── disclaimer.html
│   ├── refund-policy.html
│   ├── about.html
│   └── contact.html
│
├── articles/                     ✅ DEPLOY (content pages)
│   ├── how-emi-works.html
│   └── understanding-bmi.html
│
└── [Optional documentation files - not required for live site]
    ├── generate.js               ❌ NO (dev tool only)
    ├── template.html             ❌ NO (dev template only)
    ├── calculators-full.json     ❌ NO (backup data only)
    ├── package.json              ❌ NO (dev dependencies)
    ├── node_modules/             ❌ NO (dev packages)
    ├── *.md files                ❌ NO (documentation only)
    └── .git/                     ❌ NO (version control)
```

---

## What to Deploy (Summary)

### ✅ MUST DEPLOY

| Path | Purpose | What it contains |
|------|---------|------------------|
| `/index.html` | Homepage | Main entry point with hero, featured, search |
| `/sitemap.xml` | SEO | 83 URLs for search engines |
| `/robots.txt` | SEO | Crawl instructions, sitemap pointer |
| `/calculators.json` | Data | Calculator metadata for frontend |
| `/assets/*` | Frontend | CSS, JavaScript (style.css, app.js, etc.) |
| `/dist/*` | Content | 74 calculator pages + 6 compliance pages |
| `/articles/*` | Content | 2 educational articles (EMI, BMI) |

### ❌ DO NOT DEPLOY

| Path | Reason |
|------|--------|
| `generate.js` | Node script for development only |
| `template.html` | Template for code generation |
| `package.json`, `node_modules/` | Development dependencies |
| `*.md` files | Documentation (DEPLOYMENT_GUIDE.md, IMPLEMENTATION_COMPLETE.md, etc.) |
| `.git/`, `.gitignore` | Version control |
| `calculators-full.json` | Backup/source data (use `calculators.json` instead) |

---

## Deployment Steps

### Step 1: Prepare Files
Copy these folders from `d:\sam\cal\` to your web server:
```
d:\sam\cal\
├── index.html          → /index.html
├── sitemap.xml         → /sitemap.xml
├── robots.txt          → /robots.txt
├── calculators.json    → /calculators.json
├── assets/             → /assets/
├── dist/               → /dist/
└── articles/           → /articles/
```

### Step 2: Verify File Structure on Server
After uploading, your web server should have:
```
/
├── index.html
├── sitemap.xml
├── robots.txt
├── calculators.json
├── assets/
│   ├── style.css
│   ├── app.js
│   ├── calculators-complete.js
│   └── calculators.js
├── dist/
│   ├── *.html (all 80 pages)
│   └── index.json
└── articles/
    ├── how-emi-works.html
    └── understanding-bmi.html
```

### Step 3: Test Live Site
After deployment, verify:
```
✅ https://yourdomain.com/                    → Homepage loads
✅ https://yourdomain.com/sitemap.xml         → Sitemap accessible
✅ https://yourdomain.com/robots.txt          → Robots.txt accessible
✅ https://yourdomain.com/dist/percentage-calculator.html → Sample calculator
✅ https://yourdomain.com/articles/how-emi-works.html     → Article loads
✅ https://yourdomain.com/dist/privacy-policy.html        → Compliance page
```

---

## Hosting Platform Specific Instructions

### Netlify
1. Connect your GitHub repo or upload via drag-drop
2. Set Build command: `node generate.js` (optional, to regenerate on deploy)
3. Set Publish directory: `.` (root, since all files are in root)
4. Deploy

### Vercel
1. Import project from GitHub
2. Root Directory: `.`
3. Build Command: `node generate.js` (optional)
4. Output Directory: `.` (serves root)
5. Deploy

### Traditional Hosting (FTP/cPanel)
1. Connect via FTP
2. Upload all files from `d:\sam\cal\` to public_html or www folder
3. Preserve folder structure:
   - `/index.html` at root
   - `/assets/` folder with files
   - `/dist/` folder with all pages
   - `/articles/` folder with articles

### AWS S3 + CloudFront
1. Create S3 bucket
2. Upload all files maintaining structure
3. Set `/index.html` as error document (for SPA-like navigation)
4. Create CloudFront distribution pointing to S3
5. Set default root object to `index.html`

### Docker (Optional for Production)
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
Deploy with: `docker build -t calculator-site . && docker run -p 80:80 calculator-site`

---

## Important Notes

### Server Configuration

**1. Enable Gzip Compression** (improves performance)
```nginx
# For Nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
```

```apache
# For Apache
mod_deflate enabled in .htaccess:
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/json
</IfModule>
```

**2. Set Cache Headers** (reduce bandwidth, improve speed)
```nginx
# Cache static assets for 1 year
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}
# Cache HTML for 1 hour
location ~ \.html$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

**3. HTTPS (Required for GA4 & AdSense)**
- Enable SSL/TLS certificate (Let's Encrypt is free)
- Redirect HTTP → HTTPS
- Update canonical URLs if different from deployment domain

**4. Enable CORS (if needed)**
```
If accessing from different domain, enable CORS headers
```

---

## File Sizes (For Reference)

```
index.html                    ~15 KB
assets/style.css             ~40 KB
assets/app.js                ~12 KB
calculators.json             ~50 KB
dist/sitemap.xml             ~12 KB
Each calculator page         ~18-25 KB
Articles (2 files)           ~8 KB total
Total upload size:           ~2-3 MB
```

---

## Deployment Checklist

Before going live, ensure:

- [ ] All files copied to server (index.html, assets/, dist/, articles/)
- [ ] `/sitemap.xml` is accessible at site root
- [ ] `/robots.txt` is accessible at site root
- [ ] Homepage loads without errors
- [ ] Click a calculator link → page loads correctly
- [ ] Search functionality works on homepage
- [ ] Featured section displays and clicks work
- [ ] Footer links work (Privacy, Terms, Contact, etc.)
- [ ] Articles load from `/articles/` path
- [ ] Gzip compression enabled on server
- [ ] Cache headers set for static assets
- [ ] HTTPS enabled (if on production)
- [ ] GA4 measurement ID configured (replace G-PLACEHOLDER in index.html)
- [ ] OG image at `/assets/og-image.png` (optional but recommended)

---

## Post-Deployment SEO Setup

After deployment:

1. **Submit Sitemap to Google Search Console**
   - Visit: https://search.google.com/search-console/
   - Add property: https://yourdomain.com
   - Go to Sitemaps section → Submit: https://yourdomain.com/sitemap.xml
   - Wait 1-2 weeks for indexing

2. **Enable GA4 Tracking**
   - Edit `index.html` and `template.html`
   - Replace `G-PLACEHOLDER` with your actual Measurement ID
   - Verify in Google Analytics → Real-Time

3. **Set Up AdSense (if ready)**
   - Visit: https://www.google.com/adsense/
   - Apply with your domain
   - Once approved, add ad code to template.html
   - Ads appear on all generated pages

4. **Monitor Performance**
   - Use Lighthouse for Core Web Vitals
   - Check Search Console for errors
   - Monitor Analytics for user behavior

---

## Rollback Plan

If something goes wrong:
1. Keep a backup of the deployed files
2. If issues occur, revert to previous version
3. Check server logs for 404/500 errors
4. Verify file permissions (should be readable by web server)
5. Ensure cache is cleared (browser + CDN)

---

## Quick Reference: What Each User Sees

**User visits https://yourdomain.com/**
1. Server returns `/index.html`
2. Page loads CSS from `/assets/style.css`
3. Page loads JS from `/assets/app.js`
4. JS fetches calculator list from `/calculators.json` or `/dist/index.json`
5. User sees calculator cards and can search/filter
6. Clicking a card navigates to `/dist/[calculator-slug].html`
7. Clicking "Sitemap" in footer opens `/sitemap.xml`
8. Clicking "Privacy" opens `/dist/privacy-policy.html`

**All URLs are relative to domain root**, so deployment structure is critical.

---

## Support

If you have questions about deployment to a specific platform, let me know and I can provide detailed instructions.
