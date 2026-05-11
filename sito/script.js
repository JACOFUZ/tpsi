/* ═══════════════════════════════════════════════════════════
   TECHSPACE — script.js
   Production-ready SPA logic
═══════════════════════════════════════════════════════════ */

/* ── Product Catalog ── */
const products = [
  {
    id: 1, name: "Cuffie Noise-Cancelling Pro", cat: "audio",
    price: 349, oldPrice: 449, badge: "sale", rating: 4.8, reviews: 2847,
    desc: "Cancellazione attiva del rumore di nuova generazione con ANC ibrida a 6 microfoni. Bluetooth 5.2 multipoint, 30 ore di autonomia, driver da 40mm con equalizzatore adattivo AI. Pieghevoli, con custodia rigida inclusa.",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=85",
    tags: ["wireless", "ANC", "premium", "work"]
  },
  {
    id: 2, name: "Smartwatch Series X", cat: "wearable",
    price: 299, badge: "new", rating: 4.6, reviews: 1423,
    desc: "Display AMOLED always-on da 1.9\", ECG integrato, GPS dual-band, SpO2, temperatura corporea e rilevamento cadute. Autonomia fino a 7 giorni. Certificato 5ATM. Compatibile iOS e Android con 50+ modalità sportive.",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=85",
    tags: ["health", "GPS", "fitness", "AMOLED"]
  },
  {
    id: 3, name: "Speaker Bluetooth 360°", cat: "audio",
    price: 129, badge: null, rating: 4.5, reviews: 3201,
    desc: "Suono omnidirezionale con due driver full-range e radiatore passivo per bassi profondi. IP67 impermeabile e antipolvere, 20 ore di riproduzione continua. Ricarica USB-C rapida: 2 ore per la carica completa.",
    img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=85",
    tags: ["portatile", "outdoor", "IP67", "360°"]
  },
  {
    id: 4, name: "Striscia LED Ambient Pro", cat: "smart-home",
    price: 59, badge: "bestseller", rating: 4.4, reviews: 5672,
    desc: "16 milioni di colori RGBIC con controllo zona per zona indipendente. Compatibile Alexa, Google Home e HomeKit. App iOS/Android con oltre 50 scene. Sincronia musicale integrata. 5 metri di lunghezza.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=85",
    tags: ["RGBIC", "Alexa", "HomeKit", "musicale"]
  },
  {
    id: 5, name: "Smart Band Ultra 3", cat: "wearable",
    price: 79, badge: null, rating: 4.3, reviews: 4102,
    desc: "Leggerissima (28g), display AMOLED da 1.9\" con sempre acceso. Traccia passi, calorie bruciate, sonno profondo e livello di stress con AI. Rilevamento automatico di 60 sport. 14 giorni di autonomia garantita.",
    img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b9?auto=format&fit=crop&w=600&q=85",
    tags: ["fitness", "salute", "AMOLED", "14 giorni"]
  },
  {
    id: 6, name: "Termostato Smart AI", cat: "smart-home",
    price: 189, badge: "new", rating: 4.7, reviews: 892,
    desc: "Apprendimento automatico delle tue abitudini con IA on-device. Risparmia fino al 30% sulla bolletta energetica. Compatibile con tutti i sistemi di riscaldamento. Controllo remoto via app, geofencing automatico incluso.",
    img: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=85",
    tags: ["AI", "risparmio energetico", "geofencing"]
  },
  {
    id: 7, name: "Auricolari TWS Pro X", cat: "audio",
    price: 199, badge: "hot", rating: 4.9, reviews: 6741,
    desc: "Driver dinamici da 10mm con diaframma in LCP, ANC ibrida di 3a generazione (-42dB), modalità trasparenza adattiva e audio spaziale 3D. Autonomia 8h + 24h con custodia. Certificati IPX5. Ricarica wireless Qi.",
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=85",
    tags: ["ANC", "audio spaziale", "IPX5", "Qi wireless"]
  },
  {
    id: 8, name: "Smart Home Hub Pro", cat: "smart-home",
    price: 149, badge: null, rating: 4.5, reviews: 1234,
    desc: "Centro di controllo per tutti i tuoi dispositivi smart. Compatibile con 10.000+ prodotti Zigbee, Z-Wave, Matter e Thread. Display touchscreen da 5\" HD. Assistente vocale integrato, automazioni avanzate, backup locale.",
    img: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=600&q=85",
    tags: ["Matter", "Zigbee", "Z-Wave", "automazioni"]
  },
  {
    id: 9, name: "Tastiera Meccanica TKL Pro", cat: "accessories",
    price: 179, oldPrice: 229, badge: "sale", rating: 4.7, reviews: 2341,
    desc: "Switch meccanici hot-swap con 6 opzioni di switch disponibili. Retroilluminazione RGB per singolo tasto con effetti personalizzabili. Layout TKL 87 tasti. Connessione tripla: USB-C, Bluetooth 5.0 e dongle 2.4GHz.",
    img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=85",
    tags: ["hot-swap", "RGB", "wireless", "TKL"]
  }
];

