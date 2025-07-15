// Predict Section JavaScript
const API_BASE_URL = 'http://0.0.0.0:8000';

// Initialize the predict section
document.addEventListener('DOMContentLoaded', function() {
    initializePredictSection();
    setupEventListeners();
    createPredictIcon();
});

function initializePredictSection() {
    console.log('Predict section initialized');
    
    // Initialize UI elements
    const resultCard = document.getElementById('result-card');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (resultCard) resultCard.style.display = 'none';
    if (loadingSpinner) loadingSpinner.style.display = 'none';
}

function setupEventListeners() {
    const predictBtn = document.getElementById('predict-btn');
    const stockSelect = document.getElementById('stock-select');
    const downloadMetrics = document.getElementById('download-metrics');
    const viewCharts = document.getElementById('view-charts');
    const downloadSentimentChart = document.getElementById('download-sentiment-chart');
    const downloadTestChart = document.getElementById('download-test-chart');
    const downloadLossChart = document.getElementById('download-loss-chart');

    if (predictBtn) {
        predictBtn.addEventListener('click', handlePrediction);
    }

    if (stockSelect) {
        stockSelect.addEventListener('change', handleStockChange);
    }

    if (downloadMetrics) {
        downloadMetrics.addEventListener('click', handleDownloadMetrics);
    }

    if (viewCharts) {
        viewCharts.addEventListener('click', handleViewCharts);
    }

    if (downloadSentimentChart) {
        downloadSentimentChart.addEventListener('click', () => downloadChart('sentiment'));
    }

    if (downloadTestChart) {
        downloadTestChart.addEventListener('click', () => downloadChart('test'));
    }

    if (downloadLossChart) {
        downloadLossChart.addEventListener('click', () => downloadChart('loss'));
    }
}

async function handlePrediction() {
    const stockSymbol = document.getElementById('stock-select').value;
    const days = document.getElementById('days-input').value;
    const model = document.getElementById('model-select').value;

    if (!stockSymbol) {
        showAlert('Please select a stock symbol', 'error');
        return;
    }

    if (!days || days < 30 || days > 120) {
        showAlert('Please enter a valid number of days (30-120)', 'error');
        return;
    }

    showLoading();
    
    try {
        const endpoint = model === 'lstm' ? '/predict/lstm' : '/predict/lstm_sentiment';
        const response = await fetch(`${API_BASE_URL}${endpoint}?symbol=${stockSymbol}&days=${days}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        displayPredictionResult(data);
        await loadModelMetrics(stockSymbol, model);
        
    } catch (error) {
        console.error('Prediction error:', error);
        showAlert(`Prediction failed: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

async function handleStockChange() {
    const stockSymbol = document.getElementById('stock-select').value;
    
    if (stockSymbol) {
        await loadSentimentData(stockSymbol);
        enableDownloadButton('download-sentiment-chart');
    } else {
        clearSentimentData();
        disableDownloadButton('download-sentiment-chart');
    }
}

async function loadSentimentData(symbol) {
    try {
        const response = await fetch(`${API_BASE_URL}/sentiment_summary/${symbol}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displaySentimentData(data);
        
    } catch (error) {
        console.error('Sentiment loading error:', error);
        document.getElementById('sentiment-summary').innerHTML = 
            `<p>Sentiment data not available for ${symbol}</p>`;
    }
}

async function loadModelMetrics(symbol, model) {
    try {
        const endpoint = model === 'lstm' ? '/metrics/lstm' : '/metrics/lstm_sentiment';
        const response = await fetch(`${API_BASE_URL}${endpoint}/${symbol}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayMetricsData(data);
        enableDownloadButton('download-test-chart');
        enableDownloadButton('download-loss-chart');
        
    } catch (error) {
        console.error('Metrics loading error:', error);
        document.getElementById('metrics-display').innerHTML = 
            `<p>Metrics data not available</p>`;
    }
}

function displayPredictionResult(data) {
    const resultCard = document.getElementById('result-card');
    const resultSymbol = document.getElementById('result-symbol');
    const resultDate = document.getElementById('result-date');
    const predictedPrice = document.getElementById('predicted-price');

    if (resultSymbol) resultSymbol.textContent = data.stock;
    if (resultDate) resultDate.textContent = new Date(data.date).toLocaleDateString();
    if (predictedPrice) predictedPrice.textContent = `$${data.predicted_price_for_tommorow}`;

    if (resultCard) {
        resultCard.style.display = 'block';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function displaySentimentData(data) {
    const sentimentSummary = document.getElementById('sentiment-summary');
    
    if (sentimentSummary) {
        sentimentSummary.innerHTML = `
            <div class="sentiment-data">
                <div class="sentiment-item">
                    <h4>Positive</h4>
                    <span>${data.positive_percentage || 0}%</span>
                </div>
                <div class="sentiment-item">
                    <h4>Negative</h4>
                    <span>${data.negative_percentage || 0}%</span>
                </div>
                <div class="sentiment-item">
                    <h4>Neutral</h4>
                    <span>${data.neutral_percentage || 0}%</span>
                </div>
                <div class="sentiment-item">
                    <h4>Overall</h4>
                    <span>${data.overall_sentiment || 'N/A'}</span>
                </div>
            </div>
        `;
    }
}

function displayMetricsData(data) {
    const metricsDisplay = document.getElementById('metrics-display');
    
    if (metricsDisplay) {
        metricsDisplay.innerHTML = `
            <div class="metrics-data">
                <div class="metric-item">
                    <h4>MSE</h4>
                    <span>${parseFloat(data.mse || 0).toFixed(4)}</span>
                </div>
                <div class="metric-item">
                    <h4>RMSE</h4>
                    <span>${parseFloat(data.rmse || 0).toFixed(4)}</span>
                </div>
                <div class="metric-item">
                    <h4>MAE</h4>
                    <span>${parseFloat(data.mae || 0).toFixed(4)}</span>
                </div>
                <div class="metric-item">
                    <h4>R²</h4>
                    <span>${parseFloat(data.r2_score || 0).toFixed(4)}</span>
                </div>
                <div class="metric-item">
                    <h4>MAPE</h4>
                    <span>${parseFloat(data.mape || 0).toFixed(2)}%</span>
                </div>
            </div>
        `;
    }
}

function clearSentimentData() {
    const sentimentSummary = document.getElementById('sentiment-summary');
    if (sentimentSummary) {
        sentimentSummary.innerHTML = '<p>Select a stock to view sentiment analysis</p>';
    }
}

function showLoading() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultCard = document.getElementById('result-card');
    
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (resultCard) resultCard.style.display = 'none';
}

function hideLoading() {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';
}

function enableDownloadButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = false;
    }
}

function disableDownloadButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = true;
    }
}

async function downloadChart(type) {
    const stockSymbol = document.getElementById('stock-select').value;
    const model = document.getElementById('model-select').value;
    
    if (!stockSymbol) {
        showAlert('Please select a stock symbol first', 'error');
        return;
    }
    
    let endpoint;
    let filename;
    
    switch(type) {
        case 'sentiment':
            endpoint = `/sentiment_chart/${stockSymbol}`;
            filename = `${stockSymbol}_sentiment_chart.png`;
            break;
        case 'test':
            const testEndpoint = model === 'lstm' ? 
                `/metrics/lstm/chart/tsp/${stockSymbol}` : 
                `/metrics/lstm_sentiment/chart/tsp/${stockSymbol}`;
            endpoint = testEndpoint;
            filename = `${stockSymbol}_${model}_test_predictions.png`;
            break;
        case 'loss':
            const lossEndpoint = model === 'lstm' ? 
                `/metrics/lstm/chart/tl/${stockSymbol}` : 
                `/metrics/lstm_sentiment/chart/tl/${stockSymbol}`;
            endpoint = lossEndpoint;
            filename = `${stockSymbol}_${model}_training_loss.png`;
            break;
        default:
            showAlert('Invalid chart type', 'error');
            return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showAlert(`${filename} downloaded successfully!`, 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showAlert(`Failed to download chart: ${error.message}`, 'error');
    }
}

function handleDownloadMetrics() {
    const stockSymbol = document.getElementById('stock-select').value;
    const model = document.getElementById('model-select').value;
    
    if (!stockSymbol) {
        showAlert('Please select a stock symbol first', 'error');
        return;
    }
    
    const endpoint = model === 'lstm' ? 
        `/metrics/lstm/${stockSymbol}` : 
        `/metrics/lstm_sentiment/${stockSymbol}`;
    
    // Create CSV download from the displayed metrics
    const metricsDisplay = document.getElementById('metrics-display');
    if (metricsDisplay && metricsDisplay.querySelector('.metrics-data')) {
        const metrics = metricsDisplay.querySelectorAll('.metric-item');
        let csvContent = 'Metric,Value\n';
        
        metrics.forEach(metric => {
            const name = metric.querySelector('h4').textContent;
            const value = metric.querySelector('span').textContent;
            csvContent += `${name},${value}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${stockSymbol}_${model}_metrics.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showAlert(`Metrics downloaded successfully!`, 'success');
    } else {
        showAlert('No metrics data available to download', 'error');
    }
}

function handleViewCharts() {
    const stockSymbol = document.getElementById('stock-select').value;
    
    if (!stockSymbol) {
        showAlert('Please select a stock symbol first', 'error');
        return;
    }
    
    // Scroll to analytics section
    const analyticsSection = document.querySelector('.analytics-section');
    if (analyticsSection) {
        analyticsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showAlert(message, type) {
    // Create and show a temporary alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Style the alert
    Object.assign(alertDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '8px',
        color: '#EBF1F7',
        fontSize: '1rem',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '400px',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease',
        background: type === 'error' ? 
            'linear-gradient(135deg, #ff4757, #ff3838)' : 
            'linear-gradient(135deg, #2ed573, #2ed573)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    });
    
    document.body.appendChild(alertDiv);
    
    // Animate in
    setTimeout(() => {
        alertDiv.style.opacity = '1';
        alertDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    }, 4000);
}

function createPredictIcon() {
    const canvas = document.getElementById('predict-icon');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    
    renderer.setSize(120, 120);
    renderer.setClearColor(0x000000, 0);
    
    // Create a glowing chart-like geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x6b61f8,
        transparent: true,
        opacity: 0.8
    });
    
    const cubes = [];
    for (let i = 0; i < 5; i++) {
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = (i - 2) * 0.5;
        cube.position.y = Math.random() * 2 - 1;
        cube.scale.set(0.3, Math.random() * 2 + 0.5, 0.3);
        scene.add(cube);
        cubes.push(cube);
    }
    
    camera.position.z = 5;
    
    function animate() {
        requestAnimationFrame(animate);
        
        cubes.forEach((cube, index) => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            cube.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Health check function
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        console.log('API Health:', data);
        return data.status === 'ok';
    } catch (error) {
        console.error('API Health check failed:', error);
        return false;
    }
}

// Initialize API health check
checkAPIHealth();
