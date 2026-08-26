/**
 * API Service
 */

const api = {
    token: null,

    // Helper to make requests
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Authentication
    async login(email, password) {
        return this.request('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async getProfile() {
        return this.request('/api/profile');
    },

    // Requests
    async getAllRequests(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/api/vaccine-requests?${query}`);
    },

    async updateRequest(id, data) {
        return this.request(`/api/vaccine-request/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // Camera
    async captureImage() {
        return this.request('/api/camera/capture', {
            method: 'POST'
        });
    },

    async verifyFace(data) {
        return this.request('/api/camera/verify-face', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async detectDeltoid(data) {
        return this.request('/api/camera/detect-deltoid', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getCameraInfo() {
        return this.request('/api/camera/info');
    },

    async checkMLHealth() {
        return this.request('/api/camera/ml-health');
    },

    // Health Check
    async checkBackendHealth() {
        try {
            const response = await fetch(`${CONFIG.API_URL}/api`);
            return response.ok;
        } catch {
            return false;
        }
    }
};
