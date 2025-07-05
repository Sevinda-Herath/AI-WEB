// Hide .pre-nav and pin .nav to the top on scroll And otherway around
document.addEventListener('DOMContentLoaded', () => {
    let lastScroll = 0;
    let threshold = 400;
    const preNav = document.querySelector('.pre-nav');
    const mainNav = document.querySelector('.nav');

    // Enhanced navigation entrance animation
    function initNavAnimations() {
        // Add a subtle entrance delay for better visual flow
        const navLinks = document.querySelectorAll('.nav-links li');
        navLinks.forEach((link, index) => {
            link.style.animationDelay = `${0.8 + (index * 0.2)}s`;
        });

        // Add intersection observer for nav re-animation on scroll
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    entry.target.classList.add('nav-visible');
                } else {
                    entry.target.classList.remove('nav-visible');
                }
            });
        }, {
            threshold: [0.3, 0.7]
        });

        if (mainNav) {
            navObserver.observe(mainNav);
        }
    }

    // Initialize nav animations
    initNavAnimations();

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

    // Enhanced Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Add staggered animation for mobile nav links
            if (navLinks.classList.contains('active')) {
                const mobileLinks = navLinks.querySelectorAll('li');
                mobileLinks.forEach((link, index) => {
                    link.style.opacity = '0';
                    link.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        link.style.transition = 'all 0.3s ease';
                        link.style.opacity = '1';
                        link.style.transform = 'translateX(0)';
                    }, index * 100 + 100);
                });
            }
        });

        // Close mobile menu when clicking on a link
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
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

// Architecture Animation Enhancement
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Architecture Animation
    const architectureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a delay before starting the sequential animation
                setTimeout(() => {
                    startArchitectureAnimation();
                    // Start data transfer animation after architecture animation
                    startDataTransferAnimation();
                }, 200);
                architectureObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    // Observe the architecture section
    const architectureSection = document.querySelector('.architecture');
    if (architectureSection) {
        architectureObserver.observe(architectureSection);
    }

    function startArchitectureAnimation() {
        const steps = document.querySelectorAll('.architecture-step');
        const arrows = document.querySelectorAll('.arrow-container');

        // Reset all elements
        [...steps, ...arrows].forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        });

        // Animate elements in sequence
        animateElement(steps[0], 0);
        animateElement(arrows[0], 500);
        animateElement(steps[1], 1000);
        animateElement(arrows[1], 1500);
        animateElement(steps[2], 2000);
    }

    function animateElement(element, delay) {
        if (!element) return;
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Add a subtle bounce effect for icons
            if (element.classList.contains('architecture-step')) {
                const icon = element.querySelector('.arch-icon');
                if (icon) {
                    setTimeout(() => {
                        icon.style.animation = 'bounceIcon 0.6s ease-out';
                    }, 400);
                }
            }
        }, delay);
    }

    // Add hover effects for architecture steps
    const archSteps = document.querySelectorAll('.architecture-step');
    archSteps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            const icon = step.querySelector('.arch-icon');
            if (icon) {
                icon.style.transform = 'translateY(-5px) scale(1.05)';
                icon.style.boxShadow = '0 15px 40px rgba(107, 97, 248, 0.5)';
            }
        });

        step.addEventListener('mouseleave', () => {
            const icon = step.querySelector('.arch-icon');
            if (icon) {
                icon.style.transform = 'translateY(0) scale(1)';
                icon.style.boxShadow = '0 10px 30px rgba(107, 97, 248, 0.3)';
            }
        });
    });

    // Arrow Flow Animation Enhancement
    const arrowContainers = document.querySelectorAll('.arrow-container');
    arrowContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            const arrows = container.querySelectorAll('.arrow');
            arrows.forEach(arrow => {
                arrow.style.animationDuration = '0.5s';
                arrow.style.color = '#9d55ff';
            });
        });

        container.addEventListener('mouseleave', () => {
            const arrows = container.querySelectorAll('.arrow');
            arrows.forEach(arrow => {
                arrow.style.animationDuration = '2s';
                arrow.style.color = '#6b61f8';
            });
        });
    });
});

// Data Transfer Flow Animation
function startDataTransferAnimation() {
    const steps = document.querySelectorAll('.architecture-step');
    const totalSteps = steps.length;
    let currentStep = 0;

    function highlightStep() {
        // Reset all steps
        steps.forEach(step => {
            step.classList.remove('data-highlight', 'data-dimmed');
            step.classList.add('data-dimmed');
        });

        // Highlight current step
        if (steps[currentStep]) {
            steps[currentStep].classList.remove('data-dimmed');
            steps[currentStep].classList.add('data-highlight');
        }

        // Move to next step
        currentStep = (currentStep + 1) % totalSteps;

        // Continue the animation
        setTimeout(highlightStep, 2000);
    }

    // Start the highlighting animation after initial architecture animation completes
    setTimeout(() => {
        highlightStep();
    }, 3000);
}

