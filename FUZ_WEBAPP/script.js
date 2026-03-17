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
    let tx2 = 0;
    track.addEventListener('touchstart', e => { tx2=e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend',   e => { const d=tx2-e.changedTouches[0].clientX; if(Math.abs(d)>40) goTo(d>0?current+1:current-1); });
    block.addEventListener('keydown', e => { if(e.key==='ArrowLeft') goTo(current-1); if(e.key==='ArrowRight') goTo(current+1); });
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt=setTimeout(()=>goTo(current),150); }, {passive:true});
    goTo(0);
  });
})();

/* ══════════════════════════════════════════════════════════════
   HERO OIL EFFECT
   ══════════════════════════════════════════════════════════════
   Tre layer sovrapposti:
   1. STRIPES  — strisce morbide, organiche, casuali, che compaiono e svaniscono
   2. BUBBLES  — bolle circolari iridescenti che flottano
   3. PARTICLES — micro-gocce che schizzano dal cursore
   Tutto rivela hero-bg-2.jpg tramite canvas clip.
   ══════════════════════════════════════════════════════════════ */
(function initHeroOil() {
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

  /* Disegna immagine con cover-fit */
  function coverImg(img, alpha) {
    if (!img.complete || !img.naturalWidth) return;
    const iW = img.naturalWidth, iH = img.naturalHeight;
    const s  = Math.max(W / iW, H / iH);
    const dw = iW * s, dh = iH * s;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    ctx.globalAlpha = 1;
  }

  /* Gradiente iridescente su un path già clippato */
  function iridescentFill(cx, cy, r, hueBase, alpha, elongW, elongH, angle) {
    ctx.save();
    ctx.rotate(angle);
    const g = ctx.createLinearGradient(-elongW, -elongH, elongW, elongH);
    const h = hueBase % 360;
    g.addColorStop(0,    `hsla(${h},        100%, 70%, 0)`);
    g.addColorStop(0.2,  `hsla(${(h+45)%360}, 100%, 78%, ${alpha * 0.22})`);
    g.addColorStop(0.45, `hsla(${(h+120)%360},100%, 72%, ${alpha * 0.16})`);
    g.addColorStop(0.7,  `hsla(${(h+200)%360},100%, 78%, ${alpha * 0.20})`);
    g.addColorStop(1,    `hsla(${(h+280)%360},100%, 70%, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(-elongW - 4, -elongH - 4, elongW * 2 + 8, elongH * 2 + 8);
    ctx.restore();
  }

  /* Specular highlight ellittico */
  function specular(cx, cy, rw, rh, alpha) {
    const hx = cx - rw * 0.22;
    const hy = cy - rh * 0.30;
    const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, Math.max(rw, rh) * 0.32);
    g.addColorStop(0,   `rgba(255,255,255,${alpha * 0.65})`);
    g.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.15})`);
    g.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(hx, hy, rw * 0.26, rh * 0.14, -Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ── Catmull-Rom spline da array di punti ── */
  function catmullPath(pts) {
    const n = pts.length;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i-1+n)%n], p1 = pts[i];
      const p2 = pts[(i+1)%n],   p3 = pts[(i+2)%n];
      if (i === 0) ctx.moveTo(p1.x, p1.y);
      const cp1x = p1.x + (p2.x - p0.x) / 6, cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6, cp2y = p2.y - (p3.y - p1.y) / 6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.closePath();
  }

  /* ═══════════════════════════════════════
     STRIPES — strisce organiche che appaiono
     ═══════════════════════════════════════ */
  const stripes = [];
  const MAX_STRIPES = 12;

  function makeStripePts(cx, cy, len, thk, angle) {
    /* Stripe = ellisse deformata con noise sui bordi */
    const N = 20;
    return Array.from({ length: N }, (_, i) => {
      const t     = (i / N) * Math.PI * 2;
      const side  = Math.sin(t); // -1..1
      const along = Math.cos(t); // -1..1
      /* Deformazione casuale su ogni punto */
      const wobble = 1 + 0.18 * Math.sin(t * 3.1 + Math.random() * 6)
                       + 0.09 * Math.cos(t * 5.7 + Math.random() * 6);
      const rx = along * len * 0.5 * wobble;
      const ry = side  * thk * 0.5 * wobble;
      const rx2 = rx * Math.cos(angle) - ry * Math.sin(angle);
      const ry2 = rx * Math.sin(angle) + ry * Math.cos(angle);
      return { x: cx + rx2, y: cy + ry2 };
    });
  }

  function spawnStripe() {
    if (stripes.length >= MAX_STRIPES) return;
    const cx    = Math.random() * W;
    const cy    = Math.random() * H;
    const len   = 80 + Math.random() * 320;
    const thk   = 18 + Math.random() * 55;
    const angle = Math.random() * Math.PI;
    const life  = 3.5 + Math.random() * 4.0;
    const hue   = Math.random() * 360;
    const pts   = makeStripePts(cx, cy, len, thk, angle);
    stripes.push({ cx, cy, len, thk, angle, pts, life, maxLife: life, hue, alpha: 0 });
  }

  /* ═══════════════════════════════════════
     BUBBLES — bolle circolari che flottano
     ═══════════════════════════════════════ */
  const bubbles = [];
  const MAX_BUBBLES = 22;

  /* Punti di una bolla organica */
  function makeBubblePts(n) {
    return Array.from({ length: n }, () => ({
      s1: 0.6  + Math.random() * 2.0,
      s2: 0.3  + Math.random() * 1.0,
      p1: Math.random() * Math.PI * 2,
      p2: Math.random() * Math.PI * 2,
      a1: 0.10 + Math.random() * 0.22,
      a2: 0.05 + Math.random() * 0.10,
    }));
  }

  function bubblePts(b) {
    const n = b.bpts.length;
    return b.bpts.map((p, i) => {
      const angle = (i / n) * Math.PI * 2;
      const noise = 1
        + p.a1 * Math.sin(b.t * p.s1 + p.p1)
        + p.a2 * Math.cos(b.t * p.s2 + p.p2);
      return {
        x: b.x + b.r * noise * Math.cos(angle),
        y: b.y + b.r * noise * Math.sin(angle),
      };
    });
  }

  function spawnBubble(x, y, vx, vy, r) {
    if (bubbles.length >= MAX_BUBBLES) return;
    const life = 2.5 + Math.random() * 3.5;
    bubbles.push({
      x, y, vx, vy,
      r: r || (12 + Math.random() * 45),
      life, maxLife: life,
      bpts: makeBubblePts(7 + Math.floor(Math.random() * 5)),
      hue: Math.random() * 360,
      t: Math.random() * 20,
    });
  }

  /* ═══════════════════════════════════════
     PARTICLES — micro gocce
     ═══════════════════════════════════════ */
  const particles = [];
  const MAX_PARTICLES = 80;

  function spawnParticle(x, y, vx, vy) {
    if (particles.length >= MAX_PARTICLES) return;
    particles.push({
      x, y,
      vx: vx + (Math.random() - 0.5) * 2.5,
      vy: vy + (Math.random() - 0.5) * 2.5 - 0.5,
      r: 3 + Math.random() * 9,
      life: 1.2 + Math.random() * 1.8,
      maxLife: 0,
      hue: Math.random() * 360,
      t: Math.random() * 10,
    });
    particles[particles.length - 1].maxLife = particles[particles.length - 1].life;
  }

  /* ═══════════════════
     Tempo e mouse
     ═══════════════════ */
  let time = 0;
  let mousex = -9999, mousey = -9999;
  let lastMx = 0, lastMy = 0;
  let heroActive = false;
  let autoSpawnTick = 0;

  /* ═══════════════════
     Aggiornamento fisica
     ═══════════════════ */
  function updateStripes() {
    for (let i = stripes.length - 1; i >= 0; i--) {
      const s = stripes[i];
      s.life -= 0.016;
      if (s.life <= 0) { stripes.splice(i, 1); continue; }
      const lr = s.life / s.maxLife;
      /* Fade in primo 15%, plateau, fade out ultimo 25% */
      if (lr > 0.85)       s.alpha = Math.min(s.alpha + 0.025, 1);
      else if (lr < 0.25)  s.alpha = Math.max(s.alpha - 0.018, 0);
    }
  }

  function updateBubbles() {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.life -= 0.016;
      if (b.life <= 0) { bubbles.splice(i, 1); continue; }
      b.x  += b.vx;
      b.y  += b.vy;
      b.vx *= 0.98;
      b.vy  = b.vy * 0.98 - 0.06; /* flottazione */
      b.t  += 0.018;
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= 0.016;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      p.x  += p.vx;
      p.y  += p.vy;
      p.vx *= 0.95;
      p.vy  = p.vy * 0.95 - 0.04;
      p.t  += 0.03;
    }
  }

  /* ═══════════════════
     Disegno
     ═══════════════════ */
  function drawStripes() {
    stripes.forEach(s => {
      if (s.alpha < 0.01) return;

      /* Clip alla forma stripe */
      ctx.save();
      catmullPath(s.pts);
      ctx.clip();

      /* Immagine rivelata */
      coverImg(imgReveal, s.alpha * 0.92);

      /* Iridescenza */
      ctx.save();
      ctx.translate(s.cx, s.cy);
      iridescentFill(0, 0, 0, s.hue + time * 15, s.alpha, s.len * 0.5, s.thk * 0.5, s.angle);
      ctx.restore();

      ctx.restore();

      /* Bordo stripe */
      ctx.save();
      catmullPath(s.pts);
      const hb = (s.hue + time * 25 + 90) % 360;
      ctx.strokeStyle = `hsla(${hb}, 90%, 80%, ${s.alpha * 0.45})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      /* Specular */
      specular(s.cx, s.cy, s.len * 0.25, s.thk * 0.25, s.alpha * 0.7);
    });
  }

  function drawBubbles() {
    bubbles.forEach(b => {
      const lr = b.life / b.maxLife;
      const alpha = Math.min(lr * 2.5, 1) * 0.88;
      if (alpha < 0.01) return;

      const bp = bubblePts(b);

      ctx.save();
      catmullPath(bp);
      ctx.clip();

      /* Immagine rivelata */
      coverImg(imgReveal, alpha);

      /* Iridescenza */
      ctx.save();
      ctx.translate(b.x, b.y);
      iridescentFill(0, 0, b.r, b.hue + time * 20, alpha, b.r, b.r, 0);
      ctx.restore();

      ctx.restore();

      /* Bordo bolla — multicolore */
      ctx.save();
      catmullPath(bp);
      const hb = (b.hue + time * 35) % 360;
      ctx.strokeStyle = `hsla(${hb}, 95%, 82%, ${alpha * 0.6})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      /* Glow esterno */
      ctx.save();
      catmullPath(bubblePts({ ...b, r: b.r * 1.15 }));
      const gout = ctx.createRadialGradient(b.x, b.y, b.r * 0.5, b.x, b.y, b.r * 1.2);
      const hg = (b.hue + time * 20) % 360;
      gout.addColorStop(0,   'rgba(0,0,0,0)');
      gout.addColorStop(0.6, `hsla(${hg}, 80%, 70%, ${alpha * 0.08})`);
      gout.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = gout;
      ctx.fill();
      ctx.restore();

      /* Specular */
      specular(b.x, b.y, b.r, b.r, alpha * 0.85);
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      const lr = p.life / p.maxLife;
      const alpha = Math.min(lr * 3, 1) * 0.82;
      if (alpha < 0.01) return;

      /* Forma leggermente ovale con noise minimo */
      const wobble = 1 + 0.12 * Math.sin(p.t * 4.5);
      const pts = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return {
          x: p.x + p.r * wobble * Math.cos(a),
          y: p.y + p.r * (1 / wobble) * Math.sin(a),
        };
      });

      ctx.save();
      catmullPath(pts);
      ctx.clip();
      coverImg(imgReveal, alpha * 0.9);
      /* Iridescenza particella */
      ctx.save();
      ctx.translate(p.x, p.y);
      iridescentFill(0, 0, p.r, p.hue + time * 30, alpha * 0.8, p.r, p.r, 0);
      ctx.restore();
      ctx.restore();

      /* Bordo */
      ctx.save();
      catmullPath(pts);
      ctx.strokeStyle = `hsla(${(p.hue + 60) % 360}, 95%, 85%, ${alpha * 0.55})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      specular(p.x, p.y, p.r, p.r, alpha * 0.6);
    });
  }

  /* ═══════════════════
     AUTO-SPAWN
     ═══════════════════ */
  function autoSpawn() {
    autoSpawnTick++;

    /* Nuova stripe ogni ~4s */
    if (autoSpawnTick % 240 === 0) spawnStripe();

    /* Nuova bolla ogni ~1.5s */
    if (autoSpawnTick % 90 === 0) {
      const x = Math.random() * W;
      const y = H * 0.3 + Math.random() * H * 0.6;
      spawnBubble(x, y, (Math.random() - 0.5) * 0.8, -(0.3 + Math.random() * 0.6));
    }

    /* Particella autonoma ogni ~0.8s */
    if (autoSpawnTick % 48 === 0) {
      const x = Math.random() * W;
      const y = H * 0.2 + Math.random() * H * 0.7;
      spawnParticle(x, y, (Math.random() - 0.5) * 0.5, -(0.2 + Math.random() * 0.5));
    }
  }

  /* ═══════════════════
     LOOP PRINCIPALE
     ═══════════════════ */
  (function frame() {
    requestAnimationFrame(frame);
    time += 0.014;

    autoSpawn();
    updateStripes();
    updateBubbles();
    updateParticles();

    ctx.clearRect(0, 0, W, H);

    /* Ordine: stripes → bolle → particelle (le più piccole sopra) */
    drawStripes();
    drawBubbles();
    drawParticles();
  })();

  /* Spawn iniziale per non avere schermo vuoto */
  for (let i = 0; i < 4; i++) spawnStripe();
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * W;
    const y = H * 0.2 + Math.random() * H * 0.7;
    spawnBubble(x, y, (Math.random() - 0.5) * 0.5, -(0.2 + Math.random() * 0.4));
  }
  for (let i = 0; i < 18; i++) {
    spawnParticle(
      Math.random() * W,
      H * 0.1 + Math.random() * H * 0.85,
      (Math.random() - 0.5) * 1.0,
      -(Math.random() * 0.6)
    );
  }

  /* ═══════════════════
     INTERAZIONE MOUSE — spawn dal cursore
     ═══════════════════ */
  let spawnTick = 0;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;
    const dvx = nx - lastMx;
    const dvy = ny - lastMy;
    const speed = Math.sqrt(dvx * dvx + dvy * dvy);
    lastMx = nx; lastMy = ny;
    mousex = nx; mousey = ny;
    spawnTick++;

    /* Particelle sempre dal cursore */
    if (spawnTick % 3 === 0) {
      spawnParticle(
        nx + (Math.random() - 0.5) * 12,
        ny + (Math.random() - 0.5) * 12,
        dvx * 0.18,
        dvy * 0.18
      );
    }

    /* Bolle quando il cursore va veloce */
    if (speed > 8 && spawnTick % 8 === 0) {
      spawnBubble(
        nx + (Math.random() - 0.5) * 20,
        ny + (Math.random() - 0.5) * 20,
        dvx * 0.12,
        dvy * 0.12 - 0.4,
        10 + Math.random() * 25
      );
    }

    /* Stripe spontanea quando si percorre un lungo tratto */
    if (speed > 18 && spawnTick % 60 === 0) {
      spawnStripe();
    }
  });

  hero.addEventListener('mouseenter', () => { heroActive = true; });
  hero.addEventListener('mouseleave', () => { heroActive = false; });

  /* Touch */
  hero.addEventListener('touchmove', e => {
    const rect  = hero.getBoundingClientRect();
    const t     = e.touches[0];
    const nx    = t.clientX - rect.left;
    const ny    = t.clientY - rect.top;
    for (let i = 0; i < 3; i++) {
      spawnParticle(nx + (Math.random()-0.5)*20, ny + (Math.random()-0.5)*20, (Math.random()-0.5)*1.5, -Math.random()*0.8);
    }
  }, { passive: true });

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
