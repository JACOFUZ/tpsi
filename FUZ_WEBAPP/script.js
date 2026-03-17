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
  const iv = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100; clearInterval(iv);
      bar.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('gone');
        document.body.style.overflow = '';
        triggerInitialReveals();
      }, 500);
    } else { bar.style.width = progress + '%'; }
  }, 80);
})();

/* ── CURSOR ── */
(function initCursor() {
  const dot  = $('#cursor');
  const ring = $('#cursor-ring');
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
  const h=$('#site-header'); if(!h) return;
  window.addEventListener('scroll',()=>h.classList.toggle('scrolled',window.scrollY>60),{passive:true});
})();

/* ── HAMBURGER ── */
(function initNav() {
  const btn=$('#hamburger'), overlay=$('#nav-overlay');
  if(!btn||!overlay) return;
  const open=()=>{ btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); overlay.removeAttribute('hidden'); document.body.style.overflow='hidden'; setTimeout(()=>{ const f=overlay.querySelector('a'); if(f)f.focus(); },100); };
  const close=()=>{ btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); overlay.setAttribute('hidden',''); document.body.style.overflow=''; btn.focus(); };
  btn.addEventListener('click',()=>btn.classList.contains('open')?close():open());
  $$('.nav-link',overlay).forEach(l=>l.addEventListener('click',close));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&btn.classList.contains('open'))close(); });
  overlay.addEventListener('keydown',e=>{
    if(e.key!=='Tab') return;
    const els=$$('a,button',overlay); if(!els.length) return;
    if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els[els.length-1].focus();}
    else if(!e.shiftKey&&document.activeElement===els[els.length-1]){e.preventDefault();els[0].focus();}
  });
})();

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els=$$('.js-reveal-fade,.js-reveal-clip,.js-reveal-left,.js-reveal-right');
  if(!els.length) return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);} });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  $$('.pricing-grid .js-reveal-fade,.gear-grid .js-reveal-fade').forEach((el,i)=>{ el.style.transitionDelay=`${i*.12}s`; });
  $$('.tl-item.js-reveal-fade').forEach((el,i)=>{ el.style.transitionDelay=`${i*.1}s`; });
  $$('.poster-card.js-reveal-fade').forEach((el,i)=>{ el.style.transitionDelay=`${i*.1}s`; });
  els.forEach(el=>obs.observe(el));
}
function triggerInitialReveals() {
  initReveal();
  $$('.s-hero .js-reveal-fade,.s-hero .js-reveal-clip').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('in'),i*150+100);
  });
}

/* ── FILTRI CAROSELLI ── */
(function initFilters() {
  const btns  =$$('.f-btn');
  const blocks=$$('.carousel-block');
  if(!btns.length||!blocks.length) return;
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const filter=btn.dataset.filter;
      btns.forEach(b=>{ b.classList.toggle('active',b===btn); b.setAttribute('aria-pressed',String(b===btn)); });
      blocks.forEach((block,i)=>{
        const visible=filter==='all'||block.dataset.cat===filter;
        if(visible){
          block.classList.remove('hidden');
          block.style.opacity='0'; block.style.transform='translateY(14px)';
          setTimeout(()=>{ block.style.transition='opacity .45s var(--easing),transform .45s var(--easing)'; block.style.opacity='1'; block.style.transform='none'; },i*50);
        } else {
          block.style.transition='opacity .25s ease'; block.style.opacity='0';
          setTimeout(()=>block.classList.add('hidden'),260);
        }
      });
    });
  });
})();

/* ── CAROSELLI ── */
(function initCarousels() {
  $$('.carousel-block').forEach(block=>{
    const track   =block.querySelector('.carousel-track');
    const slides  =$$('.carousel-slide',block);
    const prevBtn =block.querySelector('.carousel-prev');
    const nextBtn =block.querySelector('.carousel-next');
    const dotsWrap=block.querySelector('.carousel-dots');
    const counter =block.querySelector('.carousel-counter');
    if(!track||!slides.length) return;

    let current=0;

    function visibleCount() {
      const w=block.offsetWidth;
      return w<400 ? 1 : 2;
    }

    /* Dots */
    slides.forEach((_,i)=>{
      if(!dotsWrap) return;
      const dot=document.createElement('button');
      dot.className='carousel-dot'+(i===0?' active':'');
      dot.setAttribute('aria-label',`Foto ${i+1}`);
      dot.addEventListener('click',()=>goTo(i));
      dotsWrap.appendChild(dot);
    });

    function getDots(){ return dotsWrap?$$('.carousel-dot',dotsWrap):[]; }

    function goTo(index) {
      const total  =slides.length;
      const visible=visibleCount();
      const max    =Math.max(0,total-visible);
      current=Math.max(0,Math.min(index,max));
      const slideW=slides[0].offsetWidth+10;
      track.style.transform=`translateX(-${current*slideW}px)`;
      getDots().forEach((d,i)=>d.classList.toggle('active',i===current));
      if(counter) counter.textContent=`${current+1}/${total}`;
      if(prevBtn) prevBtn.disabled=current===0;
      if(nextBtn) nextBtn.disabled=current>=max;
    }

    if(prevBtn) prevBtn.addEventListener('click',()=>goTo(current-1));
    if(nextBtn) nextBtn.addEventListener('click',()=>goTo(current+1));

    /* Swipe */
    let tx=0;
    track.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});
    track.addEventListener('touchend',e=>{
      const diff=tx-e.changedTouches[0].clientX;
      if(Math.abs(diff)>40) goTo(diff>0?current+1:current-1);
    });

    /* Keyboard */
    block.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft') goTo(current-1);
      if(e.key==='ArrowRight') goTo(current+1);
    });

    let rt;
    window.addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>goTo(current),150); },{passive:true});
    goTo(0);
  });
})();

