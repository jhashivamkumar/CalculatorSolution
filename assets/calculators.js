// calculators.js
// Auto-wires interactive calculators rendered by generate.js.
// For each element with id starting with "calc-<slug>", this script injects inputs and computes results

(function(){
  const mapping = {
    'percentage-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="part" type="number" placeholder="Part (e.g. 25)" />\n  <input data-name="whole" type="number" placeholder="Whole (e.g. 200)" />\n  <button data-action="calc" class="btn">Calculate %</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const p = parseFloat(el.querySelector('[data-name=part]').value)||0
          const w = parseFloat(el.querySelector('[data-name=whole]').value)||0
          const out = el.querySelector('[data-out]')
          if(w===0){ out.textContent='Enter a non-zero whole value.'; return }
          const pct = (p/w)*100
          out.innerHTML = '<strong>'+pct.toFixed(4)+'%</strong>'
        })
      }
    },

    'percentage-change-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="old" type="number" placeholder="Old value" />\n  <input data-name="new" type="number" placeholder="New value" />\n  <button data-action="calc" class="btn">Percent Change</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const oldv = parseFloat(el.querySelector('[data-name=old]').value)||0
          const newv = parseFloat(el.querySelector('[data-name=new]').value)||0
          const out = el.querySelector('[data-out]')
          if(oldv===0){ out.textContent='Old value must be non-zero.'; return }
          const pc = ((newv-oldv)/oldv)*100
          out.innerHTML = '<strong>'+pc.toFixed(4)+'%</strong>'
        })
      }
    },

    'discount-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="price" type="number" placeholder="Original price" />\n  <input data-name="disc" type="number" placeholder="Discount %" />\n  <button data-action="calc" class="btn">Apply Discount</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const price = parseFloat(el.querySelector('[data-name=price]').value)||0
          const d = parseFloat(el.querySelector('[data-name=disc]').value)||0
          const out = el.querySelector('[data-out]')
          const discounted = price * (1 - d/100)
          const saved = price - discounted
          out.innerHTML = '<strong>Price: '+discounted.toFixed(2)+'</strong> — Saved: '+saved.toFixed(2)
        })
      }
    },

    'gst-calculator-india': {
      render: ()=>`<div class="form-row">\n  <input data-name="price" type="number" placeholder="Price" />\n  <input data-name="rate" type="number" placeholder="GST rate % (e.g. 18)" />\n  <select data-name="mode"><option value="exclusive">Add GST (exclusive)</option><option value="inclusive">Extract GST (inclusive)</option></select>\n  <button data-action="calc" class="btn">Compute GST</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const price = parseFloat(el.querySelector('[data-name=price]').value)||0
          const rate = parseFloat(el.querySelector('[data-name=rate]').value)||0
          const mode = el.querySelector('[data-name=mode]').value
          const out = el.querySelector('[data-out]')
          if(mode==='exclusive'){
            const gst = price * rate/100
            const total = price + gst
            out.innerHTML = '<strong>GST: '+gst.toFixed(2)+'</strong> — Total: '+total.toFixed(2)
          } else {
            const base = price / (1 + rate/100)
            const gst = price - base
            out.innerHTML = '<strong>Base: '+base.toFixed(2)+'</strong> — GST: '+gst.toFixed(2)
          }
        })
      }
    },

    'simple-interest-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="P" type="number" placeholder="Principal (P)" />\n  <input data-name="R" type="number" placeholder="Rate % per annum" />\n  <input data-name="T" type="number" placeholder="Time (years)" />\n  <button data-action="calc" class="btn">Compute Interest</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const P = parseFloat(el.querySelector('[data-name=P]').value)||0
          const R = parseFloat(el.querySelector('[data-name=R]').value)||0
          const T = parseFloat(el.querySelector('[data-name=T]').value)||0
          const out = el.querySelector('[data-out]')
          const interest = P * R * T / 100
          const total = P + interest
          out.innerHTML = '<strong>Interest: '+interest.toFixed(2)+'</strong> — Total: '+total.toFixed(2)
        })
      }
    },

    'compound-interest-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="P" type="number" placeholder="Principal (P)" />\n  <input data-name="R" type="number" placeholder="Annual Rate %" />\n  <input data-name="n" type="number" placeholder="Compounds per year (n), e.g. 12" />\n  <input data-name="t" type="number" placeholder="Years (t)" />\n  <button data-action="calc" class="btn">Compute Future Value</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const P = parseFloat(el.querySelector('[data-name=P]').value)||0
          const R = parseFloat(el.querySelector('[data-name=R]').value)||0
          const n = parseFloat(el.querySelector('[data-name=n]').value)||1
          const t = parseFloat(el.querySelector('[data-name=t]').value)||0
          const out = el.querySelector('[data-out]')
          const r = R/100
          const A = P * Math.pow(1 + r/n, n*t)
          out.innerHTML = '<strong>Future Value: '+A.toFixed(2)+'</strong>'
        })
      }
    },

    'sip-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="P" type="number" placeholder="Monthly SIP (P)" />\n  <input data-name="R" type="number" placeholder="Annual Return %" />\n  <input data-name="t" type="number" placeholder="Years (t)" />\n  <button data-action="calc" class="btn">Estimate SIP</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const P = parseFloat(el.querySelector('[data-name=P]').value)||0
          const R = parseFloat(el.querySelector('[data-name=R]').value)||0
          const t = parseFloat(el.querySelector('[data-name=t]').value)||0
          const out = el.querySelector('[data-out]')
          const r = R/100/12
          const n = t*12
          const fv = P * ( (Math.pow(1+r,n)-1)/r ) * (1+r)
          out.innerHTML = '<strong>Maturity Value: '+fv.toFixed(2)+'</strong>'
        })
      }
    },

    'fd-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="P" type="number" placeholder="Principal" />\n  <input data-name="R" type="number" placeholder="Annual Rate %" />\n  <input data-name="t" type="number" placeholder="Years" />\n  <input data-name="n" type="number" placeholder="Compounds per year (n)" />\n  <button data-action="calc" class="btn">Compute FD</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const P = parseFloat(el.querySelector('[data-name=P]').value)||0
          const R = parseFloat(el.querySelector('[data-name=R]').value)||0
          const t = parseFloat(el.querySelector('[data-name=t]').value)||0
          const n = parseFloat(el.querySelector('[data-name=n]').value)||1
          const out = el.querySelector('[data-out]')
          const A = P * Math.pow(1 + (R/100)/n, n*t)
          out.innerHTML = '<strong>Maturity: '+A.toFixed(2)+'</strong>'
        })
      }
    },

    'rd-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="P" type="number" placeholder="Monthly deposit (P)" />\n  <input data-name="R" type="number" placeholder="Annual Rate %" />\n  <input data-name="t" type="number" placeholder="Years" />\n  <button data-action="calc" class="btn">Compute RD</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const P = parseFloat(el.querySelector('[data-name=P]').value)||0
          const R = parseFloat(el.querySelector('[data-name=R]').value)||0
          const t = parseFloat(el.querySelector('[data-name=t]').value)||0
          const out = el.querySelector('[data-out]')
          const n = 12
          const r = R/100
          // approximate RD maturity
          const m = P * ( (Math.pow(1 + r/n, n*t) - 1) / (1 - Math.pow(1 + r/n, -1/n)) )
          out.innerHTML = '<strong>Approx Maturity: '+m.toFixed(2)+'</strong>'
        })
      }
    },

    'currency-converter': {
      render: ()=>`<div class="form-row">\n  <input data-name="amount" type="number" placeholder="Amount" />\n  <input data-name="rate" type="number" placeholder="Exchange rate (1 unit = X target)" />\n  <button data-action="calc" class="btn">Convert</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const amt = parseFloat(el.querySelector('[data-name=amount]').value)||0
          const rate = parseFloat(el.querySelector('[data-name=rate]').value)||0
          const out = el.querySelector('[data-out]')
          out.innerHTML = '<strong>Converted: '+(amt*rate).toFixed(4)+'</strong>'
        })
      }
    },

    'profit-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="cp" type="number" placeholder="Cost Price" />\n  <input data-name="sp" type="number" placeholder="Selling Price" />\n  <button data-action="calc" class="btn">Compute Profit</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const cp = parseFloat(el.querySelector('[data-name=cp]').value)||0
          const sp = parseFloat(el.querySelector('[data-name=sp]').value)||0
          const out = el.querySelector('[data-out]')
          const profit = sp - cp
          const pct = cp? (profit/cp*100):0
          out.innerHTML = '<strong>Profit: '+profit.toFixed(2)+'</strong> — '+pct.toFixed(2)+'%'
        })
      }
    },

    'loss-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="cp" type="number" placeholder="Cost Price" />\n  <input data-name="sp" type="number" placeholder="Selling Price" />\n  <button data-action="calc" class="btn">Compute Loss</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const cp = parseFloat(el.querySelector('[data-name=cp]').value)||0
          const sp = parseFloat(el.querySelector('[data-name=sp]').value)||0
          const out = el.querySelector('[data-out]')
          const loss = cp - sp
          const pct = cp? (loss/cp*100):0
          out.innerHTML = '<strong>Loss: '+loss.toFixed(2)+'</strong> — '+pct.toFixed(2)+'%'
        })
      }
    },

    'break-even-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="fixed" type="number" placeholder="Fixed Costs" />\n  <input data-name="price" type="number" placeholder="Price per unit" />\n  <input data-name="variable" type="number" placeholder="Variable cost per unit" />\n  <button data-action="calc" class="btn">Compute Break-even</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const fixed = parseFloat(el.querySelector('[data-name=fixed]').value)||0
          const price = parseFloat(el.querySelector('[data-name=price]').value)||0
          const variable = parseFloat(el.querySelector('[data-name=variable]').value)||0
          const out = el.querySelector('[data-out]')
          const contrib = price - variable
          if(contrib<=0){ out.textContent='Price must exceed variable cost per unit.'; return }
          const units = fixed / contrib
          out.innerHTML = '<strong>Break-even units: '+Math.ceil(units)+'</strong>'
        })
      }
    },

    'roi-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="gain" type="number" placeholder="Gain (or sale proceeds)" />\n  <input data-name="cost" type="number" placeholder="Cost / Investment" />\n  <button data-action="calc" class="btn">Compute ROI %</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const gain = parseFloat(el.querySelector('[data-name=gain]').value)||0
          const cost = parseFloat(el.querySelector('[data-name=cost]').value)||0
          const out = el.querySelector('[data-out]')
          if(cost===0){ out.textContent='Enter non-zero cost.'; return }
          const roi = ((gain - cost)/cost)*100
          out.innerHTML = '<strong>ROI: '+roi.toFixed(2)+'%</strong>'
        })
      }
    },

    'emi-vs-rent-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="emi" type="number" placeholder="EMI per month" />\n  <input data-name="rent" type="number" placeholder="Rent per month" />\n  <button data-action="calc" class="btn">Compare</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const emi = parseFloat(el.querySelector('[data-name=emi]').value)||0
          const rent = parseFloat(el.querySelector('[data-name=rent]').value)||0
          const out = el.querySelector('[data-out]')
          if(emi < rent) out.innerHTML = '<strong>Buying (EMI) is cheaper than rent monthly</strong>'
          else if(emi > rent) out.innerHTML = '<strong>Renting is cheaper monthly</strong>'
          else out.innerHTML = '<strong>Costs are similar</strong>'
        })
      }
    },

    'credit-card-interest-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="bal" type="number" placeholder="Outstanding balance" />\n  <input data-name="apr" type="number" placeholder="APR (%)" />\n  <input data-name="days" type="number" placeholder="Days outstanding" />\n  <button data-action="calc" class="btn">Estimate Interest</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const bal = parseFloat(el.querySelector('[data-name=bal]').value)||0
          const apr = parseFloat(el.querySelector('[data-name=apr]').value)||0
          const days = parseFloat(el.querySelector('[data-name=days]').value)||30
          const out = el.querySelector('[data-out]')
          const interest = bal * (apr/100) * (days/365)
          out.innerHTML = '<strong>Estimated interest: '+interest.toFixed(2)+'</strong>'
        })
      }
    },

    'inflation-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="amount" type="number" placeholder="Amount today" />\n  <input data-name="rate" type="number" placeholder="Annual inflation %" />\n  <input data-name="years" type="number" placeholder="Years" />\n  <button data-action="calc" class="btn">Adjust for Inflation</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const amt = parseFloat(el.querySelector('[data-name=amount]').value)||0
          const r = parseFloat(el.querySelector('[data-name=rate]').value)||0
          const years = parseFloat(el.querySelector('[data-name=years]').value)||0
          const out = el.querySelector('[data-out]')
          const adj = amt / Math.pow(1 + r/100, years)
          out.innerHTML = '<strong>Inflation-adjusted value: '+adj.toFixed(2)+'</strong>'
        })
      }
    },

    'budget-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="income" type="number" placeholder="Monthly income" />\n  <input data-name="expenses" type="number" placeholder="Monthly expenses" />\n  <button data-action="calc" class="btn">Plan Budget</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const inc = parseFloat(el.querySelector('[data-name=income]').value)||0
          const exp = parseFloat(el.querySelector('[data-name=expenses]').value)||0
          const out = el.querySelector('[data-out]')
          const save = inc - exp
          const pct = inc? (save/inc*100):0
          out.innerHTML = '<strong>Savings: '+save.toFixed(2)+'</strong> — '+pct.toFixed(2)+'% of income'
        })
      }
    },

    'margin-markup-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="cost" type="number" placeholder="Cost" />\n  <input data-name="value" type="number" placeholder="Markup % or Margin %" />\n  <select data-name="mode"><option value="markup">Markup%</option><option value="margin">Margin%</option></select>\n  <button data-action="calc" class="btn">Convert</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const cost = parseFloat(el.querySelector('[data-name=cost]').value)||0
          const val = parseFloat(el.querySelector('[data-name=value]').value)||0
          const mode = el.querySelector('[data-name=mode]').value
          const out = el.querySelector('[data-out]')
          if(mode==='markup'){
            const sp = cost * (1 + val/100)
            const margin = sp? ((sp-cost)/sp*100):0
            out.innerHTML = '<strong>Selling price: '+sp.toFixed(2)+'</strong> — Margin: '+margin.toFixed(2)+'%'
          } else {
            const sp = cost / (1 - val/100)
            const markup = ((sp-cost)/cost*100)
            out.innerHTML = '<strong>Selling price: '+sp.toFixed(2)+'</strong> — Markup: '+markup.toFixed(2)+'%'
          }
        })
      }
    },

    'vat-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="price" type="number" placeholder="Price" />\n  <input data-name="rate" type="number" placeholder="VAT %" />\n  <select data-name="mode"><option value="exclusive">Add VAT</option><option value="inclusive">Extract VAT</option></select>\n  <button data-action="calc" class="btn">Compute</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const price = parseFloat(el.querySelector('[data-name=price]').value)||0
          const rate = parseFloat(el.querySelector('[data-name=rate]').value)||0
          const mode = el.querySelector('[data-name=mode]').value
          const out = el.querySelector('[data-out]')
          if(mode==='exclusive'){
            const vat = price * rate/100
            out.innerHTML = '<strong>VAT: '+vat.toFixed(2)+'</strong> — Total: '+(price+vat).toFixed(2)
          } else {
            const base = price / (1 + rate/100)
            const vat = price - base
            out.innerHTML = '<strong>Base: '+base.toFixed(2)+'</strong> — VAT: '+vat.toFixed(2)
          }
        })
      }
    },

    'tip-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="bill" type="number" placeholder="Bill amount" />\n  <input data-name="tip" type="number" placeholder="Tip %" />\n  <input data-name="people" type="number" placeholder="People (optional)" />\n  <button data-action="calc" class="btn">Compute Tip</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const bill = parseFloat(el.querySelector('[data-name=bill]').value)||0
          const tip = parseFloat(el.querySelector('[data-name=tip]').value)||0
          const people = parseInt(el.querySelector('[data-name=people]').value) || 1
          const out = el.querySelector('[data-out]')
          const tipAmt = bill * tip/100
          const per = people? ( (bill + tipAmt)/people ): (bill + tipAmt)
          out.innerHTML = '<strong>Tip: '+tipAmt.toFixed(2)+'</strong> — Per person: '+per.toFixed(2)
        })
      }
    },

    'unit-price-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="price" type="number" placeholder="Total price" />\n  <input data-name="units" type="number" placeholder="Total units" />\n  <button data-action="calc" class="btn">Unit Price</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const price = parseFloat(el.querySelector('[data-name=price]').value)||0
          const units = parseFloat(el.querySelector('[data-name=units]').value)||1
          const out = el.querySelector('[data-out]')
          const up = price/units
          out.innerHTML = '<strong>Unit price: '+up.toFixed(2)+'</strong>'
        })
      }
    },

    'invoice-total-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="subtotal" type="number" placeholder="Subtotal" />\n  <input data-name="tax" type="number" placeholder="Tax %" />\n  <input data-name="discount" type="number" placeholder="Discount %" />\n  <input data-name="shipping" type="number" placeholder="Shipping" />\n  <button data-action="calc" class="btn">Compute Total</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const subtotal = parseFloat(el.querySelector('[data-name=subtotal]').value)||0
          const tax = parseFloat(el.querySelector('[data-name=tax]').value)||0
          const discount = parseFloat(el.querySelector('[data-name=discount]').value)||0
          const shipping = parseFloat(el.querySelector('[data-name=shipping]').value)||0
          const out = el.querySelector('[data-out]')
          const taxAmt = subtotal * tax/100
          const discAmt = subtotal * discount/100
          const total = subtotal + taxAmt - discAmt + shipping
          out.innerHTML = '<strong>Total: '+total.toFixed(2)+'</strong>'
        })
      }
    },

    'subscription-pricing-calculator': {
      render: ()=>`<div class="form-row">\n  <input data-name="price" type="number" placeholder="Price per user per month" />\n  <input data-name="users" type="number" placeholder="Active users" />\n  <button data-action="calc" class="btn">Compute MRR/ARR</button>\n</div>\n<div data-out class="result"></div>`,
      bind: el=>{
        el.querySelector('[data-action]')?.addEventListener('click', ()=>{
          const price = parseFloat(el.querySelector('[data-name=price]').value)||0
          const users = parseFloat(el.querySelector('[data-name=users]').value)||0
          const out = el.querySelector('[data-out]')
          const mrr = price * users
          const arr = mrr * 12
          out.innerHTML = '<strong>MRR: '+mrr.toFixed(2)+'</strong> — ARR: '+arr.toFixed(2)
        })
      }
    }
  }

  // Add a generic EMI calculator mapping
  mapping['loan-emi-calculator'] = {
    render: ()=>`<div class="form-row">\n  <input data-name="principal" type="number" placeholder="Principal (P)" />\n  <input data-name="annualRate" type="number" placeholder="Annual rate (%)" />\n  <input data-name="tenure" type="number" placeholder="Tenure (years)" />\n  <button data-action="calc" class="btn">Calculate EMI</button>\n</div>\n<div data-out class="result"></div>`,
    bind: el=>{
      el.querySelector('[data-action]')?.addEventListener('click', ()=>{
        const P = parseFloat(el.querySelector('[data-name=principal]').value)||0
        const annual = parseFloat(el.querySelector('[data-name=annualRate]').value)||0
        const years = parseFloat(el.querySelector('[data-name=tenure]').value)||0
        const out = el.querySelector('[data-out]')
        if(P<=0||annual<=0||years<=0){ out.textContent='Enter positive principal, rate and tenure.'; return }
        const r = annual/12/100
        const n = years*12
        const numerator = P * r * Math.pow(1+r,n)
        const denom = Math.pow(1+r,n)-1
        const emi = numerator/denom
        const total = emi * n
        const interest = total - P
        out.innerHTML = '<strong>EMI: \u20B9'+emi.toFixed(2)+'</strong><br/>Total: \u20B9'+total.toFixed(2)+' — Interest: \u20B9'+interest.toFixed(2)
      })
    }
  }

  function wireUp(el, slug){
    let map = mapping[slug]
    // fallback: if slug relates to EMI loan calculators, use generic EMI mapping
    if(!map){
      if(slug.includes('emi') || slug.includes('loan')) map = mapping['loan-emi-calculator']
    }
    if(!map) return
    try{
      el.innerHTML = map.render()
      if(typeof map.bind === 'function') map.bind(el)
    }catch(e){ console.error('calc render error',slug,e) }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    // find generated calc placeholders and wire them
    document.querySelectorAll('[id^="calc-"]').forEach(el=>{
      const id = el.id
      const slug = id.replace(/^calc-/,'')
      wireUp(el, slug)
    })
  })
})();
