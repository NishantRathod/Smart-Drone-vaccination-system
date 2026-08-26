/**
 * Camera Control
 * ESP32-CAM integration and ML processing
 */

let cameraStreamInterval;
let capturedImage = null;

async function initCameraPage() {
    // Display selected request info if any
    updateSelectedRequestDisplay();
    
    // Start camera stream
    startCameraStream();
}

async function startCameraStream() {
    const canvas = document.getElementById('cameraFeed');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Poll camera stream
    cameraStreamInterval = setInterval(async () => {
        try {
            const response = await fetch(`${CONFIG.CAMERA_URL}/capture`);
            const blob = await response.blob();
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            
            img.src = URL.createObjectURL(blob);
        } catch (error) {
            console.error('Camera stream error:', error);
            // Show error on canvas
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Camera connection error', canvas.width / 2, canvas.height / 2);
        }
    }, 1000); // Update every second
}

function stopCameraStream() {
    if (cameraStreamInterval) {
        clearInterval(cameraStreamInterval);
    }
}

async function captureImage() {
    try {
        showNotification('Capturing image...', 'info');
        
        const response = await api.captureImage();
        
        if (response.success) {
            capturedImage = response.image;
            
            // Display captured image
            const canvas = document.getElementById('cameraFeed');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            
            img.src = `data:image/jpeg;base64,${capturedImage}`;
            
            showNotification('Image captured successfully', 'success');
            addActivityItem('Camera image captured', 'success');
            
            return capturedImage;
        } else {
            throw new Error('Capture failed');
        }
    } catch (error) {
        console.error('Capture error:', error);
        showNotification('Failed to capture image', 'error');
    }
}

async function verifyFace() {
    if (!selectedRequest) {
        showNotification('Please select a vaccination request first', 'warning');
        return;
    }
    
    if (!capturedImage) {
        const img = await captureImage();
        if (!img) return;
    }
    
    try {
        showNotification('Verifying face...', 'info');
        
        // Get registered face image from user
        const registeredImage = selectedRequest.faceImage;
        
        const response = await api.verifyFace(capturedImage, registeredImage);
        
        if (response.success) {
            const result = response.result;
            
            // Display result
            document.getElementById('faceVerificationResult').innerHTML = `
                <div class="verification-result ${result.verified ? 'verified' : 'not-verified'}">
                    <h3>${result.verified ? '✅ Face Verified' : '❌ Verification Failed'}</h3>
                    <p><strong>Confidence:</strong> ${result.confidence}%</p>
                    <p><strong>Match:</strong> ${result.verified ? 'YES' : 'NO'}</p>
                </div>
            `;
            
            if (result.verified) {
                // Update request
                await api.updateRequest(selectedRequest._id, {
                    faceVerified: true,
                    status: 'face-verification'
                });
                
                showNotification('Face verified successfully', 'success');
                addActivityItem(`Face verified for ${selectedRequest.userName}`, 'success');
            } else {
                showNotification('Face verification failed', 'error');
                addActivityItem(`Face verification failed for ${selectedRequest.userName}`, 'error');
            }
        }
    } catch (error) {
        console.error('Verification error:', error);
        showNotification('Face verification error', 'error');
    }
}

async function detectDeltoid() {
    if (!selectedRequest) {
        showNotification('Please select a vaccination request first', 'warning');
        return;
    }
    
    if (!capturedImage) {
        const img = await captureImage();
        if (!img) return;
    }
    
    try {
        showNotification('Detecting deltoid region...', 'info');
        
        const response = await api.detectDeltoid(capturedImage);
        
        if (response.success) {
            const result = response.result;
            
            // Draw deltoid marker on canvas
            if (result.detected && result.coordinates) {
                drawDeltoidMarker(result.coordinates);
            }
            
            // Display result
            document.getElementById('deltoidDetectionResult').innerHTML = `
                <div class="verification-result ${result.detected ? 'verified' : 'not-verified'}">
                    <h3>${result.detected ? '✅ Deltoid Detected' : '❌ Detection Failed'}</h3>
                    <p><strong>Method:</strong> ${result.method}</p>
                    <p><strong>Confidence:</strong> ${result.confidence}%</p>
                    ${result.coordinates ? `
                        <p><strong>Position:</strong> X: ${result.coordinates.x}, Y: ${result.coordinates.y}</p>
                        <p><strong>Size:</strong> ${result.coordinates.width}x${result.coordinates.height}</p>
                    ` : ''}
                </div>
            `;
            
            if (result.detected) {
                // Update request
                await api.updateRequest(selectedRequest._id, {
                    deltoidDetected: true,
                    status: 'injection-ready'
                });
                
                showNotification('Deltoid detected successfully', 'success');
                addActivityItem(`Deltoid detected for ${selectedRequest.userName}`, 'success');
            } else {
                showNotification('Deltoid detection failed', 'error');
                addActivityItem(`Deltoid detection failed for ${selectedRequest.userName}`, 'error');
            }
        }
    } catch (error) {
        console.error('Detection error:', error);
        showNotification('Deltoid detection error', 'error');
    }
}

function drawDeltoidMarker(coordinates) {
    const canvas = document.getElementById('cameraFeed');
    const ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
    
    // Draw crosshair at center
    const centerX = coordinates.x + coordinates.width / 2;
    const centerY = coordinates.y + coordinates.height / 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#10b981';
    ctx.fill();
}

async function refreshCamera() {
    showNotification('Refreshing camera...', 'info');
    capturedImage = null;
    
    // Clear results
    document.getElementById('faceVerificationResult').innerHTML = '';
    document.getElementById('deltoidDetectionResult').innerHTML = '';
    
    // Restart stream
    stopCameraStream();
    startCameraStream();
}

function updateSelectedRequestDisplay() {
    const infoDiv = document.getElementById('selectedRequestInfo');
    
    if (selectedRequest) {
        infoDiv.innerHTML = `
            <p><strong>${selectedRequest.userName}</strong></p>
            <p><small>${selectedRequest.userEmail}</small></p>
            <p style="margin-top: 0.5rem"><strong>Vaccine:</strong> ${selectedRequest.vaccineType}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${selectedRequest.status}">${selectedRequest.status}</span></p>
            <div style="margin-top: 1rem">
                <p><strong>Verification Status:</strong></p>
                <small>
                    ${selectedRequest.faceVerified ? '✅' : '⏳'} Face Verification<br>
                    ${selectedRequest.deltoidDetected ? '✅' : '⏳'} Deltoid Detection<br>
                    ${selectedRequest.humanApproved ? '✅' : '⏳'} Human Approved
                </small>
            </div>
        `;
    } else {
        infoDiv.innerHTML = `
            <p>No request selected</p>
            <p><small>Start a request process from the Requests page</small></p>
        `;
    }
}

async function approveInjection() {
    if (!selectedRequest) {
        showNotification('No request selected', 'warning');
        return;
    }
    
    if (!selectedRequest.faceVerified || !selectedRequest.deltoidDetected) {
        showNotification('Please complete face and deltoid verification first', 'warning');
        return;
    }
    
    if (confirm('Approve injection? This will mark the process as ready for drone delivery.')) {
        try {
            await api.updateRequest(selectedRequest._id, {
                humanApproved: true,
                status: 'injection-ready'
            });
            
            showNotification('Injection approved - Ready for drone', 'success');
            addActivityItem(`Injection approved for ${selectedRequest.userName}`, 'success');
            
            // Clear selected request
            selectedRequest = null;
            updateSelectedRequestDisplay();
            
            // Switch back to requests page
            switchPage('requests');
        } catch (error) {
            showNotification('Failed to approve injection', 'error');
        }
    }
}