/* ── RECENSIONI ── */
(function initReviews() {
  const openBtn   = $('#btn-review-open');
  const cancelBtn = $('#btn-review-cancel');
  const formWrap  = $('#review-form-wrap');
  const form      = $('#review-form');
  const list      = $('#reviews-list');
  const empty     = $('#reviews-empty');
  const starPicker= $('#star-picker');
  if(!openBtn||!form||!list) return;

  let selectedStars = 0;
  const STORAGE_KEY = 'jf-reviews';

  /* Carica e mostra recensioni salvate */
  function loadReviews() {
    let reviews = [];
    try { reviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e) {}
    list.innerHTML = '';
    if(reviews.length === 0) {
      if(empty) empty.hidden = false;
    } else {
      if(empty) empty.hidden = true;
      reviews.slice().reverse().forEach(r => list.appendChild(buildCard(r)));
    }
  }

  /* Costruisce una card recensione */
  function buildCard(r) {
    const card = document.createElement('article');
    card.className = 'review-card';
    card.setAttribute('role','listitem');
    const stars = '★'.repeat(r.stars) + '☆'.repeat(5-r.stars);
    card.innerHTML = `
      <div class="review-card-top">
        <div>
          <p class="review-author">${sanitize(r.name)}</p>
          ${r.role ? `<p class="review-role">${sanitize(r.role)}</p>` : ''}
        </div>
        <span class="review-stars" aria-label="${r.stars} stelle su 5">${stars}</span>
      </div>
      <p class="review-text">${sanitize(r.text)}</p>
      <p class="review-date">${sanitize(r.date)}</p>
    `;
    return card;
  }

  /* Toggle form */
  function openForm() {
    formWrap.removeAttribute('hidden');
    openBtn.setAttribute('aria-expanded','true');
    formWrap.scrollIntoView({behavior:'smooth',block:'nearest'});
    setTimeout(()=>$('#r-name')?.focus(),100);
  }
  function closeForm() {
    formWrap.setAttribute('hidden','');
    openBtn.setAttribute('aria-expanded','false');
    form.reset();
    selectedStars=0;
    $$('.star-btn',starPicker).forEach(b=>b.classList.remove('active'));
    $$('.f-err',form).forEach(el=>el.textContent='');
    $$('input,textarea',form).forEach(el=>el.classList.remove('invalid'));
  }

  openBtn.addEventListener('click', openForm);
  if(cancelBtn) cancelBtn.addEventListener('click', closeForm);

  /* Star picker */
  if(starPicker) {
    const starBtns = $$('.star-btn',starPicker);
    starBtns.forEach(btn => {
      btn.addEventListener('click',()=>{
        selectedStars = parseInt(btn.dataset.v,10);
        starBtns.forEach(b=>b.classList.toggle('active', parseInt(b.dataset.v,10)<=selectedStars));
        const err=$('#r-err-stars');
        if(err) err.textContent='';
      });
      btn.addEventListener('mouseover',()=>{
        const v=parseInt(btn.dataset.v,10);
        starBtns.forEach(b=>b.classList.toggle('active', parseInt(b.dataset.v,10)<=v));
      });
      btn.addEventListener('mouseout',()=>{
        starBtns.forEach(b=>b.classList.toggle('active', parseInt(b.dataset.v,10)<=selectedStars));
      });
    });
  }

  /* Validazione */
  function validateReview() {
    let ok = true;
    const nameEl = $('#r-name'), nameErr = $('#r-err-name');
    const textEl = $('#r-text'), textErr = $('#r-err-text');
    const starsErr= $('#r-err-stars');

    if(nameEl && nameEl.value.trim().length < 2) {
      if(nameErr) nameErr.textContent='Inserisci il tuo nome.';
      nameEl.classList.add('invalid'); ok=false;
    } else { if(nameErr) nameErr.textContent=''; nameEl?.classList.remove('invalid'); }

    if(selectedStars === 0) {
      if(starsErr) starsErr.textContent='Seleziona almeno una stella.'; ok=false;
    } else { if(starsErr) starsErr.textContent=''; }

    if(textEl && textEl.value.trim().length < 5) {
      if(textErr) textErr.textContent='Scrivi almeno 5 caratteri.';
      textEl.classList.add('invalid'); ok=false;
    } else { if(textErr) textErr.textContent=''; textEl?.classList.remove('invalid'); }

    return ok;
  }

  /* Submit */
  form.addEventListener('submit', e => {
    e.preventDefault();
    if(!validateReview()) return;

    const nameEl = $('#r-name');
    const roleEl = $('#r-role');
    const textEl = $('#r-text');

    const review = {
      name:  nameEl?.value.trim() || '',
      role:  roleEl?.value.trim() || '',
      stars: selectedStars,
      text:  textEl?.value.trim() || '',
      date:  new Date().toLocaleDateString('it-IT',{year:'numeric',month:'long',day:'numeric'})
    };

    /* Salva in localStorage */
    let reviews = [];
    try { reviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e) {}
    reviews.push(review);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

    closeForm();
    loadReviews();
    showToast('Recensione pubblicata!');
  });

  loadReviews();
})();

