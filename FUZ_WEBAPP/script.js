/**
 * JACOPO FUSÉ — script.js
 */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function sanitize(str) {
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.textContent;
}

/* Anno dinamico */
const currentYear = new Date().getFullYear();
$$('.year-span').forEach(el => { el.textContent = currentYear; });

/* ── LOADER ── */
(function initLoader() {
  const loader = $('#loader');
  const bar    = $('#loader-bar');
  if (!loader || !bar) return;
  let progress = 0;
  document.body.style.overflow = 'hidden';
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('gone');
        document.body.style.overflow = '';
        triggerInitialReveals();
      }, 500);
    } else {
      bar.style.width = progress + '%';
    }
  }, 80);
})();

/* ── CURSOR ── */
(function initCursor() {
  const dot  = $('#cursor');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  });
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(animateRing);
  })();

  const hoverEls = 'a, button, .p-card, .f-btn, .price-card, .gear-group, input, textarea, select';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverEls)) ring.classList.add('hovered'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hoverEls)) ring.classList.remove('hovered'); });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ── HEADER SCROLL ── */
(function initHeader() {
  const header = $('#site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── HAMBURGER / NAV OVERLAY ── */
(function initNav() {
  const btn     = $('#hamburger');
  const overlay = $('#nav-overlay');
  const links   = $$('.nav-link', overlay);
  if (!btn || !overlay) return;

  function openNav() {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const first = overlay.querySelector('a'); if (first) first.focus(); }, 100);
  }
  function closeNav() {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    btn.focus();
  }

  btn.addEventListener('click', () => btn.classList.contains('open') ? closeNav() : openNav());
  links.forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && btn.classList.contains('open')) closeNav(); });

  overlay.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = $$('a, button', overlay);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = $$('.js-reveal-fade, .js-reveal-clip, .js-reveal-left, .js-reveal-right');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.pricing-grid .js-reveal-fade, .gear-grid .js-reveal-fade, .video-grid .js-reveal-fade').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
  });
  $$('.tl-item.js-reveal-fade').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });
  els.forEach(el => observer.observe(el));
}

function triggerInitialReveals() {
  initReveal();
  $$('.s-hero .js-reveal-fade, .s-hero .js-reveal-clip').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), i * 150 + 100);
  });
}

/* ── CONTATORI ── */
(function initCounters() {
  const counters = $$('.stat-n[data-target]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const start = performance.now();
      const dur = 1400;
      (function tick(now) {
        const progress = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      })(performance.now());
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ── FILTRI GALLERIA ── */
(function initFilters() {
  const btns  = $$('.f-btn');
  const cards = $$('.p-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btns.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
      cards.forEach(card => {
        const visible = filter === 'all' || card.dataset.cat === filter;
        if (visible) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(.95) translateY(10px)';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'none';
          }));
        } else {
          card.style.transition = 'opacity .25s ease, transform .25s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(.95)';
          setTimeout(() => card.classList.add('hidden'), 280);
        }
      });
    });
  });
})();

/* ── FORM VALIDAZIONE ── */
(function initForm() {
  const form = $('#contact-form');
  if (!form) return;
  const fields = {
    name:    { el: $('#f-name'),  err: $('#err-name'),  validate: v => v.trim().length >= 2 ? '' : 'Inserisci il tuo nome (min 2 caratteri).' },
    email:   { el: $('#f-email'), err: $('#err-email'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : "Inserisci un'email valida." },
    type:    { el: $('#f-type'),  err: $('#err-type'),  validate: v => v !== '' ? '' : 'Seleziona un tipo di richiesta.' },
    message: { el: $('#f-msg'),   err: $('#err-msg'),   validate: v => v.trim().length >= 10 ? '' : 'Il messaggio deve avere almeno 10 caratteri.' },
  };

  function validateField(key) {
    const { el, err, validate } = fields[key];
    if (!el || !err) return true;
    const msg = validate(el.value);
    err.textContent = sanitize(msg);
    el.classList.toggle('invalid', msg !== '');
    return msg === '';
  }

  Object.keys(fields).forEach(key => {
    const { el } = fields[key];
    if (!el) return;
    el.addEventListener('blur', () => validateField(key));
    el.addEventListener('input', () => { if (el.classList.contains('invalid')) validateField(key); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    Object.keys(fields).forEach(key => { if (!validateField(key)) valid = false; });
    if (!valid) {
      const first = Object.values(fields).find(f => f.el?.classList.contains('invalid'));
      if (first) first.el.focus();
      return;
    }
    const btn = form.querySelector('.btn-send');
    if (btn) { btn.disabled = true; btn.querySelector('span').textContent = 'Invio in corso…'; }
    setTimeout(() => {
      form.reset();
      Object.values(fields).forEach(({ el }) => el?.classList.remove('invalid'));
      const ok = $('#form-ok');
      if (ok) ok.removeAttribute('hidden');
      if (btn) { btn.disabled = false; btn.querySelector('span').textContent = 'Invia messaggio'; }
      showToast('Messaggio inviato!');
      setTimeout(() => { if (ok) ok.setAttribute('hidden', ''); }, 5000);
    }, 1200);
  });
})();

/* ── TOAST ── */
function showToast(message, duration = 3000) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = sanitize(message);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── SMOOTH SCROLL ── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      const headerH = $('#site-header')?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── PARALLAX HERO ── */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heroBg = $('.hero-bg');
  if (!heroBg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── HOVER MAGNETICO BOTTONI ── */
(function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('.btn-fill, .btn-line').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

window.addEventListener('error', e => { console.warn('[JF Portfolio] Errore:', e.message); });
