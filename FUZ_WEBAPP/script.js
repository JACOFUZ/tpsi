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
  const loader = $('#loader'), bar = $('#loader-bar');
  if (!loader || !bar) return;
  let p = 0;
  document.body.style.overflow = 'hidden';
  const iv = setInterval(() => {
    p += Math.random() * 18 + 5;
    if (p >= 100) {
      p = 100; clearInterval(iv); bar.style.width = '100%';
      setTimeout(() => { loader.classList.add('gone'); document.body.style.overflow = ''; triggerInitialReveals(); }, 500);
    } else { bar.style.width = p + '%'; }
  }, 80);
})();

/* ── CURSOR ── */
(function initCursor() {
  const dot = $('#cursor'), ring = $('#cursor-ring');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;
  let mx=-100,my=-100,rx=-100,ry=-100;
  document.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    dot.style.transform=`translate(calc(${mx}px - 50%),calc(${my}px - 50%))`;
  });
  (function loop() { rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.transform=`translate(calc(${rx}px - 50%),calc(${ry}px - 50%))`; requestAnimationFrame(loop); })();
  const hov = 'a,button,.carousel-slide,.poster-card,.gear-group,.review-card,input,textarea,select,.reveal-wrap';
  document.addEventListener('mouseover', e=>{ if(e.target.closest(hov)) ring.classList.add('hovered'); });
  document.addEventListener('mouseout',  e=>{ if(e.target.closest(hov)) ring.classList.remove('hovered'); });
  document.addEventListener('mouseleave',()=>{ dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter',()=>{ dot.style.opacity='1'; ring.style.opacity='1'; });
})();

/* ── HEADER SCROLL ── */
(function() {
  const h = $('#site-header'); if (!h) return;
  window.addEventListener('scroll', () => h.classList.toggle('scrolled', window.scrollY > 60), {passive:true});
})();

/* ── HAMBURGER ── */
(function initNav() {
  const btn = $('#hamburger'), overlay = $('#nav-overlay');
  if (!btn || !overlay) return;
  const open  = () => { btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); overlay.removeAttribute('hidden'); document.body.style.overflow='hidden'; setTimeout(()=>{ const f=overlay.querySelector('a'); if(f)f.focus(); },100); };
  const close = () => { btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); overlay.setAttribute('hidden',''); document.body.style.overflow=''; btn.focus(); };
  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  $$('.nav-link', overlay).forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key==='Escape' && btn.classList.contains('open')) close(); });
  overlay.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const els = $$('a,button', overlay); if (!els.length) return;
    if (e.shiftKey && document.activeElement===els[0]) { e.preventDefault(); els[els.length-1].focus(); }
    else if (!e.shiftKey && document.activeElement===els[els.length-1]) { e.preventDefault(); els[0].focus(); }
  });
})();

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = $$('.js-reveal-fade,.js-reveal-clip,.js-reveal-left,.js-reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, {threshold:0.1, rootMargin:'0px 0px -40px 0px'});
  $$('.pricing-grid .js-reveal-fade,.gear-grid .js-reveal-fade').forEach((el,i) => { el.style.transitionDelay=`${i*.12}s`; });
  $$('.tl-item.js-reveal-fade').forEach((el,i) => { el.style.transitionDelay=`${i*.1}s`; });
  $$('.poster-card.js-reveal-fade').forEach((el,i) => { el.style.transitionDelay=`${i*.1}s`; });
  els.forEach(el => obs.observe(el));
}
function triggerInitialReveals() {
  initReveal();
  $$('.s-hero .js-reveal-fade,.s-hero .js-reveal-clip').forEach((el,i) => { setTimeout(()=>el.classList.add('in'), i*150+100); });
}