/* ── State ── */
let favorites = [];
let cart = [];       // [{ id, qty }]
let activeCategory = 'all';
let searchTerm = '';
let sortValue = 'default';
let showFavOnly = false;
let currentModalId = null;

/* ── DOM refs ── */
const productGrid    = document.getElementById('product-grid');
const searchBar      = document.getElementById('search-bar');
const sortSelect     = document.getElementById('sort-select');
const resetBtn       = document.getElementById('reset-filters');
const modal          = document.getElementById('product-modal');
const catalogTitle   = document.getElementById('catalog-title');
const catalogCount   = document.getElementById('catalog-count');
const cartDrawer     = document.getElementById('cart-drawer');
const cartOverlay    = document.getElementById('cart-overlay');
const cartItemsEl    = document.getElementById('cart-items');
const cartFooter     = document.getElementById('cart-footer');
const cartTotalEl    = document.getElementById('cart-total');
const cartCountEl    = document.getElementById('cart-count');
const favCountEl     = document.getElementById('fav-count');
const backToTopBtn   = document.getElementById('back-to-top');
const scrollProgress = document.getElementById('scroll-progress');

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  initTheme();
  setupNavigation();
  setupHamburger();
  setupFilters();
  setupModal();
  setupCart();
  setupScrollBehavior();
  setupNewsletter();
  showSkeletons(3);
  setTimeout(() => {
    applyFilters();
  }, 600);
});

/* ── Storage ── */
function loadStorage() {
  try {
    favorites = JSON.parse(localStorage.getItem('ts_favorites') || '[]');
    cart      = JSON.parse(localStorage.getItem('ts_cart')      || '[]');
  } catch(e) {
    favorites = []; cart = [];
  }
  updateFavCount();
  updateCartCount();
}

function saveStorage() {
  localStorage.setItem('ts_favorites', JSON.stringify(favorites));
  localStorage.setItem('ts_cart',      JSON.stringify(cart));
}

/* ── Theme ── */
function initTheme() {
  const saved = localStorage.getItem('ts_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-toggle');
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ts_theme', next);
    showToast(next === 'dark' ? 'Tema scuro attivato' : 'Tema chiaro attivato', 'info');
  });
}

/* ── Navigation ── */
function setupNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const sec = link.dataset.section;
      navigateTo(sec);
      document.querySelector('.nav-links').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
      document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
    });
  });

  document.getElementById('hero-cta').addEventListener('click', () => navigateTo('catalog'));
  document.getElementById('hero-fav-btn').addEventListener('click', () => navigateTo('favorites'));
  document.getElementById('fav-btn').addEventListener('click', () => navigateTo('favorites'));
}

function navigateTo(section) {
  showFavOnly = (section === 'favorites');
  const targetSec = showFavOnly ? 'catalog' : section;

  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active-section'));
  document.getElementById(targetSec).classList.add('active-section');

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === section);
  });

  if (targetSec === 'catalog') {
    activeCategory = 'all';
    document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
    updateCatalogHeader();
    applyFilters();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Hamburger ── */
function setupHamburger() {
  const ham   = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  ham.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if (!ham.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      ham.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Filters ── */
function setupFilters() {
  document.querySelectorAll('.pill').forEach(p => {
    p.addEventListener('click', () => {
      activeCategory = p.dataset.cat;
      document.querySelectorAll('.pill').forEach(pp => pp.classList.remove('active'));
      p.classList.add('active');
      applyFilters();
    });
  });
  searchBar.addEventListener('input', () => {
    searchTerm = searchBar.value.toLowerCase().trim();
    applyFilters();
  });
  sortSelect.addEventListener('change', () => {
    sortValue = sortSelect.value;
    applyFilters();
  });
  resetBtn.addEventListener('click', resetFilters);
}

function resetFilters() {
  activeCategory = 'all';
  searchTerm     = '';
  sortValue      = 'default';
  searchBar.value   = '';
  sortSelect.value  = 'default';
  document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
  applyFilters();
}

function applyFilters() {
  let filtered = products.filter(p => {
    const matchCat  = activeCategory === 'all' || p.cat === activeCategory;
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm) ||
                        p.cat.toLowerCase().includes(searchTerm) ||
                        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm)));
    const matchFav  = !showFavOnly || favorites.includes(p.id);
    return matchCat && matchSearch && matchFav;
  });

  if      (sortValue === 'price-asc')  filtered.sort((a,b) => a.price - b.price);
  else if (sortValue === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  else if (sortValue === 'rating')     filtered.sort((a,b) => b.rating - a.rating);
  else if (sortValue === 'name-asc')   filtered.sort((a,b) => a.name.localeCompare(b.name, 'it'));

  updateCatalogHeader(filtered.length);
  renderProducts(filtered);
}

