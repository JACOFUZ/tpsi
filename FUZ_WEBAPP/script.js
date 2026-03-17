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

  function coverImg(img, alpha) {
    if (!img.complete || !img.naturalWidth) return;
    const iW = img.naturalWidth, iH = img.naturalHeight;
    const s  = Math.max(W / iW, H / iH);
    const dw = iW * s, dh = iH * s;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    ctx.globalAlpha = 1;
  }

  function iridescentFill(cx, cy, rw, rh, hueBase, alpha) {
    const h = hueBase % 360;
    const g = ctx.createLinearGradient(cx - rw, cy - rh, cx + rw, cy + rh);
    g.addColorStop(0,    `hsla(${h},           100%, 72%, 0)`);
    g.addColorStop(0.2,  `hsla(${(h+50)%360},  100%, 78%, ${alpha * 0.20})`);
    g.addColorStop(0.5,  `hsla(${(h+130)%360}, 100%, 74%, ${alpha * 0.14})`);
    g.addColorStop(0.75, `hsla(${(h+210)%360}, 100%, 78%, ${alpha * 0.18})`);
    g.addColorStop(1,    `hsla(${(h+290)%360}, 100%, 72%, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(cx - rw - 4, cy - rh - 4, rw * 2 + 8, rh * 2 + 8);
  }

  function specular(cx, cy, rw, rh, alpha) {
    const hx = cx - rw * 0.22, hy = cy - rh * 0.30;
    const g  = ctx.createRadialGradient(hx, hy, 0, hx, hy, Math.max(rw, rh) * 0.34);
    g.addColorStop(0,   `rgba(255,255,255,${alpha * 0.65})`);
    g.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.15})`);
    g.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(hx, hy, rw * 0.28, rh * 0.15, -Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();
  }

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
     CURSOR BLOB — forma piccola e velocissima
     che cambia continuamente, mai regolare
     ═══════════════════════════════════════ */
  const N_CURSOR = 14;
  /* Ogni punto ha frequenze alte e ampiezze asimmetriche */
  const cursorPts = Array.from({ length: N_CURSOR }, () => ({
    /* frequenze alte → deformazione rapida */
    f1: 2.5  + Math.random() * 5.0,
    f2: 1.8  + Math.random() * 4.2,
    f3: 3.0  + Math.random() * 6.0,
    f4: 4.5  + Math.random() * 8.0,
    /* fasi random → asimmetria totale */
    p1: Math.random() * Math.PI * 2,
    p2: Math.random() * Math.PI * 2,
    p3: Math.random() * Math.PI * 2,
    p4: Math.random() * Math.PI * 2,
    /* ampiezze diverse per ogni punto → mai circolare */
    a1: 0.22 + Math.random() * 0.32,
    a2: 0.10 + Math.random() * 0.18,
    a3: 0.08 + Math.random() * 0.14,
    a4: 0.05 + Math.random() * 0.10,
    /* raggio base diverso per ogni punto → elongazioni */
    rb: 0.70 + Math.random() * 0.60,
  }));

  /* Posizione lerp del cursore blob */
  let cbx = -500, cby = -500;
  let cbTx = -500, cbTy = -500;
  let cbRadius = 0, cbTargetR = 0;
  let heroActive = false;

  function cursorBlobPoints(t) {
    return cursorPts.map((p, i) => {
      const angle = (i / N_CURSOR) * Math.PI * 2 - Math.PI / 2;
      /* Deformazione multi-frequenza ad alta velocità */
      const noise = p.rb * (1
        + p.a1 * Math.sin(t * p.f1 + p.p1)
        + p.a2 * Math.cos(t * p.f2 + p.p2)
        + p.a3 * Math.sin(t * p.f3 + p.p3)
        + p.a4 * Math.cos(t * p.f4 + p.p4));
      return {
        x: cbx + cbRadius * noise * Math.cos(angle),
        y: cby + cbRadius * noise * Math.sin(angle),
      };
    });
  }

  /* ═══════════════════
     STRIPES
     ═══════════════════ */
  const stripes = [];
  const MAX_STRIPES = 12;

  function makeStripePts(cx, cy, len, thk, angle) {
    const N = 20;
    return Array.from({ length: N }, (_, i) => {
      const t      = (i / N) * Math.PI * 2;
      const wobble = 1 + 0.20 * Math.sin(t * 3.1 + Math.random() * 6) + 0.10 * Math.cos(t * 5.7 + Math.random() * 6);
      const rx = Math.cos(t) * len * 0.5 * wobble;
      const ry = Math.sin(t) * thk * 0.5 * wobble;
      return {
        x: cx + rx * Math.cos(angle) - ry * Math.sin(angle),
        y: cy + rx * Math.sin(angle) + ry * Math.cos(angle),
      };
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
    stripes.push({ cx, cy, len, thk, angle, pts: makeStripePts(cx, cy, len, thk, angle), life, maxLife: life, hue, alpha: 0 });
  }

  /* ═══════════════════
     BUBBLES
     ═══════════════════ */
  const bubbles = [];
  const MAX_BUBBLES = 22;

  function makeBubblePts(n) {
    return Array.from({ length: n }, () => ({
      s1: 0.6 + Math.random() * 2.0, s2: 0.3 + Math.random() * 1.0,
      p1: Math.random() * Math.PI * 2, p2: Math.random() * Math.PI * 2,
      a1: 0.10 + Math.random() * 0.22, a2: 0.05 + Math.random() * 0.10,
    }));
  }

  function bubblePts(b) {
    const n = b.bpts.length;
    return b.bpts.map((p, i) => {
      const angle = (i / n) * Math.PI * 2;
      const noise = 1 + p.a1 * Math.sin(b.t * p.s1 + p.p1) + p.a2 * Math.cos(b.t * p.s2 + p.p2);
      return { x: b.x + b.r * noise * Math.cos(angle), y: b.y + b.r * noise * Math.sin(angle) };
    });
  }

  function spawnBubble(x, y, vx, vy, r) {
    if (bubbles.length >= MAX_BUBBLES) return;
    const life = 2.5 + Math.random() * 3.5;
    bubbles.push({ x, y, vx, vy, r: r || (12 + Math.random() * 45), life, maxLife: life, bpts: makeBubblePts(7 + Math.floor(Math.random() * 5)), hue: Math.random() * 360, t: Math.random() * 20 });
  }

  /* ═══════════════════
     PARTICLES
     ═══════════════════ */
  const particles = [];
  const MAX_PARTICLES = 80;

  function spawnParticle(x, y, vx, vy) {
    if (particles.length >= MAX_PARTICLES) return;
    const life = 1.2 + Math.random() * 1.8;
    particles.push({ x, y, vx: vx + (Math.random()-.5)*2.5, vy: vy + (Math.random()-.5)*2.5-.5, r: 3 + Math.random() * 9, life, maxLife: life, hue: Math.random() * 360, t: Math.random() * 10 });
  }

  /* ═══════════════════
     TEMPO
     ═══════════════════ */
  let time = 0;
  let lastMx = 0, lastMy = 0;
  let autoSpawnTick = 0;
  let spawnTick = 0;

  /* ═══════════════════
     UPDATE
     ═══════════════════ */
  function updateStripes() {
    for (let i = stripes.length - 1; i >= 0; i--) {
      const s = stripes[i];
      s.life -= 0.016;
      if (s.life <= 0) { stripes.splice(i, 1); continue; }
      const lr = s.life / s.maxLife;
      if (lr > 0.85)      s.alpha = Math.min(s.alpha + 0.025, 1);
      else if (lr < 0.25) s.alpha = Math.max(s.alpha - 0.018, 0);
    }
  }

  function updateBubbles() {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.life -= 0.016;
      if (b.life <= 0) { bubbles.splice(i, 1); continue; }
      b.x += b.vx; b.y += b.vy;
      b.vx *= 0.98; b.vy = b.vy * 0.98 - 0.06;
      b.t += 0.018;
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= 0.016;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.95; p.vy = p.vy * 0.95 - 0.04;
      p.t += 0.03;
    }
  }

  /* ═══════════════════
     DRAW
     ═══════════════════ */
  function drawCursorBlob(t) {
    if (cbRadius < 1 || !imgReveal.complete || !imgReveal.naturalWidth) return;
    const lr = cbTargetR > 0 ? 1 : cbRadius / 5;
    const alpha = Math.min(lr, 1) * 0.92;

    const bp = cursorBlobPoints(t);

    /* Clip → rivela immagine */
    ctx.save();
    catmullPath(bp);
    ctx.clip();
    coverImg(imgReveal, alpha);

    /* Iridescenza */
    ctx.save();
    iridescentFill(cbx, cby, cbRadius * 1.2, cbRadius * 1.0, time * 18, alpha * 0.9);
    ctx.restore();

    ctx.restore();

    /* Bordo multicolore */
    ctx.save();
    catmullPath(bp);
    const hb = (time * 28) % 360;
    ctx.strokeStyle = `hsla(${hb}, 95%, 82%, ${alpha * 0.55})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    /* Glow sottile esterno */
    const outerPts = cursorBlobPoints(t - 0.05); // leggero offset temporale = forma leggermente diversa
    ctx.save();
    catmullPath(outerPts.map(p => ({ x: cbx + (p.x - cbx) * 1.18, y: cby + (p.y - cby) * 1.18 })));
    const gout = ctx.createRadialGradient(cbx, cby, cbRadius * 0.5, cbx, cby, cbRadius * 1.3);
    const hg = (time * 18 + 60) % 360;
    gout.addColorStop(0,   'rgba(0,0,0,0)');
    gout.addColorStop(0.6, `hsla(${hg}, 80%, 70%, ${alpha * 0.07})`);
    gout.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = gout;
    ctx.fill();
    ctx.restore();

    /* Specular */
    ctx.save();
    specular(cbx, cby, cbRadius * 0.9, cbRadius * 0.7, alpha * 0.75);
    ctx.restore();
  }

  function drawStripes() {
    stripes.forEach(s => {
      if (s.alpha < 0.01) return;
      ctx.save();
      catmullPath(s.pts);
      ctx.clip();
      coverImg(imgReveal, s.alpha * 0.92);
      ctx.save();
      ctx.translate(s.cx, s.cy);
      ctx.rotate(s.angle);
      iridescentFill(0, 0, s.len * 0.5, s.thk * 0.5, s.hue + time * 15, s.alpha);
      ctx.restore();
      ctx.restore();

      ctx.save();
      catmullPath(s.pts);
      ctx.strokeStyle = `hsla(${(s.hue + time * 25 + 90) % 360}, 90%, 80%, ${s.alpha * 0.45})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      specular(s.cx, s.cy, s.len * 0.25, s.thk * 0.25, s.alpha * 0.7);
      ctx.restore();
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
      coverImg(imgReveal, alpha);
      ctx.save();
      iridescentFill(b.x, b.y, b.r, b.r, b.hue + time * 20, alpha);
      ctx.restore();
      ctx.restore();

      ctx.save();
      catmullPath(bp);
      ctx.strokeStyle = `hsla(${(b.hue + time * 35) % 360}, 95%, 82%, ${alpha * 0.6})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      catmullPath(bubblePts({ ...b, r: b.r * 1.15 }));
      const gout = ctx.createRadialGradient(b.x, b.y, b.r * 0.5, b.x, b.y, b.r * 1.2);
      gout.addColorStop(0, 'rgba(0,0,0,0)');
      gout.addColorStop(0.6, `hsla(${(b.hue + time * 20) % 360}, 80%, 70%, ${alpha * 0.08})`);
      gout.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gout;
      ctx.fill();
      ctx.restore();

      ctx.save();
      specular(b.x, b.y, b.r, b.r, alpha * 0.85);
      ctx.restore();
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      const lr = p.life / p.maxLife;
      const alpha = Math.min(lr * 3, 1) * 0.82;
      if (alpha < 0.01) return;
      const wobble = 1 + 0.12 * Math.sin(p.t * 4.5);
      const pts = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return { x: p.x + p.r * wobble * Math.cos(a), y: p.y + p.r * (1/wobble) * Math.sin(a) };
      });
      ctx.save();
      catmullPath(pts);
      ctx.clip();
      coverImg(imgReveal, alpha * 0.9);
      ctx.save();
      iridescentFill(p.x, p.y, p.r, p.r, p.hue + time * 30, alpha * 0.8);
      ctx.restore();
      ctx.restore();

      ctx.save();
      catmullPath(pts);
      ctx.strokeStyle = `hsla(${(p.hue + 60) % 360}, 95%, 85%, ${alpha * 0.55})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      specular(p.x, p.y, p.r, p.r, alpha * 0.6);
      ctx.restore();
    });
  }

  /* ═══════════════════
     AUTO SPAWN
     ═══════════════════ */
  function autoSpawn() {
    autoSpawnTick++;
    if (autoSpawnTick % 240 === 0) spawnStripe();
    if (autoSpawnTick % 90 === 0)  spawnBubble(Math.random() * W, H * 0.3 + Math.random() * H * 0.6, (Math.random()-.5)*.8, -(0.3+Math.random()*.6));
    if (autoSpawnTick % 48 === 0)  spawnParticle(Math.random() * W, H * 0.2 + Math.random() * H * 0.7, (Math.random()-.5)*.5, -(0.2+Math.random()*.5));
  }

  /* ═══════════════════
     LOOP
     ═══════════════════ */
  (function frame() {
    requestAnimationFrame(frame);
    /* Veloce: time avanza più rapido per il cursor blob */
    time += 0.016;

    /* Lerp cursore blob — inseguimento morbido */
    cbx += (cbTx - cbx) * 0.14;
    cby += (cbTy - cby) * 0.14;
    cbRadius += (cbTargetR - cbRadius) * 0.10;

    autoSpawn();
    updateStripes();
    updateBubbles();
    updateParticles();

    ctx.clearRect(0, 0, W, H);

    drawStripes();
    drawBubbles();
    drawParticles();
    drawCursorBlob(time);   /* sopra tutto */
  })();

  /* ═══════════════════
     SPAWN INIZIALE
     ═══════════════════ */
  for (let i = 0; i < 4; i++) spawnStripe();
  for (let i = 0; i < 8; i++) spawnBubble(Math.random()*W, H*.2+Math.random()*H*.7, (Math.random()-.5)*.5, -(0.2+Math.random()*.4));
  for (let i = 0; i < 18; i++) spawnParticle(Math.random()*W, H*.1+Math.random()*H*.85, (Math.random()-.5)*1.0, -Math.random()*.6);

  /* ═══════════════════
     MOUSE
     ═══════════════════ */
  hero.addEventListener('mouseenter', e => {
    heroActive = true;
    cbTargetR = 30 + Math.random() * 20; /* piccolo: 30–50px */
    const rect = hero.getBoundingClientRect();
    cbTx = cbx = e.clientX - rect.left;
    cbTy = cby = e.clientY - rect.top;
    lastMx = cbTx; lastMy = cbTy;
  });

  hero.addEventListener('mouseleave', () => {
    heroActive = false;
    cbTargetR = 0;
  });

  hero.addEventListener('mousemove', e => {
    const rect  = hero.getBoundingClientRect();
    const nx    = e.clientX - rect.left;
    const ny    = e.clientY - rect.top;
    const dvx   = nx - lastMx;
    const dvy   = ny - lastMy;
    const speed = Math.sqrt(dvx*dvx + dvy*dvy);
    lastMx = nx; lastMy = ny;
    cbTx = nx; cbTy = ny;

    /* Raggio leggermente variabile con la velocità */
    cbTargetR = 28 + Math.min(speed * 0.6, 22);

    spawnTick++;

    /* Particelle dal cursore */
    if (spawnTick % 3 === 0) {
      spawnParticle(nx+(Math.random()-.5)*14, ny+(Math.random()-.5)*14, dvx*.18, dvy*.18);
    }

    /* Bolle quando veloce */
    if (speed > 8 && spawnTick % 8 === 0) {
      spawnBubble(nx+(Math.random()-.5)*22, ny+(Math.random()-.5)*22, dvx*.12, dvy*.12-.4, 10+Math.random()*25);
    }

    /* Stripe occasionale su movimento brusco */
    if (speed > 18 && spawnTick % 60 === 0) spawnStripe();
  });

  hero.addEventListener('touchmove', e => {
    const rect = hero.getBoundingClientRect();
    const t    = e.touches[0];
    const nx   = t.clientX - rect.left;
    const ny   = t.clientY - rect.top;
    cbTx = nx; cbTy = ny;
    cbTargetR = 35;
    for (let i = 0; i < 3; i++) {
      spawnParticle(nx+(Math.random()-.5)*20, ny+(Math.random()-.5)*20, (Math.random()-.5)*1.5, -Math.random()*.8);
    }
  }, { passive: true });

  hero.addEventListener('touchend', () => { cbTargetR = 0; });
})();
