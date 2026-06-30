/**
 * Configuration
 * Admin Portal Settings
 */

const CONFIG = {
    API_URL: 'http://localhost:5000',
    ML_SERVICE_URL: 'http://localhost:8000',
    CAMERA_URL: 'http://10.241.12.140',
    
    // Polling intervals (ms)
    DASHBOARD_REFRESH: 10000,  // 10 seconds
    ACTIVITY_REFRESH: 5000,     // 5 seconds
    HEALTH_CHECK: 15000,        // 15 seconds
    
    // Pagination
    REQUESTS_PER_PAGE: 10,
    
    // Auto-refresh
    AUTO_REFRESH: true
};

// Status colors
const STATUS_COLORS = {
    'pending': '#f59e0b',
    'approved': '#3b82f6',
    'in-progress': '#8b5cf6',
    'face-verification': '#14b8a6',
    'injection-ready': '#10b981',
    'completed': '#059669',
    'cancelled': '#6b7280',
    'failed': '#ef4444'
};

// Status icons
const STATUS_ICONS = {
    'pending': 'fa-clock',
    'approved': 'fa-check',
    'in-progress': 'fa-spinner',
    'face-verification': 'fa-user-check',
    'injection-ready': 'fa-syringe',
    'completed': 'fa-check-circle',
    'cancelled': 'fa-times-circle',
    'failed': 'fa-exclamation-triangle'
};