// Add bounceIcon keyframe animation via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIcon {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style);

// Responsive Arrow Direction Handler
document.addEventListener('DOMContentLoaded', () => {
    function updateArrowDirections() {
        const incomingArrows = document.querySelectorAll('.arrow-incoming i');
        const outgoingArrows = document.querySelectorAll('.arrow-outgoing i');
        
        if (window.innerWidth <= 1080) {
            // For screens 1080px and below, use vertical arrows
            incomingArrows.forEach(arrow => {
                arrow.className = 'fa fa-arrow-down';
            });
            outgoingArrows.forEach(arrow => {
                arrow.className = 'fa fa-arrow-up';
            });
        } else {
            // For screens above 1080px, use horizontal arrows
            incomingArrows.forEach(arrow => {
                arrow.className = 'fa fa-arrow-right';
            });
            outgoingArrows.forEach(arrow => {
                arrow.className = 'fa fa-arrow-left';
            });
        }
    }

    // Update arrows on initial load
    updateArrowDirections();

    // Update arrows on window resize
    window.addEventListener('resize', updateArrowDirections);
});

// Technologies Section Enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Technologies Animation
    const technologiesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger tech cards animation
                const techCards = entry.target.querySelectorAll('.tech-card');
                techCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animationDelay = `${index * 0.2}s`;
                        card.classList.add('animate-in');
                    }, index * 100);
                });
                
                // Add enhanced hover effects
                addTechCardInteractions();
                technologiesObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    // Observe the technologies section
    const technologiesSection = document.querySelector('.technologies');
    if (technologiesSection) {
        technologiesObserver.observe(technologiesSection);
    }

    function addTechCardInteractions() {
        const techCards = document.querySelectorAll('.tech-card');
        
        techCards.forEach(card => {
            // Enhanced hover with ripple effect
            card.addEventListener('mouseenter', (e) => {
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'tech-ripple';
                
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
                ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
                
                ripple.style.cssText += `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(107, 97, 248, 0.1);
                    transform: scale(0);
                    animation: techRipple 0.6s ease-out;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                card.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });

            // Card tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            // Reset transform on mouse leave
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });

            // Click animation
            card.addEventListener('click', () => {
                card.style.transform = 'translateY(-5px) scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });
    }
});

// About Section Enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for About Section
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate chart bars
                const chartBars = entry.target.querySelectorAll('.chart-bar');
                chartBars.forEach((bar, index) => {
                    const height = bar.getAttribute('data-height');
                    setTimeout(() => {
                        bar.style.height = height;
                        bar.style.opacity = '1';
                    }, index * 200 + 800);
                });
                
                // Animate metrics
                const metricNumbers = entry.target.querySelectorAll('.metric-number');
                metricNumbers.forEach((metric, index) => {
                    setTimeout(() => {
                        animateMetricNumber(metric);
                    }, index * 300 + 1000);
                });
                
                aboutObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    // Observe the about section
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }

    function animateMetricNumber(element) {
        const finalText = element.textContent;
        
        if (finalText === '95.7%') {
            animateCounter(element, 0, 95.7, '%', 2000);
        } else if (finalText === '2.3s') {
            animateCounter(element, 0, 2.3, 's', 1500);
        }
    }

    function animateCounter(element, start, end, suffix = '', duration = 2000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            if (suffix === '%') {
                element.textContent = Math.floor(current * 10) / 10 + suffix;
            } else if (suffix === 's') {
                element.textContent = (Math.floor(current * 10) / 10).toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }
});

// Hero Section Enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scrolling for scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const contentSections = document.querySelector('.content-sections');
            if (contentSections) {
                const offsetTop = contentSections.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Parallax effect for hero background elements
    let ticking = false;
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection && scrollTop < window.innerHeight) {
            const particles = document.querySelector('.hero-particles');
            const grid = document.querySelector('.hero-grid');
            
            if (particles) {
                particles.style.transform = `translateY(${scrollTop * 0.3}px)`;
            }
            if (grid) {
                grid.style.transform = `translateY(${scrollTop * 0.2}px)`;
            }
        }
        
        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestParallaxUpdate);

    // Interactive chart points
    const chartPoints = document.querySelectorAll('.point');
    chartPoints.forEach((point, index) => {
        point.addEventListener('mouseenter', () => {
            point.style.transform = 'scale(1.5)';
            point.style.boxShadow = '0 0 30px rgba(107, 97, 248, 0.8)';
            
            // Show value tooltip
            const value = point.getAttribute('data-value');
            if (value) {
                const tooltip = document.createElement('div');
                tooltip.className = 'chart-tooltip';
                tooltip.textContent = `$${value}`;
                tooltip.style.cssText = `
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(107, 97, 248, 0.9);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    white-space: nowrap;
                    pointer-events: none;
                    z-index: 100;
                `;
                point.appendChild(tooltip);
            }
        });

        point.addEventListener('mouseleave', () => {
            point.style.transform = 'scale(1)';
            point.style.boxShadow = '0 0 20px rgba(107, 97, 248, 0.6)';
            
            // Remove tooltip
            const tooltip = point.querySelector('.chart-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // Animate stats counters
    const animateStats = () => {
        const stats = document.querySelectorAll('.stat-value');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    
                    if (text === '95%') {
                        animateCounter(target, 0, 95, '%', 2000);
                    } else if (text === '24/7') {
                        // For 24/7, just add a pulse effect
                        target.style.animation = 'pulse 2s ease-in-out infinite';
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    };

    // Initialize stat animations
    animateStats();

    // Add hover effect for hero buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(5px)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        button.addEventListener('mouseleave', () => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(0)';
            }
        });
    });

    // Hero section fade out on scroll
    const heroFadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const opacity = Math.max(0.1, entry.intersectionRatio);
                heroContent.style.opacity = opacity;
            }
        });
    }, { threshold: Array.from({ length: 101 }, (_, i) => i / 100) });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroFadeObserver.observe(heroSection);
    }
});

// Resize handler for responsive hero elements
window.addEventListener('resize', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.innerWidth <= 768) {
        // Adjust hero content for mobile
        heroContent.style.marginTop = '60px';
    } else if (heroContent) {
        heroContent.style.marginTop = '100px';
    }
});

// Navigation smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for all navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 120; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    function updateActiveNavLink() {
        let current = '';
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // If we're at the very top, highlight home
        if (scrollY < 100) {
            current = 'hero';
        }

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Call once on load

    // Enhanced navigation hover effects
    navLinksAll.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const icon = link.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.15) translateY(-1px) rotate(5deg)';
                icon.style.filter = 'drop-shadow(0 0 8px rgba(107, 97, 248, 0.6))';
            }
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('nav-ripple');
            ripple.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: rgba(107, 97, 248, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: navRipple 0.6s ease-out;
                pointer-events: none;
                z-index: 0;
            `;
            
            const rect = link.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%) scale(0)';
            
            link.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });

        link.addEventListener('mouseleave', () => {
            const icon = link.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) translateY(0) rotate(0deg)';
                icon.style.filter = 'none';
            }
        });
    });
});

