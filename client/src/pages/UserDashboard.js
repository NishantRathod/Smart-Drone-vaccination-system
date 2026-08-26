/**
 * User Dashboard Component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vaccineAPI } from '../services/api';
import { toast } from 'react-toastify';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    inProgress: 0
  });

  useEffect(() => {
    fetchVaccinationRequests();
  }, []);

  const fetchVaccinationRequests = async () => {
    try {
      const response = await vaccineAPI.getStatus();
      
      if (response.data.success) {
        const requestsData = response.data.requests;
        setRequests(requestsData);
        
        // Calculate statistics
        const stats = {
          total: requestsData.length,
          pending: requestsData.filter(r => r.status === 'pending' || r.status === 'approved').length,
          completed: requestsData.filter(r => r.status === 'completed').length,
          inProgress: requestsData.filter(r => r.status === 'in-progress' || r.status === 'face-verification' || r.status === 'injection-ready').length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load vaccination requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'approved': 'status-approved',
      'in-progress': 'status-in-progress',
      'face-verification': 'status-verification',
      'injection-ready': 'status-ready',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled',
      'failed': 'status-failed'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.replace('-', ' ').toUpperCase()}
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
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Manage your vaccination requests and view your status</p>
        </div>
        <Link to="/book-vaccination" className="btn btn-primary">
          + Book New Vaccination
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
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

      {/* User Profile Card */}
      <div className="profile-card">
        <h2>Your Profile</h2>
        <div className="profile-content">
          <div className="profile-image">
            {user?.faceImage ? (
              <img src={user.faceImage} alt="Profile" />
            ) : (
              <div className="profile-placeholder">👤</div>
            )}
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <strong>Name:</strong> {user?.name}
            </div>
            <div className="detail-item">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="detail-item">
              <strong>Role:</strong> {user?.role}
            </div>
            <div className="detail-item">
              <strong>Face Verified:</strong> {user?.faceVerified ? '✅ Yes' : '❌ Not yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Vaccination Requests */}
      <div className="requests-section">
        <h2>Your Vaccination Requests</h2>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Vaccination Requests Yet</h3>
            <p>Book your first vaccination to get started</p>
            <Link to="/book-vaccination" className="btn btn-primary">
              Book Vaccination
            </Link>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div className="request-title">
                    <h3>{request.vaccineType} Vaccine</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="request-id">
                    ID: {request._id.substring(0, 8)}
                  </div>
                </div>
                
                <div className="request-details">
                  <div className="detail-row">
                    <span className="detail-label">📍 Location:</span>
                    <span className="detail-value">{request.location}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">📅 Scheduled:</span>
                    <span className="detail-value">{formatDate(request.scheduledDate)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">🕒 Created:</span>
                    <span className="detail-value">{formatDate(request.createdAt)}</span>
                  </div>
                  
                  {request.droneAssigned && (
                    <div className="detail-row">
                      <span className="detail-label">🚁 Drone:</span>
                      <span className="detail-value">{request.droneAssigned}</span>
                    </div>
                  )}
                  
                  {request.notes && (
                    <div className="detail-row">
                      <span className="detail-label">📝 Notes:</span>
                      <span className="detail-value">{request.notes}</span>
                    </div>
                  )}
                </div>
                
                <div className="request-verification">
                  <div className="verification-item">
                    <span className={`verification-badge ${request.faceVerified ? 'verified' : 'pending'}`}>
                      {request.faceVerified ? '✅' : '⏳'} Face Verification
                    </span>
                  </div>
                  <div className="verification-item">
                    <span className={`verification-badge ${request.deltoidDetected ? 'verified' : 'pending'}`}>
                      {request.deltoidDetected ? '✅' : '⏳'} Deltoid Detection
                    </span>
                  </div>
                  <div className="verification-item">
                    <span className={`verification-badge ${request.humanApproved ? 'verified' : 'pending'}`}>
                      {request.humanApproved ? '✅' : '⏳'} Human Approval
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
