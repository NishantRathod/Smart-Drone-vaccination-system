/**
 * Users Management
 * User administration functions
 */

let allUsers = [];

async function loadUsers() {
    try {
        // Note: This requires backend endpoint
        showNotification('Loading users...', 'info');
        
        // Placeholder - would need actual API endpoint
        // const response = await api.getAllUsers();
        
        // For now, show message
        document.getElementById('usersTable').innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-users" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <h3>User Management</h3>
                <p style="color: var(--text-secondary); margin-top: 1rem;">
                    User management features coming soon.<br>
                    Backend API endpoints need to be implemented.
                </p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Failed to load users', 'error');
    }
}

function renderUsersTable(users) {
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.length === 0 ? 
                    '<tr><td colspan="7" style="text-align: center;">No users found</td></tr>' :
                    users.map(user => `
                    <tr>
                        <td><strong>${user.name}</strong></td>
                        <td>${user.email}</td>
                        <td>${user.phone || 'N/A'}</td>
                        <td><span class="role-badge role-${user.role}">${user.role}</span></td>
                        <td>${formatDate(user.createdAt)}</td>
                        <td><span class="status-badge status-${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                            <button class="btn-action btn-view" onclick="viewUser('${user._id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action btn-reject" onclick="deleteUser('${user._id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('usersTable').innerHTML = tableHTML;
}

async function viewUser(userId) {
    // View user details
    showNotification('User details feature coming soon', 'info');
}

async function deleteUser(userId) {
    if (confirm('Delete this user? This action cannot be undone.')) {
        try {
            // await api.deleteUser(userId);
            showNotification('User deleted successfully', 'success');
            loadUsers();
        } catch (error) {
            showNotification('Failed to delete user', 'error');
        }
    }
}

function filterUsers() {
    const filter = document.getElementById('userFilter').value;
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    
    let filtered = allUsers;
    
    if (filter !== 'all') {
        filtered = filtered.filter(user => user.role === filter);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }
    
    renderUsersTable(filtered);
}

async function exportUsers() {
    showNotification('Exporting users...', 'info');
    
    try {
        // Convert users to CSV
        const csv = convertToCSV(allUsers);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        showNotification('Users exported successfully', 'success');
    } catch (error) {
        showNotification('Failed to export users', 'error');
    }
}

function convertToCSV(users) {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Registered'];
    const rows = users.map(user => [
        user.name,
        user.email,
        user.phone || '',
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        new Date(user.createdAt).toLocaleDateString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}