/* ── FORM CONTATTI ── */
(function initForm() {
  const form=$('#contact-form'); if(!form) return;
  const fields={
    name:   {el:$('#f-name'), err:$('#err-name'), validate:v=>v.trim().length>=2?'':'Inserisci il tuo nome.'},
    email:  {el:$('#f-email'),err:$('#err-email'),validate:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())?'':"Inserisci un'email valida."},
    type:   {el:$('#f-type'), err:$('#err-type'), validate:v=>v!==''?'':'Seleziona un tipo di richiesta.'},
    message:{el:$('#f-msg'),  err:$('#err-msg'),  validate:v=>v.trim().length>=10?'':'Almeno 10 caratteri.'},
  };
  const vf=key=>{ const{el,err,validate}=fields[key]; if(!el||!err) return true; const msg=validate(el.value); err.textContent=sanitize(msg); el.classList.toggle('invalid',msg!==''); return msg===''; };
  Object.keys(fields).forEach(k=>{ const{el}=fields[k]; if(!el) return; el.addEventListener('blur',()=>vf(k)); el.addEventListener('input',()=>{ if(el.classList.contains('invalid'))vf(k); }); });
  form.addEventListener('submit',e=>{
    e.preventDefault();
    let valid=true; Object.keys(fields).forEach(k=>{ if(!vf(k))valid=false; });
    if(!valid){ const f=Object.values(fields).find(f=>f.el?.classList.contains('invalid')); if(f)f.el.focus(); return; }
    const btn=form.querySelector('.btn-send');
    if(btn){ btn.disabled=true; btn.querySelector('span').textContent='Invio in corso…'; }
    setTimeout(()=>{
      form.reset(); Object.values(fields).forEach(({el})=>el?.classList.remove('invalid'));
      const ok=$('#form-ok'); if(ok) ok.removeAttribute('hidden');
      if(btn){ btn.disabled=false; btn.querySelector('span').textContent='Invia messaggio'; }
      showToast('Messaggio inviato!');
      setTimeout(()=>{ if(ok) ok.setAttribute('hidden',''); },5000);
    },1200);
  });
})();

/* ── TOAST ── */
function showToast(msg, dur=3000) {
  const t=$('#toast'); if(!t) return;
  t.textContent=sanitize(msg); t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),dur);
}

/* ── SMOOTH SCROLL ── */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href').slice(1);
    const target=id?document.getElementById(id):null;
    if(!target) return; e.preventDefault();
    const top=target.getBoundingClientRect().top+window.scrollY-($('#site-header')?.offsetHeight??0);
    window.scrollTo({top,behavior:'smooth'});
  });
});

/* ── PARALLAX ── */
(function(){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const bg=$('.hero-bg'); if(!bg) return;
  let t=false;
  window.addEventListener('scroll',()=>{ if(!t){ requestAnimationFrame(()=>{ bg.style.transform=`translateY(${window.scrollY*.35}px)`; t=false; }); t=true; } },{passive:true});
})();

/* ── HOVER MAGNETICO ── */
(function(){
  if(window.matchMedia('(pointer:coarse)').matches) return;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  $$('.btn-fill,.btn-line').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{ const r=btn.getBoundingClientRect(); btn.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.25}px,${(e.clientY-(r.top+r.height/2))*.25}px)`; });
    btn.addEventListener('mouseleave',()=>{ btn.style.transform=''; });
  });
})();

/* ── THEME TOGGLE ── */
(function initTheme(){
  const btn=$('#theme-toggle'), body=document.body; if(!btn) return;
  if(localStorage.getItem('jf-theme')==='light') body.classList.add('light');
  btn.addEventListener('click',()=>{ body.classList.toggle('light'); localStorage.setItem('jf-theme',body.classList.contains('light')?'light':'dark'); });
})();

window.addEventListener('error',e=>console.warn('[JF]',e.message));
