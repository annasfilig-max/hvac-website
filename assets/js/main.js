/* HVAC Template — main.js
   Handles: mobile menu, FAQ accordion, gallery lightbox, form validation,
   carousel, count-up stats, and intersection-based fade-ins.
*/
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuClose = document.querySelector('[data-menu-close]');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }
  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close siblings (one-at-a-time)
      document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(o => {
        if (o !== btn) o.setAttribute('aria-expanded', 'false');
      });
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  /* ---------- Forms ---------- */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // honeypot
      const hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) { return; }

      let valid = true;
      form.querySelectorAll('[data-required]').forEach(field => {
        const group = field.closest('.form-group');
        const errEl = group ? group.querySelector('.form-error') : null;
        let fieldValid = true;
        const val = (field.value || '').trim();

        if (!val) {
          fieldValid = false;
          if (errEl) errEl.textContent = 'This field is required.';
        } else if (field.type === 'email') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            fieldValid = false;
            if (errEl) errEl.textContent = 'Please enter a valid email address.';
          }
        } else if (field.type === 'tel') {
          if (!/^[+()\-\s\d]{7,}$/.test(val)) {
            fieldValid = false;
            if (errEl) errEl.textContent = 'Please enter a valid phone number.';
          }
        }

        if (group) group.classList.toggle('error', !fieldValid);
        if (!fieldValid) valid = false;
      });

      if (!valid) return;

      // Simulate success (buyer will wire up Formspree endpoint).
      form.classList.add('submitted');
      const success = form.querySelector('.form-success');
      if (success) success.setAttribute('aria-live', 'polite');
    });

    // clear error on input
    form.querySelectorAll('[data-required]').forEach(field => {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group) group.classList.remove('error');
      });
    });
  });

  /* ---------- Simple carousel ---------- */
  document.querySelectorAll('[data-carousel]').forEach(root => {
    const track = root.querySelector('.carousel-track');
    const prev = root.querySelector('[data-car-prev]');
    const next = root.querySelector('[data-car-next]');
    if (!track) return;
    let idx = 0;
    const slides = track.children.length;
    function visible() { return window.innerWidth >= 768 ? 3 : 1; }
    function update() {
      const max = Math.max(0, slides - visible());
      if (idx > max) idx = max;
      if (idx < 0) idx = 0;
      const slideW = track.children[0].getBoundingClientRect().width + 24; // gap
      track.style.transform = `translateX(-${idx * slideW}px)`;
    }
    if (prev) prev.addEventListener('click', () => { idx--; update(); });
    if (next) next.addEventListener('click', () => { idx++; update(); });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Gallery lightbox ---------- */
  const lb = document.querySelector('[data-lightbox]');
  if (lb) {
    const lbImg = lb.querySelector('img');
    const items = Array.from(document.querySelectorAll('.gallery-item img'));
    let cur = 0;
    function openLb(i) {
      cur = i;
      lbImg.src = items[cur].src;
      lbImg.alt = items[cur].alt || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    }
    function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
    function navLb(dir) {
      cur = (cur + dir + items.length) % items.length;
      lbImg.src = items[cur].src;
    }
    items.forEach((img, i) => {
      img.parentElement.addEventListener('click', () => openLb(i));
      img.parentElement.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLb(i); });
      img.parentElement.setAttribute('tabindex', '0');
    });
    lb.querySelector('[data-lb-close]').addEventListener('click', closeLb);
    lb.querySelector('[data-lb-prev]').addEventListener('click', () => navLb(-1));
    lb.querySelector('[data-lb-next]').addEventListener('click', () => navLb(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') navLb(-1);
      if (e.key === 'ArrowRight') navLb(1);
    });
  }

  /* ---------- Gallery filters (visual only) ---------- */
  document.querySelectorAll('.gallery-filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ---------- Count-up stats + fade-in on scroll ---------- */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in-view');
      if (el.hasAttribute('data-count')) {
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        if (reduced) { el.textContent = target + suffix; }
        else {
          const dur = 1500;
          const start = performance.now();
          const step = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const val = Math.floor(target * (0.5 - Math.cos(Math.PI * p) / 2));
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      }
      io.unobserve(el);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.fade-in, [data-count]').forEach(el => io.observe(el));

  /* ---------- Footer year ---------- */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();

/* "This website could be yours" promo banner — dismissible per session */
(function(){
  if (sessionStorage.getItem('jtmBannerClosed')) return;
  function mount(){
    const bar = document.createElement('div');
    bar.id = 'jtm-promo-banner';
    bar.innerHTML = '<span style="font-weight:500">This website could be yours.</span> <a href="https://jtmarketing.live" target="_blank" rel="noopener" style="color:#ffd89b;text-decoration:underline;font-weight:600;margin-left:0.5rem">Get yours →</a><button aria-label="Close" style="background:transparent;border:0;color:#fff;font-size:1.5rem;line-height:1;cursor:pointer;padding:0 0.5rem;margin-left:auto">×</button>';
    Object.assign(bar.style, {position:'sticky',top:'0',left:'0',right:'0',background:'linear-gradient(90deg,#0a3d62,#1e5a8a)',color:'#fff',padding:'0.625rem 1rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem',zIndex:'200',fontSize:'0.875rem',fontFamily:'Inter,system-ui,sans-serif',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'});
    bar.querySelector('button').onclick = () => { bar.remove(); sessionStorage.setItem('jtmBannerClosed','1'); };
    document.body.prepend(bar);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();

/* Rewrite internal /path links to absolute domain URLs (so nav works on the GHL Preview HVAC published site) */
(function(){
  const ABS_BASE = 'https://hvac.websitepreviewjtm.com';
  function fixLinks(){
    document.querySelectorAll('a[href^="/"]').forEach(function(a){
      const href = a.getAttribute('href');
      if (!href || href.startsWith('//') || href.startsWith('/preview-hvac')) return;
      a.setAttribute('href', ABS_BASE + href);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixLinks);
  else fixLinks();
})();
