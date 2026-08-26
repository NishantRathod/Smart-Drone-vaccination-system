/**
 * ML Integration Routes
 * Communicates with Python ML Microservice (No Express.js)
 */

const https = require('https');
const http = require('http');
const { verifyToken, sendJSON } = require('../middleware/auth');
const VaccinationRequest = require('../models/VaccinationRequest');
const User = require('../models/User');

// ML Service Configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Make HTTP Request to ML Service
 */
function makeMLRequest(endpoint, method, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, ML_SERVICE_URL);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const req = protocol.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          reject(new Error('Invalid JSON response from ML service'));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data && (method === 'POST' || method === 'PUT')) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Verify Face using ML Model
 * POST /api/ml/verify-face
 */
async function verifyFace(req, res) {
  verifyToken(req, res, async () => {
    try {
      const { userId, faceImage, requestId } = req.body;
      
      if (!faceImage) {
        return sendJSON(res, 400, {
          success: false,
          message: 'Face image is required'
        });
      }
      
      // Get user's registered face image
      const user = await User.findById(userId || req.user.id);
      if (!user) {
        return sendJSON(res, 404, {
          success: false,
          message: 'User not found'
        });
      }
      
      if (!user.faceImage) {
        return sendJSON(res, 400, {
          success: false,
          message: 'No registered face image found. Please register your face first.'
        });
      }
      
      try {
        // Call ML Service for face verification
        const mlResponse = await makeMLRequest('/verify-face', 'POST', {
          registered_face: user.faceImage,
          current_face: faceImage
        });
        
        // Update user or vaccination request based on verification
        if (mlResponse.status === 'verified' && mlResponse.confidence > 0.7) {
          user.faceVerified = true;
          await user.save();
          
          // If requestId provided, update vaccination request
          if (requestId) {
            await VaccinationRequest.findByIdAndUpdate(requestId, {
              faceVerified: true,
              faceVerificationDate: new Date(),
              status: 'face-verification'
            });
          }
          
          return sendJSON(res, 200, {
            success: true,
            message: 'Face verification successful',
            verified: true,
            confidence: mlResponse.confidence,
            mlResponse
          });
        } else {
          return sendJSON(res, 200, {
            success: false,
            message: 'Face verification failed',
            verified: false,
            confidence: mlResponse.confidence || 0,
            mlResponse
          });
        }
        
      } catch (mlError) {
        console.error('ML Service Error:', mlError);
        return sendJSON(res, 503, {
          success: false,
          message: 'ML service unavailable. Using fallback verification.',
          verified: false,
          error: mlError.message
        });
      }
      
    } catch (error) {
      console.error('Verify Face Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Server error during face verification',
        error: error.message
      });
    }
  });
}

/**
 * Detect Deltoid (Shoulder Injection Point) using ML Model
 * POST /api/ml/detect-deltoid
 */
async function detectDeltoid(req, res) {
  verifyToken(req, res, async () => {
    try {
      const { image, requestId } = req.body;
      
      if (!image) {
        return sendJSON(res, 400, {
          success: false,
          message: 'Shoulder image is required'
        });
      }
      
      try {
        // Call ML Service for deltoid detection
        const mlResponse = await makeMLRequest('/detect-deltoid', 'POST', {
          image: image
        });
        
        if (mlResponse.detected && mlResponse.coordinates) {
          // Update vaccination request with deltoid coordinates
          if (requestId) {
            await VaccinationRequest.findByIdAndUpdate(requestId, {
              deltoidDetected: true,
              deltoidCoordinates: mlResponse.coordinates,
              deltoidDetectionDate: new Date(),
              status: 'injection-ready'
            });
          }
          
          return sendJSON(res, 200, {
            success: true,
            message: 'Deltoid detected successfully',
            detected: true,
            coordinates: mlResponse.coordinates,
            confidence: mlResponse.confidence,
            mlResponse
          });
        } else {
          return sendJSON(res, 200, {
            success: false,
            message: 'Deltoid detection failed',
            detected: false,
            mlResponse
          });
        }
        
      } catch (mlError) {
        console.error('ML Service Error:', mlError);
        return sendJSON(res, 503, {
          success: false,
          message: 'ML service unavailable',
          detected: false,
          error: mlError.message
        });
      }
      
    } catch (error) {
      console.error('Detect Deltoid Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Server error during deltoid detection',
        error: error.message
      });
    }
  });
}

module.exports = {
  verifyFace,
  detectDeltoid
};
