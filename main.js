// Hide .pre-nav and pin .nav to the top on scroll And otherway around
document.addEventListener('DOMContentLoaded', () => {
    let lastScroll = 0;
    let threshold = 200;
    const preNav = document.querySelector('.pre-nav');
    const mainNav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > threshold && currentScroll > lastScroll) {
            preNav.classList.add('pre-nav-hidden');
            mainNav.classList.add('main-nav-fixed');
        } else if (currentScroll < lastScroll) {
            preNav.classList.remove('pre-nav-hidden');
            mainNav.classList.remove('main-nav-fixed');
        }
        lastScroll = currentScroll;
    });
});


// Mouse Pointer Effect - Display Numbers Instead of Squares
let number = 1;
function spark(event){
    let i = document.createElement("span");
    i.classList.add("spark"); // Adding class to the created element
    i.textContent = number++; // Display incrementing number
    
    // Reset number to 1 when it reaches 1000
    if (number > 9999) {
        number = 1;
    }
    
    i.style.left = (event.pageX) + "px";
    i.style.top = (event.pageY) + "px";
    i.style.scale = `${Math.random() * 1.5 }`;
    i.style.setProperty('--x', getRandomTransitionValue());
    i.style.setProperty('--y', getRandomTransitionValue());

    document.body.appendChild(i);
    
    setTimeout(() => {
    if (i.parentElement) {
        document.body.removeChild(i);
    }
    }, 2000);
}
function getRandomTransitionValue(){
    return `${Math.random() * 75 - 10}px`;
}
document.addEventListener("mousemove", spark);

// Intersection Observer for section animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all section cards
document.addEventListener('DOMContentLoaded', () => {
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => observer.observe(card));
});

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target === 95) {
            element.textContent = Math.floor(current) + '%';
        } else if (target === 10000) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        } else {
            element.textContent = current.toFixed(0);
        }
    }, 16);
}

// Initialize counters when about section is visible
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((stat, index) => {
                    const targets = [5000, 75, 24];
                    setTimeout(() => {
                        animateCounter(stat, targets[index]);
                    }, index * 200);
                });
                aboutObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    aboutObserver.observe(aboutSection);
}

// Particle effect for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #6b61f8;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.6;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            z-index: 1;
        `;
        hero.appendChild(particle);
    }
}

// Add particle animation CSS
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes floatParticle {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
        50% { transform: translateY(-100px) rotate(180deg); opacity: 1; }
        100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(particleStyles);

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 100);
        }, 1000);
    }
});

// Add glitch effect to icons on hover
document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.section-icon, .tech-icon i, .flow-icon i');
    
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.animation = 'glitch 0.5s ease-in-out';
        });
        
        icon.addEventListener('animationend', () => {
            icon.style.animation = '';
        });
    });
});

// Add glitch animation CSS
const glitchStyles = document.createElement('style');
glitchStyles.textContent = `
    @keyframes glitch {
        0%, 100% { transform: translate(0); }
        10% { transform: translate(-2px, 2px); }
        20% { transform: translate(2px, -2px); }
        30% { transform: translate(-2px, -2px); }
        40% { transform: translate(2px, 2px); }
        50% { transform: translate(-2px, 2px); }
        60% { transform: translate(2px, -2px); }
        70% { transform: translate(-2px, -2px); }
        80% { transform: translate(2px, 2px); }
        90% { transform: translate(-2px, 2px); }
    }
