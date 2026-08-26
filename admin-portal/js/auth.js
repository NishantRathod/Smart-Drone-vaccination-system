/**
 * Authentication
 * Login and session management
 */

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        const response = await api.login(email, password);
        
        if (response.success) {
            // Check if user is admin
            if (response.user.role !== 'admin') {
                throw new Error('Access denied. Admin privileges required.');
            }
            
            // Store token and user info
            localStorage.setItem('adminToken', response.token);
            localStorage.setItem('adminUser', JSON.stringify(response.user));
            api.token = response.token;
            
            // Show main content
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            
            // Initialize dashboard
            initializeDashboard();
            showNotification('Welcome, Admin!', 'success');
        } else {
            throw new Error(response.message || 'Login failed');
        }
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
        setTimeout(() => errorDiv.classList.remove('show'), 5000);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.reload();
    }
}

function checkAuth() {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const hashToken = hashParams.get('token');
    const hashUser = hashParams.get('user');

    if (hashToken && hashUser) {
        try {
            const userData = JSON.parse(hashUser);
            if (userData.role === 'admin') {
                localStorage.setItem('adminToken', hashToken);
                localStorage.setItem('adminUser', JSON.stringify(userData));
                api.token = hashToken;
                window.history.replaceState(null, '', window.location.pathname);
                document.getElementById('loginPage').style.display = 'none';
                document.getElementById('mainContent').style.display = 'block';
                return true;
            }
        } catch (error) {
            console.error('Invalid admin session handoff:', error);
        }
    }

    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (token && user) {
        const userData = JSON.parse(user);
        if (userData.role === 'admin') {
            api.token = token;
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            return true;
        }
    }
    
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
    return false;
}
