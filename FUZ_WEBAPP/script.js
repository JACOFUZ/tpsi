/**
 * JACOPO FUSÉ — script.js
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
function sanitize(str) { const d = document.createElement('div'); d.textContent = String(str); return d.textContent; }
try { $$('.year-span').forEach(el => { el.textContent = new Date().getFullYear(); }); } catch(e) {}

/* ── LOADER ── */
(function initLoader() {
  const loader = $('#loader'), bar = $('#loader-bar');
  function forceKill() {
    if(loader) { loader.style.opacity = '0'; loader.style.pointerEvents = 'none'; setTimeout(() => loader.remove(), 800); }
    document.body.style.overflow = '';
  }
  function dismiss() {
    try { if (loader) loader.classList.add('gone'); document.body.style.overflow = ''; triggerInitialReveals(); setTimeout(forceKill, 1000); }
    catch(e) { forceKill(); }
  }
  if (!loader || !bar) { dismiss(); return; }
  let p = 0, done = false;
  document.body.style.overflow = 'hidden';
  function safeDismiss() { if (done) return; done = true; dismiss(); }
  const iv = setInterval(() => {
    try { p += Math.random() * 18 + 5; if (p >= 100) { clearInterval(iv); bar.style.width = '100%'; setTimeout(safeDismiss, 350); } else { bar.style.width = p + '%'; } } 
    catch(e) { clearInterval(iv); safeDismiss(); }
  }, 80);
  window.addEventListener('load', () => setTimeout(safeDismiss, 300));
  setTimeout(safeDismiss, 3000);
})();

/* ── CURSOR ── */
try {
  (function initCursor() {
    const dot = $('#cursor'), ring = $('#cursor-ring');
    if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;
    let mx=-100,my=-100,rx=-100,ry=-100;
    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.transform=`translate(calc(${mx}px - 50%),calc(${my}px - 50%))`; });
    (function loop() { rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.transform=`translate(calc(${rx}px - 50%),calc(${ry}px - 50%))`; requestAnimationFrame(loop); })();
    const hov='a,button,.carousel-slide,.poster-card,.gear-group,.review-card,input,textarea,select';
    document.addEventListener('mouseover', e=>{ if(e.target.closest(hov)) ring.classList.add('hovered'); });
    document.addEventListener('mouseout',  e=>{ if(e.target.closest(hov)) ring.classList.remove('hovered'); });
    document.addEventListener('mouseleave',()=>{ dot.style.opacity='0'; ring.style.opacity='0'; });
    document.addEventListener('mouseenter',()=>{ dot.style.opacity='1'; ring.style.opacity='1'; });
  })();
} catch(e) {}

/* ── HEADER SCROLL ── */
try {
  (function() {
    const h = $('#site-header'); if (!h) return;
    window.addEventListener('scroll', () => h.classList.toggle('scrolled', window.scrollY > 60), {passive:true});
  })();
} catch(e) {}

/* ── NEW NAV DROPDOWN ── */
try {
  (function initNav() {
    const btn = $('#hamburger'), dropdown = $('#nav-dropdown');
    if (!btn || !dropdown) return;
    
    const toggleMenu = () => {
      const isOpen = btn.classList.contains('open');
      if (isOpen) {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
        dropdown.setAttribute('hidden','');
      } else {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        dropdown.removeAttribute('hidden');
      }
    };
    
    btn.addEventListener('click', toggleMenu);
    
    // Chiude la tendina quando si clicca su un link
    $$('.nav-link', dropdown).forEach(l => l.addEventListener('click', toggleMenu));
    
    // Chiude la tendina cliccando fuori
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !dropdown.contains(e.target) && btn.classList.contains('open')) {
            toggleMenu();
        }
    });
  })();
} catch(e) {}

