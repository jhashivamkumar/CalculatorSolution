// Manage category active state, keyboard navigation, and session persistence
(function(){
  const links = Array.from(document.querySelectorAll('.category-link'));
  if(!links.length) return;

  function setActive(el){
    links.forEach(l=>{ l.classList.remove('active'); l.removeAttribute('aria-current'); });
    el.classList.add('active');
    el.setAttribute('aria-current','true');
    // store in session so navigation keeps state
    try{ sessionStorage.setItem('calc_active_cat', el.getAttribute('data-cat') || ''); }catch(e){}
  }

  // Restore from session
  try{
    const saved = sessionStorage.getItem('calc_active_cat');
    if(saved !== null){
      const restored = links.find(l=>l.getAttribute('data-cat')===saved) || links.find(l=>l.getAttribute('data-cat')==='');
      if(restored) setActive(restored);
    }
  }catch(e){}

  links.forEach((link, idx)=>{
    // make keyboard friendly
    link.setAttribute('role','link');
    link.setAttribute('tabindex','0');

    link.addEventListener('click', (e)=>{
      e.preventDefault();
      setActive(link);
      // notify app.js if present to filter cards
      if(window.filterByCategory) window.filterByCategory(link.getAttribute('data-cat'));
    });

    link.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
        return;
      }
      // left/right/up/down navigation between links
      if(['ArrowUp','ArrowLeft','ArrowDown','ArrowRight'].includes(e.key)){
        e.preventDefault();
        const dir = (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 1;
        let next = (idx + dir + links.length) % links.length;
        links[next].focus();
      }
    });
  });
})();
