/**
 * CATHARSIS FARM - Full Animation Script 2026
 * Оптимизация: Статичные карточки + Динамический фон
 */

// 1. Регистрация плагина ScrollTrigger
if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

window.addEventListener('load', () => {
    // Проверка наличия GSAP
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("Критическая ошибка: GSAP или ScrollTrigger не найдены.");
        return;
    }

    // --- 1. HERO: АМЕТИСТОВЫЕ ЧАСТИЦЫ (Canvas 2D) ---
    const canvas = document.getElementById('particleCanvas');
    let isCanvasActive = true;

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.spX = Math.random() * 0.4 - 0.2;
                this.spY = Math.random() * 0.4 - 0.2;
                this.opacity = Math.random() * 0.5;
            }
            update() {
                this.x += this.spX;
                this.y += this.spY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                // Используем фиолетовый цвет частиц для Hero
                ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animateParticles() {
            if (!isCanvasActive) return; 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Оптимизация: выключаем канвас, когда скроллим вниз
        ScrollTrigger.create({
            trigger: ".home-section",
            start: "top top",
            end: "bottom top",
            onLeave: () => isCanvasActive = false,
            onEnterBack: () => { isCanvasActive = true; animateParticles(); }
        });
    }

    // --- 2. ПЛАВАЮЩИЕ БЕЛЫЕ SVG-ИКОНКИ (Везде) ---
    function initFloatingIcons() {
        const icons = gsap.utils.toArray('.float-icon');
        
        icons.forEach((icon) => {
            // Хаотичное "дыхание" (движение)
            gsap.to(icon, {
                x: `+=${gsap.utils.random(20, 45)}`,
                y: `+=${gsap.utils.random(25, 55)}`,
                rotation: gsap.utils.random(-20, 20),
                duration: gsap.utils.random(5, 9),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                force3D: true
            });

            // Мерцание белого неона
            gsap.to(icon, {
                opacity: gsap.utils.random(0.12, 0.25),
                duration: gsap.utils.random(2, 4),
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        });
    }
    initFloatingIcons();

    // --- 3. МЫШЬ: СВЕЧЕНИЕ И ПАРАЛЛАКС ---
    const glow = document.querySelector('.cursor-glow');
    
    window.addEventListener('mousemove', (e) => {
        // Движение пятна света (Glow)
        if (glow) {
            gsap.to(glow, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
            });
        }

        // Мягкий параллакс элементов в Hero
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        gsap.to(".hero-content", { x: moveX, y: moveY, duration: 1, overwrite: "auto" });
        gsap.to(".section-decor", { x: moveX * 0.7, y: moveY * 0.7, duration: 1.5, overwrite: "auto" });
        gsap.to(".t-left", { x: -moveX * 2, y: -moveY * 2, duration: 1.3 });
        gsap.to(".b-right", { x: moveX * 2, y: moveY * 2, duration: 1.3 });
    });

    // --- 4. ЛОКАЛЬНЫЙ КИБЕРПАНК-ФОН (Только секция Product) ---
    
    // Движение сетки при скролле
    gsap.to(".product-section .bg-grid", {
        scrollTrigger: {
            trigger: ".product-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5
        },
        y: -100,
        ease: "none"
    });

    // Появление фиолетовых облаков (blobs)
    gsap.from(".product-section .blob", {
        scrollTrigger: {
            trigger: ".product-section",
            start: "top 75%",
        },
        autoAlpha: 0,
        scale: 0.7,
        duration: 2.5,
        stagger: 0.4,
        ease: "power2.out"
    });
    gsap.to(".product-section .bg-icons", {
    scrollTrigger: {
        trigger: ".product-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5 // Иконки будут плавно "плавать" при движении страницы
    },
    y: -60,
    ease: "none"
});

    // --- 5. ФИНАЛЬНЫЙ FIX ТРИГГЕРОВ ---
    // Даем браузеру 400мс на отрисовку всего контента и пересчитываем координаты
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 400);
});