/* ── SCROLL REVEAL ── */
function initReveal() {
  try {
    const els = $$('.js-reveal-fade,.js-reveal-clip,.js-reveal-left,.js-reveal-right');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } }); }, {threshold:0.1, rootMargin:'0px 0px -40px 0px'});
    $$('.pricing-grid .js-reveal-fade,.gear-grid .js-reveal-fade').forEach((el,i) => { el.style.transitionDelay=`${i*.12}s`; });
    $$('.tl-item.js-reveal-fade').forEach((el,i) => { el.style.transitionDelay=`${i*.1}s`; });
    $$('.poster-card.js-reveal-fade').forEach((el,i) => { el.style.transitionDelay=`${i*.1}s`; });
    els.forEach(el => obs.observe(el));
  } catch(e) { try { $$('.js-reveal-fade,.js-reveal-clip,.js-reveal-left,.js-reveal-right').forEach(el => el.classList.add('in')); } catch(e2) {} }
}
function triggerInitialReveals() {
  try { initReveal(); $$('.s-hero .js-reveal-fade,.s-hero .js-reveal-clip').forEach((el,i) => { setTimeout(()=>{ try { el.classList.add('in'); } catch(e) {} }, i*150+100); }); } 
  catch(e) { try { $$('.js-reveal-fade,.js-reveal-clip,.js-reveal-left,.js-reveal-right').forEach(el => el.classList.add('in')); } catch(e2) {} }
}

/* ── COLLAGE FILTER ── */
try {
  (function initCollageFilter() {
    const btns = $$('.f-btn'), items = $$('.collage-item');
    if (!btns.length || !items.length) return;
    function applyFilter(filter) {
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        if (show) {
          item.style.display = '';
          requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(.96)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    }
    items.forEach(item => { item.style.transition = 'opacity .3s ease, transform .3s ease'; });
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => { b.classList.toggle('active', b === btn); });
        applyFilter(btn.dataset.filter);
      });
    });
    applyFilter('all');
  })();
} catch(e) {}

/* ── ORGANIC CONTOUR LINES ── */
try {
  (function initBgLines() {
    const heroBgBase = document.querySelector('.hero-bg-base');
    const darkSections = [ document.getElementById('esperienze'), document.getElementById('video'), document.getElementById('offerte'), document.querySelector('.contact-body') ];
    const canvases = [];
    function addCanvas(parent, zIndex) {
      if (!parent) return null;
      const c = document.createElement('canvas'); c.className = 'bg-lines-canvas'; c.style.zIndex = zIndex;
      parent.insertBefore(c, parent.firstChild); canvases.push({ canvas: c, parent }); return c;
    }
    addCanvas(heroBgBase, '1');
    darkSections.forEach(s => addCanvas(s, '0'));
    function resizeAll() { canvases.forEach(({ canvas, parent }) => { canvas.width = parent.offsetWidth || 1; canvas.height = parent.offsetHeight || 1; }); }
    resizeAll();
    let _rt; window.addEventListener('resize', () => { clearTimeout(_rt); _rt = setTimeout(resizeAll, 120); }, { passive: true });
    function makeShapes(count) {
      return Array.from({ length: count }, () => {
        const nPts = 6 + Math.floor(Math.random() * 5);
        return {
          cx: 0.1 + Math.random() * 0.8, cy: 0.1 + Math.random() * 0.8,
          dcx: (Math.random() - 0.5) * 0.00008, dcy: (Math.random() - 0.5) * 0.00008,
          rFrac: 0.15 + Math.random() * 0.30, scaleX: 0.65 + Math.random() * 0.70, scaleY: 0.65 + Math.random() * 0.70,
          rot: Math.random() * Math.PI * 2, dRot: (Math.random() - 0.5) * 0.0003,
          pts: Array.from({ length: nPts }, () => ({ phase: Math.random() * Math.PI * 2, freq: 0.05 + Math.random() * 0.12, amp: 0.06 + Math.random() * 0.18 })),
          opacity: 0.045 + Math.random() * 0.055, lw: 0.4 + Math.random() * 0.7, tOffset: Math.random() * 100,
        };
      });
    }
    const shapeSets = canvases.map(({ canvas }) => ({ canvas, shapes: makeShapes(4 + Math.floor(Math.random() * 3)) }));
    function drawShape(ctx, W, H, shape, time) {
      const t = time + shape.tOffset; const cx = shape.cx * W; const cy = shape.cy * H; const R = shape.rFrac * Math.min(W, H); const n = shape.pts.length;
      shape.cx = ((shape.cx + shape.dcx) + 1) % 1; shape.cy = ((shape.cy + shape.dcy) + 1) % 1; shape.rot += shape.dRot;
      const points = shape.pts.map((p, i) => {
        const baseAngle = (i / n) * Math.PI * 2; const deform = 1 + p.amp * Math.sin(t * p.freq + p.phase); const r = R * deform;
        return { x: cx + r * shape.scaleX * Math.cos(baseAngle + shape.rot), y: cy + r * shape.scaleY * Math.sin(baseAngle + shape.rot) };
      });
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n];
        if (i === 0) ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo( p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6, p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6, p2.x, p2.y );
      }
      ctx.closePath();
    }
    let time = 0;
    (function animate() {
      requestAnimationFrame(animate);
      try {
        time += 0.016; const rgb = document.body.classList.contains('light') ? '0,0,0' : '255,255,255';
        shapeSets.forEach(({ canvas, shapes }) => {
          if (!canvas.width) return; const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
          shapes.forEach(shape => { drawShape(ctx, canvas.width, canvas.height, shape, time); ctx.strokeStyle = `rgba(${rgb},${shape.opacity})`; ctx.lineWidth = shape.lw; ctx.stroke(); });
        });
      } catch(e) {}
    })();
  })();
} catch(e) {}

