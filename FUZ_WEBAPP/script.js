/**
 * JACOPO FUSÉ — script.js
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LOADER DINAMICO
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loader-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if(progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('gone');
                document.body.style.overflow = 'auto';
            }, 500);
        }
        bar.style.width = progress + '%';
    }, 120);

    // 2. HERO LIQUID CANVAS (Effetto Blob Inseguimento)
    const canvas = document.getElementById('hero-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let blobX = mouse.x, blobY = mouse.y;

        const resize = () => { 
            w = canvas.width = window.innerWidth; 
            h = canvas.height = window.innerHeight; 
        };
        window.addEventListener('resize', resize); resize();
        window.addEventListener('mousemove', e => { 
            mouse.x = e.clientX; 
            mouse.y = e.clientY; 
        });

        function animateBlob() {
            ctx.clearRect(0, 0, w, h);
            // Inseguimento morbido dei movimenti
            blobX += (mouse.x - blobX) * 0.08;
            blobY += (mouse.y - blobY) * 0.08;
            
            const gradient = ctx.createRadialGradient(blobX, blobY, 0, blobX, blobY, 300);
            gradient.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(blobX, blobY, 300, 0, Math.PI * 2);
            ctx.fill();
            requestAnimationFrame(animateBlob);
        }
        animateBlob();
    }

    // 3. CURSORE PERSONALIZZATO
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if(cursor && ring) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = ring.style.left = e.clientX + 'px';
            cursor.style.top = ring.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('a, button, .collage-item, .price-card').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
        });
    }

    // 4. HEADER SCROLL EFFECT
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 60) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }, {passive: true});

    // 5. MENU TOGGLE (NAV DROPDOWN)
    const hamburger = document.getElementById('hamburger');
    const dropdown = document.getElementById('nav-dropdown');
    if(hamburger && dropdown) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = dropdown.hasAttribute('hidden');
            if(isHidden) dropdown.removeAttribute('hidden');
            else dropdown.setAttribute('hidden', '');
        });
        
        document.addEventListener('click', (e) => {
            if(!dropdown.contains(e.target)) dropdown.setAttribute('hidden', '');
        });

        // Chiudi menu al click sui link
        dropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => dropdown.setAttribute('hidden', ''));
        });
    }

    // 6. INTERSECTION OBSERVER (Animazioni al caricamento sezioni)
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[class*="js-reveal"]').forEach(el => observer.observe(el));

    // 7. PORTFOLIO FILTERS
    const filters = document.querySelectorAll('.f-btn');
    const items = document.querySelectorAll('.collage-item');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.filter;
            items.forEach(item => {
                if(cat === 'all' || item.dataset.cat === cat) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
});