// Footer smooth scrolling
const footerLinks = document.querySelectorAll('footer a[href^="#"]');
footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 120;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Pre-nav interactions
const preNavLogo = document.querySelector('.pre-nav-logo p');
if (preNavLogo) {
    preNavLogo.addEventListener('click', () => {
        // Smooth scroll to top with a subtle bounce effect
        const scrollToTop = () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        };
        scrollToTop();
    });
}

// Pre-nav links enhanced hover effects
const preNavLinks = document.querySelectorAll('.pre-nav-links a');
preNavLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
});

// Footer Enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Animate footer stats on scroll
    const footerStats = document.querySelectorAll('.footer-stats .stat-item');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate the number if it contains digits
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement && numberElement.textContent.match(/\d/)) {
                    animateFooterNumber(numberElement);
                }
                
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Set initial state and observe
    footerStats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px)';
        stat.style.transition = `all 0.6s ease ${index * 0.1}s`;
        footerObserver.observe(stat);
    });

    function animateFooterNumber(element) {
        const text = element.textContent;
        const number = parseFloat(text.replace(/[^\d.]/g, ''));
        
        if (!isNaN(number)) {
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                if (text.includes('%')) {
                    element.textContent = (Math.floor(current * 10) / 10) + '%';
                } else if (text.includes('ms')) {
                    element.textContent = '<' + Math.floor(current) + 'ms';
                } else if (text.includes('M+')) {
                    element.textContent = Math.floor(current) + 'M+';
                } else {
                    element.textContent = (Math.floor(current * 10) / 10) + text.replace(/[\d.]/g, '');
                }
            }, 30);
        }
    }

    // Add ripple effect to social links
    const socialLinks = document.querySelectorAll('.footer-social a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = 60;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add hover effect for tech badges
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animate footer sections on scroll
    const footerSections = document.querySelectorAll('.footer-section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    footerSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `all 0.6s ease ${index * 0.2}s`;
        sectionObserver.observe(section);
    });
});

