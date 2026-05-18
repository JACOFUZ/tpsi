// --- STATO GLOBALE E UTILITY ---
const state = {
    products: [],
    cart: JSON.parse(localStorage.getItem('cart')) || []
};

// Mostra Notifica Toast (sostituisce gli alert)
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') toast.style.borderLeftColor = 'var(--danger)';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Aggiorna Badge Carrello e Nome Store
function updateUI() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantita, 0);
        badge.textContent = totalItems;
    }

    const storeNameDisplay = document.getElementById('store-name-display');
    const storeName = localStorage.getItem('storeName');
    if (storeNameDisplay && storeName) {
        storeNameDisplay.textContent = storeName;
    }
}

// Parsing base del CSV (separatore virgola)
async function fetchProducts() {
    try {
        const response = await fetch('prodotti.csv');
        if (!response.ok) throw new Error("Impossibile caricare il CSV. Sei su un server locale?");
        const text = await response.text();
        
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const products = [];
        
        // Salta l'intestazione (indice 0)
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            if (row.length >= 6) {
                products.push({
                    id: row[0].trim(),
                    marca: row[1].trim(),
                    nome: row[2].trim(),
                    descrizione: row[3].trim(),
                    immagine: row[4].trim(),
                    prezzo: parseFloat(row[5].trim())
                });
            }
        }
        state.products = products;
        return products;
    } catch (error) {
        showToast(error.message, 'error');
        console.error(error);
        return [];
    }
}

// --- LOGICA SPECIFICA PER PAGINA ---

// INI.HTML
function initSetup() {
    const form = document.getElementById('setup-form');
    if (!form) return;
    
    // Prepopola se esiste
    document.getElementById('store-name').value = localStorage.getItem('storeName') || '';
    document.getElementById('store-category').value = localStorage.getItem('storeCategory') || '';

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('store-name').value;
        const category = document.getElementById('store-category').value;
        
        localStorage.setItem('storeName', name);
        localStorage.setItem('storeCategory', category);
        
        showToast('Configurazione salvata!');
        setTimeout(() => window.location.href = 'index.html', 1000);
    });
}

// INDEX.HTML
async function initCatalog() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    if (!localStorage.getItem('storeName')) {
        window.location.href = 'ini.html'; // Redirige se non configurato
        return;
    }

    const products = await fetchProducts();
    grid.innerHTML = ''; // Svuota eventuale loading

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = `assets/${p.immagine}`;
        img.className = 'card-img';
        img.alt = p.nome;

        const content = document.createElement('div');
        content.className = 'card-content';

        const brand = document.createElement('span');
        brand.className = 'card-brand';
        brand.textContent = p.marca;

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = p.nome;

        const desc = document.createElement('p');
        desc.className = 'card-desc';
        desc.textContent = p.descrizione;

        const price = document.createElement('div');
        price.className = 'card-price';
        price.textContent = `€${p.prezzo.toFixed(2)}`;

        const btn = document.createElement('a');
        btn.className = 'btn';
        btn.href = `prodotto.html?id=${p.id}`;
        btn.textContent = 'Dettagli Prodotto';

        content.appendChild(brand);
        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(price);
        content.appendChild(btn);

        card.appendChild(img);
        card.appendChild(content);
        grid.appendChild(card);
    });
}

// PRODOTTO.HTML
async function initProductDetail() {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (!idParam) {
        container.textContent = "Prodotto non trovato.";
        return;
    }

    const products = await fetchProducts();
    const prodotto = products.find(p => p.id === idParam);

    if (!prodotto) {
        container.textContent = "Prodotto non trovato.";
        return;
    }

    // Costruzione UI tramite createElement
    const wrapper = document.createElement('div');
    wrapper.className = 'product-detail';

    const img = document.createElement('img');
    img.src = `assets/${prodotto.immagine}`;
    img.className = 'detail-img';
    img.alt = prodotto.nome;

    const info = document.createElement('div');
    info.className = 'detail-info';

    const brand = document.createElement('h4');
    brand.className = 'card-brand';
    brand.textContent = prodotto.marca;

    const title = document.createElement('h2');
    title.textContent = prodotto.nome;

    const desc = document.createElement('p');
    desc.textContent = prodotto.descrizione;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `€${prodotto.prezzo.toFixed(2)}`;

    const btnAdd = document.createElement('button');
    btnAdd.className = 'btn';
    btnAdd.textContent = 'Aggiungi al carrello';
    btnAdd.onclick = () => {
        addToCart(prodotto);
        showToast(`${prodotto.nome} aggiunto al carrello!`);
    };

    info.appendChild(brand);
    info.appendChild(title);
    info.appendChild(desc);
    info.appendChild(price);
    info.appendChild(btnAdd);

    wrapper.appendChild(img);
    wrapper.appendChild(info);
    
    container.innerHTML = '';
    container.appendChild(wrapper);
}

