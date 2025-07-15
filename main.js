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

// Predict Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the predict page
    if (window.location.pathname.includes('predict.html')) {
        initializePredictPage();
    }
});

function initializePredictPage() {
    const API_BASE_URL = 'http://143.110.184.234:8000';
    let selectedSymbol = null;
    
    // Test API connectivity on page load
    testAPIConnectivity();
    
    // Stock card selection
    const stockCards = document.querySelectorAll('.stock-card');
    const predictBtn = document.getElementById('predict-btn');
    const daysInput = document.getElementById('days-input');
    const modelTypeSelect = document.getElementById('model-type');
    const loadingOverlay = document.getElementById('loading-overlay');
    const resultsSection = document.getElementById('results-section');
    
    // Test API connectivity
    async function testAPIConnectivity() {
        try {
            console.log('Testing API connectivity...');
            showNotification('Testing API connectivity...', 'info');
            updateDebugStatus('Testing API connectivity...');
            
            const response = await fetch(`${API_BASE_URL}/sentiment_summary/AAPL`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                console.log('API connectivity test passed');
                showNotification('API server is reachable!', 'success');
                updateDebugStatus('✅ API server is reachable');
            } else {
                console.error('API connectivity test failed:', response.status);
                showNotification(`API server responded with error: ${response.status}`, 'warning');
                updateDebugStatus(`⚠️ API server error: ${response.status}`);
            }
        } catch (error) {
            console.error('API connectivity test failed:', error);
            showNotification('Cannot connect to API server. Please check if the server is running.', 'error');
            updateDebugStatus('❌ Cannot connect to API server');
            addDebugLog(`Connection error: ${error.message}`, 'error');
        }
    }

    // Enhanced server test with CORS check
    async function testServerConnection() {
        const testUrls = [
            `${API_BASE_URL}/sentiment_summary/AAPL`,
            `${API_BASE_URL}/predict/lstm?symbol=AAPL&days=7`,
            `${API_BASE_URL}/metrics/lstm/AAPL`
        ];
        
        for (const url of testUrls) {
            try {
                addDebugLog(`Testing endpoint: ${url}`, 'info');
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    addDebugLog(`✅ ${url} - Status: ${response.status}`, 'success');
                } else {
                    addDebugLog(`❌ ${url} - Status: ${response.status}`, 'error');
                }
            } catch (error) {
                addDebugLog(`❌ ${url} - Error: ${error.message}`, 'error');
                
                // Check for CORS issues
                if (error.message.includes('CORS')) {
                    addDebugLog('CORS error detected - server may not allow cross-origin requests', 'error');
                }
            }
        }
    }

    // Debug helper functions
    function updateDebugStatus(status) {
        const debugStatus = document.getElementById('debug-api-status');
        if (debugStatus) {
            debugStatus.textContent = status;
        }
    }

    function updateDebugSymbol(symbol) {
        const debugSymbol = document.getElementById('debug-symbol');
        if (debugSymbol) {
            debugSymbol.textContent = symbol || 'None';
        }
    }

    function updateDebugLastRequest(request) {
        const debugLastRequest = document.getElementById('debug-last-request');
        if (debugLastRequest) {
            debugLastRequest.textContent = request;
        }
    }

    function addDebugLog(message, type = 'info') {
        const debugConsole = document.getElementById('debug-console');
        if (debugConsole) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.className = `debug-log ${type}`;
            logEntry.textContent = `[${timestamp}] ${message}`;
            debugConsole.appendChild(logEntry);
            debugConsole.scrollTop = debugConsole.scrollHeight;
        }
    }
    
    // Add click handlers for stock cards
    stockCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            stockCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');
            selectedSymbol = card.dataset.symbol;
            updateDebugSymbol(selectedSymbol);
            addDebugLog(`Stock selected: ${selectedSymbol}`, 'info');
            
            // Load initial data for selected stock
            loadStockData(selectedSymbol);
        });
    });
    
    // Test API button handler
    const testApiBtn = document.getElementById('test-api-btn');
    if (testApiBtn) {
        testApiBtn.addEventListener('click', testAPIConnectivity);
    }
    
    // Predict button handler
    predictBtn.addEventListener('click', () => {
        if (!selectedSymbol) {
            showNotification('Please select a stock symbol first', 'warning');
            addDebugLog('Prediction attempted without selecting a symbol', 'warning');
            return;
        }
        
        const days = parseInt(daysInput.value);
        const modelType = modelTypeSelect.value;
        
        if (days < 1 || days > 30) {
            showNotification('Please enter a valid number of days (1-30)', 'warning');
            addDebugLog(`Invalid days value: ${days}`, 'warning');
            return;
        }
        
        addDebugLog(`Starting prediction: ${selectedSymbol}, ${days} days, ${modelType} model`, 'info');
        runPrediction(selectedSymbol, days, modelType);
    });
    
    // Load stock data (sentiment and metrics)
    async function loadStockData(symbol) {
        try {
            showLoading();
            
            // Load sentiment data
            await loadSentimentData(symbol);
            
            // Load metrics data
            await loadMetricsData(symbol);
            
            // Show results section
            resultsSection.classList.add('visible');
            
        } catch (error) {
            console.error('Error loading stock data:', error);
            showError('Failed to load stock data. Please try again.');
        } finally {
            hideLoading();
        }
    }
    
    // Load sentiment analysis data
    async function loadSentimentData(symbol) {
        try {
            const url = `${API_BASE_URL}/sentiment_summary/${symbol}`;
            console.log('Loading sentiment data from:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                console.error('Sentiment API error:', response.status, response.statusText);
                throw new Error(`Failed to load sentiment data: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Sentiment data received:', data);
            displaySentimentSummary(data);
            
            // Set up chart download links
            document.getElementById('sentiment-chart-download').href = `${API_BASE_URL}/sentiment_chart/${symbol}`;
            
        } catch (error) {
            console.error('Sentiment loading error:', error);
            document.getElementById('sentiment-summary').innerHTML = 
                `<div class="error-message">Failed to load sentiment data: ${error.message}</div>`;
        }
    }
    
    // Load model metrics
    async function loadMetricsData(symbol) {
        try {
            const modelType = modelTypeSelect.value;
            const endpoint = modelType === 'lstm' ? 'lstm' : 'lstm_sentiment';
            const url = `${API_BASE_URL}/metrics/${endpoint}/${symbol}`;
            
            console.log('Loading metrics data from:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                console.error('Metrics API error:', response.status, response.statusText);
                throw new Error(`Failed to load metrics data: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Metrics data received:', data);
            displayMetrics(data);
            
            // Set up chart download links
            document.getElementById('test-predictions-download').href = 
                `${API_BASE_URL}/metrics/${endpoint}/chart/tsp/${symbol}`;
            document.getElementById('training-loss-download').href = 
                `${API_BASE_URL}/metrics/${endpoint}/chart/tl/${symbol}`;
            
        } catch (error) {
            console.error('Metrics loading error:', error);
            document.getElementById('metrics-grid').innerHTML = 
                `<div class="error-message">Failed to load metrics data: ${error.message}</div>`;
        }
    }
    
    // Run prediction
    async function runPrediction(symbol, days, modelType) {
        try {
            showLoading();
            predictBtn.classList.add('loading');
            
            const url = `${API_BASE_URL}/predict/${modelType}?symbol=${symbol}&days=${days}`;
            console.log('Making prediction request to:', url);
            updateDebugLastRequest(url);
            addDebugLog(`Making prediction request to: ${url}`, 'info');
            
            const response = await fetch(url);
            console.log('Response status:', response.status);
            addDebugLog(`Response status: ${response.status}`, response.ok ? 'success' : 'error');
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                addDebugLog(`Server error response: ${errorText}`, 'error');
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Prediction data received:', data);
            addDebugLog(`Prediction data received: ${JSON.stringify(data)}`, 'success');
            displayPredictions(data, days);
            
        } catch (error) {
            console.error('Prediction error:', error);
            addDebugLog(`Prediction error: ${error.message}`, 'error');
            showNotification(`Prediction failed: ${error.message}`, 'error');
            
            // Try to provide more helpful error messages
            if (error.message.includes('Failed to fetch')) {
                showNotification('Cannot connect to the prediction server. Please check if the server is running.', 'error');
                addDebugLog('Network connection failed - server may be down', 'error');
            } else if (error.message.includes('404')) {
                showNotification('Prediction endpoint not found. Please check the API configuration.', 'error');
                addDebugLog('API endpoint not found - check URL and server configuration', 'error');
            } else if (error.message.includes('500')) {
                showNotification('Server error occurred. Please try again later.', 'error');
                addDebugLog('Internal server error - check server logs', 'error');
            }
        } finally {
            hideLoading();
            predictBtn.classList.remove('loading');
        }
    }
    
    // Display sentiment summary
    function displaySentimentSummary(data) {
        const container = document.getElementById('sentiment-summary');
        
        if (data.error) {
            container.innerHTML = `<div class="error-message">${data.error}</div>`;
            return;
        }
        
        // Handle different possible response formats
        const overallSentiment = data.overall_sentiment || data.sentiment || 'N/A';
        const positiveScore = data.positive_score || data.positive || 0;
        const negativeScore = data.negative_score || data.negative || 0;
        const neutralScore = data.neutral_score || data.neutral || 0;
        
        container.innerHTML = `
            <div class="sentiment-metrics">
                <div class="metric-item">
                    <div class="metric-label">Overall Sentiment</div>
                    <div class="metric-value sentiment-${overallSentiment?.toLowerCase()}">${overallSentiment}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Positive Score</div>
                    <div class="metric-value">${(positiveScore * 100).toFixed(1)}%</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Negative Score</div>
                    <div class="metric-value">${(negativeScore * 100).toFixed(1)}%</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Neutral Score</div>
                    <div class="metric-value">${(neutralScore * 100).toFixed(1)}%</div>
                </div>
            </div>
        `;
    }
    
    // Display model metrics
    function displayMetrics(data) {
        const container = document.getElementById('metrics-grid');
        
        if (data.error) {
            container.innerHTML = `<div class="error-message">${data.error}</div>`;
            return;
        }
        
        container.innerHTML = `
            <div class="metric-item">
                <div class="metric-label">RMSE</div>
                <div class="metric-value">${data.rmse?.toFixed(4) || 'N/A'}</div>
            </div>
            <div class="metric-item">
                <div class="metric-label">MAE</div>
                <div class="metric-value">${data.mae?.toFixed(4) || 'N/A'}</div>
            </div>
            <div class="metric-item">
                <div class="metric-label">MAPE</div>
                <div class="metric-value">${data.mape?.toFixed(2) || 'N/A'}%</div>
            </div>
            <div class="metric-item">
                <div class="metric-label">R² Score</div>
                <div class="metric-value">${data.r2_score?.toFixed(4) || 'N/A'}</div>
            </div>
        `;
    }
    
    // Display predictions
    function displayPredictions(data, days) {
        const container = document.getElementById('prediction-grid');
        
        if (data.error) {
            container.innerHTML = `<div class="error-message">${data.error}</div>`;
            return;
        }
        
        // Handle different possible response formats
        let predictions = data.predictions || data.prediction || data;
        
        // If predictions is not an array, try to extract it
        if (!Array.isArray(predictions)) {
            console.log('Predictions is not an array, received:', predictions);
            if (typeof predictions === 'object' && predictions !== null) {
                // Try to find array in the object
                const keys = Object.keys(predictions);
                for (let key of keys) {
                    if (Array.isArray(predictions[key])) {
                        predictions = predictions[key];
                        break;
                    }
                }
            }
        }
        
        if (!Array.isArray(predictions) || predictions.length === 0) {
            container.innerHTML = '<div class="error-message">No predictions available. Please check the API response format.</div>';
            console.log('Full API response:', data);
            return;
        }
        
        let html = '';
        predictions.forEach((prediction, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index + 1);
            
            // Handle different prediction formats
            const price = typeof prediction === 'number' ? prediction : 
                         prediction.price || prediction.value || prediction.prediction || 0;
            
            html += `
                <div class="prediction-item">
                    <div class="prediction-day">Day ${index + 1}</div>
                    <div class="prediction-date">${date.toLocaleDateString()}</div>
                    <div class="prediction-price">$${price.toFixed(2)}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // Show loading overlay
    function showLoading() {
        loadingOverlay.classList.add('visible');
    }
    
    // Hide loading overlay
    function hideLoading() {
        loadingOverlay.classList.remove('visible');
    }
    
    // Show error message
    function showError(message) {
        alert(message); // You can replace this with a more elegant error display
    }
    
    // Enhanced CSV download functionality
    function setupCSVDownloads(symbol) {
        // Create CSV download buttons for data
        const csvDownloadContainer = document.createElement('div');
        csvDownloadContainer.className = 'csv-downloads';
        csvDownloadContainer.innerHTML = `
            <h4>Download Data (CSV)</h4>
            <div class="csv-buttons">
                <a href="#" class="download-btn csv-btn" onclick="downloadCSV('sentiment', '${symbol}')">
                    📊 Sentiment Data CSV
                </a>
                <a href="#" class="download-btn csv-btn" onclick="downloadCSV('metrics', '${symbol}')">
                    📈 Metrics Data CSV
                </a>
                <a href="#" class="download-btn csv-btn" onclick="downloadCSV('predictions', '${symbol}')">
                    🔮 Predictions CSV
                </a>
            </div>
        `;
        
        // Add to results section
        const resultsContainer = document.querySelector('.results-container');
        resultsContainer.appendChild(csvDownloadContainer);
    }

    // CSV download function
    window.downloadCSV = function(type, symbol) {
        const modelType = document.getElementById('model-type').value;
        const days = document.getElementById('days-input').value;
        
        let url = '';
        switch(type) {
            case 'sentiment':
                url = `${API_BASE_URL}/sentiment_summary/${symbol}?format=csv`;
                break;
            case 'metrics':
                url = `${API_BASE_URL}/metrics/${modelType}/${symbol}?format=csv`;
                break;
            case 'predictions':
                url = `${API_BASE_URL}/predict/${modelType}?symbol=${symbol}&days=${days}&format=csv`;
                break;
        }
        
        // Create temporary download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `${symbol}_${type}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Enhanced error handling with retry functionality
    function showErrorWithRetry(message, retryFunction) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-with-retry';
        errorDiv.innerHTML = `
            <p>${message}</p>
            <button onclick="retryFunction()" class="retry-btn">Retry</button>
        `;
        
        // You can customize where this appears
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.parentElement.removeChild(errorDiv);
            }
        }, 5000);
    }

    // Add notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
        `;
        
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #2ea043, #28a745)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #da3633, #dc3545)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(45deg, #ffc107, #ffca28)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #6b61f8, #8b5cf6)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add notification animations
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .csv-downloads {
            background: #21262D;
            border: 2px solid #30363D;
            border-radius: 16px;
            padding: 30px;
            margin-top: 30px;
        }
        .csv-downloads h4 {
            color: #EBF1F7;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }
        .csv-buttons {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        .csv-btn {
            background: linear-gradient(45deg, #0969da, #1f6feb);
        }
        .csv-btn:hover {
            box-shadow: 0 5px 15px rgba(9, 105, 218, 0.3);
        }
        .retry-btn {
            background: #6b61f8;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        }
        .error-message-with-retry {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #21262D;
            border: 2px solid #da3633;
            border-radius: 12px;
            padding: 20px;
            z-index: 10001;
            text-align: center;
            color: #EBF1F7;
        }
    `;
    document.head.appendChild(notificationStyle);

    // Update loadStockData function to show CSV downloads
    const originalLoadStockData = loadStockData;
    loadStockData = async function(symbol) {
        await originalLoadStockData(symbol);
        setupCSVDownloads(symbol);
        showNotification(`Loaded data for ${symbol}`, 'success');
    };

    // Update prediction success
    const originalDisplayPredictions = displayPredictions;
    displayPredictions = function(data, days) {
        originalDisplayPredictions(data, days);
        
        // Add sparkle effect to prediction items
        setTimeout(() => {
            const predictionItems = document.querySelectorAll('.prediction-item');
            predictionItems.forEach((item, index) => {
                setTimeout(() => {
                    addSparkleEffect(item);
                }, index * 100);
            });
        }, 500);
        
        showNotification(`Prediction completed for ${days} days!`, 'success');
    };
}