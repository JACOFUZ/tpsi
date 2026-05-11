// Dati fittizi dei prodotti
const products = [
    { id: 1, name: "Cuffie Noise Cancelling", category: "audio", price: 299.99, desc: "Cuffie over-ear con cancellazione attiva del rumore.", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Smartwatch Pro", category: "wearable", price: 199.99, desc: "Monitoraggio fitness avanzato e notifiche smart.", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Speaker Bluetooth", category: "audio", price: 89.99, desc: "Speaker portatile impermeabile con bassi potenti.", img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Lampada Smart RGB", category: "smart-home", price: 45.00, desc: "Controlla la luce della tua stanza tramite app.", img: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80" },
    { id: 5, name: "Fitness Band", category: "wearable", price: 39.99, desc: "Leggera, traccia passi e sonno.", img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b9?auto=format&fit=crop&w=400&q=80" },
    { id: 6, name: "Termostato Wi-Fi", category: "smart-home", price: 150.00, desc: "Risparmia energia con il controllo intelligente.", img: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=400&q=80" }
];

// Stato dell'applicazione
let favorites = JSON.parse(localStorage.getItem('techFavorites')) || [];
let currentView = 'home';
let showingFavoritesOnly = false;

// Elementi DOM
const productGrid = document.getElementById('product-grid');
const searchBar = document.getElementById('search-bar');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
const btnReset = document.getElementById('reset-filters');
const modal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.querySelector('.close-modal');

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateFavCount();
    setupNavigation();
    setupHamburger();
    setupFilters();
    setupModal();
});

// 1. Navigazione SPA
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            if (targetId === 'favorites') {
                showingFavoritesOnly = true;
                switchSection('catalog');
                applyFilters();
            } else {
                showingFavoritesOnly = false;
                switchSection(targetId);
                if (targetId === 'catalog') applyFilters();
            }
            // Chiudi menu hamburger su mobile
            document.querySelector('.nav-links').classList.remove('active');
        });
    });
}

function switchSection(sectionId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active-section'));
    document.getElementById(sectionId).classList.add('active-section');
}

// 2. Render dei Prodotti in Sicurezza (No innerHTML per dati)
function renderProducts(productsToRender) {
    productGrid.innerHTML = ''; // Svuoto in modo sicuro il contenitore
    
    if (!productsToRender || productsToRender.length === 0) {
        const msg = document.createElement('p');
        msg.textContent = "Nessun prodotto trovato.";
        productGrid.appendChild(msg);
        return;
    }

    productsToRender.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = prod.img;
        img.alt = prod.name;
        img.loading = "lazy";

        const content = document.createElement('div');
        content.className = 'card-content';

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = prod.name;

        const price = document.createElement('p');
        price.className = 'card-price';
        price.textContent = `€${prod.price.toFixed(2)}`;

        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const btnDetails = document.createElement('button');
        btnDetails.className = 'btn-details';
        btnDetails.textContent = 'Dettagli';
        btnDetails.onclick = () => openModal(prod);

        const btnFav = document.createElement('button');
        btnFav.className = `btn-fav ${favorites.includes(prod.id) ? 'active' : ''}`;
        btnFav.textContent = favorites.includes(prod.id) ? '♥ Rimuovi' : '♡ Preferito';
        btnFav.onclick = () => toggleFavorite(prod.id, btnFav);

        actions.append(btnDetails, btnFav);
        content.append(title, price, actions);
        card.append(img, content);
        productGrid.appendChild(card);
    });
}

// 3. Filtri, Ricerca e Ordinamento
function setupFilters() {
    searchBar.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    btnReset.addEventListener('click', () => {
        searchBar.value = '';
        categoryFilter.value = 'all';
        sortSelect.value = 'default';
        applyFilters();
    });
}

function applyFilters() {
    const searchTerm = searchBar.value.toLowerCase();
    const category = categoryFilter.value;
    const sortVal = sortSelect.value;

    let filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm);
        const matchCat = category === 'all' || p.category === category;
        const matchFav = showingFavoritesOnly ? favorites.includes(p.id) : true;
        return matchSearch && matchCat && matchFav;
    });

    if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortVal === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

    renderProducts(filtered);
}

// 4. Preferiti e LocalStorage
function toggleFavorite(id, btnElement) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Rimosso dai preferiti');
    } else {
        favorites.push(id);
        showToast('Aggiunto ai preferiti');
    }
    localStorage.setItem('techFavorites', JSON.stringify(favorites));
    updateFavCount();
    
    // Aggiorna UI del pulsante o rimuovi se siamo nella vista preferiti
    if (showingFavoritesOnly) {
        applyFilters();
    } else {
        btnElement.classList.toggle('active');
        btnElement.textContent = favorites.includes(id) ? '♥ Rimuovi' : '♡ Preferito';
    }
}

function updateFavCount() {
    document.getElementById('fav-count').textContent = favorites.length;
}

// 5. Modale Dettagli (Gestione ESC e Click Outside)
function setupModal() {
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });
}

function openModal(prod) {
    modalBody.innerHTML = ''; // Reset sicuro
    
    const img = document.createElement('img');
    img.src = prod.img;
    img.className = 'modal-img';
    img.alt = prod.name;

    const title = document.createElement('h2');
    title.textContent = prod.name;

    const price = document.createElement('p');
    price.innerHTML = `<strong>Prezzo:</strong> €${prod.price.toFixed(2)}`;

    const desc = document.createElement('p');
    desc.textContent = prod.desc;

    modalBody.append(img, title, price, desc);
    
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    closeModalBtn.focus();
}

function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
}

// 6. Tema Dark/Light
function initTheme() {
    const savedTheme = localStorage.getItem('techTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('techTheme', next);
    });
}

// 7. Toast Notifications
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 8. Hamburger Menu Responsive
function setupHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });
}