// CARRELLO.HTML
function initCart() {
    const container = document.getElementById('cart-container');
    if (!container) return;
    renderCart();

    const btnClear = document.getElementById('btn-clear-cart');
    const btnPdf = document.getElementById('btn-checkout');

    if(btnClear) btnClear.onclick = () => {
        state.cart = [];
        saveCart();
        renderCart();
        showToast('Carrello svuotato', 'error');
    };

    if(btnPdf) btnPdf.onclick = generatePDF;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-total');
    if (!container || !summary) return;

    container.innerHTML = '';
    let total = 0;

    if (state.cart.length === 0) {
        container.textContent = "Il carrello è vuoto.";
        summary.textContent = "0.00";
        return;
    }

    state.cart.forEach((item, index) => {
        total += item.prezzo * item.quantita;

        const div = document.createElement('div');
        div.className = 'cart-item';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'cart-item-info';

        const img = document.createElement('img');
        img.src = `assets/${item.immagine}`;
        img.className = 'cart-item-img';

        const textDiv = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = `${item.marca} ${item.nome}`;
        const details = document.createElement('div');
        details.textContent = `€${item.prezzo.toFixed(2)} x ${item.quantita}`;
        
        textDiv.appendChild(title);
        textDiv.appendChild(details);
        infoDiv.appendChild(img);
        infoDiv.appendChild(textDiv);

        const btnRemove = document.createElement('button');
        btnRemove.className = 'btn btn-danger';
        btnRemove.textContent = 'Rimuovi';
        btnRemove.onclick = () => {
            state.cart.splice(index, 1);
            saveCart();
            renderCart();
            showToast('Prodotto rimosso', 'error');
        };

        div.appendChild(infoDiv);
        div.appendChild(btnRemove);
        container.appendChild(div);
    });

    summary.textContent = total.toFixed(2);
}

function addToCart(prodotto) {
    const existing = state.cart.find(item => item.id === prodotto.id);
    if (existing) {
        existing.quantita += 1;
    } else {
        state.cart.push({ ...prodotto, quantita: 1 });
    }
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
    updateUI();
}

// Generazione PDF Ordine con jsPDF
function generatePDF() {
    if (state.cart.length === 0) {
        showToast('Carrello vuoto, impossibile generare ordine', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const storeName = localStorage.getItem('storeName') || 'Store';
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(138, 43, 226); // Viola
    doc.text(`Ordine - ${storeName}`, 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.line(14, 35, 196, 35); // Linea divisoria

    let y = 45;
    let totale = 0;

    // Intestazione tabella manuale
    doc.setFont(undefined, 'bold');
    doc.text("Prodotto", 14, y);
    doc.text("Q.tà", 130, y);
    doc.text("Prezzo", 150, y);
    doc.text("Subtot", 180, y);
    y += 10;
    doc.setFont(undefined, 'normal');

    state.cart.forEach(item => {
        // Controllo cambio pagina
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        const subtot = item.prezzo * item.quantita;
        totale += subtot;

        doc.text(`${item.marca} ${item.nome}`.substring(0, 45), 14, y); // Taglia nomi troppo lunghi
        doc.text(`${item.quantita}`, 130, y);
        doc.text(`€${item.prezzo.toFixed(2)}`, 150, y);
        doc.text(`€${subtot.toFixed(2)}`, 180, y);
        
        y += 10;
    });

    doc.line(14, y, 196, y);
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text(`TOTALE ORDINE: €${totale.toFixed(2)}`, 14, y);

    doc.save(`ordine_${Date.now()}.pdf`);
    showToast('PDF generato con successo!');
    
    // Opzionale: svuota carrello dopo l'acquisto
    // state.cart = []; saveCart(); renderCart();
}

// Inizializzazione globale
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    initSetup();
    initCatalog();
    initProductDetail();
    initCart();
});