/* ── FILTRI CAROSELLI ── */
(function initFilters() {
  const btns   = $$('.f-btn');
  const blocks = $$('.carousel-block');
  if (!btns.length || !blocks.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btns.forEach(b => { b.classList.toggle('active', b===btn); b.setAttribute('aria-pressed', String(b===btn)); });
      blocks.forEach((block, i) => {
        const visible = filter==='all' || block.dataset.cat===filter;
        if (visible) {
          block.classList.remove('hidden');
          block.style.opacity='0'; block.style.transform='translateY(14px)';
          setTimeout(() => { block.style.transition='opacity .45s var(--easing),transform .45s var(--easing)'; block.style.opacity='1'; block.style.transform='none'; }, i*50);
        } else {
          block.style.transition='opacity .25s ease'; block.style.opacity='0';
          setTimeout(() => block.classList.add('hidden'), 260);
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
    function visibleCount() { return block.offsetWidth < 400 ? 1 : 2; }
    slides.forEach((_, i) => {
      if (!dotsWrap) return;
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i===0 ? ' active' : '');
      dot.setAttribute('aria-label', `Foto ${i+1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    function getDots() { return dotsWrap ? $$('.carousel-dot', dotsWrap) : []; }
    function goTo(index) {
      const total = slides.length, visible = visibleCount(), max = Math.max(0, total-visible);
      current = Math.max(0, Math.min(index, max));
      track.style.transform = `translateX(-${current * (slides[0].offsetWidth + 10)}px)`;
      getDots().forEach((d,i) => d.classList.toggle('active', i===current));
      if (counter) counter.textContent = `${current+1}/${total}`;
      if (prevBtn) prevBtn.disabled = current===0;
      if (nextBtn) nextBtn.disabled = current>=max;
    }
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current-1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current+1));
    let tx = 0;
    track.addEventListener('touchstart', e => { tx=e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend',   e => { const d=tx-e.changedTouches[0].clientX; if(Math.abs(d)>40) goTo(d>0?current+1:current-1); });
    block.addEventListener('keydown', e => { if(e.key==='ArrowLeft') goTo(current-1); if(e.key==='ArrowRight') goTo(current+1); });
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt=setTimeout(()=>goTo(current),150); }, {passive:true});
    goTo(0);
  });
})();

/* ── BLOB REVEAL EFFECT ── */
(function initRevealEffect() {
  const wrap      = document.getElementById('reveal-wrap');
  const canvas    = document.getElementById('reveal-canvas');
  const hiddenImg = document.getElementById('reveal-hidden-img');
  const hint      = document.getElementById('reveal-hint');
  const cursorEl  = document.getElementById('reveal-cursor-el');
  if (!wrap || !canvas || !hiddenImg) return;

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  function resize() { W = canvas.width = wrap.offsetWidth; H = canvas.height = wrap.offsetHeight; }
  resize();
  new ResizeObserver(resize).observe(wrap);

  let mx=0, my=0, tx=0, ty=0, radius=0, targetR=0, time=0;

  /* 14 punti con oscillazioni multiple → forma macchia d'olio */
  const N = 14;
  const pts = Array.from({ length: N }, () => ({
    s1: 0.35 + Math.random() * 1.0,
    s2: 0.18 + Math.random() * 0.7,
    s3: 0.12 + Math.random() * 0.45,
    p1: Math.random() * Math.PI * 2,
    p2: Math.random() * Math.PI * 2,
    p3: Math.random() * Math.PI * 2,
    a1: 0.18 + Math.random() * 0.16,
    a2: 0.09 + Math.random() * 0.09,
    a3: 0.05 + Math.random() * 0.06,
  }));

  function blobPoint(i, cx, cy, r, t) {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    const p = pts[i];
    const noise = 1
      + p.a1 * Math.sin(t * p.s1 + p.p1)
      + p.a2 * Math.cos(t * p.s2 + p.p2)
      + p.a3 * Math.sin(t * p.s3 + p.p3);
    return { x: cx + r * noise * Math.cos(angle), y: cy + r * noise * Math.sin(angle) };
  }

  /* Catmull-Rom → Bezier per bordi morbidi organici */
  function drawBlob(cx, cy, r, t) {
    const bp = Array.from({ length: N }, (_, i) => blobPoint(i, cx, cy, r, t));
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const p0 = bp[(i-1+N)%N], p1 = bp[i], p2 = bp[(i+1)%N], p3 = bp[(i+2)%N];
      if (i===0) ctx.moveTo(p1.x, p1.y);
      const cp1x = p1.x + (p2.x - p0.x) / 6, cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6, cp2y = p2.y - (p3.y - p1.y) / 6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.closePath();
  }

  function drawCover(img) {
    const iW = img.naturalWidth || W, iH = img.naturalHeight || H;
    const scale = Math.max(W/iW, H/iH);
    const dw = iW*scale, dh = iH*scale;
    ctx.drawImage(img, (W-dw)/2, (H-dh)/2, dw, dh);
  }

  /* Glow esterno alla macchia per effetto olio iridescente */
  function drawGlow(cx, cy, r, t) {
    ctx.save();
    drawBlob(cx, cy, r * 1.06, t);
    const grad = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 1.1);
    grad.addColorStop(0, 'rgba(74,143,255,0.0)');
    grad.addColorStop(0.6, 'rgba(74,143,255,0.08)');
    grad.addColorStop(1, 'rgba(74,143,255,0.0)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  (function frame() {
    requestAnimationFrame(frame);
    time += 0.016;
    mx += (tx - mx) * 0.10;
    my += (ty - my) * 0.10;
    radius += (targetR - radius) * 0.06;
    ctx.clearRect(0, 0, W, H);
    if (radius < 1) return;

    /* Glow esterno */
    drawGlow(mx, my, radius, time);

    /* Clip → disegna immagine casco dentro il blob */
    ctx.save();
    drawBlob(mx, my, radius, time);
    ctx.clip();
    if (hiddenImg.complete && hiddenImg.naturalWidth > 0) drawCover(hiddenImg);
    ctx.restore();

    /* Bordo blob */
    ctx.save();
    drawBlob(mx, my, radius, time);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth   = 2;
    ctx.stroke();
    ctx.restore();
  })();

  wrap.addEventListener('mouseenter', e => {
    targetR = Math.min(W, H) * 0.42;
    wrap.classList.add('active');
    if (hint) hint.classList.add('hidden');
    const rect = wrap.getBoundingClientRect();
    tx = mx = e.clientX - rect.left;
    ty = my = e.clientY - rect.top;
  });

  wrap.addEventListener('mouseleave', () => {
    targetR = 0;
    wrap.classList.remove('active');
    if (hint) hint.classList.remove('hidden');
    if (cursorEl) cursorEl.style.opacity = '0';
  });

  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    tx = e.clientX - rect.left;
    ty = e.clientY - rect.top;
    if (cursorEl) {
      cursorEl.style.left    = tx + 'px';
      cursorEl.style.top     = ty + 'px';
      cursorEl.style.opacity = '1';
    }
  });

  /* Touch */
  wrap.addEventListener('touchmove', e => {
    e.preventDefault();
    const rect = wrap.getBoundingClientRect();
    const t = e.touches[0];
    tx = t.clientX - rect.left;
    ty = t.clientY - rect.top;
    if (!wrap.classList.contains('active')) {
      targetR = Math.min(W, H) * 0.42;
      mx = tx; my = ty;
      wrap.classList.add('active');
      if (hint) hint.classList.add('hidden');
    }
  }, { passive: false });

  wrap.addEventListener('touchend', () => {
    targetR = 0;
    wrap.classList.remove('active');
    if (hint) hint.classList.remove('hidden');
  });
})();

/* ── RECENSIONI ── */
(function initReviews() {
  const list  = document.getElementById('reviews-list');
  const empty = document.getElementById('reviews-empty');
  if (!list) return;
  const STORAGE_KEY = 'jf-reviews';
  function buildCard(r) {
    const card = document.createElement('article');
    card.className = 'review-card';
    card.setAttribute('role', 'listitem');
    const stars = '★'.repeat(r.stars) + '☆'.repeat(5-r.stars);
    card.innerHTML = `
      <div class="review-card-top">
        <div><p class="review-author">${sanitize(r.name)}</p>${r.role?`<p class="review-role">${sanitize(r.role)}</p>`:''}</div>
        <span class="review-stars" aria-label="${r.stars} stelle">${stars}</span>
      </div>
      <p class="review-text">${sanitize(r.text)}</p>
      <p class="review-date">${sanitize(r.date)}</p>
    `;
    return card;
  }
  function loadReviews() {
    let reviews = [];
    try { reviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e) {}
    list.innerHTML = '';
    if (reviews.length === 0) { if (empty) empty.hidden = false; }
    else { if (empty) empty.hidden = true; reviews.slice().reverse().forEach(r => list.appendChild(buildCard(r))); }
  }
  loadReviews();
})();

/* ── FORM CONTATTI ── */
(function initForm() {
  const form = $('#contact-form'); if (!form) return;
  const fields = {
    name:   {el:$('#f-name'), err:$('#err-name'), validate:v=>v.trim().length>=2?'':'Inserisci il tuo nome.'},
    email:  {el:$('#f-email'),err:$('#err-email'),validate:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())?'':"Inserisci un'email valida."},
    type:   {el:$('#f-type'), err:$('#err-type'), validate:v=>v!==''?'':'Seleziona un tipo di richiesta.'},
    message:{el:$('#f-msg'),  err:$('#err-msg'),  validate:v=>v.trim().length>=10?'':'Almeno 10 caratteri.'},
  };
  const vf = key => { const{el,err,validate}=fields[key]; if(!el||!err) return true; const msg=validate(el.value); err.textContent=sanitize(msg); el.classList.toggle('invalid',msg!==''); return msg===''; };
  Object.keys(fields).forEach(k => { const{el}=fields[k]; if(!el) return; el.addEventListener('blur',()=>vf(k)); el.addEventListener('input',()=>{ if(el.classList.contains('invalid'))vf(k); }); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true; Object.keys(fields).forEach(k=>{ if(!vf(k))valid=false; });
    if (!valid) { const f=Object.values(fields).find(f=>f.el?.classList.contains('invalid')); if(f)f.el.focus(); return; }
    const btn = form.querySelector('.btn-send');
    if (btn) { btn.disabled=true; btn.querySelector('span').textContent='Invio in corso…'; }
    setTimeout(() => {
      form.reset(); Object.values(fields).forEach(({el})=>el?.classList.remove('invalid'));
      const ok = $('#form-ok'); if(ok) ok.removeAttribute('hidden');
      if(btn){ btn.disabled=false; btn.querySelector('span').textContent='Invia messaggio'; }
      showToast('Messaggio inviato!');
      setTimeout(()=>{ if(ok) ok.setAttribute('hidden',''); },5000);
    },1200);
  });
})();

/* ── TOAST ── */
function showToast(msg, dur=3000) {
  const t = $('#toast'); if (!t) return;
  t.textContent = sanitize(msg); t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

/* ── SMOOTH SCROLL ── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return; e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - ($('#site-header')?.offsetHeight ?? 0);
    window.scrollTo({top, behavior:'smooth'});
  });
});

/* ── PARALLAX ── */
(function() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const bg = $('.hero-bg'); if (!bg) return;
  let t = false;
  window.addEventListener('scroll', () => { if(!t){ requestAnimationFrame(()=>{ bg.style.transform=`t
