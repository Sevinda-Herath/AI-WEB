// Predict Section JavaScript
const API_BASE_URL = 'https://mylstmsenti-api.ddns.net';

// Initialize the predict section
document.addEventListener('DOMContentLoaded', function() {
    initializePredictSection();
    setupEventListeners();
    initializeStockButtons();
    createPredictIcon();
});

function initializePredictSection() {
    console.log('Predict section initialized');
    
    // Initialize UI elements
    const resultCard = document.getElementById('result-card');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (resultCard) resultCard.style.display = 'none';
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    
    // Initialize analytics section - hidden by default
    const analyticsSection = document.querySelector('.analytics-section');
    if (analyticsSection) {
        analyticsSection.style.display = 'none';
        analyticsSection.style.opacity = '0';
        analyticsSection.style.transform = 'translateY(-10px)';
    }
    
    // Initialize sentiment section visibility
    initializeSentimentSection();
}

function setupEventListeners() {
    const predictBtn = document.getElementById('predict-btn');
    const stockButtons = document.querySelectorAll('.stock-btn');
    const modelSelect = document.getElementById('model-select');
    const downloadMetrics = document.getElementById('download-metrics');
    const viewCharts = document.getElementById('view-charts');
    const downloadSentimentChart = document.getElementById('download-sentiment-chart');
    const downloadTestChart = document.getElementById('download-test-chart');
    const downloadLossChart = document.getElementById('download-loss-chart');

    if (predictBtn) {
        predictBtn.addEventListener('click', handlePrediction);
    }

    // Handle stock button selection
    stockButtons.forEach(button => {
        button.addEventListener('click', handleStockButtonClick);
    });

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
    const stockSymbol = getSelectedStockSymbol();
    const days = document.getElementById('days-input').value;
    const model = document.getElementById('model-select').value;

    // Enhanced validation
    if (!stockSymbol || stockSymbol.trim() === '') {
        showAlert('Please select a stock symbol', 'error');
        return;
    }

    if (!days || isNaN(days) || days < 1 || days > 365) {
        showAlert('Please enter a valid number of days (1-365)', 'error');
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
        
        // Show analytics section after prediction
        showAnalyticsSection();
        
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
    const stockSymbol = getSelectedStockSymbol();
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
    const stockSymbol = getSelectedStockSymbol();
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
        
        // Scroll to metrics section for better UX
        setTimeout(() => {
            const metricsCard = document.getElementById('metrics-card');
            if (metricsCard) {
                metricsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 500);
        
    } catch (error) {
        console.error('Metrics loading error:', error);
        const metricsDisplay = document.getElementById('metrics-display');
        if (metricsDisplay) {
            metricsDisplay.innerHTML = 
                `<div class="error-message">
                    <p>❌ Metrics data not available for ${symbol}</p>
                    <p class="error-details">${error.message}</p>
                </div>`;
        }
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
        
        // Determine overall performance based on R² scores
        const avgR2 = ((data.train_r2 || 0) + (data.test_r2 || 0)) / 2;
        let performance = 'poor';
        if (avgR2 > 0.8) {
            performance = 'excellent';
        } else if (avgR2 > 0.6) {
            performance = 'good';
        }
        
        metricsDisplay.innerHTML = `
            <div class="metrics-data">
                <div class="metrics-header">
                    <h3>Model Metrics for ${data.symbol}</h3>
                    <p class="model-info">Performance evaluation metrics</p>
                    <p class="metrics-summary">Training and testing accuracy measures</p>
                </div>
                
                <div class="metrics-counts">
                    <div class="metrics-section training">
                        <h3>Training Metrics</h3>
                        <div class="metrics-stats">
                            <div class="metric-group">
                                <div class="metric-name">Mean Absolute Error</div>
                                <div class="metric-value">${parseFloat(data.train_mae || 0).toFixed(6)}</div>
                                <div class="metric-description">Average prediction error</div>
                            </div>
                            <div class="metric-group">
                                <div class="metric-name">Mean Squared Error</div>
                                <div class="metric-value">${parseFloat(data.train_mse || 0).toFixed(6)}</div>
                                <div class="metric-description">Squared prediction error</div>
                            </div>
                            <div class="metric-group">
                                <div class="metric-name">Root Mean Squared Error</div>
                                <div class="metric-value">${trainRMSE.toFixed(6)}</div>
                                <div class="metric-description">Standard deviation of errors</div>
                            </div>
                            <div class="metric-group">
                                <div class="metric-name">R² Score</div>
                                <div class="metric-value">${parseFloat(data.train_r2 || 0).toFixed(6)}</div>
                                <div class="metric-description">Coefficient of determination</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metrics-section testing">
                        <h3>Testing Metrics</h3>
                        <div class="metrics-stats">
                            <div class="metric-group">
                                <div class="metric-name">Mean Absolute Error</div>
                                <div class="metric-value">${parseFloat(data.test_mae || 0).toFixed(6)}</div>
                                <div class="metric-description">Average prediction error</div>
                            </div>
                            <div class="metric-group">
                                <div class="metric-name">Mean Squared Error</div>
                                <div class="metric-value">${parseFloat(data.test_mse || 0).toFixed(6)}</div>
                                <div class="metric-description">Squared prediction error</div>
                            </div>
                            <div class="metric-group">
                                <div class="metric-name">Root Mean Squared Error</div>
                                <div class="metric-value">${testRMSE.toFixed(6)}</div>
                                <div class="metric-description">Standard deviation of errors</div>
                            </div>
                            <div class="metric-group">
                                <div class="metric-name">R² Score</div>
                                <div class="metric-value">${parseFloat(data.test_r2 || 0).toFixed(6)}</div>
                                <div class="metric-description">Coefficient of determination</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metrics-section symbol">
                        <h3>Symbol Info</h3>
                        <div class="metrics-stats">
                            <div class="metric-group">
                                <div class="metric-name">Stock Symbol</div>
                                <div class="metric-value">${data.symbol || 'N/A'}</div>
                                <div class="metric-description">Selected stock ticker</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="metrics-overview">
                    <div class="performance-summary">
                        <h4>Overall Performance</h4>
                        <span class="performance-badge ${performance}">${performance.charAt(0).toUpperCase() + performance.slice(1)}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Ensure the metrics display is visible
        metricsDisplay.style.display = 'block';
        metricsDisplay.style.opacity = '1';
        
        // Add animation for better UX
        const metricsData = metricsDisplay.querySelector('.metrics-data');
        if (metricsData) {
            metricsData.style.opacity = '0';
            metricsData.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                metricsData.style.opacity = '1';
                metricsData.style.transform = 'translateY(0)';
                metricsData.style.transition = 'all 0.5s ease';
            }, 100);
        }
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
    const stockSymbol = getSelectedStockSymbol();
    
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
    const stockSymbol = getSelectedStockSymbol();
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
    const stockSymbol = getSelectedStockSymbol();
    const model = document.getElementById('model-select').value;

    if (!stockSymbol || stockSymbol.trim() === '') {
        showAlert('Please select a stock symbol first', 'error');
        return;
    }

    if (!model || model.trim() === '') {
        showAlert('Please select a model type first', 'error');
        return;
    }

    // Try to get the metrics data from the DOM (as displayed)
    const metricsDisplay = document.getElementById('metrics-display');
    if (!metricsDisplay || !metricsDisplay.querySelector('.metrics-data')) {
        showAlert('No metrics data available to download. Please run a prediction first.', 'error');
        return;
    }

    try {
        // Try to extract the metrics from the DOM
        // If not possible, fallback to using the last API response if available
        // For this example, we'll extract from the DOM as per the new API output

        let csvContent = 'Metric,Value\n';

        // Extract metrics from the DOM (as displayed)
        const metricsMap = {
            'Stock Symbol': stockSymbol,
            'Model Type': model,
            'Date': new Date().toLocaleDateString(),
            'Train MAE': metricsDisplay.querySelector('.training .metric-group:nth-child(1) .metric-value')?.textContent.trim(),
            'Train MSE': metricsDisplay.querySelector('.training .metric-group:nth-child(2) .metric-value')?.textContent.trim(),
            'Train R2': metricsDisplay.querySelector('.training .metric-group:nth-child(4) .metric-value')?.textContent.trim(),
            'Test MAE': metricsDisplay.querySelector('.testing .metric-group:nth-child(1) .metric-value')?.textContent.trim(),
            'Test MSE': metricsDisplay.querySelector('.testing .metric-group:nth-child(2) .metric-value')?.textContent.trim(),
            'Test R2': metricsDisplay.querySelector('.testing .metric-group:nth-child(4) .metric-value')?.textContent.trim(),
            'Next Day Prediction': document.getElementById('predicted-price')?.textContent.replace('$', '').trim()
        };

        for (const [metric, value] of Object.entries(metricsMap)) {
            if (value !== undefined && value !== null && value !== '') {
                csvContent += `"${metric}","${value}"\n`;
            }
        }

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
    const stockSymbol = getSelectedStockSymbol();
    
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
    const stockSymbol = getSelectedStockSymbol();
    const days = document.getElementById('days-input').value;
    const model = document.getElementById('model-select').value;

    const isValid = stockSymbol && days && days >= 1 && days <= 365 && model;

    const predictBtn = document.getElementById('predict-btn');
    if (predictBtn) {
        predictBtn.disabled = !isValid;
        predictBtn.style.opacity = isValid ? '1' : '0.6';
    }
    
    return isValid;
}

// Add input listeners for real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const stockButtons = document.querySelectorAll('.stock-btn');
    const daysInput = document.getElementById('days-input');
    const modelSelect = document.getElementById('model-select');
    
    // Add event listeners for stock buttons
    stockButtons.forEach(button => {
        button.addEventListener('click', validateForm);
    });
    
    [daysInput, modelSelect].forEach(element => {
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

function handleStockButtonClick(event) {
    const button = event.currentTarget;
    const symbol = button.getAttribute('data-symbol');
    const name = button.getAttribute('data-name');
    
    // Remove selection from all buttons
    const allButtons = document.querySelectorAll('.stock-btn');
    allButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Add selection to clicked button
    button.classList.add('selected');
    
    // Update hidden input value
    const hiddenInput = document.getElementById('stock-select');
    if (hiddenInput) {
        hiddenInput.value = symbol;
    }
    
    // Show selection feedback
    showAlert(`Selected ${symbol} - ${name}`, 'success');
    
    // Trigger stock change logic
    handleStockChange();
    
    // Validate form
    validateForm();
}

function initializeStockButtons() {
    const stockButtons = document.querySelectorAll('.stock-btn');
    
    stockButtons.forEach(button => {
        // Add click event listener
        button.addEventListener('click', handleStockButtonClick);
        
        // Add keyboard support
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleStockButtonClick(event);
            }
        });
        
        // Make buttons focusable
        button.setAttribute('tabindex', '0');
    });
}

// Initialize stock buttons on page load
document.addEventListener('DOMContentLoaded', initializeStockButtons);

function getSelectedStockSymbol() {
    const hiddenInput = document.getElementById('stock-select');
    if (hiddenInput) {
        return hiddenInput.value;
    }
    
    // Fallback: find selected button
    const selectedButton = document.querySelector('.stock-btn.selected');
    if (selectedButton) {
        return selectedButton.getAttribute('data-symbol');
    }
    
    return '';
}

function showAnalyticsSection() {
    const analyticsSection = document.querySelector('.analytics-section');
    if (analyticsSection) {
        analyticsSection.style.display = 'block';
        analyticsSection.style.opacity = '1';
        analyticsSection.style.transform = 'translateY(0)';
        analyticsSection.style.transition = 'all 0.3s ease';
    }
    
    // Ensure metrics card is visible
    const metricsCard = document.getElementById('metrics-card');
    if (metricsCard) {
        metricsCard.style.display = 'block';
        metricsCard.style.opacity = '1';
        metricsCard.style.transform = 'translateY(0)';
        metricsCard.style.transition = 'all 0.3s ease';
    }
}

function hideAnalyticsSection() {
    const analyticsSection = document.querySelector('.analytics-section');
    if (analyticsSection) {
        analyticsSection.style.opacity = '0';
        analyticsSection.style.transform = 'translateY(-10px)';
        analyticsSection.style.transition = 'all 0.3s ease';
        
        // Hide completely after animation
        setTimeout(() => {
            analyticsSection.style.display = 'none';
        }, 300);
    }
}