function updateCatalogHeader(count) {
  if (showFavOnly) {
    catalogTitle.textContent = 'I tuoi Preferiti';
    const existing = document.querySelector('.fav-banner');
    if (!existing) {
      const banner = document.createElement('div');
      banner.className = 'fav-banner';
      banner.innerHTML = `<span class="fav-banner-icon">♥</span>
        <div class="fav-banner-text">
          <h3>Lista Preferiti</h3>
          <p>Prodotti salvati in questo browser — ${favorites.length} ${favorites.length === 1 ? 'articolo' : 'articoli'}</p>
        </div>`;
      document.querySelector('.catalog-wrap').insertBefore(banner, document.querySelector('.filter-pills'));
    }
  } else {
    catalogTitle.textContent = 'Catalogo';
    const banner = document.querySelector('.fav-banner');
    if (banner) banner.remove();
  }
  if (count !== undefined) {
    catalogCount.textContent = count === 0 ? '' : `${count} ${count === 1 ? 'prodotto' : 'prodotti'}`;
  }
}

/* ── Skeletons ── */
function showSkeletons(n) {
  productGrid.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const sk = document.createElement('div');
    sk.className = 'card-skeleton';
    sk.style.animationDelay = `${i * 0.08}s`;
    sk.innerHTML = `<div class="skeleton skel-img"></div>
      <div class="skel-body">
        <div class="skeleton skel-line skel-short"></div>
        <div class="skeleton skel-line skel-medium"></div>
        <div class="skeleton skel-line" style="width:35%"></div>
        <div class="skeleton skel-btn"></div>
      </div>`;
    productGrid.appendChild(sk);
  }
}

/* ── Render Products ── */
function renderProducts(list) {
  productGrid.innerHTML = '';

  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    if (showFavOnly) {
      empty.innerHTML = `<span class="empty-icon">♡</span>
        <p class="empty-title">Nessun preferito ancora</p>
        <p class="empty-sub">Aggiungi prodotti ai preferiti per rivederli qui.</p>
        <button class="empty-cta" onclick="navigateTo('catalog')">Vai al Catalogo →</button>`;
    } else {
      empty.innerHTML = `<span class="empty-icon">🔍</span>
        <p class="empty-title">Nessun prodotto trovato</p>
        <p class="empty-sub">Prova a modificare i filtri o la ricerca.</p>
        <button class="empty-cta" onclick="resetFilters()">Azzera filtri</button>`;
    }
    productGrid.appendChild(empty);
    return;
  }

  list.forEach((prod, i) => {
    const card = buildCard(prod, i);
    productGrid.appendChild(card);
  });
}

