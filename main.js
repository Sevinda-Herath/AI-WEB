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
                    const targets = [10000, 95, 24];
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