// Add ripple CSS if not exists
if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Scroll-triggered Animation System
document.addEventListener('DOMContentLoaded', () => {
    // Create a single observer for all scroll animations
    const scrollAnimationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Apply the appropriate visible class based on the hidden class
                if (element.classList.contains('scroll-hidden')) {
                    element.classList.remove('scroll-hidden');
                    element.classList.add('scroll-visible');
                }
                if (element.classList.contains('scroll-hidden-left')) {
                    element.classList.remove('scroll-hidden-left');
                    element.classList.add('scroll-visible-left');
                }
                if (element.classList.contains('scroll-hidden-right')) {
                    element.classList.remove('scroll-hidden-right');
                    element.classList.add('scroll-visible-right');
                }
                if (element.classList.contains('scroll-hidden-scale')) {
                    element.classList.remove('scroll-hidden-scale');
                    element.classList.add('scroll-visible-scale');
                }
                
                // Add bounce effect for icons when they become visible
                const icon = element.querySelector('i');
                if (icon) {
                    setTimeout(() => {
                        icon.style.animation = 'bounce 1s ease-in-out';
                    }, 500);
                }
                
                // Unobserve to prevent re-triggering
                scrollAnimationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation 50px before element fully enters viewport
    });

    // Observe all elements with scroll animation classes
    const animatedElements = document.querySelectorAll('.scroll-hidden, .scroll-hidden-left, .scroll-hidden-right, .scroll-hidden-scale');
    animatedElements.forEach(element => {
        scrollAnimationObserver.observe(element);
    });

    // Special observer for section headers with typing effect
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const titleElement = entry.target.querySelector('.section-title');
                if (titleElement) {
                    // Create typing effect
                    const originalText = titleElement.textContent;
                    titleElement.textContent = '';
                    titleElement.style.borderRight = '2px solid #6b61f8';
                    
                    let charIndex = 0;
                    const typeInterval = setInterval(() => {
                        if (charIndex < originalText.length) {
                            titleElement.textContent += originalText.charAt(charIndex);
                            charIndex++;
                        } else {
                            clearInterval(typeInterval);
                            setTimeout(() => {
                                titleElement.style.borderRight = 'none';
                            }, 1000);
                        }
                    }, 80);
                }
                
                headerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Observe section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        headerObserver.observe(header);
    });

    // Enhanced stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number, .metric-number');
                numbers.forEach((numberElement, index) => {
                    setTimeout(() => {
                        animateNumber(numberElement);
                    }, index * 200);
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe stats sections
    const statsElements = document.querySelectorAll('.architecture-stats, .about-metrics');
    statsElements.forEach(stats => {
        statsObserver.observe(stats);
    });

    function animateNumber(element) {
        const finalText = element.textContent;
        const number = parseFloat(finalText.replace(/[^\d.]/g, ''));
        
        if (!isNaN(number) && number > 0) {
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                if (finalText.includes('%')) {
                    element.textContent = Math.floor(current * 10) / 10 + '%';
                } else if (finalText.includes('ms')) {
                    element.textContent = '<' + Math.floor(current) + 'ms';
                } else if (finalText.includes('M+')) {
                    element.textContent = Math.floor(current) + 'M+';
                } else if (finalText.includes('s')) {
                    element.textContent = (Math.floor(current * 10) / 10) + 's';
                } else if (finalText.includes('/')) {
                    element.textContent = finalText; // Keep 24/7 as is
                } else {
                    element.textContent = Math.floor(current) + finalText.replace(/[\d.]/g, '');
                }
            }, 20);
        }
    }

    // Chart bars animation
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chartBars = entry.target.querySelectorAll('.chart-bar');
                chartBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const height = bar.getAttribute('data-height');
                        bar.style.height = height;
                        bar.style.background = 'linear-gradient(135deg, #6b61f8, #9d55ff)';
                        bar.style.transform = 'scaleY(1)';
                    }, index * 150);
                });
                
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Observe chart containers
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(chart => {
        chartObserver.observe(chart);
        
        // Set initial state for chart bars
        const bars = chart.querySelectorAll('.chart-bar');
        bars.forEach(bar => {
            bar.style.height = '0';
            bar.style.transform = 'scaleY(0)';
            bar.style.transformOrigin = 'bottom';
            bar.style.transition = 'all 0.8s ease-out';
        });
    });
});