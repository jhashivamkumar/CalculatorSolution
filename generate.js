// Node script to generate static HTML pages from calculators.json and template.html
// Usage: node generate.js
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname)
const outDir = path.join(root, 'dist')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

let dataFile = path.join(root, 'calculators-full.json')
if (!fs.existsSync(dataFile)) dataFile = path.join(root, 'calculators.json')
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))

const template = fs.readFileSync(path.join(root, 'template.html'), 'utf8')

const clamp = (str, max) => {
  if (!str) return ''
  const clean = String(str).replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}…`
}

// Utility: generate fuller explanation text (~320 words) when placeholder detected
function generateExplanation(item) {
  const title = item.title || 'Calculator'
  const category = item.category || 'tool'
  const p1 = `${title} helps users perform a common ${category} calculation quickly and accurately. This page provides a clear interface to enter the necessary inputs and receive instantaneous results without needing spreadsheets or complex software. The calculator focuses on usability: labeled fields, sensible defaults, unit options where relevant, and immediate feedback so users can iterate through scenarios and compare outcomes.`
  const p2 = `Practical examples and short guidance are included to help both beginners and experienced users. Use cases range from everyday decisions like shopping discounts and budgeting to more advanced planning like loan comparisons and investment projections. Because this tool runs entirely in the browser, it is fast and private — no data leaves your device.`
  const p3 = `The formulas used are standard and widely accepted in financial and technical contexts. For reference, a formula section shows the exact mathematical relationship used for the calculation so you can verify results or reproduce them elsewhere. Always verify critical financial decisions with a professional, especially for tax and legal matters.`
  const p4 = `This calculator is optimized for mobile and desktop: the layout adapts to narrow screens and preserves readability. Performance and SEO best practices were considered when building this page: concise content, unique metadata, structured data (JSON-LD), and a sitemap entry to help search engines index the page quickly.`
  const p5 = `Tip: try multiple input combinations to compare scenarios. For loan-related calculators, compare shorter and longer tenures to see trade-offs between monthly payments and total interest. For investment calculators, adjust expected rates conservatively and consider inflation when planning long-term goals.`
  return [p1, p2, p3, p4, p5].join('\n\n')
}

function generateFaqs(item) {
  const t = item.title || 'This calculator'
  const faqs = []
  faqs.push({ q: `How does the ${t} work?`, a: `Enter the values requested and press Calculate. The page applies the standard formula described in the Formula section and displays the result.` })
  faqs.push({ q: `Is the result exact?`, a: `The result is a mathematical computation and accurate given the inputs; for legal, tax or investment actions consult a qualified professional.` })
  faqs.push({ q: `Can I use different units?`, a: `Where unit options exist, select the appropriate unit. Otherwise convert values to the required unit before input.` })
  faqs.push({ q: `Why use this calculator instead of a spreadsheet?`, a: `It is faster for single, repeatable calculations and easier to use on mobile devices; spreadsheets are better for large data sets and complex analysis.` })
  faqs.push({ q: `Is my data private?`, a: `Yes — this tool runs client-side in your browser and does not send inputs to a server.` })
  return faqs
}

function renderFaqs(faqs) {
  return faqs.map(f => `<details class="card"><summary><strong>${f.q}</strong></summary><p>${f.a}</p></details>`).join('\n')
}

function renderRelated(current) {
  const related = data.filter(item => item.category === current.category && item.slug !== current.slug).slice(0, 4)
  if (!related.length) return '<p class="lead">Explore more calculators in this category soon.</p>'
  return related.map(r => `<a class="card" href="${r.slug}.html"><h4>${r.title}</h4><p>${r.short || r.description || ''}</p></a>`).join('\n')
}

const indexList = []
for (const c of data) {
  if (!c.explanation || String(c.explanation).trim().toLowerCase().startsWith('placeholder')) {
    c.explanation = generateExplanation(c)
  }
  if (!c.faqs || !c.faqs.length) {
    c.faqs = generateFaqs(c)
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': c.faqs.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
    }))
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', position: 1, name: 'Calculator Solution', item: 'https://calculatorsolution.com/' },
      { '@type': 'ListItem', position: 2, name: c.title, item: `https://calculatorsolution.com/${c.slug}.html` }
    ]
  }

  const searchSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': 'https://calculatorsolution.com/',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://calculatorsolution.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const jsonldCombined = []
  if (c.jsonld && Object.keys(c.jsonld).length) jsonldCombined.push(c.jsonld)
  jsonldCombined.push(searchSchema, breadcrumbSchema, faqSchema)
  const jsonld = JSON.stringify(jsonldCombined, null, 2)

  const faqs = renderFaqs(c.faqs || [])
  let interactive = `<!-- Interactive placeholder for ${c.title} -->\n<div id="calc-${c.slug}">\n  <p>Open this page in the browser and use the calculator fields below.</p>\n</div>`

  let inlineScript = ''
  if (c.slug === 'percentage-calculator') {
    interactive = `
      <div id="calc-${c.slug}" class="card">
        <div class="form-row">
          <input id="part" type="number" placeholder="Part (e.g. 25)" />
          <input id="whole" type="number" placeholder="Whole (e.g. 200)" />
          <button id="pct-calc" class="btn">Calculate %</button>
        </div>
        <div id="pct-result" class="result" aria-live="polite"></div>
      </div>`

    inlineScript = `<script>(function(){
      const btn = document.getElementById('pct-calc')
      btn?.addEventListener('click', ()=>{
        const p = parseFloat(document.getElementById('part').value) || 0
        const w = parseFloat(document.getElementById('whole').value) || 0
        const out = document.getElementById('pct-result')
        if(w === 0){ out.textContent = 'Enter a non-zero whole value.'; return }
        const pct = (p / w) * 100
        out.innerHTML = '<strong>' + pct.toFixed(4) + '%</strong> - (' + p + '/' + w + ')*100';
      })
    })()</script>`
  }

  if (c.slug === 'bmi-calculator') {
    interactive = `
      <div id="calc-${c.slug}" class="card">
        <div class="form-row">
          <select id="bmi-units"><option value="metric">Metric (kg, m)</option><option value="imperial">Imperial (lb, in)</option></select>
          <input id="weight" type="number" placeholder="Weight" />
          <input id="height" type="number" placeholder="Height" />
          <button id="bmi-calc" class="btn">Calculate BMI</button>
        </div>
        <div id="bmi-result" class="result" aria-live="polite"></div>
      </div>`

    inlineScript = `<script>(function(){
      document.getElementById('bmi-calc')?.addEventListener('click', ()=>{
        const units = document.getElementById('bmi-units').value
        const w = parseFloat(document.getElementById('weight').value) || 0
        const h = parseFloat(document.getElementById('height').value) || 0
        const out = document.getElementById('bmi-result')
        if(w<=0||h<=0){ out.textContent='Enter positive weight and height.'; return }
        let bmi = 0
        if(units==='metric'){
          bmi = w / (h*h)
        } else {
          bmi = (w / (h*h)) * 703
        }
        let cat = 'Unknown'
        if(bmi<18.5) cat='Underweight'
        else if(bmi<25) cat='Normal'
        else if(bmi<30) cat='Overweight'
        else cat='Obesity'
        out.innerHTML = '<strong>' + bmi.toFixed(2) + '</strong> - ' + cat
      })
    })()</script>`
  }

  if (c.slug === 'loan-emi-calculator') {
    interactive = `
      <div id="calc-${c.slug}" class="card">
        <div class="form-row">
          <input id="principal" type="number" placeholder="Principal (P)" />
          <input id="annualRate" type="number" placeholder="Annual Rate (%)" />
          <input id="tenure" type="number" placeholder="Tenure (years)" />
          <button id="emi-calc" class="btn">Calculate EMI</button>
        </div>
        <div id="emi-result" class="result" aria-live="polite"></div>
      </div>`

    inlineScript = `<script>(function(){
      document.getElementById('emi-calc')?.addEventListener('click', ()=>{
        const P = parseFloat(document.getElementById('principal').value) || 0
        const annual = parseFloat(document.getElementById('annualRate').value) || 0
        const years = parseFloat(document.getElementById('tenure').value) || 0
        const out = document.getElementById('emi-result')
        if(P<=0||annual<=0||years<=0){ out.textContent='Enter positive principal, rate and tenure.'; return }
        const r = annual / 12 / 100
        const n = years * 12
        const numerator = P * r * Math.pow(1+r,n)
        const denom = Math.pow(1+r,n)-1
        const emi = numerator/denom
        const total = emi * n
        const interest = total - P
        out.innerHTML = '<strong>EMI: \u20B9' + emi.toFixed(2) + '</strong><br/>Total Payment: \u20B9' + total.toFixed(2) + ' - Interest: \u20B9' + interest.toFixed(2)
      })
    })()</script>`
  }

  const related = renderRelated(c)
  const pageTitle = clamp(`${c.title} | CalculatorSolution`, 60)
  const metaDescription = clamp(c.meta_description || c.short || c.description || c.explanation, 155)

  const page = template
    .replaceAll('{{page_title}}', pageTitle)
    .replaceAll('{{title}}', c.title)
    .replaceAll('{{meta_description}}', metaDescription)
    .replaceAll('{{jsonld}}', jsonld)
    .replaceAll('{{slug}}', c.slug)
    .replaceAll('{{short}}', (c.short || ''))
    .replaceAll('{{interactive}}', interactive)
    .replaceAll('{{explanation}}', (c.explanation || ''))
    .replaceAll('{{formula}}', (c.formula || ''))
    .replaceAll('{{faqs}}', faqs)
    .replaceAll('{{related}}', related)
    .replaceAll('{{interactive_script}}', inlineScript || '')

  fs.writeFileSync(path.join(outDir, `${c.slug}.html`), page, 'utf8')
  indexList.push({ slug: c.slug, title: c.title, category: c.category, short: c.short })
}

fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(indexList, null, 2), 'utf8')

const compliancePages = [
  'privacy-policy',
  'terms-of-service',
  'disclaimer',
  'refund-policy',
  'about',
  'contact'
]

// Auto-detect articles in articles/ folder
const articlesDir = path.join(root, 'articles')
const articleFiles = []
if (fs.existsSync(articlesDir)) {
  fs.readdirSync(articlesDir).forEach(file => {
    if (file.endsWith('.html')) {
      articleFiles.push(`articles/${file.replace('.html', '')}`)
    }
  })
}

const sitemapUrls = [
  '  <url><loc>https://calculatorsolution.com/</loc></url>',
  ...indexList.map(i => `  <url><loc>https://calculatorsolution.com/${i.slug}.html</loc></url>`),
  ...compliancePages.map(p => `  <url><loc>https://calculatorsolution.com/${p}.html</loc></url>`),
  ...articleFiles.map(a => `  <url><loc>https://calculatorsolution.com/${a}.html</loc></url>`)
].join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>`
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8')
try {
  fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8')
} catch (e) {
  console.warn('Could not write sitemap to project root:', e.message)
}

try {
  fs.writeFileSync(path.join(root, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://calculatorsolution.com/sitemap.xml\n', 'utf8')
} catch (e) {
  console.warn('Could not write robots.txt to project root:', e.message)
}

fs.writeFileSync(path.join(outDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://calculatorsolution.com/sitemap.xml\n', 'utf8')

console.log('Generated', indexList.length, 'pages into', outDir)
