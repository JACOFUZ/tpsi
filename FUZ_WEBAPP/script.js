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

    // 2. HERO LIQUID CANVAS (Matematica avanzata per effetto blob)
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
            // Inseguimento morbido
            blobX += (mouse.x - blobX) * 0.08;
            blobY += (mouse.y - blobY) * 0.08;
            
            const gradient = ctx.createRadialGradient(blobX, blobY, 0, blobX, blobY, 250);
            gradient.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(blobX, blobY, 250, 0, Math.PI * 2);
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
        document.querySelectorAll('a, button, .price-card').forEach(el => {
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

    // 5. MENU TOGGLE
    const hamburger = document.getElementById('hamburger');
    const dropdown = document.getElementById('nav-dropdown');
    if(hamburger && dropdown) {
        hamburger.addEventListener('click', () => {
            dropdown.toggleAttribute('hidden');
        });
        // Chiudi al click fuori
        document.addEventListener('click', (e) => {
            if(!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.setAttribute('hidden', '');
            }
        });
    }

    // 6. INTERSECTION OBSERVER (Animazioni al caricamento)
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[class*="js-reveal"]').forEach(el => observer.observe(el));

    // 7. FORM SUBMISSION (Toast fake)
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    if(form && toast) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.reset();
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        });
    }
});
