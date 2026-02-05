// Modern frontend: populate cards from /calculators.json with search, filtering, featured links, and reveal animations
async function fetchJSON(path) {
  try {
    return await (await fetch(path)).json()
  } catch (e) {
    console.warn('fetch failed', path)
    return null
  }
}

async function init() {
  // Analytics bridge: connect custom events to GA4 dataLayer
  window.analytics = window.analytics || {
    track: function (evt, props) {
      try {
        console.log('ANALYTICS', evt, props||{});
        // Push to GA4 dataLayer
        if (window.gtag) {
          gtag('event', evt, props || {});
        }
      } catch(e){ console.error('Analytics error:', e); }
    }
  }

  // mark page for analytics / A/B testing
  document.documentElement.setAttribute('data-page', 'home')
  if (window.gtag) gtag('event', 'page_view', { page_title: 'Calculator Solution Home', page_path: '/' })
  let data =
    (await fetchJSON('/calculators.json')) ||
    (await fetchJSON('calculators.json')) ||
    (await fetchJSON('/index.json')) ||
    (await fetchJSON('index.json')) ||
    []

  // index.json shape: { calculators: [...] }
  if (data && !Array.isArray(data) && Array.isArray(data.calculators)) {
    data = data.calculators
  }

  if (!Array.isArray(data)) {
    data = []
  }
  const cards = document.getElementById('cards')
  const search = document.getElementById('search')
  const categoryLinks = document.querySelectorAll('.category-link')
  const emptyState = document.querySelector('.empty-state')
  const featuredGrid = document.getElementById('featured-grid')
  const heroCards = document.querySelectorAll('.hero-card[data-cat]')
  const cardsSection = document.querySelector('.main-grid')

  const featuredOrder = [
    'percentage-calculator',
    'loan-emi-calculator',
    'bmi-calculator',
    'sip-calculator',
    'mortgage-amortization-calculator',
    'currency-converter'
  ]

  const revealObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            revealObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.15 })
    : null

  function addReveal(node) {
    if (!node) return
    if (revealObserver) {
      revealObserver.observe(node)
    } else {
      node.classList.add('visible')
    }
  }

  document.querySelectorAll('.reveal').forEach(addReveal)

  let currentFilter = ''

  // function setCategory(cat) {
  //   currentFilter = cat || ''
  //   categoryLinks?.forEach(l => {
  //     const isActive = l.dataset.cat === currentFilter
  //     l.style.fontWeight = isActive ? '700' : '500'
  //     l.style.color = isActive ? 'var(--primary)' : 'inherit'
  //   })
  //   if (search) search.value = ''
  //   if (!currentFilter) {
  //     render(data)
  //   } else {
  //     render(data.filter(c => c.category === currentFilter))
  //   }
  //   cardsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // }
  function setCategory(cat, opts = { scroll: true }) {
  currentFilter = cat || ''

  categoryLinks?.forEach(l => {
    const isActive = l.dataset.cat === currentFilter
    l.style.fontWeight = isActive ? '700' : '500'
    l.style.color = isActive ? 'var(--primary)' : 'inherit'
  })

  if (search) search.value = ''

  if (!currentFilter) {
    render(data)
  } else {
    render(data.filter(c => c.category === currentFilter))
  }

  // ✅ only scroll when user triggers it
  if (opts.scroll) {
    cardsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

  // allow category.js to trigger filtering
  window.filterByCategory = (cat) => setCategory(cat)


  function render(list) {
    cards.innerHTML = ''
    emptyState.style.display = list.length === 0 ? 'block' : 'none'

    list.forEach((c, i) => {
      const el = document.createElement('a')
      el.className = 'card'
      el.href = `/${c.slug}.html`
      el.title = c.short || c.description || ''

      const categoryEmoji = {
        finance: '💰',
        health: '❤️',
        utility: '🛠️',
        education: '📚'
      }[c.category] || '✨'

      el.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <h4 style="flex: 1;">${c.title}</h4>
          <span style="font-size: 1.2rem; margin-left: 8px;">${categoryEmoji}</span>
        </div>
        <p>${c.short || c.description || ''}</p>
      `
      // set initial state for staggered animation
      el.style.opacity = 0
      el.style.transform = 'translateY(10px)'
      // track card clicks for analytics
      el.addEventListener('click', function () { try { window.analytics.track && window.analytics.track('card_click', { slug: c.slug, title: c.title, category: c.category, event_category: 'calculator_cards' }) } catch (e) {} })
      cards.appendChild(el)
      addReveal(el)
      // Staggered entrance — add a lightweight animation class
      setTimeout(() => {
        el.classList.add('animate-fade-up')
        // clear inline styles to let CSS handle final state
        el.style.opacity = ''
        el.style.transform = ''
      }, Math.min(80 * i, 800))
    })
  }

  function renderFeatured() {
    if (!featuredGrid || !data.length) return
    featuredGrid.innerHTML = ''
    const featured = featuredOrder.map(slug => data.find(c => c.slug === slug)).filter(Boolean)
    featured.forEach(item => {
      const link = document.createElement('a')
      link.className = 'featured-card reveal'
      link.href = `/${item.slug}.html`
      link.innerHTML = `
        <h4>${item.title}</h4>
        <p>${item.short || item.description || ''}</p>
        <span class="featured-meta">${item.category || 'calculator'}</span>
      `
      // analytics hook for featured clicks
      link.addEventListener('click', function (e) {
        try { window.analytics.track && window.analytics.track('featured_click', { slug: item.slug, title: item.title, event_category: 'featured_section' }) } catch (e) {}
      })
      featuredGrid.appendChild(link)
      addReveal(link)
    })
  }

  render(data)
  renderFeatured()

  // Smooth navigation when clicking featured cards: reveal cards then navigate
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('a.featured-card')
    if (!a) return
    e.preventDefault()
    const href = a.getAttribute('href')
    const cardsSection = document.querySelector('.main-grid')
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => { window.location = href }, 450)
    } else {
      window.location = href
    }
  })

  // Search functionality with debouncing
  let searchTimeout
  search?.addEventListener('input', e => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      const q = e.target.value.trim().toLowerCase()

      let filtered = data
      if (q) {
        filtered = data.filter(c =>
          (c.title + ' ' + (c.short || '') + ' ' + (c.category || '')).toLowerCase().includes(q)
        )
      } else if (currentFilter) {
        filtered = data.filter(c => c.category === currentFilter)
      }

      render(filtered)
      if (q) {
        cardsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 150)
  })

  // Category filtering
  categoryLinks?.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      setCategory(link.dataset.cat)
    })
  })

  // Hero cards click/keyboard to filter categories
  heroCards?.forEach(card => {
    const cat = card.dataset.cat
    const activate = () => setCategory(cat)
    card.addEventListener('click', e => {
      e.preventDefault()
      activate()
    })
    card.addEventListener('keypress', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        activate()
      }
    })
  })

  // Set initial active state
  // setCategory('')
  setCategory('', { scroll: false })
}

document.addEventListener('DOMContentLoaded', init)
