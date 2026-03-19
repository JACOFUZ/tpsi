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

try { $$('.year-span').forEach(el => { el.textContent = new Date().getFullYear(); }); } catch(e) {}

/* ── LOADER ── */
(function initLoader() {
  const loader = $('#loader'), bar = $('#loader-bar');

  function dismiss() {
    try {
      if (loader) loader.classList.add('gone');
      document.body.style.overflow = '';
      triggerInitialReveals();
    } catch(e) {
      if (loader) loader.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (!loader || !bar) { dismiss(); return; }

  let p = 0, done = false;
  document.body.style.overflow = 'hidden';

  function safeDismiss() {
    if (done) return;
    done = true;
    dismiss();
  }

  const iv = setInterval(() => {
    try {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        clearInterval(iv);
        bar.style.width = '100%';
        setTimeout(safeDismiss, 350);
      } else {
        bar.style.width = p + '%';
      }
    } catch(e) { clearInterval(iv); safeDismiss(); }
  }, 80);

  if (document.readyState === 'complete') {
    setTimeout(safeDismiss, 400);
  } else {
    window.addEventListener('load', () => setTimeout(safeDismiss, 300));
  }
  setTimeout(safeDismiss, 3000);
})();

/* ── CURSOR ── */
try {
  (function initCursor() {
    const dot = $('#cursor'), ring = $('#cursor-ring');
    if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;
    let mx=-100,my=-100,rx=-100,ry=-100;
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      dot.style.transform=`translate(calc(${mx}px - 50%),calc(${my}px - 50%))`;
    });
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

/* ── NAV ── */
try {
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
} catch(e) {}

/* ── SCROLL REVEAL ── */
function initReveal() {
  try {
    const els = $$('.js-reveal-fade,.js-reveal-clip,.js-reveal-left,.js-reveal-right');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, {threshold:0.1, rootMargin:'0px 0px -40px 0px'});
    $$('.pricing-grid .js-reveal-fade,.gear-grid .js-reveal-fade').forEach((el,i) => { el.style.transitionDelay=`${i*.12}s`; });
    $$('.tl-item.js-reveal-fade').forEach((el,i) => { el.style.transitionDelay=`${i*.1}s`; });
    $$('.poster-card.js-reveal-fade').forEach((el,i) => { el.style.transitionDelay=`${i*.1}s`; });
    els.forEach(el => obs.observe(el));
  } catch(e) {
    try { $$('.js-reveal-fade,.js-reveal-clip,.js-reveal-left,.js-reveal-right').forEach(el => el.classList.add('in')); } catch(e2) {}
  }
}
function triggerInitialReveals() {
  try {
    initReveal();
    $$('.s-hero .js-reveal-fade,.s-hero .js-reveal-clip').forEach((el,i) => {
      setTimeout(()=>{ try { el.classList.add('in'); } catch(e) {} }, i*150+100);
    });
  } catch(e) {
    try { $$('.js-reveal-fade,.js-reveal-clip,.js-reveal-left,.js-reveal-right').forEach(el => el.classList.add('in')); } catch(e2) {}
  }
}

/* ── FILTRI ── */
try {
  (function initFilters() {
    const btns = $$('.f-btn'), blocks = $$('.carousel-block');
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
            setTimeout(() => { block.style.transition='opacity .45s ease,transform .45s ease'; block.style.opacity='1'; block.style.transform='none'; }, i*50);
          } else {
            block.style.transition='opacity .25s ease'; block.style.opacity='0';
            setTimeout(() => block.classList.add('hidden'), 260);
          }
        });
      });
    });
  })();
} catch(e) {}

/* ── CAROSELLI ── */
try {
  (function initCarousels() {
    $$('.carousel-block').forEach(block => {
      try {
        const track = block.querySelector('.carousel-track');
        const slides = $$('.carousel-slide', block);
        const prevBtn = block.querySelector('.carousel-prev');
        const nextBtn = block.querySelector('.carousel-next');
        const dotsWrap = block.querySelector('.carousel-dots');
        const counter = block.querySelector('.carousel-counter');
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
          const total=slides.length, visible=visibleCount(), max=Math.max(0,total-visible);
          current=Math.max(0,Math.min(index,max));
          track.style.transform=`translateX(-${current*(slides[0].offsetWidth+10)}px)`;
          getDots().forEach((d,i)=>d.classList.toggle('active',i===current));
          if (counter) counter.textContent=`${current+1}/${total}`;
          if (prevBtn) prevBtn.disabled=current===0;
          if (nextBtn) nextBtn.disabled=current>=max;
        }
        if (prevBtn) prevBtn.addEventListener('click', ()=>goTo(current-1));
        if (nextBtn) nextBtn.addEventListener('click', ()=>goTo(current+1));
        let tx2=0;
        track.addEventListener('touchstart', e=>{tx2=e.touches[0].clientX;},{passive:true});
        track.addEventListener('touchend', e=>{const d=tx2-e.changedTouches[0].clientX;if(Math.abs(d)>40)goTo(d>0?current+1:current-1);});
        block.addEventListener('keydown', e=>{if(e.key==='ArrowLeft')goTo(current-1);if(e.key==='ArrowRight')goTo(current+1);});
        let rt; window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>goTo(current),150);},{passive:true});
        goTo(0);
      } catch(e) {}
    });
  })();
} catch(e) {}