/* ── HERO LIQUID BLOB ── */
try {
  (function initHeroBlob() {
    const hero = document.getElementById('hero'), canvas = document.getElementById('hero-canvas');
    if (!hero || !canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    function resize() { W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; }
    resize();
    try { new ResizeObserver(resize).observe(hero); } catch(e) { window.addEventListener('resize', resize); }
    
    // CAMBIATO: Colore del blob abbinato al nuovo tema Viola Scuro
    function blobColor() { return document.body.classList.contains('light') ? 'rgba(160, 120, 190, 0.4)' : 'rgba(30, 15, 45, 0.72)'; }
    
    const N = 22, BASE_R = 128;
    const pts = Array.from({ length: N }, (_, i) => ({ angle: (i / N) * Math.PI * 2, r: BASE_R, rVel: 0, idlePhase: Math.random() * Math.PI * 2, idleFreq: 0.10 + Math.random() * 0.15, idleAmp: 6 + Math.random() * 10 }));
    let targetX = -999, targetY = -999, blobX = -999, blobY = -999, velX = 0, velY = 0, prevVX = 0, prevVY = 0, heroActive = false, time = 0;
    
    function drawBlob(ptArr) {
      const n = ptArr.length; ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p0=ptArr[(i-1+n)%n], p1=ptArr[i], p2=ptArr[(i+1)%n], p3=ptArr[(i+2)%n];
        if (i === 0) ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo( p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6, p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6, p2.x, p2.y );
      }
      ctx.closePath();
    }
    (function frame() {
      requestAnimationFrame(frame);
      try {
        time += 0.016; const prevBX = blobX, prevBY = blobY;
        blobX += (targetX - blobX) * 0.09; blobY += (targetY - blobY) * 0.09;
        velX = blobX - prevBX; velY = blobY - prevBY;
        const accX = velX - prevVX, accY = velY - prevVY; prevVX = velX; prevVY = velY;
        const speed = Math.sqrt(velX * velX + velY * velY), moveDir = Math.atan2(velY, velX);
        const accMag = Math.sqrt(accX * accX + accY * accY), accDir = Math.atan2(accY, accX);
        pts.forEach(p => {
          const velStretch = Math.cos(p.angle - moveDir) * speed * 3.2;
          const accDeform = Math.cos(p.angle - accDir) * accMag * 18.0;
          const shear = Math.sin(p.angle - moveDir) * speed * 1.4;
          const gravitySag = Math.sin(p.angle) * velY * 1.8;
          const squeeze = Math.abs(Math.sin(p.angle - moveDir)) * speed * -0.5;
          const idle = p.idleAmp * Math.sin(time * p.idleFreq + p.idlePhase);
          p.rVel = (p.rVel + ((BASE_R + velStretch + accDeform + shear + gravitySag + squeeze + idle) - p.r) * 0.16) * 0.68;
          p.r = Math.max(BASE_R * 0.18, Math.min(BASE_R * 2.8, p.r + p.rVel));
        });
        ctx.clearRect(0, 0, W, H);
        if (!heroActive) return;
        const shapePts = pts.map(p => ({ x: blobX + p.r * Math.cos(p.angle), y: blobY + p.r * Math.sin(p.angle) }));
        ctx.save(); drawBlob(shapePts); ctx.fillStyle = blobColor(); ctx.fill(); ctx.restore();
      } catch(e) {}
    })();
    hero.addEventListener('mouseenter', e => { const rect = hero.getBoundingClientRect(); blobX = targetX = e.clientX - rect.left; blobY = targetY = e.clientY - rect.top; prevVX = 0; prevVY = 0; heroActive = true; });
    hero.addEventListener('mouseleave', () => { heroActive = false; });
    hero.addEventListener('mousemove', e => { const rect = hero.getBoundingClientRect(); targetX = e.clientX - rect.left; targetY = e.clientY - rect.top; });
    hero.addEventListener('touchmove', e => {
      const rect = hero.getBoundingClientRect(), t = e.touches[0];
      if (!heroActive) { blobX = targetX = t.clientX - rect.left; blobY = targetY = t.clientY - rect.top; prevVX = 0; prevVY = 0; heroActive = true; } 
      else { targetX = t.clientX - rect.left; targetY = t.clientY - rect.top; }
    }, { passive: true });
    hero.addEventListener('touchend', () => { heroActive = false; });
  })();
} catch(e) {}

