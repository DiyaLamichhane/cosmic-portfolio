// script.js - Interactive Galaxy Background & Navigation

// Galaxy Canvas Animation
(function() {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let shootingStars = [];
    let nebulae = [];
    let time = 0;
    
    const STAR_COUNT = 800;
    const NEBULA_COUNT = 8;
    
    // Initialize stars
    function initStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random(),
                radius: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: 0.003 + Math.random() * 0.015,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    // Initialize nebulae (colorful clouds)
    function initNebulae() {
        nebulae = [];
        for (let i = 0; i < NEBULA_COUNT; i++) {
            const colors = [
                { h: 260, s: 60, l: 25 }, // purple
                { h: 280, s: 70, l: 20 }, // magenta
                { h: 220, s: 65, l: 20 }, // blue
                { h: 300, s: 55, l: 22 }  // pink
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            nebulae.push({
                x: Math.random(),
                y: Math.random(),
                radius: 0.15 + Math.random() * 0.25,
                hue: color.h,
                sat: color.s,
                light: color.l,
                alpha: 0.08 + Math.random() * 0.1
            });
        }
    }
    
    // Draw background gradient
    function drawBackground() {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#020217');
        grad.addColorStop(0.4, '#08052a');
        grad.addColorStop(0.7, '#030318');
        grad.addColorStop(1, '#01010f');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }
    
    // Draw nebulae
    function drawNebulae() {
        for (let nebula of nebulae) {
            const x = nebula.x * width;
            const y = nebula.y * height;
            const radius = nebula.radius * Math.min(width, height);
            
            const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
            grad.addColorStop(0, `hsla(${nebula.hue}, ${nebula.sat}%, ${nebula.light + 10}%, ${nebula.alpha * 1.5})`);
            grad.addColorStop(0.5, `hsla(${nebula.hue}, ${nebula.sat}%, ${nebula.light}%, ${nebula.alpha})`);
            grad.addColorStop(1, `hsla(${nebula.hue}, ${nebula.sat}%, ${nebula.light - 10}%, 0)`);
            
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
    }
    
    // Draw stars with twinkling
    function drawStars() {
        for (let star of stars) {
            const x = star.x * width;
            const y = star.y * height;
            const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.phase);
            const alpha = star.alpha * twinkle;
            
            ctx.beginPath();
            ctx.arc(x, y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 245, 220, ${alpha})`;
            ctx.fill();
            
            // Add glow to larger stars
            if (star.radius > 1.2) {
                ctx.beginPath();
                ctx.arc(x, y, star.radius * 1.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 170, 255, ${alpha * 0.3})`;
                ctx.fill();
            }
        }
    }
    
    // Create shooting star
    function createShootingStar() {
        if (Math.random() < 0.005) {
            shootingStars.push({
                x: Math.random() * width,
                y: Math.random() * height * 0.3,
                vx: 5 + Math.random() * 8,
                vy: 3 + Math.random() * 6,
                life: 1.0,
                length: 20 + Math.random() * 15
            });
        }
    }
    
    // Update and draw shooting stars
    function updateShootingStars() {
        for (let i = 0; i < shootingStars.length; i++) {
            const s = shootingStars[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= 0.02;
            
            if (s.x > width + 100 || s.y > height + 100 || s.x < -100 || s.life <= 0) {
                shootingStars.splice(i, 1);
                i--;
                continue;
            }
            
            // Draw trail
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x - s.vx * s.length, s.y - s.vy * s.length);
            ctx.strokeStyle = `rgba(255, 220, 150, ${s.life * 0.8})`;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            
            // Draw head
            ctx.beginPath();
            ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 100, ${s.life})`;
            ctx.fill();
        }
    }
    
    // Resize handler
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    // Animation loop
    function animate() {
        if (!ctx) return;
        
        drawBackground();
        drawNebulae();
        drawStars();
        createShootingStar();
        updateShootingStars();
        
        time += 0.02;
        requestAnimationFrame(animate);
    }
    
    // Initialize
    function init() {
        resizeCanvas();
        initStars();
        initNebulae();
        animate();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            initStars();
            initNebulae();
        });
    }
    
    init();
})();

// Navigation & Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
        
        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });
    }
    
    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href')?.substring(1);
            if (href === current) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
    
    // Add animation to skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                observer.unobserve(bar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
});