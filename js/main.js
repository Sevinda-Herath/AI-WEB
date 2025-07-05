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