function buildCard(prod, index) {
  const isFav       = favorites.includes(prod.id);
  const inCart      = cart.some(c => c.id === prod.id);
  const starsHtml   = renderStars(prod.rating);
  const badgeHtml   = prod.badge ? `<span class="card-badge badge-${prod.badge}">${badgeLabel(prod.badge)}</span>` : '';
  const oldPriceHtml = prod.oldPrice ? `<span class="card-old-price">€${prod.oldPrice}</span>` : '';
  const catLabel    = catName(prod.cat);

  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('role', 'listitem');
  card.style.animationDelay = `${Math.min(index * 0.06, 0.4)}s`;

  card.innerHTML = `
    <div class="card-img-wrap">
      <img src="${prod.img}" alt="${prod.name}" loading="lazy">
      ${badgeHtml}
      <button class="card-quick-add" data-id="${prod.id}" aria-label="Aggiungi velocemente al carrello" title="Aggiungi al carrello">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
    <div class="card-body">
      <p class="card-cat">${catLabel}</p>
      <h3 class="card-name">${escHtml(prod.name)}</h3>
      <div class="card-rating">
        <span class="stars" aria-label="${prod.rating} stelle su 5">${starsHtml}</span>
        <span class="rating-val">${prod.rating}</span>
        <span class="rating-cnt">(${prod.reviews.toLocaleString('it-IT')})</span>
      </div>
      <div class="card-price-row">
        <span class="card-price">€${prod.price}</span>
        ${oldPriceHtml}
      </div>
      <div class="card-actions">
        <button class="btn-cart ${inCart ? 'in-cart' : ''}" data-id="${prod.id}">${inCart ? '✓ Nel carrello' : 'Aggiungi'}</button>
        <button class="btn-details" data-id="${prod.id}">Dettagli</button>
        <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${prod.id}" aria-label="${isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
    </div>`;

  card.querySelector('.card-quick-add').addEventListener('click', e => {
    e.stopPropagation();
    addToCart(prod.id);
  });
  card.querySelector('.btn-cart').addEventListener('click', e => {
    e.stopPropagation();
    addToCart(prod.id, card.querySelector('.btn-cart'));
  });
  card.querySelector('.btn-details').addEventListener('click', e => {
    e.stopPropagation();
    openModal(prod);
  });
  card.querySelector('.btn-fav').addEventListener('click', e => {
    e.stopPropagation();
    toggleFavorite(prod.id);
    applyFilters();
  });
  card.addEventListener('click', () => openModal(prod));

  return card;
}

/* ── Helpers ── */
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function badgeLabel(badge) {
  const map = { new: 'Nuovo', hot: 'Hot', sale: 'Sale', bestseller: 'Top' };
  return map[badge] || badge;
}

function catName(cat) {
  const map = { audio: 'Audio', wearable: 'Wearable', 'smart-home': 'Smart Home', accessories: 'Accessori' };
  return map[cat] || cat;
}

/* ── Favorites ── */
function toggleFavorite(id) {
  const idx = favorites.indexOf(id);
  if (idx > -1) {
    favorites.splice(idx, 1);
    showToast('Rimosso dai preferiti', 'error');
  } else {
    favorites.push(id);
    showToast('Aggiunto ai preferiti ♥', 'success');
  }
  saveStorage();
  updateFavCount();
  if (currentModalId === id) updateModalFavBtn(id);
}

function updateFavCount() {
  favCountEl.textContent = favorites.length;
  favCountEl.style.display = favorites.length > 0 ? 'flex' : 'none';
}

/* ── Cart ── */
function setupCart() {
  document.getElementById('cart-toggle').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  document.getElementById('btn-checkout').addEventListener('click', handleCheckout);
  document.getElementById('btn-clear-cart').addEventListener('click', clearCart);
  renderCart();
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function addToCart(id, btnEl) {
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
    showToast('Quantità aggiornata', 'info');
  } else {
    cart.push({ id, qty: 1 });
    const prod = products.find(p => p.id === id);
    showToast(`${prod.name} aggiunto al carrello`, 'success');
  }
  saveStorage();
  updateCartCount();
  renderCart();

  if (btnEl) {
    btnEl.textContent = '✓ Nel carrello';
    btnEl.classList.add('in-cart');
  }

  // Animate cart icon
  const cartIcon = document.getElementById('cart-toggle');
  cartIcon.style.transform = 'scale(1.3)';
  setTimeout(() => { cartIcon.style.transform = ''; }, 220);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveStorage();
  updateCartCount();
  renderCart();
  applyFilters();
}

function updateQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  if (item.qty === 0) { removeFromCart(id); return; }
  saveStorage();
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  saveStorage();
  updateCartCount();
  renderCart();
  applyFilters();
  showToast('Carrello svuotato', 'info');
}

function updateCartCount() {
  const total = cart.reduce((sum, c) => sum + c.qty, 0);
  cartCountEl.textContent = total;
  cartCountEl.style.display = total > 0 ? 'flex' : 'none';
}

