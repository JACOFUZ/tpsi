document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader
    const loader = document.querySelector('.loader');
    const bar = document.querySelector('.loader-bar');
    let p = 0;
    const interval = setInterval(() => {
        p += Math.random() * 30;
        if(p >= 100) {
            p = 100;
            clearInterval(interval);
            setTimeout(() => loader.classList.add('gone'), 500);
        }
        bar.style.width = p + '%';
    }, 150);

    // 2. Custom Cursor
    const cursor = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });

    document.querySelectorAll('a, button, .collage-item').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    // 3. Header Scroll
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 4. Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if(en.isIntersecting) en.target.classList.add('in');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[class*="js-reveal-"]').forEach(el => observer.observe(el));

    // 5. Menu Toggle
    const ham = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-dropdown');
    ham.addEventListener('click', () => {
        const isHidden = nav.hasAttribute('hidden');
        if(isHidden) nav.removeAttribute('hidden');
        else nav.setAttribute('hidden', '');
    });

    // 6. Portfolio Filters
    const fBtns = document.querySelectorAll('.f-btn');
    const items = document.querySelectorAll('.collage-item');
    fBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            fBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            items.forEach(item => {
                item.style.display = (f === 'all' || item.dataset.cat === f) ? 'block' : 'none';
            });
        });
    });
});
