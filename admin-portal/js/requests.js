/**
 * Requests Management
 * Vaccination request handling
 */

let currentRequests = [];
let selectedRequest = null;

async function loadRequests(filter = 'all') {
    try {
        const params = filter !== 'all' ? { status: filter } : {};
        const response = await api.getAllRequests(params);
        
        if (response.success) {
            currentRequests = response.requests;
            renderRequestsTable(currentRequests);
        }
    } catch (error) {
        console.error('Error loading requests:', error);
        showNotification('Failed to load requests', 'error');
    }
}

function renderRequestsTable(requests) {
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Vaccine</th>
                    <th>Location</th>
                    <th>Scheduled</th>
                    <th>Status</th>
                    <th>Verification</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${requests.length === 0 ? 
                    '<tr><td colspan="8" style="text-align: center;">No requests found</td></tr>' :
                    requests.map(req => `
                    <tr>
                        <td style="font-family: monospace">${req._id.substring(0, 8)}</td>
                        <td>
                            <strong>${req.userName}</strong><br>
                            <small>${req.userEmail}</small>
                        </td>
                        <td>${req.vaccineType}</td>
                        <td>${req.location}</td>
                        <td>${formatDate(req.scheduledDate)}</td>
                        <td><span class="status-badge status-${req.status}">${req.status}</span></td>
                        <td>
                            <small>
                                ${req.faceVerified ? '✅' : '⏳'} Face<br>
                                ${req.deltoidDetected ? '✅' : '⏳'} Deltoid<br>
                                ${req.humanApproved ? '✅' : '⏳'} Human
                            </small>
                        </td>
                        <td>
                            <button class="btn-action btn-view" onclick="viewRequest('${req._id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${renderActionButtons(req)}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('requestsTable').innerHTML = tableHTML;
}

function renderActionButtons(request) {
    let buttons = '';
    
    if (request.status === 'pending') {
        buttons += `
            <button class="btn-action btn-approve" onclick="approveRequest('${request._id}')">
                <i class="fas fa-check"></i>
            </button>
        `;
    }
    
    if (request.status === 'approved') {
        buttons += `
            <button class="btn-action btn-approve" onclick="startProcess('${request._id}')">
                <i class="fas fa-play"></i> Start
            </button>
        `;
    }
    
    if (request.status !== 'completed' && request.status !== 'cancelled') {
        buttons += `
            <button class="btn-action btn-reject" onclick="cancelRequest('${request._id}')">
                <i class="fas fa-times"></i>
            </button>
        `;
    }
    
    return buttons;
}

async function approveRequest(id) {
    if (confirm('Approve this vaccination request?')) {
        try {
            await api.updateRequest(id, {
                status: 'approved',
                operatorName: 'Admin'
            });
            
            showNotification('Request approved', 'success');
            addActivityItem('Request approved', 'success');
            loadRequests(document.getElementById('filterStatus').value);
        } catch (error) {
            showNotification('Failed to approve request', 'error');
        }
    }
}

async function startProcess(id) {
    selectedRequest = currentRequests.find(r => r._id === id);
    if (selectedRequest) {
        // Switch to camera page
        switchPage('camera');
        showNotification('Process started - Use camera to verify', 'info');
        
        await api.updateRequest(id, {
            status: 'in-progress'
        });
        
        addActivityItem(`Started process for ${selectedRequest.userName}`, 'info');
    }
}

async function cancelRequest(id) {
    if (confirm('Cancel this vaccination request?')) {
        try {
            await api.updateRequest(id, {
                status: 'cancelled'
            });
            
            showNotification('Request cancelled', 'warning');
            addActivityItem('Request cancelled', 'warning');
            loadRequests(document.getElementById('filterStatus').value);
        } catch (error) {
            showNotification('Failed to cancel request', 'error');
        }
    }
}

async function viewRequest(id) {
    try {
        const request = currentRequests.find(r => r._id === id);
        if (!request) return;
        
        const modalBody = document.getElementById('requestModalBody');
        modalBody.innerHTML = `
            <div style="line-height: 1.8">
                <h3>Patient Information</h3>
                <p><strong>Name:</strong> ${request.userName}</p>
                <p><strong>Email:</strong> ${request.userEmail}</p>
                <p><strong>Phone:</strong> ${request.userPhone || 'N/A'}</p>
                
                <h3 style="margin-top: 2rem">Vaccination Details</h3>
                <p><strong>Vaccine Type:</strong> ${request.vaccineType}</p>
                <p><strong>Location:</strong> ${request.location}</p>
                <p><strong>Scheduled Date:</strong> ${formatDate(request.scheduledDate)}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${request.status}">${request.status}</span></p>
                
                <h3 style="margin-top: 2rem">Verification Status</h3>
                <p><strong>Face Verified:</strong> ${request.faceVerified ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Deltoid Detected:</strong> ${request.deltoidDetected ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Human Approved:</strong> ${request.humanApproved ? '✅ Yes' : '❌ No'}</p>
                
                ${request.notes ? `<p><strong>Notes:</strong> ${request.notes}</p>` : ''}
                
                <div style="margin-top: 2rem">
                    <button class="btn-action btn-approve" onclick="closeModal()">Close</button>
                </div>
            </div>
        `;
        
        document.getElementById('requestModal').classList.add('show');
    } catch (error) {
        showNotification('Failed to load request details', 'error');
    }
}

function filterRequests() {
    const filter = document.getElementById('filterStatus').value;
    loadRequests(filter);
}

function closeModal() {
    document.getElementById('requestModal').classList.remove('show');
}
