/**
 * Live Camera Page
 * ESP32-CAM stream with face verification and deltoid detection
 * Admin/Operator only
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { vaccineAPI, cameraAPI } from '../services/api';
import { toast } from 'react-toastify';
import './LiveCamera.css';

const ESP32_STREAM_URL = 'http://10.241.12.140/stream';

const LiveCamera = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [deltoidResult, setDeltoidResult] = useState(null);
  const [streamError, setStreamError] = useState(false);
  const canvasRef = useRef(null);

  // Fetch vaccination requests for the dropdown
  const fetchRequests = useCallback(async () => {
    try {
      setLoadingRequests(true);
      const response = await vaccineAPI.getAllRequests();
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load vaccination requests');
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Handle request selection
  const handleSelectRequest = (e) => {
    const requestId = e.target.value;
    if (!requestId) {
      setSelectedRequest(null);
      return;
    }
    const request = requests.find(r => r._id === requestId);
    setSelectedRequest(request);
    setVerificationResult(null);
    setDeltoidResult(null);
    setCapturedImage(null);
  };

  // Capture image from ESP32-CAM via server
  const handleCapture = async () => {
    try {
      setProcessing(true);
      toast.info('Capturing image from camera...');
      const response = await cameraAPI.captureImage();

      if (response.data.success) {
        setCapturedImage(response.data.image);
        toast.success('Image captured successfully');
        return response.data.image;
      } else {
        toast.error('Failed to capture image');
        return null;
      }
    } catch (error) {
      console.error('Capture error:', error);
      toast.error('Camera not available. Check ESP32-CAM connection.');
      return null;
    } finally {
      setProcessing(false);
    }
  };

  // Face Verification
  const handleVerifyFace = async () => {
    if (!selectedRequest) {
      toast.warning('Please select a vaccination request first');
      return;
    }

    try {
      setProcessing(true);
      const image = capturedImage || await handleCapture();
      if (!image) return;

      toast.info('Verifying face...');

      const response = await cameraAPI.verifyFaceWithCamera({
        currentImage: image,
        registeredImage: selectedRequest.faceImage || ''
      });

      if (response.data.success) {
        const verification = response.data.verification;
        setVerificationResult(verification);

        if (verification.verified) {
          toast.success(
            `Face VERIFIED! Confidence: ${(verification.confidence * 100).toFixed(1)}%`,
            { autoClose: 5000 }
          );
          // Update request status
          await vaccineAPI.updateRequest(selectedRequest._id, {
            faceVerified: true,
            status: 'face-verification'
          });
          fetchRequests();
        } else {
          toast.error(
            'Face NOT verified. Please try again or adjust camera position.',
            { autoClose: 5000 }
          );
        }
      } else {
        toast.error('Face verification failed');
      }
    } catch (error) {
      console.error('Face verification error:', error);
      toast.error('Face verification failed. Check ML service connection.');
    } finally {
      setProcessing(false);
    }
  };

  // Deltoid Detection
  const handleDetectDeltoid = async () => {
    if (!selectedRequest) {
      toast.warning('Please select a vaccination request first');
      return;
    }

    try {
      setProcessing(true);
      const image = capturedImage || await handleCapture();
      if (!image) return;

      toast.info('Detecting deltoid region...');

      const response = await cameraAPI.detectDeltoidWithCamera({
        image: image
      });

      if (response.data.success) {
        const detection = response.data.detection;
        setDeltoidResult(detection);

        if (detection.detected) {
          toast.success(
            `Deltoid DETECTED! Confidence: ${(detection.confidence * 100).toFixed(1)}% - Position: (${detection.coordinates.x}, ${detection.coordinates.y})`,
            { autoClose: 5000 }
          );

          // Draw marker on canvas
          drawDeltoidMarker(image, detection.coordinates);

          // Update request status
          await vaccineAPI.updateRequest(selectedRequest._id, {
            deltoidDetected: true,
            deltoidCoordinates: detection.coordinates,
            status: 'injection-ready'
          });
          fetchRequests();
        } else {
          toast.error(
            'Deltoid NOT detected. Please adjust camera to show shoulder area.',
            { autoClose: 5000 }
          );
        }
      } else {
        toast.error('Deltoid detection failed');
      }
    } catch (error) {
      console.error('Deltoid detection error:', error);
      toast.error('Deltoid detection failed. Check ML service connection.');
    } finally {
      setProcessing(false);
    }
  };

  // Draw deltoid marker on canvas
  const drawDeltoidMarker = (imageData, coordinates) => {
    if (!canvasRef.current || !coordinates) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const x = coordinates.x;
      const y = coordinates.y;

      // Draw crosshair
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x - 35, y);
      ctx.lineTo(x + 35, y);
      ctx.moveTo(x, y - 35);
      ctx.lineTo(x, y + 35);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('INJECTION POINT', x + 30, y - 30);
    };

    img.src = imageData;
  };

  // Reset results
  const handleReset = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setDeltoidResult(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f59e0b',
      'approved': '#3b82f6',
      'in-progress': '#8b5cf6',
      'face-verification': '#14b8a6',
      'injection-ready': '#10b981',
      'completed': '#059669',
      'cancelled': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="live-camera-page">
      <div className="live-camera-header">
        <h1>Live Camera Feed</h1>
        <p>ESP32-CAM Stream with AI-Powered Face Verification & Deltoid Detection</p>
      </div>

      <div className="live-camera-layout">
        {/* Left: Camera Feed */}
        <div className="camera-feed-section">
          <div className="feed-container">
            <div className="feed-label">
              <span className="live-dot"></span> LIVE FEED
            </div>
            {!streamError ? (
              <img
                src={ESP32_STREAM_URL}
                alt="ESP32-CAM Live Stream"
                className="camera-stream"
                onError={() => setStreamError(true)}
              />
            ) : (
              <div className="stream-error">
                <p>Camera stream unavailable</p>
                <p className="stream-error-sub">Check ESP32-CAM connection at {ESP32_STREAM_URL}</p>
                <button
                  className="btn-retry"
                  onClick={() => setStreamError(false)}
                >
                  Retry Connection
                </button>
              </div>
            )}
          </div>

          {/* Captured Image / Deltoid Canvas */}
          {(capturedImage || deltoidResult) && (
            <div className="captured-section">
              <h3>Captured Frame</h3>
              <div className="captured-container">
                {deltoidResult && deltoidResult.detected ? (
                  <canvas ref={canvasRef} className="captured-canvas" />
                ) : (
                  capturedImage && <img src={capturedImage} alt="Captured" className="captured-img" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls & Results */}
        <div className="controls-section">
          {/* Request Selector */}
          <div className="control-card">
            <h3>Select Vaccination Request</h3>
            <select
              className="request-select"
              onChange={handleSelectRequest}
              value={selectedRequest?._id || ''}
              disabled={loadingRequests}
            >
              <option value="">
                {loadingRequests ? 'Loading requests...' : '-- Select a request --'}
              </option>
              {requests.map(req => (
                <option key={req._id} value={req._id}>
                  {req.userName} - {req.vaccineType} ({req.status})
                </option>
              ))}
            </select>

            {selectedRequest && (
              <div className="selected-info">
                <p><strong>Patient:</strong> {selectedRequest.userName}</p>
                <p><strong>Email:</strong> {selectedRequest.userEmail}</p>
                <p><strong>Vaccine:</strong> {selectedRequest.vaccineType}</p>
                <p><strong>Location:</strong> {selectedRequest.location}</p>
                <p>
                  <strong>Status: </strong>
                  <span
                    className="status-tag"
                    style={{ backgroundColor: getStatusColor(selectedRequest.status) }}
                  >
                    {selectedRequest.status}
                  </span>
                </p>
                <div className="verification-checklist">
                  <span className={selectedRequest.faceVerified ? 'check-done' : 'check-pending'}>
                    {selectedRequest.faceVerified ? 'V' : '?'} Face
                  </span>
                  <span className={selectedRequest.deltoidDetected ? 'check-done' : 'check-pending'}>
                    {selectedRequest.deltoidDetected ? 'V' : '?'} Deltoid
                  </span>
                  <span className={selectedRequest.humanApproved ? 'check-done' : 'check-pending'}>
                    {selectedRequest.humanApproved ? 'V' : '?'} Approved
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="control-card">
            <h3>Camera Controls</h3>
            <div className="action-buttons">
              <button
                className="btn-action btn-capture"
                onClick={handleCapture}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Capture Frame'}
              </button>
              <button
                className="btn-action btn-verify"
                onClick={handleVerifyFace}
                disabled={processing || !selectedRequest}
              >
                {processing ? 'Verifying...' : 'Verify Face'}
              </button>
              <button
                className="btn-action btn-detect"
                onClick={handleDetectDeltoid}
                disabled={processing || !selectedRequest}
              >
                {processing ? 'Detecting...' : 'Detect Deltoid'}
              </button>
              <button
                className="btn-action btn-reset"
                onClick={handleReset}
                disabled={processing}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Face Verification Result */}
          {verificationResult && (
            <div className={`result-card ${verificationResult.verified ? 'result-success' : 'result-fail'}`}>
              <h3>{verificationResult.verified ? 'Face Verified' : 'Face Not Verified'}</h3>
              <p><strong>Confidence:</strong> {(verificationResult.confidence * 100).toFixed(1)}%</p>
              <p><strong>Message:</strong> {verificationResult.message}</p>
            </div>
          )}

          {/* Deltoid Detection Result */}
          {deltoidResult && (
            <div className={`result-card ${deltoidResult.detected ? 'result-success' : 'result-fail'}`}>
              <h3>{deltoidResult.detected ? 'Deltoid Detected' : 'Deltoid Not Detected'}</h3>
              {deltoidResult.detected && deltoidResult.coordinates && (
                <>
                  <p><strong>Position:</strong> X: {deltoidResult.coordinates.x}, Y: {deltoidResult.coordinates.y}</p>
                  <p><strong>Confidence:</strong> {(deltoidResult.confidence * 100).toFixed(1)}%</p>
                </>
              )}
              <p><strong>Message:</strong> {deltoidResult.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveCamera;