`;
document.head.appendChild(glitchStyles);

// Initialize Three.js icon in hero section
function initThreeIcon() {
    const canvas = document.getElementById('three-icon');
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.width, canvas.height);

    // Build a line chart geometry with streaming data
    const pointCount = 30;
    const spacing = 0.3;
    const positions = new Float32Array(pointCount * 3);
    const initialY = () => Math.sin(Math.random() * 2 * Math.PI) * 1.2;
    for (let i = 0; i < pointCount; i++) {
        positions[i * 3] = (i - pointCount / 2) * spacing;
        positions[i * 3 + 1] = initialY();
        positions[i * 3 + 2] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: 0x6b61f8, linewidth: 2, transparent: true });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Add data point markers
    // Helper: create circular texture for point markers
    function generateCircleTexture(color = '#ffffff', size = 64) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        return new THREE.CanvasTexture(canvas);
    }

    const circleTex = generateCircleTexture('#6b61f8');
    const pointsMaterial = new THREE.PointsMaterial({ map: circleTex, size: 0.5, alphaTest: 0.5, transparent: true });
    const pointsMesh = new THREE.Points(geometry, pointsMaterial);
    scene.add(pointsMesh);

    // Add axes
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
    // X Axis
    const xAxisPoints = [
        new THREE.Vector3(-pointCount/2 * spacing, 0, 0),
        new THREE.Vector3(pointCount/2 * spacing, 0, 0)
    ];
    const xAxis = new THREE.Line(new THREE.BufferGeometry().setFromPoints(xAxisPoints), axisMaterial);
    scene.add(xAxis);
    // Y Axis
    const yAxisPoints = [
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(0, 1.5, 0)
    ];
    const yAxis = new THREE.Line(new THREE.BufferGeometry().setFromPoints(yAxisPoints), axisMaterial);
    scene.add(yAxis);

    let tick = 0; // for throttling updates

    function animateIcon() {
        requestAnimationFrame(animateIcon);
        tick++;
        if (tick % 20 === 0) { // update every 20 frames
            // shift Y values left
            for (let i = 0; i < pointCount - 1; i++) {
                positions[i * 3 + 1] = positions[(i + 1) * 3 + 1];
            }
            // add new random value at end
            const newY = Math.sin(Date.now() * 0.002) * 1.2 + (Math.random() - 0.5) * 0.2;
            positions[(pointCount - 1) * 3 + 1] = newY;
            geometry.attributes.position.needsUpdate = true;
        }
        renderer.render(scene, camera);
    }
    animateIcon();
}
document.addEventListener('DOMContentLoaded', initThreeIcon);

// About page specific functionality
document.addEventListener('DOMContentLoaded', () => {
    // Only run about page scripts if we're on the about page
    if (window.location.pathname.includes('about.html') || document.querySelector('.about-content')) {
        initAboutPageAnimations();
    }
});

function initAboutPageAnimations() {
    // Animate stat numbers when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe all stat numbers
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(stat => statsObserver.observe(stat));

    // Add floating animation to about cards on scroll
    const aboutCardsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.style.animation + ', float 3s ease-in-out infinite';
            }
        });
    }, { threshold: 0.3 });

    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach(card => aboutCardsObserver.observe(card));

    // Timeline animation
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const timelineItems = entry.target.querySelectorAll('.timeline-item');
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                        item.style.transition = 'all 0.6s ease-out';
                    }, index * 300);
                });
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const timeline = document.querySelector('.timeline');
    if (timeline) {
        // Initially hide timeline items
        const timelineItems = timeline.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
        });
        timelineObserver.observe(timeline);
    }

    // Future items staggered animation
    const futureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const futureItems = entry.target.querySelectorAll('.future-item');
                futureItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = 'all 0.6s ease-out';
                    }, index * 200);
                });
                futureObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const futureGrid = document.querySelector('.future-grid');
    if (futureGrid) {
        // Initially hide future items
        const futureItems = futureGrid.querySelectorAll('.future-item');
        futureItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
        });
        futureObserver.observe(futureGrid);
    }

    // Add interactive effects to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-3px) scale(1.05)';
            tag.style.boxShadow = '0 5px 15px rgba(107, 97, 248, 0.3)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) scale(1)';
            tag.style.boxShadow = 'none';
        });
    });

    // Add parallax effect to floating elements
    const floatingElements = document.querySelectorAll('.float-item');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Add typewriter effect to hero title
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        typeWriterEffect(heroTitle, 'About This Project', 100);
    }

    // Developer card hover effect
    const developerCard = document.querySelector('.developer-card');
    if (developerCard) {
        developerCard.addEventListener('mouseenter', () => {
            const avatar = developerCard.querySelector('.avatar-placeholder');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(5deg)';
                avatar.style.transition = 'transform 0.3s ease';
            }
        });
        
        developerCard.addEventListener('mouseleave', () => {
            const avatar = developerCard.querySelector('.avatar-placeholder');
            if (avatar) {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    }
}

function animateStatNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format different types of numbers
        if (target === 95) {
            element.textContent = Math.floor(current) + '%';
        } else if (target === 1000) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        } else if (target === 24) {
            element.textContent = Math.floor(current) + '/7';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
    
    // Add scale animation
    element.style.animation = 'countUp 2s ease-out';
}

function typeWriterEffect(element, text, speed = 100) {
    const originalText = element.textContent;
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 500); // Small delay before starting
}

// Add tilt effect to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.about-card, .developer-card, .future-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
});

// Add sparkle effect when clicking on elements
document.addEventListener('click', (e) => {
    if (e.target.closest('.about-card, .developer-card, .future-item, .skill-tag')) {
        createSparkleEffect(e.pageX, e.pageY);
    }
});

function createSparkleEffect(x, y) {
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        sparkle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: #6b61f8;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: sparkleExplosion 0.8s ease-out forwards;
            transform: rotate(${i * 60}deg);
        `;
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentElement) {
                document.body.removeChild(sparkle);
            }
        }, 800);
    }
}

// Add sparkle animation CSS
const sparkleStyles = document.createElement('style');
sparkleStyles.textContent = `
    @keyframes sparkleExplosion {
        0% {
            transform: translateX(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateX(50px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyles);