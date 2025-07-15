// Predict Section JavaScript
const API_BASE_URL = 'http://162.243.175.58:8000';

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
    
    // Initialize sentiment section visibility
    initializeSentimentSection();
}

function setupEventListeners() {
    const predictBtn = document.getElementById('predict-btn');
    const stockSelect = document.getElementById('stock-select');
    const modelSelect = document.getElementById('model-select');
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

    if (modelSelect) {
        modelSelect.addEventListener('change', handleModelChange);
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

    // Enhanced validation
    if (!stockSymbol || stockSymbol.trim() === '') {
        showAlert('Please select a stock symbol', 'error');
        return;
    }

    if (!days || isNaN(days) || days < 30 || days > 120) {
        showAlert('Please enter a valid number of days (30-120)', 'error');
        document.getElementById('days-input').focus();
        return;
    }

    if (!model || model.trim() === '') {
        showAlert('Please select a model type', 'error');
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
        
        // Show success message
        showAlert(`Prediction completed successfully for ${stockSymbol}!`, 'success');
        
    } catch (error) {
        console.error('Prediction error:', error);
        showAlert(`Prediction failed: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

async function handleStockChange() {
    const stockSymbol = document.getElementById('stock-select').value;
    const model = document.getElementById('model-select').value;
    
    // Only show sentiment data if LSTM+Sentiment model is selected
    if (stockSymbol && model === 'lstm_sentiment') {
        showSentimentLoading();
        await loadSentimentData(stockSymbol);
        enableDownloadButton('download-sentiment-chart');
    } else {
        hideSentimentSection();
        disableDownloadButton('download-sentiment-chart');
    }
}

async function handleModelChange() {
    const stockSymbol = document.getElementById('stock-select').value;
    const model = document.getElementById('model-select').value;
    
    // Show/hide sentiment section based on model selection
    if (model === 'lstm_sentiment') {
        showSentimentSection();
        if (stockSymbol) {
            showSentimentLoading();
            await loadSentimentData(stockSymbol);
            enableDownloadButton('download-sentiment-chart');
        } else {
            clearSentimentData();
            disableDownloadButton('download-sentiment-chart');
        }
    } else {
        hideSentimentSection();
        disableDownloadButton('download-sentiment-chart');
    }
}

function showSentimentSection() {
    const sentimentCard = document.getElementById('sentiment-card');
    if (sentimentCard) {
        sentimentCard.style.display = 'block';
        sentimentCard.style.opacity = '1';
        sentimentCard.style.transform = 'translateY(0)';
        sentimentCard.style.transition = 'all 0.3s ease';
    }
}

function hideSentimentSection() {
    const sentimentCard = document.getElementById('sentiment-card');
    if (sentimentCard) {
        sentimentCard.style.opacity = '0';
        sentimentCard.style.transform = 'translateY(-10px)';
        sentimentCard.style.transition = 'all 0.3s ease';
        
        // Hide completely after animation
        setTimeout(() => {
            sentimentCard.style.display = 'none';
        }, 300);
    }
    
    // Clear sentiment data
    const sentimentSummary = document.getElementById('sentiment-summary');
    if (sentimentSummary) {
        sentimentSummary.innerHTML = '';
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
        hideSentimentLoading();
        
    } catch (error) {
        console.error('Sentiment loading error:', error);
        document.getElementById('sentiment-summary').innerHTML = 
            `<div class="error-message">
                <p>❌ Sentiment data not available for ${symbol}</p>
                <p class="error-details">${error.message}</p>
            </div>`;
        hideSentimentLoading();
    }
}

async function loadModelMetrics(symbol, model) {
    try {
        showMetricsLoading();
        const endpoint = model === 'lstm' ? '/metrics/lstm' : '/metrics/lstm_sentiment';
        const response = await fetch(`${API_BASE_URL}${endpoint}/${symbol}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayMetricsData(data);
        enableDownloadButton('download-test-chart');
        enableDownloadButton('download-loss-chart');
        hideMetricsLoading();
        
    } catch (error) {
        console.error('Metrics loading error:', error);
        document.getElementById('metrics-display').innerHTML = 
            `<div class="error-message">
                <p>❌ Metrics data not available for ${symbol}</p>
                <p class="error-details">${error.message}</p>
            </div>`;
        hideMetricsLoading();
    }
}

function displayPredictionResult(data) {
    const resultCard = document.getElementById('result-card');
    const resultSymbol = document.getElementById('result-symbol');
    const resultDate = document.getElementById('result-date');
    const predictedPrice = document.getElementById('predicted-price');

    if (resultSymbol) resultSymbol.textContent = data.stock;
    if (resultDate) resultDate.textContent = new Date(data.date).toLocaleDateString();
    
    // Round predicted price to 2 decimal places
    const roundedPrice = parseFloat(data.predicted_price_for_tommorow).toFixed(2);
    if (predictedPrice) predictedPrice.textContent = `$${roundedPrice}`;

    if (resultCard) {
        resultCard.style.display = 'block';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function displaySentimentData(data) {
    const sentimentSummary = document.getElementById('sentiment-summary');
    
    if (sentimentSummary) {
        // Calculate percentages from counts
        const totalArticles = data.total_articles || 0;
        const positiveCount = data.positive_count || 0;
        const neutralCount = data.neutral_count || 0;
        const negativeCount = data.negative_count || 0;
        
        const positivePercentage = totalArticles > 0 ? (positiveCount / totalArticles * 100) : 0;
        const neutralPercentage = totalArticles > 0 ? (neutralCount / totalArticles * 100) : 0;
        const negativePercentage = totalArticles > 0 ? (negativeCount / totalArticles * 100) : 0;
        
        // Determine overall sentiment based on highest count
        let overallSentiment = 'neutral';
        if (positiveCount > neutralCount && positiveCount > negativeCount) {
            overallSentiment = 'positive';
        } else if (negativeCount > neutralCount && negativeCount > positiveCount) {
            overallSentiment = 'negative';
        }
        
        sentimentSummary.innerHTML = `
            <div class="sentiment-data">
                <div class="sentiment-header">
                    <h3>Sentiment Analysis for ${data.symbol}</h3>
                    <p class="date-collected">Data collected: ${new Date(data.date_collected).toLocaleDateString()}</p>
                    <p class="total-articles">Total articles analyzed: ${totalArticles}</p>
                </div>
                
                <div class="sentiment-counts">
                    <div class="sentiment-item positive">
                        <h4>Positive</h4>
                        <div class="sentiment-stats">
                            <span class="count">${positiveCount} articles</span>
                            <span class="percentage">${positivePercentage.toFixed(1)}%</span>
                            <span class="confidence">Avg confidence: ${(data.avg_confidence_positive * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    
                    <div class="sentiment-item neutral">
                        <h4>Neutral</h4>
                        <div class="sentiment-stats">
                            <span class="count">${neutralCount} articles</span>
                            <span class="percentage">${neutralPercentage.toFixed(1)}%</span>
                            <span class="confidence">Avg confidence: ${(data.avg_confidence_neutral * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    
                    <div class="sentiment-item negative">
                        <h4>Negative</h4>
                        <div class="sentiment-stats">
                            <span class="count">${negativeCount} articles</span>
                            <span class="percentage">${negativePercentage.toFixed(1)}%</span>
                            <span class="confidence">Avg confidence: ${(data.avg_confidence_negative * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="sentiment-summary">
                    <div class="overall-sentiment">
                        <h4>Overall Sentiment</h4>
                        <span class="sentiment-badge ${overallSentiment}">${overallSentiment.charAt(0).toUpperCase() + overallSentiment.slice(1)}</span>
                    </div>
                </div>
            </div>
        `;
    }
}

function displayMetricsData(data) {
    const metricsDisplay = document.getElementById('metrics-display');
    
    if (metricsDisplay) {
        // Calculate RMSE from MSE if not provided
        const trainRMSE = data.train_mse ? Math.sqrt(data.train_mse) : 0;
        const testRMSE = data.test_mse ? Math.sqrt(data.test_mse) : 0;
        
        metricsDisplay.innerHTML = `
            <div class="metrics-data">
                <div class="metrics-section">
                    <h3>Training Metrics</h3>
                    <div class="metric-item">
                        <h4>Train MAE</h4>
                        <span>${parseFloat(data.train_mae || 0).toFixed(6)}</span>
                    </div>
                    <div class="metric-item">
                        <h4>Train MSE</h4>
                        <span>${parseFloat(data.train_mse || 0).toFixed(6)}</span>
                    </div>
                    <div class="metric-item">
                        <h4>Train RMSE</h4>
                        <span>${trainRMSE.toFixed(6)}</span>
                    </div>
                    <div class="metric-item">
                        <h4>Train R²</h4>
                        <span>${parseFloat(data.train_r2 || 0).toFixed(6)}</span>
                    </div>
                </div>
                
                <div class="metrics-section">
                    <h3>Test Metrics</h3>
                    <div class="metric-item">
                        <h4>Test MAE</h4>
                        <span>${parseFloat(data.test_mae || 0).toFixed(6)}</span>
                    </div>
                    <div class="metric-item">
                        <h4>Test MSE</h4>
                        <span>${parseFloat(data.test_mse || 0).toFixed(6)}</span>
                    </div>
                    <div class="metric-item">
                        <h4>Test RMSE</h4>
                        <span>${testRMSE.toFixed(6)}</span>
                    </div>
                    <div class="metric-item">
                        <h4>Test R²</h4>
                        <span>${parseFloat(data.test_r2 || 0).toFixed(6)}</span>
                    </div>
                </div>
                
                <div class="metrics-section">
                    <h3>Symbol</h3>
                    <div class="metric-item">
                        <h4>Symbol</h4>
                        <span class="symbol-value">${data.symbol || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;
    }
}

function clearSentimentData() {
    const sentimentSummary = document.getElementById('sentiment-summary');
    if (sentimentSummary) {
        sentimentSummary.innerHTML = `
            <div class="sentiment-placeholder">
                <div class="placeholder-icon">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <p class="placeholder-text">Select a stock symbol to view sentiment analysis</p>
                <p class="placeholder-hint">Market sentiment data will appear here</p>
            </div>
        `;
    }
}

function initializeSentimentSection() {
    const model = document.getElementById('model-select').value;
    const stockSymbol = document.getElementById('stock-select').value;
    
    if (model === 'lstm_sentiment') {
        showSentimentSection();
        if (stockSymbol) {
            loadSentimentData(stockSymbol);
        } else {
            clearSentimentData();
        }
    } else {
        hideSentimentSection();
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

function showSentimentLoading() {
    const sentimentSummary = document.getElementById('sentiment-summary');
    if (sentimentSummary) {
        sentimentSummary.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading sentiment data...</p>
            </div>
        `;
    }
}

function hideSentimentLoading() {
    // This function is called after displaySentimentData or error handling
    // so no need to clear the loading state manually
}

function showMetricsLoading() {
    const metricsDisplay = document.getElementById('metrics-display');
    if (metricsDisplay) {
        metricsDisplay.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading model metrics...</p>
            </div>
        `;
    }
}

function hideMetricsLoading() {
    // This function is called after displayMetricsData or error handling
    // so no need to clear the loading state manually
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
    
    if (!stockSymbol || stockSymbol.trim() === '') {
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
        // Show loading for download
        showAlert('Preparing download...', 'info');
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        // Check if the response is actually an image
        if (!blob.type.startsWith('image/')) {
            throw new Error('Invalid response format - expected image');
        }
        
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
    
    if (!stockSymbol || stockSymbol.trim() === '') {
        showAlert('Please select a stock symbol first', 'error');
        return;
    }
    
    if (!model || model.trim() === '') {
        showAlert('Please select a model type first', 'error');
        return;
    }
    
    const metricsDisplay = document.getElementById('metrics-display');
    if (!metricsDisplay || !metricsDisplay.querySelector('.metrics-data')) {
        showAlert('No metrics data available to download. Please run a prediction first.', 'error');
        return;
    }
    
    try {
        let csvContent = 'Category,Metric,Value\n';
        
        // Get all metrics sections
        const metricsSections = metricsDisplay.querySelectorAll('.metrics-section');
        
        metricsSections.forEach(section => {
            const sectionTitle = section.querySelector('h3')?.textContent.trim() || 'Metrics';
            const metrics = section.querySelectorAll('.metric-item');
            
            metrics.forEach(metric => {
                const nameElement = metric.querySelector('h4');
                const valueElement = metric.querySelector('span');
                
                if (nameElement && valueElement) {
                    const name = nameElement.textContent.trim();
                    const value = valueElement.textContent.trim();
                    csvContent += `"${sectionTitle}","${name}","${value}"\n`;
                }
            });
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${stockSymbol}_${model}_metrics.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showAlert(`Metrics downloaded successfully!`, 'success');
        
    } catch (error) {
        console.error('Download metrics error:', error);
        showAlert(`Failed to download metrics: ${error.message}`, 'error');
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
    
    // Define alert colors
    const alertColors = {
        error: 'linear-gradient(135deg, #ff4757, #ff3838)',
        success: 'linear-gradient(135deg, #2ed573, #2ed573)',
        info: 'linear-gradient(135deg, #3742fa, #2f3542)',
        warning: 'linear-gradient(135deg, #ffa502, #ff6348)'
    };
    
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
        background: alertColors[type] || alertColors.info,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        cursor: 'pointer'
    });
    
    // Add click to dismiss
    alertDiv.addEventListener('click', () => {
        dismissAlert(alertDiv);
    });
    
    document.body.appendChild(alertDiv);
    
    // Animate in
    setTimeout(() => {
        alertDiv.style.opacity = '1';
        alertDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay (longer for error messages)
    const delay = type === 'error' ? 6000 : 4000;
    setTimeout(() => {
        if (alertDiv.parentNode) {
            dismissAlert(alertDiv);
        }
    }, delay);
}

function dismissAlert(alertDiv) {
    alertDiv.style.opacity = '0';
    alertDiv.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 300);
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
        const response = await fetch(`${API_BASE_URL}/`);
        const data = await response.json();
        console.log('API Health:', data);
        
        // Update UI to show API status
        updateAPIStatus(data.status === 'ok');
        return data.status === 'ok';
    } catch (error) {
        console.error('API Health check failed:', error);
        updateAPIStatus(false);
        return false;
    }
}

// Update API status indicator
function updateAPIStatus(isHealthy) {
    const statusIndicator = document.getElementById('api-status');
    if (statusIndicator) {
        statusIndicator.className = isHealthy ? 'api-status healthy' : 'api-status unhealthy';
        statusIndicator.textContent = isHealthy ? 'API Online' : 'API Offline';
    }
}

// Initialize API health check
checkAPIHealth();

// Set up periodic health checks (every 30 seconds)
setInterval(checkAPIHealth, 30000);

// Add keyboard shortcuts for better UX
document.addEventListener('keydown', function(event) {
    // Enter key to trigger prediction if focus is on days input
    if (event.key === 'Enter' && event.target.id === 'days-input') {
        handlePrediction();
    }
    
    // Escape key to dismiss any visible alerts
    if (event.key === 'Escape') {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert.parentNode) {
                dismissAlert(alert);
            }
        });
    }
});

// Add form validation helper
function validateForm() {
    const stockSymbol = document.getElementById('stock-select').value;
    const days = document.getElementById('days-input').value;
    const model = document.getElementById('model-select').value;
    
    const isValid = stockSymbol && days && days >= 30 && days <= 120 && model;
    
    const predictBtn = document.getElementById('predict-btn');
    if (predictBtn) {
        predictBtn.disabled = !isValid;
        predictBtn.style.opacity = isValid ? '1' : '0.6';
    }
    
    return isValid;
}

// Add input listeners for real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const stockSelect = document.getElementById('stock-select');
    const daysInput = document.getElementById('days-input');
    const modelSelect = document.getElementById('model-select');
    
    [stockSelect, daysInput, modelSelect].forEach(element => {
        if (element) {
            element.addEventListener('input', validateForm);
            element.addEventListener('change', validateForm);
        }
    });
    
    // Initial validation
    validateForm();
    
    // Initialize sentiment section on page load
    setTimeout(() => {
        initializeSentimentSection();
    }, 100);
});
