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
$$('.year-span').forEach(el => { el.textContent = new Date().getFullYear(); });

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
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;
  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  });
  (function loop() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(loop);
  })();

  const hov = 'a,button,.p-card,.f-btn,.price-card,.gear-group,input,textarea,select';
  document.addEventListener('mouseover',  e => { if (e.target.closest(hov)) ring.classList.add('hovered'); });
  document.addEventListener('mouseout',   e => { if (e.target.closest(hov)) ring.classList.remove('hovered'); });
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; });
})();

/* ── HEADER SCROLL ── */
(function() {
  const h = $('#site-header');
  if (!h) return;
  window.addEventListener('scroll', () => h.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
})();

/* ── HAMBURGER ── */
(function initNav() {
  const btn     = $('#hamburger');
  const overlay = $('#nav-overlay');
  if (!btn || !overlay) return;

  const open = () => {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const f = overlay.querySelector('a'); if (f) f.focus(); }, 100);
  };
  const close = () => {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    overlay.setAttribute('hidden','');
    document.body.style.overflow = '';
    btn.focus();
  };

  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  $$('.nav-link', overlay).forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && btn.classList.contains('open')) close(); });

  overlay.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const els = $$('a,button', overlay);
    if (!els.length) return;
    if (e.shiftKey && document.activeElement === els[0]) { e.preventDefault(); els[els.length-1].focus(); }
    else if (!e.shiftKey && document.activeElement === els[els.length-1]) { e.preventDefault(); els[0].focus(); }
  });
})();

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = $$('.js-reveal-fade,.js-reveal-clip,.js-reveal-left,.js-reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.pricing-grid .js-reveal-fade,.gear-grid .js-reveal-fade,.video-grid .js-reveal-fade').forEach((el,i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
  });
  $$('.tl-item.js-reveal-fade').forEach((el,i) => { el.style.transitionDelay = `${i * 0.1}s`; });
  els.forEach(el => obs.observe(el));
}

function triggerInitialReveals() {
  initReveal();
  $$('.s-hero .js-reveal-fade,.s-hero .js-reveal-clip').forEach((el,i) => {
    setTimeout(() => el.classList.add('in'), i * 150 + 100);
  });
}

/* ── CONTATORI ── */
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const start  = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / 1400, 1);
        el.textContent = Math.round((1 - Math.pow(1-p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('.stat-n[data-target]').forEach(c => obs.observe(c));
})();

/* ── FILTRI GALLERIA ── */
(function initFilters() {
  const btns  = $$('.f-btn');
  const cards = $$('.p-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btns.forEach(b => { b.classList.toggle('active', b===btn); b.setAttribute('aria-pressed', String(b===btn)); });
      cards.forEach(card => {
        const visible = filter === 'all' || card.dataset.cat === filter;
        if (visible) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(.95) translateY(10px)';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            card.style.opacity = '1'; card.style.transform = 'none';
          }));
        } else {
          card.style.transition = 'opacity .25s ease, transform .25s ease';
          card.style.opacity = '0'; card.style.transform = 'scale(.95)';
          setTimeout(() => card.classList.add('hidden'), 280);
        }
      });
    });
  });
})();

/* ── FORM ── */
(function initForm() {
  const form = $('#contact-form');
  if (!form) return;
  const fields = {
    name:    { el: $('#f-name'),  err: $('#err-name'),  validate: v => v.trim().length >= 2 ? '' : 'Inserisci il tuo nome (min 2 caratteri).' },
    email:   { el: $('#f-email'), err: $('#err-email'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : "Inserisci un'email valida." },
    type:    { el: $('#f-type'),  err: $('#err-type'),  validate: v => v !== '' ? '' : 'Seleziona un tipo di richiesta.' },
    message: { el: $('#f-msg'),   err: $('#err-msg'),   validate: v => v.trim().length >= 10 ? '' : 'Il messaggio deve avere almeno 10 caratteri.' },
  };

  const validateField = key => {
    const { el, err, validate } = fields[key];
    if (!el || !err) return true;
    const msg = validate(el.value);
    err.textContent = sanitize(msg);
    el.classList.toggle('invalid', msg !== '');
    return msg === '';
  };

  Object.keys(fields).forEach(key => {
    const { el } = fields[key];
    if (!el) return;
    el.addEventListener('blur',  () => validateField(key));
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
      setTimeout(() => { if (ok) ok.setAttribute('hidden',''); }, 5000);
    }, 1200);
  });
})();

/* ── TOAST ── */
function showToast(msg, dur = 3000) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = sanitize(msg);
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

/* ── SMOOTH SCROLL ── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - ($('#site-header')?.offsetHeight ?? 0);
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── PARALLAX ── */
(function() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const bg = $('.hero-bg');
  if (!bg) return;
  let t = false;
  window.addEventListener('scroll', () => {
    if (!t) { requestAnimationFrame(() => { bg.style.transform = `translateY(${window.scrollY*.35}px)`; t = false; }); t = true; }
  }, { passive: true });
})();

/* ── HOVER MAGNETICO ── */
(function() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  $$('.btn-fill,.btn-line').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX-(r.left+r.width/2))*.25}px,${(e.clientY-(r.top+r.height/2))*.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

window.addEventListener('error', e => console.warn('[JF] Errore:', e.message));
