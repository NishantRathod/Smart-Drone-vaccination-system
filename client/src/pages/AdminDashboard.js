/**
 * Admin Dashboard Component
 * Complete monitoring and control system with ESP32 CAM integration
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { vaccineAPI } from '../services/api';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'camera', 'face-verify', 'deltoid-detect'
  const [cameraImage, setCameraImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [deltoidResult, setDeltoidResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef(null);
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  const fetchAllRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await vaccineAPI.getAllRequests(params);
      
      if (response.data.success) {
        const requestsData = response.data.requests;
        setRequests(requestsData);
        
        // Calculate statistics
        const stats = {
          total: response.data.total,
          pending: requestsData.filter(r => r.status === 'pending' || r.status === 'approved').length,
          inProgress: requestsData.filter(r => 
            r.status === 'in-progress' || 
            r.status === 'face-verification' || 
            r.status === 'injection-ready'
          ).length,
          completed: requestsData.filter(r => r.status === 'completed').length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      showNotification('Failed to load vaccination requests', 'error');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchAllRequests();
  }, [fetchAllRequests]);

  // Notification helper
  const showNotification = (message, type = 'info') => {
    // Simple notification - can be replaced with toast library
    alert(message);
  };

  const updateRequestStatus = async (requestId, updateData) => {
    try {
      const response = await vaccineAPI.updateRequest(requestId, updateData);
      
      if (response.data.success) {
        showNotification('Request updated successfully', 'success');
        fetchAllRequests();
        setShowModal(false);
        setSelectedRequest(null);
      } else {
        showNotification(response.data.message || 'Update failed', 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      showNotification('Failed to update request', 'error');
    }
  };

  // Camera Functions
  const captureFromCamera = async () => {
    try {
      setProcessing(true);
      const response = await axios.post(`${API_URL}/api/camera/capture`);
      
      if (response.data.success) {
        setCameraImage(response.data.image);
        showNotification('Image captured successfully', 'success');
        return response.data.image;
      } else {
        showNotification('Failed to capture image', 'error');
        return null;
      }
    } catch (error) {
      console.error('Camera capture error:', error);
      showNotification('Camera not available', 'error');
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const verifyFaceFromCamera = async (request) => {
    try {
      setProcessing(true);
      const image = cameraImage || await captureFromCamera();
      
      if (!image) {
        showNotification('No image captured', 'error');
        return;
      }

      // Call face verification API
      const response = await axios.post(`${API_URL}/api/camera/verify-face`, {
        currentImage: image,
        registeredImage: request.faceImage || ''
      });

      if (response.data.success) {
        const verification = response.data.verification;
        setVerificationResult(verification);
        
        if (verification.verified) {
          showNotification(`Face verified! Confidence: ${(verification.confidence).toFixed(2)}`, 'success');
          
          // Update request status
          await updateRequestStatus(request._id, {
            faceVerified: true,
            faceVerificationData: verification,
            status: 'face-verification'
          });
        } else {
          showNotification('Face not verified. Please try again.', 'warning');
        }
      }
    } catch (error) {
      console.error('Face verification error:', error);
      showNotification('Face verification failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const detectDeltoidFromCamera = async (request) => {
    try {
      setProcessing(true);
      const image = cameraImage || await captureFromCamera();
      
      if (!image) {
        showNotification('No image captured', 'error');
        return;
      }

      // Call deltoid detection API
      const response = await axios.post(`${API_URL}/api/camera/detect-deltoid`, {
        image: image
      });

      if (response.data.success) {
        const detection = response.data.detection;
        setDeltoidResult(detection);
        
        if (detection.detected) {
          showNotification(`Deltoid detected! Confidence: ${(detection.confidence * 100).toFixed(1)}%`, 'success');
          
          // Draw detection on canvas
          drawDeltoidMarker(detection.coordinates);
          
          // Update request status
          await updateRequestStatus(request._id, {
            deltoidDetected: true,
            deltoidCoordinates: detection.coordinates,
            deltoidConfidence: detection.confidence,
            status: 'injection-ready'
          });
        } else {
          showNotification('Deltoid not detected. Please adjust camera position.', 'warning');
        }
      }
    } catch (error) {
      console.error('Deltoid detection error:', error);
      showNotification('Deltoid detection failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const drawDeltoidMarker = (coordinates) => {
    if (!canvasRef.current || !cameraImage || !coordinates) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Draw marker at deltoid position
      const x = coordinates.x;
      const y = coordinates.y;
      
      // Draw crosshair
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x - 30, y);
      ctx.lineTo(x + 30, y);
      ctx.moveTo(x, y - 30);
      ctx.lineTo(x, y + 30);
      ctx.stroke();
      
      // Add label
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px Arial';
      ctx.fillText('INJECTION POINT', x + 25, y - 25);
    };
    
    img.src = cameraImage;
  };

  const handleApprove = (request) => {
    updateRequestStatus(request._id, {
      status: 'approved',
      operatorName: 'Admin'
    });
  };

  const handleStartProcess = (request) => {
    setSelectedRequest(request);
    setModalType('camera');
    setShowModal(true);
    setCameraImage(null);
    setVerificationResult(null);
    setDeltoidResult(null);
  };

  const handleVerifyFace = async (request) => {
    setSelectedRequest(request);
    setModalType('face-verify');
    setShowModal(true);
    setCameraImage(null);
    setVerificationResult(null);
  };

  const handleDetectDeltoid = async (request) => {
    setSelectedRequest(request);
    setModalType('deltoid-detect');
    setShowModal(true);
    setCameraImage(null);
    setDeltoidResult(null);
  };

  const handleHumanApproval = (request, approved) => {
    if (approved) {
      updateRequestStatus(request._id, {
        humanApproved: true,
        status: 'in-progress'
      });
      showNotification('Injection approved - proceeding with vaccination', 'success');
    } else {
      updateRequestStatus(request._id, {
        status: 'cancelled',
        notes: 'Rejected by operator during human approval'
      });
      showNotification('Injection rejected', 'warning');
    }
  };

  const handleComplete = (request) => {
    updateRequestStatus(request._id, {
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const handleCancel = (request) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      updateRequestStatus(request._id, {
        status: 'cancelled'
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'orange', icon: '⏳' },
      'approved': { color: 'blue', icon: '✓' },
      'in-progress': { color: 'purple', icon: '🔄' },
      'face-verification': { color: 'teal', icon: '👤' },
      'injection-ready': { color: 'green', icon: '💉' },
      'completed': { color: 'success', icon: '✅' },
      'cancelled': { color: 'gray', icon: '❌' },
      'failed': { color: 'red', icon: '⚠️' }
    };
    
    const config = statusConfig[status] || { color: 'gray', icon: '?' };
    
    return (
      <span className={`status-badge status-${config.color}`}>
        {config.icon} {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🔧 Admin Dashboard</h1>
        <p>Manage and monitor all vaccination requests</p>
      </div>

      {/* Statistics */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h3>Filter by Status:</h3>
        <div className="filter-buttons">
          <button 
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button 
            className={filterStatus === 'pending' ? 'active' : ''}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button 
            className={filterStatus === 'approved' ? 'active' : ''}
            onClick={() => setFilterStatus('approved')}
          >
            Approved
          </button>
          <button 
            className={filterStatus === 'in-progress' ? 'active' : ''}
            onClick={() => setFilterStatus('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={filterStatus === 'completed' ? 'active' : ''}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="admin-requests">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <p>No requests found</p>
          </div>
        ) : (
          <div className="requests-table">
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
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="request-id">{request._id.substring(0, 8)}</td>
                    <td>
                      <div className="patient-info">
                        <strong>{request.userName}</strong>
                        <small>{request.userEmail}</small>
                      </div>
                    </td>
                    <td>{request.vaccineType}</td>
                    <td className="location-cell">{request.location}</td>
                    <td>{formatDate(request.scheduledDate)}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <div className="verification-status">
                        <span className={request.faceVerified ? 'verified' : 'not-verified'}>
                          {request.faceVerified ? '✅' : '⏳'} Face
                        </span>
                        <span className={request.deltoidDetected ? 'verified' : 'not-verified'}>
                          {request.deltoidDetected ? '✅' : '⏳'} Deltoid
                        </span>
                        <span className={request.humanApproved ? 'verified' : 'not-verified'}>
                          {request.humanApproved ? '✅' : '⏳'} Human
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {request.status === 'pending' && (
                          <button 
                            className="btn-action btn-approve"
                            onClick={() => handleApprove(request)}
                          >
                            Approve
                          </button>
                        )}
                        
                        {request.status === 'approved' && (
                          <button 
                            className="btn-action btn-start"
                            onClick={() => handleStartProcess(request)}
                          >
                            Start
                          </button>
                        )}
                        
                        {request.status === 'in-progress' && !request.faceVerified && (
                          <button 
                            className="btn-action btn-verify"
                            onClick={() => handleVerifyFace(request)}
                          >
                            Verify Face
                          </button>
                        )}
                        
                        {request.status === 'face-verification' && !request.deltoidDetected && (
                          <button 
                            className="btn-action btn-detect"
                            onClick={() => handleDetectDeltoid(request)}
                          >
                            Detect Deltoid
                          </button>
                        )}
                        
                        {request.status === 'injection-ready' && !request.humanApproved && (
                          <>
                            <button 
                              className="btn-action btn-approve-injection"
                              onClick={() => handleHumanApproval(request, true)}
                            >
                              Approve Injection
                            </button>
                            <button 
                              className="btn-action btn-reject"
                              onClick={() => handleHumanApproval(request, false)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {request.humanApproved && request.status !== 'completed' && (
                          <button 
                            className="btn-action btn-complete"
                            onClick={() => handleComplete(request)}
                          >
                            Mark Complete
                          </button>
                        )}
                        
                        {request.status !== 'completed' && request.status !== 'cancelled' && (
                          <button 
                            className="btn-action btn-cancel"
                            onClick={() => handleCancel(request)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Camera & ML Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'camera' && '📷 Camera Control'}
                {modalType === 'face-verify' && '👤 Face Verification'}
                {modalType === 'deltoid-detect' && '💉 Deltoid Detection'}
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              {/* Patient Info */}
              <div className="patient-card">
                <h3>Patient Information</h3>
                <p><strong>Name:</strong> {selectedRequest.userName}</p>
                <p><strong>Email:</strong> {selectedRequest.userEmail}</p>
                <p><strong>Vaccine:</strong> {selectedRequest.vaccineType}</p>
                <p><strong>Location:</strong> {selectedRequest.location}</p>
              </div>

              {/* Camera Feed / Image Display */}
              <div className="camera-section">
                <h3>ESP32 Camera Feed</h3>
                <div className="camera-display">
                  {cameraImage ? (
                    <div className="captured-image">
                      {deltoidResult && deltoidResult.detected ? (
                        <canvas ref={canvasRef} />
                      ) : (
                        <img src={cameraImage} alt="Captured" />
                      )}
                    </div>
                  ) : (
                    <div className="no-image">
                      <p>📷 No image captured</p>
                      <p>Click "Capture Image" to take a photo</p>
                    </div>
                  )}
                </div>

                <div className="camera-controls">
                  <button 
                    className="btn-camera"
                    onClick={captureFromCamera}
                    disabled={processing}
                  >
                    {processing ? '⏳ Capturing...' : '📸 Capture Image'}
                  </button>
                  
                  {cameraImage && (
                    <button 
                      className="btn-camera btn-retake"
                      onClick={() => setCameraImage(null)}
                    >
                      🔄 Retake
                    </button>
                  )}
                </div>
              </div>

              {/* Face Verification Section */}
              {(modalType === 'face-verify' || modalType === 'camera') && (
                <div className="verification-section">
                  <h3>Face Verification</h3>
                  {verificationResult ? (
                    <div className={`result-box ${verificationResult.verified ? 'success' : 'error'}`}>
                      <h4>{verificationResult.verified ? '✅ Face Verified' : '❌ Face Not Verified'}</h4>
                      <p><strong>Confidence:</strong> {(verificationResult.confidence).toFixed(2)}</p>
                      <p><strong>Message:</strong> {verificationResult.message}</p>
                      {verificationResult.user_file && (
                        <p><strong>Matched With:</strong> {verificationResult.user_file}</p>
                      )}
                    </div>
                  ) : (
                    <div className="verification-actions">
                      <button 
                        className="btn-verify"
                        onClick={() => verifyFaceFromCamera(selectedRequest)}
                        disabled={!cameraImage || processing}
                      >
                        {processing ? '⏳ Verifying...' : '🔍 Verify Face'}
                      </button>
                      <p className="help-text">Capture an image first, then click verify to match with registered face</p>
                    </div>
                  )}
                </div>
              )}

              {/* Deltoid Detection Section */}
              {(modalType === 'deltoid-detect' || modalType === 'camera') && (
                <div className="detection-section">
                  <h3>Deltoid Detection</h3>
                  {deltoidResult ? (
                    <div className={`result-box ${deltoidResult.detected ? 'success' : 'error'}`}>
                      <h4>{deltoidResult.detected ? '✅ Deltoid Detected' : '❌ Deltoid Not Detected'}</h4>
                      {deltoidResult.detected && deltoidResult.coordinates && (
                        <>
                          <p><strong>Position:</strong> X: {deltoidResult.coordinates.x}, Y: {deltoidResult.coordinates.y}</p>
                          <p><strong>Confidence:</strong> {(deltoidResult.confidence * 100).toFixed(1)}%</p>
                        </>
                      )}
                      <p><strong>Message:</strong> {deltoidResult.message}</p>
                    </div>
                  ) : (
                    <div className="detection-actions">
                      <button 
                        className="btn-detect"
                        onClick={() => detectDeltoidFromCamera(selectedRequest)}
                        disabled={!cameraImage || processing}
                      >
                        {processing ? '⏳ Detecting...' : '🎯 Detect Deltoid'}
                      </button>
                      <p className="help-text">Capture shoulder image, then click detect to identify injection point</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="modal-actions">
                {verificationResult && verificationResult.verified && (
                  <button 
                    className="btn-action btn-success"
                    onClick={() => {
                      updateRequestStatus(selectedRequest._id, {
                        faceVerified: true,
                        faceVerificationData: verificationResult,
                        status: 'face-verification'
                      });
                    }}
                  >
                    ✅ Confirm Face Verification
                  </button>
                )}
                
                {deltoidResult && deltoidResult.detected && (
                  <button 
                    className="btn-action btn-success"
                    onClick={() => {
                      updateRequestStatus(selectedRequest._id, {
                        deltoidDetected: true,
                        deltoidCoordinates: deltoidResult.coordinates,
                        deltoidConfidence: deltoidResult.confidence,
                        status: 'injection-ready'
                      });
                    }}
                  >
                    ✅ Confirm Deltoid Detection
                  </button>
                )}
                
                <button 
                  className="btn-action btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