/* ── FORM E TOAST ── */
try {
  (function initForm() {
    const form=$('#contact-form');if(!form)return;
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const btn=form.querySelector('.btn-send');
      if(btn){btn.disabled=true;btn.querySelector('span').textContent='Invio…';}
      setTimeout(()=>{
        form.reset();
        const ok=$('#form-ok');if(ok)ok.removeAttribute('hidden');
        if(btn){btn.disabled=false;btn.querySelector('span').textContent='Invia richiesta';}
        showToast('Messaggio inviato!');
        setTimeout(()=>{if(ok)ok.setAttribute('hidden','');},5000);
      },1200);
    });
  })();
} catch(e) {}
function showToast(msg,dur=3000){ try{const t=$('#toast');if(!t)return;t.textContent=sanitize(msg);t.classList.add('show');setTimeout(()=>t.classList.remove('show'),dur);}catch(e){} }

/* ── SMOOTH SCROLL ── */
try {
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href').slice(1);
      const target=id?document.getElementById(id):null;
      if(!target)return;e.preventDefault();
      const top=target.getBoundingClientRect().top+window.scrollY-($('#site-header')?.offsetHeight??0);
      window.scrollTo({top,behavior:'smooth'});
    });
  });
} catch(e) {}

/* ── THEME ── */
try {
  (function initTheme(){
    const btn=$('#theme-toggle'),body=document.body;if(!btn)return;
    if(localStorage.getItem('jf-theme')==='light')body.classList.add('light');
    btn.addEventListener('click',()=>{body.classList.toggle('light');localStorage.setItem('jf-theme',body.classList.contains('light')?'light':'dark');});
  })();
} catch(e) {}
