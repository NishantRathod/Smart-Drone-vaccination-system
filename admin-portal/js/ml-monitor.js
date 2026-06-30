/**
 * ML Monitor
 * ML service monitoring and stats
 */

let mlMonitorInterval;

async function initMLMonitor() {
    await loadMLStats();
    startMLMonitoring();
}

async function loadMLStats() {
    try {
        const healthResponse = await api.checkMLHealth();
        
        if (healthResponse.success) {
            updateMLServiceStatus(true, healthResponse);
        } else {
            updateMLServiceStatus(false);
        }
    } catch (error) {
        console.error('ML service check error:', error);
        updateMLServiceStatus(false);
    }
}

function updateMLServiceStatus(isOnline, data = null) {
    const statusElement = document.getElementById('mlServiceStatus');
    
    if (isOnline && data) {
        statusElement.innerHTML = `
            <div class="health-status online">
                <i class="fas fa-check-circle"></i>
                <span>ML Service Online</span>
            </div>
            <div class="ml-stats">
                <div class="stat-item">
                    <span class="stat-label">Face Model:</span>
                    <span class="stat-value">${data.face_model ? 'Loaded' : 'Not Loaded'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Deltoid Model:</span>
                    <span class="stat-value">${data.deltoid_model ? 'Loaded' : 'Not Loaded'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Version:</span>
                    <span class="stat-value">${data.version || 'N/A'}</span>
                </div>
            </div>
        `;
    } else {
        statusElement.innerHTML = `
            <div class="health-status offline">
                <i class="fas fa-times-circle"></i>
                <span>ML Service Offline</span>
            </div>
        `;
    }
}

async function testFaceVerification() {
    showNotification('Testing face verification...', 'info');
    
    try {
        // This would need actual test images
        showNotification('Please use camera page for face verification', 'warning');
    } catch (error) {
        showNotification('Face verification test failed', 'error');
    }
}

async function testDeltoidDetection() {
    showNotification('Testing deltoid detection...', 'info');
    
    try {
        // This would need actual test images
        showNotification('Please use camera page for deltoid detection', 'warning');
    } catch (error) {
        showNotification('Deltoid detection test failed', 'error');
    }
}

async function restartMLService() {
    if (confirm('Restart ML Service? This may cause brief interruption.')) {
        showNotification('ML service restart requested', 'info');
        // This would require backend support
        setTimeout(() => {
            showNotification('ML service restarted', 'success');
            loadMLStats();
        }, 2000);
    }
}

function startMLMonitoring() {
    if (CONFIG.AUTO_REFRESH) {
        mlMonitorInterval = setInterval(loadMLStats, CONFIG.HEALTH_CHECK);
    }
}

function stopMLMonitoring() {
    if (mlMonitorInterval) {
        clearInterval(mlMonitorInterval);
    }
}

// Model performance tracking
function logModelPerformance(modelType, processingTime, success) {
    const performanceLog = {
        model: modelType,
        time: processingTime,
        success: success,
        timestamp: new Date()
    };
    
    console.log('Model Performance:', performanceLog);
    
    // Could store in localStorage for analytics
    const logs = JSON.parse(localStorage.getItem('mlPerformanceLogs') || '[]');
    logs.push(performanceLog);
    
    // Keep last 100 logs
    if (logs.length > 100) {
        logs.shift();
    }
    
    localStorage.setItem('mlPerformanceLogs', JSON.stringify(logs));
}

function getModelPerformanceStats() {
    const logs = JSON.parse(localStorage.getItem('mlPerformanceLogs') || '[]');
    
    if (logs.length === 0) {
        return null;
    }
    
    const faceVerificationLogs = logs.filter(l => l.model === 'face');
    const deltoidDetectionLogs = logs.filter(l => l.model === 'deltoid');
    
    return {
        faceVerification: {
            avgTime: faceVerificationLogs.reduce((sum, l) => sum + l.time, 0) / faceVerificationLogs.length || 0,
            successRate: faceVerificationLogs.filter(l => l.success).length / faceVerificationLogs.length * 100 || 0,
            totalTests: faceVerificationLogs.length
        },
        deltoidDetection: {
            avgTime: deltoidDetectionLogs.reduce((sum, l) => sum + l.time, 0) / deltoidDetectionLogs.length || 0,
            successRate: deltoidDetectionLogs.filter(l => l.success).length / deltoidDetectionLogs.length * 100 || 0,
            totalTests: deltoidDetectionLogs.length
        }
    };
}

function displayPerformanceStats() {
    const stats = getModelPerformanceStats();
    
    if (!stats) {
        showNotification('No performance data available', 'info');
        return;
    }
    
    console.log('Performance Stats:', stats);
    
    // Display in UI
    document.getElementById('mlStats').innerHTML = `
        <div class="performance-stats">
            <div class="model-stat">
                <h4>Face Verification</h4>
                <p>Avg Time: ${stats.faceVerification.avgTime.toFixed(2)}ms</p>
                <p>Success Rate: ${stats.faceVerification.successRate.toFixed(1)}%</p>
                <p>Total Tests: ${stats.faceVerification.totalTests}</p>
            </div>
            <div class="model-stat">
                <h4>Deltoid Detection</h4>
                <p>Avg Time: ${stats.deltoidDetection.avgTime.toFixed(2)}ms</p>
                <p>Success Rate: ${stats.deltoidDetection.successRate.toFixed(1)}%</p>
                <p>Total Tests: ${stats.deltoidDetection.totalTests}</p>
            </div>
        </div>
    `;
}