/* ══════════════════════════════════════════════════════════════
   HERO LIQUID BLOB
   Una macchia liquida che segue il cursore con fisica spring.
   Nessun bordo, nessuna texture — solo forma pura.
   Colore: grigio scuro (dark) / grigio medio (light), 65% opacità.
   ══════════════════════════════════════════════════════════════ */
try {
  (function initHeroBlob() {
    const hero   = document.getElementById('hero');
    const canvas = document.getElementById('hero-canvas');
    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    resize();
    try { new ResizeObserver(resize).observe(hero); } catch(e) { window.addEventListener('resize', resize); }

    /* ── Colore blob in base al tema attivo ── */
    function blobColor() {
      return document.body.classList.contains('light')
        ? 'rgba(148, 152, 161, 0.65)'   /* grigio medio su sfondo chiaro */
        : 'rgba(34, 36, 42, 0.65)';     /* grigio scuro su sfondo nero  */
    }

    /* ── Posizione blob (lerp) ── */
    let targetX = -999, targetY = -999;
    let blobX   = -999, blobY   = -999;
    let prevX   = -999, prevY   = -999;
    let velX    = 0,    velY    = 0;
    let heroActive = false;

    /* ── N punti sul perimetro con spring physics ──
       Ogni punto ha:
       - angle fisso
       - raggio corrente (r) e velocità radiale (rVel)
       - parametri idle per respiro organico anche a riposo   */
    const N = 16;
    const BASE_R = 140; /* raggio base in px */

    const pts = Array.from({ length: N }, (_, i) => ({
      angle:     (i / N) * Math.PI * 2,
      r:         BASE_R,
      rVel:      0,
      idlePhase: Math.random() * Math.PI * 2,
      idleFreq:  0.18 + Math.random() * 0.22,   /* lento — respiro */
      idleAmp:   4    + Math.random() * 8,       /* piccolo — quasi impercettibile a riposo */
    }));

    let time = 0;

    /* ── Catmull-Rom → Bezier per curva morbida ── */
    function drawBlob(ptArr) {
      const n = ptArr.length;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p0 = ptArr[(i-1+n)%n];
        const p1 = ptArr[i];
        const p2 = ptArr[(i+1)%n];
        const p3 = ptArr[(i+2)%n];
        if (i === 0) ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo(
          p1.x + (p2.x - p0.x) / 6,
          p1.y + (p2.y - p0.y) / 6,
          p2.x - (p3.x - p1.x) / 6,
          p2.y - (p3.y - p1.y) / 6,
          p2.x, p2.y
        );
      }
      ctx.closePath();
    }

    /* ── Loop ── */
    (function frame() {
      requestAnimationFrame(frame);
      try {
        time += 0.016;

        /* Lerp morbido verso mouse — inertia liquida */
        blobX += (targetX - blobX) * 0.09;
        blobY += (targetY - blobY) * 0.09;

        /* Velocità istantanea per calcolare deformazione */
        velX = blobX - prevX;
        velY = blobY - prevY;
        prevX = blobX;
        prevY = blobY;

        const speed   = Math.sqrt(velX * velX + velY * velY);
        const moveDir = Math.atan2(velY, velX);

        /* Aggiorna ogni punto */
        pts.forEach(p => {
          /* Quanto questo punto è allineato con la direzione di movimento?
             1 = in avanti (si allunga), -1 = indietro (si comprime) */
          const alignment = Math.cos(p.angle - moveDir);

          /* Deformazione proporzionale alla velocità
             — più si muove, più si allunga nella direzione del moto */
          const stretch = alignment * speed * 0.55;

          /* Respiro idle — sempre attivo, indipendente dal movimento */
          const idle = p.idleAmp * Math.sin(time * p.idleFreq + p.idlePhase);

          /* Raggio target */
          const targetR = BASE_R + stretch + idle;

          /* Spring: forza proporzionale alla distanza dal target, smorzamento */
          p.rVel = (p.rVel + (targetR - p.r) * 0.13) * 0.74;
          p.r   += p.rVel;

          /* Clamp di sicurezza */
          p.r = Math.max(BASE_R * 0.45, Math.min(BASE_R * 1.85, p.r));
        });

        ctx.clearRect(0, 0, W, H);

        if (!heroActive) return;

        /* Calcola posizioni assolute dei punti */
        const shapePts = pts.map(p => ({
          x: blobX + p.r * Math.cos(p.angle),
          y: blobY + p.r * Math.sin(p.angle),
        }));

        /* Disegna — nessun bordo, solo fill */
        ctx.save();
        drawBlob(shapePts);
        ctx.fillStyle = blobColor();
        ctx.fill();
        ctx.restore();

      } catch(e) {}
    })();

    /* ── Event listeners ── */
    hero.addEventListener('mouseenter', e => {
      const rect = hero.getBoundingClientRect();
      /* Teletrasporta al punto di ingresso senza lerp iniziale */
      blobX = targetX = e.clientX - rect.left;
      blobY = targetY = e.clientY - rect.top;
      prevX = blobX; prevY = blobY;
      heroActive = true;
    });

    hero.addEventListener('mouseleave', () => {
      heroActive = false;
    });

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });

    /* Touch */
    hero.addEventListener('touchmove', e => {
      const rect = hero.getBoundingClientRect();
      const t    = e.touches[0];
      if (!heroActive) {
        blobX = targetX = t.clientX - rect.left;
        blobY = targetY = t.clientY - rect.top;
        prevX = blobX; prevY = blobY;
        heroActive = true;
      } else {
        targetX = t.clientX - rect.left;
        targetY = t.clientY - rect.top;
      }
    }, { passive: true });

    hero.addEventListener('touchend', () => { heroActive = false; });

    /* Aggiorna colore quando cambia il tema */
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', () => { /* blobColor() legge live */ });

  })();
} catch(e) { console.warn('[JF] blob', e); }

