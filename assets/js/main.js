(function () {
  'use strict';

  // Mark JS as ready — CSS reveal-hide rules are scoped to .has-js so that
  // if JS fails / IntersectionObserver doesn't fire (e.g. inside a GHL iframe),
  // content stays visible by default instead of stuck at opacity 0.
  document.documentElement.classList.add('has-js');

  // Safety net: after 2.5s, force-reveal anything still hidden in case IO never fires.
  setTimeout(() => {
    document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .fade-in, ' +
      '.sec-head, .svc-card, .svc-wide, .port-tile, .stat, .testimonial, ' +
      '.step, .city-card, .team-card, .about-strip, .big-quote'
    ).forEach(el => el.classList.add('in-view'));
  }, 2500);

  // ===== Mobile menu =====
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    const toggle = (open) => {
      const isOpen = open ?? !mobileMenu.classList.contains('is-open');
      mobileMenu.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    };
    menuToggle.addEventListener('click', () => toggle());
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  // ===== FAQ accordion =====
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.getAttribute('aria-expanded') === 'true';
      // close all
      document.querySelectorAll('.faq-item').forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        const q = other.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ===== Count-up on scroll =====
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('in-view');
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          if (prefersReduced) { el.textContent = target + suffix; io.unobserve(el); return; }
          const duration = 1400;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    countEls.forEach(el => io.observe(el));
  }

  // ===== Testimonial carousel =====
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    let idx = 0;
    const visible = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const update = () => {
      const max = Math.max(0, slides.length - visible());
      if (idx > max) idx = max;
      if (idx < 0) idx = 0;
      const slideW = slides[0].getBoundingClientRect().width + 24;
      track.style.transform = `translateX(-${idx * slideW}px)`;
    };
    prev?.addEventListener('click', () => { idx--; update(); });
    next?.addEventListener('click', () => { idx++; update(); });
    window.addEventListener('resize', update);
    setTimeout(update, 100);
  }

  // ===== Gallery filters (visual only) =====
  document.querySelectorAll('.gallery-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filters .filter-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  // ===== Lightbox =====
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.lightbox-img');
    const items = Array.from(document.querySelectorAll('.masonry-item img'));
    let current = 0;
    const open = (i) => {
      current = i;
      lbImg.src = items[i].src;
      lbImg.alt = items[i].alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    const nav = (d) => {
      current = (current + d + items.length) % items.length;
      lbImg.src = items[current].src;
      lbImg.alt = items[current].alt;
    };
    items.forEach((img, i) => {
      img.parentElement.addEventListener('click', () => open(i));
      img.parentElement.setAttribute('role', 'button');
      img.parentElement.setAttribute('tabindex', '0');
      img.parentElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev')?.addEventListener('click', () => nav(-1));
    lightbox.querySelector('.lightbox-next')?.addEventListener('click', () => nav(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') nav(-1);
      if (e.key === 'ArrowRight') nav(1);
    });
  }

  // ===== Forms =====
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRe = /^[\d\s().+\-]{7,}$/;
  document.querySelectorAll('form[data-validate]').forEach(form => {
    const success = form.parentElement.querySelector('.form-success');
    const showError = (group, msg) => {
      group.classList.add('has-error');
      const err = group.querySelector('.error-msg');
      if (err) err.textContent = msg;
    };
    const clearError = (group) => group.classList.remove('has-error');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // honeypot
      const hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) return;
      let valid = true;
      form.querySelectorAll('.form-group').forEach(clearError);
      form.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          showError(group, 'This field is required.');
          valid = false;
        } else if (field.type === 'email' && !emailRe.test(field.value.trim())) {
          showError(group, 'Please enter a valid email address.');
          valid = false;
        } else if (field.type === 'tel' && !phoneRe.test(field.value.trim())) {
          showError(group, 'Please enter a valid phone number.');
          valid = false;
        }
      });
      if (!valid) {
        const firstErr = form.querySelector('.has-error input, .has-error textarea, .has-error select');
        firstErr?.focus();
        return;
      }
      // Show success (skip actual submit for template demo)
      form.style.display = 'none';
      if (success) success.classList.add('is-visible');
    });
  });

  // ===== Mark active nav =====
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-main a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  
  // ===== Scroll-triggered nav (denser bg + brass border when scrolled) =====
  const header = document.querySelector('.site-header');
  if (header) {
    const onHeaderScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  // ===== Hero parallax (subtle on scroll) =====
  const heroImg = document.querySelector('.hero-split-img img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 800) heroImg.style.transform = `translateY(${y * 0.08}px) scale(1.02)`;
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