function renderCart() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty">
      <span class="cart-empty-icon">🛒</span>
      <p>Il tuo carrello è vuoto.<br>Aggiungi qualcosa di bello!</p>
    </div>`;
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'block';
  let total = 0;

  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (!prod) return;
    const itemTotal = prod.price * item.qty;
    total += itemTotal;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img class="cart-item-img" src="${prod.img}" alt="${prod.name}" loading="lazy">
      <div class="cart-item-info">
        <p class="cart-item-name">${escHtml(prod.name)}</p>
        <p class="cart-item-price">€${itemTotal.toLocaleString('it-IT', {minimumFractionDigits:0, maximumFractionDigits:0})}</p>
        <div class="cart-item-controls">
          <button class="qty-btn" data-id="${prod.id}" data-delta="-1" aria-label="Riduci quantità">−</button>
          <span class="qty-value" aria-label="Quantità">${item.qty}</span>
          <button class="qty-btn" data-id="${prod.id}" data-delta="1"  aria-label="Aumenta quantità">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${prod.id}" aria-label="Rimuovi">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>`;

    el.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), parseInt(btn.dataset.delta)));
    });
    el.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(prod.id));
    cartItemsEl.appendChild(el);
  });

  cartTotalEl.textContent = `€${total.toLocaleString('it-IT', {minimumFractionDigits:0, maximumFractionDigits:0})}`;
}

function handleCheckout() {
  closeCart();
  showToast('Ordine inviato! 🎉 Riceverai una conferma via email', 'success');
  setTimeout(() => {
    cart = [];
    saveStorage();
    updateCartCount();
    renderCart();
    applyFilters();
  }, 500);
}

/* ── Modal ── */
function setupModal() {
  document.getElementById('close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(prod) {
  currentModalId = prod.id;
  const isFav   = favorites.includes(prod.id);
  const inCart  = cart.some(c => c.id === prod.id);

  document.getElementById('modal-img').src    = prod.img;
  document.getElementById('modal-img').alt    = prod.name;
  document.getElementById('modal-cat').textContent   = catName(prod.cat);
  document.getElementById('modal-title').textContent = prod.name;
  document.getElementById('modal-desc').textContent  = prod.desc;
  document.getElementById('modal-price').textContent = `€${prod.price}`;

  const oldPriceEl = document.getElementById('modal-old-price');
  oldPriceEl.textContent = prod.oldPrice ? `€${prod.oldPrice}` : '';

  const badgeEl = document.getElementById('modal-badge');
  if (prod.badge) {
    badgeEl.textContent = badgeLabel(prod.badge);
    badgeEl.className = `modal-badge card-badge badge-${prod.badge}`;
  } else {
    badgeEl.textContent = '';
    badgeEl.className = 'modal-badge';
  }

  // Stars
  const ratingEl = document.getElementById('modal-rating');
  ratingEl.innerHTML = `<span class="stars" aria-label="${prod.rating} stelle">${renderStars(prod.rating)}</span>
    <span class="rating-val">${prod.rating}</span>
    <span class="rating-cnt">(${prod.reviews.toLocaleString('it-IT')} recensioni)</span>`;

  // Tags
  const tagsEl = document.getElementById('modal-tags');
  tagsEl.innerHTML = (prod.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('');

  // Fav button
  const favBtn = document.getElementById('modal-fav-btn');
  favBtn.className = `btn-modal-fav ${isFav ? 'active' : ''}`;
  favBtn.setAttribute('aria-label', isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti');
  favBtn.onclick = () => {
    toggleFavorite(prod.id);
    updateModalFavBtn(prod.id);
  };

  // Cart button
  const addCartBtn = document.getElementById('modal-add-cart');
  addCartBtn.textContent = '';
  addCartBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="margin-right:6px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>${inCart ? 'Già nel carrello — Aggiungi ancora' : 'Aggiungi al Carrello'}`;
  addCartBtn.onclick = () => {
    addToCart(prod.id);
    addCartBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="margin-right:6px"><polyline points="20 6 9 17 4 12"/></svg>Aggiunto al Carrello!`;
    setTimeout(() => {
      addCartBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="margin-right:6px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Aggiungi ancora`;
    }, 1800);
  };

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function updateModalFavBtn(id) {
  const isFav = favorites.includes(id);
  const favBtn = document.getElementById('modal-fav-btn');
  if (!favBtn) return;
  favBtn.classList.toggle('active', isFav);
  favBtn.setAttribute('aria-label', isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti');
  favBtn.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentModalId = null;
}

/* ── Toast ── */
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-dot" aria-hidden="true"></span>${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 320);
  }, 3200);
}

/* ── Scroll behaviors ── */
function setupScrollBehavior() {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';

    backToTopBtn.classList.toggle('visible', scrolled > 400);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Newsletter ── */
function setupNewsletter() {
  document.getElementById('newsletter-btn').addEventListener('click', () => {
    const input = document.querySelector('.newsletter input');
    const email = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      showToast('Inserisci un indirizzo email valido', 'error');
      return;
    }
    input.value = '';
    showToast(`Iscrizione confermata per ${email} 🎉`, 'success');
  });
}
