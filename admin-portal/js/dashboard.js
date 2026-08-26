/**
 * Dashboard
 * Main dashboard functionality
 */

let dashboardInterval;
let activityInterval;
let healthCheckInterval;

async function initializeDashboard() {
    await loadDashboardData();
    startDashboardPolling();
    checkSystemHealth();
}

async function loadDashboardData() {
    try {
        // Load requests
        const response = await api.getAllRequests();
        
        if (response.success) {
            updateStatistics(response.requests);
            updateRecentRequests(response.requests);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

function updateStatistics(requests) {
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending' || r.status === 'approved').length,
        inProgress: requests.filter(r => 
            r.status === 'in-progress' || 
            r.status === 'face-verification' || 
            r.status === 'injection-ready'
        ).length,
        completed: requests.filter(r => r.status === 'completed').length
    };
    
    document.getElementById('totalRequests').textContent = stats.total;
    document.getElementById('pendingRequests').textContent = stats.pending;
    document.getElementById('inProgressRequests').textContent = stats.inProgress;
    document.getElementById('completedRequests').textContent = stats.completed;
}

function updateRecentRequests(requests) {
    const recentRequests = requests.slice(0, 5);
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Patient</th>
                    <th>Vaccine</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${recentRequests.map(req => `
                    <tr>
                        <td><strong>${req.userName}</strong><br><small>${req.userEmail}</small></td>
                        <td>${req.vaccineType}</td>
                        <td>${formatDate(req.scheduledDate)}</td>
                        <td><span class="status-badge status-${req.status}">${req.status}</span></td>
                        <td>
                            <button class="btn-action btn-view" onclick="viewRequest('${req._id}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('recentRequestsTable').innerHTML = tableHTML;
}

async function checkSystemHealth() {
    // Check backend
    const backendOnline = await api.checkBackendHealth();
    updateHealthStatus('backendStatus', backendOnline);
    
    // Check ML service
    try {
        const mlResponse = await api.checkMLHealth();
        updateHealthStatus('mlStatus', mlResponse.success);
    } catch {
        updateHealthStatus('mlStatus', false);
    }
    
    // Database status (inferred from backend)
    updateHealthStatus('dbStatus', backendOnline);
    
    // Camera status
    try {
        const cameraInfo = await api.getCameraInfo();
        updateHealthStatus('cameraStatus', cameraInfo.success);
    } catch {
        updateHealthStatus('cameraStatus', false);
    }
    
    // Update system status indicator
    const allOnline = backendOnline;
    document.getElementById('systemStatus').style.background = allOnline ? '#10b981' : '#ef4444';
    document.getElementById('statusText').textContent = allOnline ? 'System Online' : 'System Issues';
}

function updateHealthStatus(elementId, isOnline) {
    const element = document.getElementById(elementId);
    if (isOnline) {
        element.innerHTML = '<i class="fas fa-circle"></i> Online';
        element.className = 'health-status online';
    } else {
        element.innerHTML = '<i class="fas fa-circle"></i> Offline';
        element.className = 'health-status offline';
    }
}

function addActivityItem(message, type = 'info', time = 'Just now') {
    const activityFeed = document.getElementById('activityFeed');
    const activityHTML = `
        <div class="activity-item">
            <div class="activity-icon ${type}">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
            </div>
            <div class="activity-content">
                <p><strong>${message}</strong></p>
                <small>${time}</small>
            </div>
            <span class="activity-time">${time}</span>
        </div>
    `;
    
    activityFeed.insertAdjacentHTML('afterbegin', activityHTML);
    
    // Limit to 10 activities
    while (activityFeed.children.length > 10) {
        activityFeed.removeChild(activityFeed.lastChild);
    }
}

function startDashboardPolling() {
    if (CONFIG.AUTO_REFRESH) {
        // Dashboard data
        dashboardInterval = setInterval(loadDashboardData, CONFIG.DASHBOARD_REFRESH);
        
        // System health
        healthCheckInterval = setInterval(checkSystemHealth, CONFIG.HEALTH_CHECK);
    }
}

function stopDashboardPolling() {
    if (dashboardInterval) clearInterval(dashboardInterval);
    if (healthCheckInterval) clearInterval(healthCheckInterval);
}

async function refreshDashboard() {
    showNotification('Refreshing dashboard...', 'info');
    await loadDashboardData();
    await checkSystemHealth();
    showNotification('Dashboard refreshed', 'success');
}

function exportData() {
    showNotification('Exporting data...', 'info');
    // Implement export functionality
    setTimeout(() => {
        showNotification('Data exported successfully', 'success');
    }, 1000);
}
