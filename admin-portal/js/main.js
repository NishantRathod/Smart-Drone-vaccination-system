/**
 * Main Application
 * Entry point and navigation
 */

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (checkAuth()) {
        initializeDashboard();
    }
    
    // Setup login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Setup navigation
    document.querySelectorAll('.nav-link').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            switchPage(page);
        });
    });
    
    // Setup filter
    const filterSelect = document.getElementById('filterStatus');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterRequests);
    }
    
    // Setup camera controls
    document.getElementById('captureBtn')?.addEventListener('click', captureImage);
    document.getElementById('verifyFaceBtn')?.addEventListener('click', verifyFace);
    document.getElementById('detectDeltoidBtn')?.addEventListener('click', detectDeltoid);
    document.getElementById('refreshCameraBtn')?.addEventListener('click', refreshCamera);
    document.getElementById('approveInjectionBtn')?.addEventListener('click', approveInjection);
    
    // Setup modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('show');
            });
        });
    });
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
});

// Navigation
function switchPage(pageName) {
    // Cleanup previous page
    stopCameraStream();
    
    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    // Show selected page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load page data
        switch(pageName) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'requests':
                loadRequests();
                break;
            case 'camera':
                initCameraPage();
                break;
            case 'ml-monitor':
                loadMLStats();
                break;
            case 'users':
                loadUsers();
                break;
        }
    }
}

// Notifications
function showNotification(message, type = 'info') {
    let container = document.getElementById('notificationContainer');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease';
    }, 10);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (container.contains(notification)) {
                container.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return formatDate(dateString);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopDashboardPolling();
    stopCameraStream();
});
