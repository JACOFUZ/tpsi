/**
 * JACOPO FUSÉ — script.js
 * Versione aggiornata per GitHub Pages
 */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function sanitize(str) {
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.textContent;
}

/* ── LOADER ── */
(function initLoader() {
  const loader = $('#loader'), bar = $('#loader-bar');
  
  function forceKill() {
    if(loader) {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => loader.remove(), 800);
    }
    document.body.style.overflow = '';
  }

  function dismiss() {
    try { 
      if (loader) loader.classList.add('gone'); 
      document.body.style.overflow = ''; 
      if (typeof triggerInitialReveals === 'function') triggerInitialReveals(); 
      setTimeout(forceKill, 1000);
    } catch(e) { forceKill(); }
  }

  if (!loader || !bar) { dismiss(); return; }
  
  let p = 0, done = false;
  document.body.style.overflow = 'hidden';
  function safeDismiss() { if (done) return; done = true; dismiss(); }
  
  const iv = setInterval(() => {
    p += Math.random() * 18 + 5;
    if (p >= 100) { clearInterval(iv); bar.style.width = '100%'; setTimeout(safeDismiss, 350); }
    else { bar.style.width = p + '%'; }
  }, 80);
  
  window.addEventListener('load', () => setTimeout(safeDismiss, 300));
  setTimeout(safeDismiss, 3000); // Backup 3 secondi
})();

/* ── CURSOR ── */
(function initCursor() {
  const dot = $('#cursor'), ring = $('#cursor-ring');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  function loop() {
    rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── NAV & HEADER ── */
(function initNav() {
  const btn = $('#hamburger'), overlay = $('#nav-overlay'), header = $('#site-header');
  if (!btn || !overlay) return;
  
  btn.onclick = () => {
    const isOpen = btn.classList.toggle('open');
    overlay.hidden = !isOpen;
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  $$('.nav-link').forEach(link => {
    link.onclick = () => {
      btn.classList.remove('open');
      overlay.hidden = true;
      document.body.style.overflow = '';
    };
  });

  window.onscroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
})();

/* ── THEME ── */
(function initTheme() {
  const btn = $('#theme-toggle');
  if (!btn) return;
  btn.onclick = () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('jf-theme', isLight ? 'light' : 'dark');
  };
  if (localStorage.getItem('jf-theme') === 'light') document.body.classList.add('light');
})();

/* ── REVEAL ANIMATIONS ── */
function triggerInitialReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.1 });

  $$('.js-reveal-fade, .js-reveal-clip, .js-reveal-left, .js-reveal-right').forEach(el => observer.observe(el));
}

/* ── COLLAGE FILTER ── */
(function initFilter() {
  const btns = $$('.f-btn'), items = $$('.collage-item');
  btns.forEach(btn => {
    btn.onclick = () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.style.display = match ? 'block' : 'none';
      });
    };
  });
})();

/* ── FORM ── */
const form = $('#contact-form');
if (form) {
  form.onsubmit = (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.innerText = 'Invio...';
    setTimeout(() => {
      form.reset();
      $('#form-ok').hidden = false;
      btn.disabled = false;
      btn.innerText = 'Invia richiesta';
      setTimeout(() => $('#form-ok').hidden = true, 5000);
    }, 1500);
  };
}

// Aggiorna l'anno nel footer
const yearSpan = $('.year-span');
if(yearSpan) yearSpan.innerText = new Date().getFullYear();
