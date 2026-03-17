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
  const hov = 'a,button,.carousel-slide,.poster-card,.gear-group,input,textarea,select';
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
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  $$('.pricing-grid .js-reveal-fade,.gear-grid .js-reveal-fade,.video-grid .js-reveal-fade').forEach((el,i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
  });
  $$('.tl-item.js-reveal-fade').forEach((el,i) => { el.style.transitionDelay = `${i * 0.1}s`; });
  $$('.poster-card.js-reveal-fade').forEach((el,i) => { el.style.transitionDelay = `${i * 0.1}s`; });
  els.forEach(el => obs.observe(el));
}
function triggerInitialReveals() {
  initReveal();
  $$('.s-hero .js-reveal-fade,.s-hero .js-reveal-clip').forEach((el,i) => {
    setTimeout(() => el.classList.add('in'), i * 150 + 100);
  });
}

/* ── FILTRI CAROSELLI ── */
(function initFilters() {
  const btns   = $$('.f-btn');
  const blocks = $$('.carousel-block');
  if (!btns.length || !blocks.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      btns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });

      blocks.forEach((block, i) => {
        const visible = filter === 'all' || block.dataset.cat === filter;
        if (visible) {
          block.classList.remove('hidden');
          block.style.opacity = '0';
          block.style.transform = 'translateY(20px)';
          setTimeout(() => {
            block.style.transition = 'opacity .5s var(--easing), transform .5s var(--easing)';
            block.style.opacity    = '1';
            block.style.transform  = 'none';
          }, i * 60);
        } else {
          block.style.transition = 'opacity .3s ease, transform .3s ease';
          block.style.opacity    = '0';
          block.style.transform  = 'translateY(10px)';
          setTimeout(() => block.classList.add('hidden'), 300);
        }
      });
    });
  });
})();

/* ── CAROSELLI ── */
(function initCarousels() {
  $$('.carousel-block').forEach(block => {
    const track    = block.querySelector('.carousel-track');
    const slides   = $$('.carousel-slide', block);
    const prevBtn  = block.querySelector('.carousel-prev');
    const nextBtn  = block.querySelector('.carousel-next');
    const dotsWrap = block.querySelector('.carousel-dots');
    const counter  = block.querySelector('.carousel-counter');
    if (!track || !slides.length) return;

    let current = 0;

    /* Quante slide visibili */
    function visibleCount() {
      const w = block.offsetWidth;
      if (w < 600)  return 1;
      if (w < 1024) return 2;
      return 3;
    }

    /* Costruisci i dots */
    slides.forEach((_, i) => {
      if (!dotsWrap) return;
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Vai alla foto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function getDots() {
      return dotsWrap ? $$('.carousel-dot', dotsWrap) : [];
    }

    function goTo(index) {
      const total   = slides.length;
      const visible = visibleCount();
      const max     = Math.max(0, total - visible);
      current = Math.max(0, Math.min(index, max));

      /* Calcola offset: larghezza slide + gap (14px) */
      const slideW  = slides[0].offsetWidth + 14;
      track.style.transform = `translateX(-${current * slideW}px)`;

      /* Dots */
      getDots().forEach((d, i) => d.classList.toggle('active', i === current));

      /* Counter es. "2 / 5" */
      if (counter) counter.textContent = `${current + 1} / ${total}`;

      /* Bottoni */
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current >= max;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    /* Swipe touch */
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    /* Keyboard */
    block.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    /* Resize */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => goTo(current), 150);
    }, { passive: true });

    /* Init */
    goTo(0);
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

/* ── THEME TOGGLE ── */
(function initTheme() {
  const btn  = $('#theme-toggle');
  const body = document.body;
  if (!btn) return;
  const saved = localStorage.getItem('jf-theme');
  if (saved === 'light') body.classList.add('light');
  btn.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem('jf-theme', body.classList.contains('light') ? 'light' : 'dark');
  });
})();

window.addEventListener('error', e => console.warn('[JF] Errore:', e.message));
