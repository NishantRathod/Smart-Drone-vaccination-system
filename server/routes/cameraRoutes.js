/**
 * ESP32 Camera Routes
 * Handles camera streaming and ML integration
 */

const { verifyToken, verifyAdmin, sendJSON } = require('../middleware/auth');
const axios = require('axios');

// ESP32 Camera Configuration
const ESP32_CAM_URL = process.env.ESP32_CAM_URL || 'http://10.241.12.140';
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Get Camera Stream Info
 * GET /api/camera/info
 */
async function getCameraInfo(req, res) {
  verifyAdmin(req, res, async () => {
    try {
      return sendJSON(res, 200, {
        success: true,
        camera: {
          url: ESP32_CAM_URL,
          streamUrl: `${ESP32_CAM_URL}/stream`,
          captureUrl: `${ESP32_CAM_URL}/capture`,
          status: 'available'
        }
      });
    } catch (error) {
      console.error('Camera Info Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Failed to get camera info',
        error: error.message
      });
    }
  });
}

/**
 * Capture Image from ESP32 Camera
 * POST /api/camera/capture
 */
async function captureImage(req, res) {
  verifyAdmin(req, res, async () => {
    try {
      // ESP32-CAM capture endpoint
      const response = await axios.get(`${ESP32_CAM_URL}/capture`, {
        responseType: 'arraybuffer',
        timeout: 10000
      });
      
      // Convert to base64
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      
      return sendJSON(res, 200, {
        success: true,
        image: dataUrl,
        message: 'Image captured successfully'
      });
      
    } catch (error) {
      console.error('Camera Capture Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Failed to capture image from camera',
        error: error.message
      });
    }
  });
}

/**
 * Verify Face using ML Service
 * POST /api/camera/verify-face
 * Body: { currentImage: base64 }
 */
async function verifyFaceWithML(req, res) {
  verifyAdmin(req, res, async () => {
    try {
      const { currentImage, registeredImage } = req.body;
      
      if (!currentImage) {
        return sendJSON(res, 400, {
          success: false,
          message: 'Current image is required'
        });
      }
      
      // Call ML service
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/verify-face`, {
        registered_face: registeredImage || '',
        current_face: currentImage
      }, {
        timeout: 15000
      });
      
      return sendJSON(res, 200, {
        success: true,
        verification: mlResponse.data
      });
      
    } catch (error) {
      console.error('Face Verification Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Face verification failed',
        error: error.response?.data || error.message
      });
    }
  });
}

/**
 * Detect Deltoid using ML Service
 * POST /api/camera/detect-deltoid
 * Body: { image: base64 }
 */
async function detectDeltoidWithML(req, res) {
  verifyAdmin(req, res, async () => {
    try {
      const { image } = req.body;
      
      if (!image) {
        return sendJSON(res, 400, {
          success: false,
          message: 'Image is required'
        });
      }
      
      // Call ML service
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/detect-deltoid`, {
        image: image
      }, {
        timeout: 15000
      });
      
      return sendJSON(res, 200, {
        success: true,
        detection: mlResponse.data
      });
      
    } catch (error) {
      console.error('Deltoid Detection Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Deltoid detection failed',
        error: error.response?.data || error.message
      });
    }
  });
}

/**
 * Stream Proxy (optional - for CORS handling)
 * GET /api/camera/stream
 */
async function streamProxy(req, res) {
  verifyAdmin(req, res, async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `${ESP32_CAM_URL}/stream`,
        responseType: 'stream'
      });
      
      res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');
      response.data.pipe(res);
      
    } catch (error) {
      console.error('Stream Proxy Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Failed to stream from camera'
      });
    }
  });
}

/**
 * Test ML Service Connection
 * GET /api/camera/ml-health
 */
async function checkMLHealth(req, res) {
  verifyAdmin(req, res, async () => {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`, {
        timeout: 5000
      });
      
      return sendJSON(res, 200, {
        success: true,
        mlService: response.data
      });
      
    } catch (error) {
      console.error('ML Health Check Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'ML service is not available',
        error: error.message
      });
    }
  });
}

module.exports = {
  getCameraInfo,
  captureImage,
  verifyFaceWithML,
  detectDeltoidWithML,
  streamProxy,
  checkMLHealth
};
