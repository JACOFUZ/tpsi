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
      setTimeout(() => {
        loader.classList.add('gone');
        document.body.style.overflow = '';
        triggerInitialReveals();
      }, 500);
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
  (function loop() {
    rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
    ring.style.transform=`translate(calc(${rx}px - 50%),calc(${ry}px - 50%))`;
    requestAnimationFrame(loop);
  })();
  const hov='a,button,.carousel-slide,.poster-card,.gear-group,.review-card,input,textarea,select';
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
  $$('.s-hero .js-reveal-fade,.s-hero .js-reveal-clip').forEach((el,i) => {
    setTimeout(()=>el.classList.add('in'), i*150+100);
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

/* ══════════════════════════════════════════════════════════════
   HERO — OIL BUBBLE REVEAL
   Blob principale + bolle satellite che si staccano e vagano
   Riflessi iridescenti + forma casuale ad ogni ingresso
   ══════════════════════════════════════════════════════════════ */
(function initHeroBlobReveal() {
  const hero      = document.getElementById('hero');
  const canvas    = document.getElementById('hero-canvas');
  const imgReveal = document.getElementById('hero-img-reveal');
  if (!hero || !canvas || !imgReveal) return;

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(hero);

  /* ─── Stato principale ─── */
  let mx = 0, my = 0;
  let tx = -9999, ty = -9999;
  let radius = 0, targetR = 0;
  let time = 0;
  let heroActive = false;
  let lastTx = 0, lastTy = 0;
  let spawnTick = 0;

  /* ─── Forma blob principale: 18 punti
         Randomizzata ad ogni mouseenter → mai uguale ─── */
  const N_MAIN = 18;
  let mainPts = [];

  function randomMainPts() {
    mainPts = Array.from({ length: N_MAIN }, () => ({
      s1: 0.28 + Math.random() * 1.3,
      s2: 0.14 + Math.random() * 0.85,
      s3: 0.07 + Math.random() * 0.55,
      s4: 0.35 + Math.random() * 1.1,
      p1: Math.random() * Math.PI * 2,
      p2: Math.random() * Math.PI * 2,
      p3: Math.random() * Math.PI * 2,
      p4: Math.random() * Math.PI * 2,
      a1: 0.16 + Math.random() * 0.22,
      a2: 0.08 + Math.random() * 0.12,
      a3: 0.04 + Math.random() * 0.07,
      a4: 0.025 + Math.random() * 0.055,
    }));
  }
  randomMainPts();

  /* ─── Costruisce path Catmull-Rom da array di punti ─── */
  function buildPath(bpArr) {
    const n = bpArr.length;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p0 = bpArr[(i-1+n)%n];
      const p1 = bpArr[i];
      const p2 = bpArr[(i+1)%n];
      const p3 = bpArr[(i+2)%n];
      if (i === 0) ctx.moveTo(p1.x, p1.y);
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.closePath();
  }

  /* Calcola punti blob principale */
  function mainBlobPoints(cx, cy, r, t) {
    return mainPts.map((p, i) => {
      const angle = (i / N_MAIN) * Math.PI * 2 - Math.PI / 2;
      const noise = 1
        + p.a1 * Math.sin(t * p.s1 + p.p1)
        + p.a2 * Math.cos(t * p.s2 + p.p2)
        + p.a3 * Math.sin(t * p.s3 + p.p3)
        + p.a4 * Math.cos(t * p.s4 + p.p4);
      return { x: cx + r * noise * Math.cos(angle), y: cy + r * noise * Math.sin(angle) };
    });
  }

  /* ─── Cover-fit immagine sul canvas ─── */
  function drawCover(img, alpha) {
    const iW = img.naturalWidth  || W;
    const iH = img.naturalHeight || H;
    const scale = Math.max(W / iW, H / iH);
    const dw = iW * scale, dh = iH * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    ctx.globalAlpha = 1;
  }

  /* ─── Riflessi iridescenti sull'olio ─── */
  function drawIridescence(cx, cy, r, t, alpha) {
    ctx.save();
    buildPath(mainBlobPoints(cx, cy, r, t));
    ctx.clip();

    /* Striscia di colore che ruota nel tempo */
    const hue = (t * 18) % 360;
    const sheen = ctx.createLinearGradient(
      cx + Math.cos(t * 0.4) * r, cy + Math.sin(t * 0.4) * r,
      cx - Math.cos(t * 0.4) * r, cy - Math.sin(t * 0.4) * r
    );
    sheen.addColorStop(0,    `hsla(${hue},        100%, 70%, 0)`);
    sheen.addColorStop(0.25, `hsla(${hue + 45},   100%, 75%, ${alpha * 0.13})`);
    sheen.addColorStop(0.5,  `hsla(${hue + 120},  100%, 70%, ${alpha * 0.09})`);
    sheen.addColorStop(0.75, `hsla(${hue + 200},  100%, 75%, ${alpha * 0.13})`);
    sheen.addColorStop(1,    `hsla(${hue + 270},  100%, 70%, 0)`);
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, W, H);

    ctx.restore();
  }

  /* Highlight speculare (punto luce bianco in alto-sinistra) */
  function drawSpecular(cx, cy, r, alpha) {
    const hx = cx - r * 0.28;
    const hy = cy - r * 0.32;
    const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.22);
    g.addColorStop(0,   `rgba(255,255,255,${alpha * 0.5})`);
    g.addColorStop(0.4, `rgba(255,255,255,${alpha * 0.12})`);
    g.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(hx, hy, r * 0.22, r * 0.13, -Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ─── Sistema bolle satellite ───
     Ogni bolla è una piccola macchia d'olio indipendente
     che si stacca dalla chiazza principale e vaga           */
  const bubbles = [];
  const MAX_BUBBLES = 28;

  function makeBubblePts(n) {
    return Array.from({ length: n }, () => ({
      s1: 0.5  + Math.random() * 2.2,
      s2: 0.25 + Math.random() * 1.0,
      p1: Math.random() * Math.PI * 2,
      p2: Math.random() * Math.PI * 2,
      a1: 0.14 + Math.random() * 0.28,
      a2: 0.07 + Math.random() * 0.13,
    }));
  }

  function spawnBubble(x, y, vx, vy, fromSplash) {
    if (bubbles.length >= MAX_BUBBLES) return;
    const r = fromSplash
      ? 8  + Math.random() * 28
      : 14 + Math.random() * 38;
    const life = 1.2 + Math.random() * 2.0;
    const n = 5 + Math.floor(Math.random() * 6);
    bubbles.push({
      x, y,
      vx: vx + (Math.random() - 0.5) * (fromSplash ? 5 : 1.5),
      vy: vy + (Math.random() - 0.5) * (fromSplash ? 5 : 1.5),
      r,
      drawR: 0,
      life,
      maxLife: life,
      pts: makeBubblePts(n),
      hue: Math.random() * 360,
      t: Math.random() * 20,
      fromSplash,
    });
  }

  function bubblePoints(b) {
    const n = b.pts.length;
    return b.pts.map((p, i) => {
      const angle = (i / n) * Math.PI * 2;
      const noise = 1
        + p.a1 * Math.sin(b.t * p.s1 + p.p1)
        + p.a2 * Math.cos(b.t * p.s2 + p.p2);
      return {
        x: b.x + b.drawR * noise * Math.cos(angle),
        y: b.y + b.drawR * noise * Math.sin(angle),
      };
    });
  }

  function updateBubbles() {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.life -= 0.016;
      if (b.life <= 0) { bubbles.splice(i, 1); continue; }

      b.x  += b.vx;
      b.y  += b.vy;
      b.vx *= 0.96;
      b.vy *= 0.96;
      b.vy -= 0.025; /* olio sale — flottazione */

      /* Raggio: cresce veloce, poi si sgonfia verso la fine */
      const lr = b.life / b.maxLife;
      const targetDR = lr > 0.6 ? b.r : b.r * (lr / 0.6);
      b.drawR += (targetDR - b.drawR) * 0.18;
      b.t += 0.022;
    }
  }

  function drawBubbles() {
    bubbles.forEach(b => {
      if (b.drawR < 1 || !imgReveal.complete) return;
      const lr = b.life / b.maxLife;
      const alpha = Math.min(1, lr * 1.8) * 0.9;
      const bp = bubblePoints(b);

      /* Rivela immagine dentro la bolla */
      ctx.save();
      buildPath(bp);
      ctx.clip();
      drawCover(imgReveal, alpha * 0.88);
      ctx.restore();

      /* Iridescenza bolla */
      ctx.save();
      buildPath(bp);
      ctx.clip();
      const hue = (b.hue + time * 22) % 360;
      const sg = ctx.createLinearGradient(b.x - b.drawR, b.y - b.drawR, b.x + b.drawR, b.y + b.drawR);
      sg.addColorStop(0,   `hsla(${hue},       100%, 75%, 0)`);
      sg.addColorStop(0.4, `hsla(${hue + 60},  100%, 75%, ${alpha * 0.18})`);
      sg.addColorStop(0.7, `hsla(${hue + 150}, 100%, 75%, ${alpha * 0.12})`);
      sg.addColorStop(1,   `hsla(${hue + 240}, 100%, 75%, 0)`);
      ctx.fillStyle = sg;
      ctx.fillRect(b.x - b.drawR - 2, b.y - b.drawR - 2, b.drawR * 2 + 4, b.drawR * 2 + 4);
      ctx.restore();

      /* Bordo bolla */
      ctx.save();
      buildPath(bp);
      const hue2 = (b.hue + time * 30 + 90) % 360;
      ctx.strokeStyle = `hsla(${hue2}, 90%, 80%, ${alpha * 0.55})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      /* Specular highlight piccola */
      ctx.save();
      const hsx = b.x - b.drawR * 0.25;
      const hsy = b.y - b.drawR * 0.28;
      const hsg = ctx.createRadialGradient(hsx, hsy, 0, hsx, hsy, b.drawR * 0.28);
      hsg.addColorStop(0, `rgba(255,255,255,${alpha * 0.5})`);
      hsg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hsg;
      ctx.beginPath();
      ctx.ellipse(hsx, hsy, b.drawR * 0.22, b.drawR * 0.13, -Math.PI/5, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
  }

  /* ─── Loop principale ─── */
  (function frame() {
    requestAnimationFrame(frame);
    time += 0.014;
    spawnTick++;

    /* Lerp inerziale */
    mx += (tx - mx) * 0.09;
    my += (ty - my) * 0.09;
    radius += (targetR - radius) * 0.055;

    updateBubbles();
    ctx.clearRect(0, 0, W, H);

    /* 1. Bolle satellite (sotto il blob principale) */
    drawBubbles();

    if (radius > 1 && imgReveal.complete && imgReveal.naturalWidth > 0) {
      const mainBP = mainBlobPoints(mx, my, radius, time);

      /* 2. Alone / glow esterno */
      ctx.save();
      buildPath(mainBlobPoints(mx, my, radius * 1.1, time));
      const glow = ctx.createRadialGradient(mx, my, radius * 0.6, mx, my, radius * 1.12);
      glow.addColorStop(0,   'rgba(74,143,255,0)');
      glow.addColorStop(0.55,'rgba(74,143,255,0.07)');
      glow.addColorStop(1,   'rgba(74,143,255,0)');
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.restore();

      /* 3. Clip + immagine rivelata */
      ctx.save();
      buildPath(mainBP);
      ctx.clip();
      drawCover(imgReveal, 1);
      ctx.restore();

      /* 4. Iridescenza olio */
      drawIridescence(mx, my, radius, time, 1);

      /* 5. Specular highlight */
      drawSpecular(mx, my, radius, 1);

      /* 6. Bordo bolla principale */
      ctx.save();
      buildPath(mainBP);
      const hue = (time * 18) % 360;
      ctx.strokeStyle = `hsla(${hue}, 80%, 78%, 0.18)`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();
    }
  })();

  /* ─── Gestione mouse ─── */
  hero.addEventListener('mouseenter', e => {
    /* Nuova forma casuale ad ogni ingresso */
    randomMainPts();
    heroActive = true;
    targetR = Math.min(W, H) * 0.18; /* più piccolo */
    const rect = hero.getBoundingClientRect();
    tx = mx = e.clientX - rect.left;
    ty = my = e.clientY - rect.top;
    lastTx = tx; lastTy = ty;
  });

  hero.addEventListener('mouseleave', () => {
    heroActive = false;
    targetR = 0;
    /* Quando il mouse esce, le bolle esistenti continuano a galleggiare */
  });

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;

    const dvx = nx - lastTx;
    const dvy = ny - lastTy;
    const speed = Math.sqrt(dvx * dvx + dvy * dvy);

    lastTx = tx; lastTy = ty;
    tx = nx; ty = ny;

    /* Splash: bolle che schizzano via quando il cursore va veloce */
    if (speed > 10 && spawnTick % 2 === 0) {
      const count = Math.floor(Math.min(speed / 12, 4));
      for (let i = 0; i < count; i++) {
        spawnBubble(
          mx + (Math.random() - 0.5) * radius * 1.0,
          my + (Math.random() - 0.5) * radius * 1.0,
          dvx * (0.25 + Math.random() * 0.35),
          dvy * (0.25 + Math.random() * 0.35),
          true
        );
      }
    }

    /* Bolle spontanee che si staccano dal bordo e vagano */
    if (heroActive && spawnTick % 40 === 0) {
      const angle = Math.random() * Math.PI * 2;
      spawnBubble(
        mx + Math.cos(angle) * radius * (0.7 + Math.random() * 0.4),
        my + Math.sin(angle) * radius * (0.7 + Math.random() * 0.4),
        (Math.random() - 0.5) * 1.2,
        -(Math.random() * 1.5 + 0.3), /* salgono verso l'alto */
        false
      );
    }
  });

  /* ─── Touch ─── */
  hero.addEventListener('touchmove', e => {
    const rect  = hero.getBoundingClientRect();
    const touch = e.touches[0];
    const nx = touch.clientX - rect.left;
    const ny = touch.clientY - rect.top;
    tx = nx; ty = ny;
    if (!heroActive) {
      randomMainPts();
      heroActive = true;
      targetR = Math.min(W, H) * 0.18;
      mx = tx; my = ty;
    }
  }, { passive: true });

  hero.addEventListener('touchend', () => {
    heroActive = false;
    targetR = 0;
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
  const vf = key => {
    const{el,err,validate}=fields[key]; if(!el||!err) return true;
    const msg=validate(el.value); err.textContent=sanitize(msg);
    el.classList.toggle('invalid',msg!==''); return msg==='';
  };
  Object.keys(fields).forEach(k => {
    const{el}=fields[k]; if(!el) return;
    el.addEventListener('blur',()=>vf(k));
    el.addEventListener('input',()=>{ if(el.classList.contains('invalid'))vf(k); });
  });
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

/* ── THEME TOGGLE ── */
(function initTheme() {
  const btn = $('#theme-toggle'), body = document.body; if (!btn) return;
  if (localStorage.getItem('jf-theme')==='light') body.classList.add('light');
  btn.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem('jf-theme', body.classList.contains('light')?'light':'dark');
  });
})();

window.addEventListener('error', e => console.warn('[JF]', e.message));