/* ── RECENSIONI ── */
try {
  (function initReviews() {
    const list=document.getElementById('reviews-list'),empty=document.getElementById('reviews-empty');
    if(!list)return;
    const STORAGE_KEY='jf-reviews';
    function buildCard(r){
      const card=document.createElement('article');card.className='review-card';card.setAttribute('role','listitem');
      const stars='★'.repeat(r.stars)+'☆'.repeat(5-r.stars);
      card.innerHTML=`<div class="review-card-top"><div><p class="review-author">${sanitize(r.name)}</p>${r.role?`<p class="review-role">${sanitize(r.role)}</p>`:''}</div><span class="review-stars">${stars}</span></div><p class="review-text">${sanitize(r.text)}</p><p class="review-date">${sanitize(r.date)}</p>`;
      return card;
    }
    let reviews=[];try{reviews=JSON.parse(localStorage.getItem(STORAGE_KEY))||[];}catch(e){}
    list.innerHTML='';
    if(reviews.length===0){if(empty)empty.hidden=false;}
    else{if(empty)empty.hidden=true;reviews.slice().reverse().forEach(r=>list.appendChild(buildCard(r)));}
  })();
} catch(e) {}

/* ── FORM ── */
try {
  (function initForm() {
    const form=$('#contact-form');if(!form)return;
    const fields={
      name:   {el:$('#f-name'),err:$('#err-name'),validate:v=>v.trim().length>=2?'':'Inserisci il tuo nome.'},
      email:  {el:$('#f-email'),err:$('#err-email'),validate:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())?'':"Inserisci un'email valida."},
      type:   {el:$('#f-type'),err:$('#err-type'),validate:v=>v!==''?'':'Seleziona un tipo di richiesta.'},
      message:{el:$('#f-msg'),err:$('#err-msg'),validate:v=>v.trim().length>=10?'':'Almeno 10 caratteri.'},
    };
    const vf=key=>{const{el,err,validate}=fields[key];if(!el||!err)return true;const msg=validate(el.value);err.textContent=sanitize(msg);el.classList.toggle('invalid',msg!=='');return msg==='';};
    Object.keys(fields).forEach(k=>{const{el}=fields[k];if(!el)return;el.addEventListener('blur',()=>vf(k));el.addEventListener('input',()=>{if(el.classList.contains('invalid'))vf(k);});});
    form.addEventListener('submit',e=>{
      e.preventDefault();
      let valid=true;Object.keys(fields).forEach(k=>{if(!vf(k))valid=false;});
      if(!valid){const f=Object.values(fields).find(f=>f.el?.classList.contains('invalid'));if(f)f.el.focus();return;}
      const btn=form.querySelector('.btn-send');
      if(btn){btn.disabled=true;btn.querySelector('span').textContent='Invio in corso…';}
      setTimeout(()=>{
        form.reset();Object.values(fields).forEach(({el})=>el?.classList.remove('invalid'));
        const ok=$('#form-ok');if(ok)ok.removeAttribute('hidden');
        if(btn){btn.disabled=false;btn.querySelector('span').textContent='Invia messaggio';}
        showToast('Messaggio inviato!');
        setTimeout(()=>{if(ok)ok.setAttribute('hidden','');},5000);
      },1200);
    });
  })();
} catch(e) {}

/* ── TOAST ── */
function showToast(msg,dur=3000){
  try{const t=$('#toast');if(!t)return;t.textContent=sanitize(msg);t.classList.add('show');setTimeout(()=>t.classList.remove('show'),dur);}catch(e){}
}

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
