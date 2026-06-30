/**
 * Smart Vaccination System - Main Server
 * Node.js HTTP Server (No Express.js)
 * Author: Engineering Team
 * Date: March 2026
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const vaccineRoutes = require('./routes/vaccineRoutes');
const mlRoutes = require('./routes/mlRoutes');
const cameraRoutes = require('./routes/cameraRoutes');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-vaccination')
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Server Configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const ADMIN_PORTAL_DIR = path.join(__dirname, '..', 'admin-portal');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

/**
 * Parse JSON body from request
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB default

    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > maxSize) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Parse multipart form data (for file uploads)
 */
function parseMultipartForm(req, boundary) {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    
    req.on('data', chunk => {
      buffer = Buffer.concat([buffer, chunk]);
    });
    
    req.on('end', () => {
      try {
        const parts = {};
        const boundaryBuffer = Buffer.from('--' + boundary);
        let position = 0;
        
        while (position < buffer.length) {
          const start = buffer.indexOf(boundaryBuffer, position);
          if (start === -1) break;
          
          const nextBoundary = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length);
          if (nextBoundary === -1) break;
          
          const part = buffer.slice(start + boundaryBuffer.length, nextBoundary);
          const headerEnd = part.indexOf('\r\n\r\n');
          
          if (headerEnd !== -1) {
            const headers = part.slice(0, headerEnd).toString();
            const content = part.slice(headerEnd + 4, -2);
            
            const nameMatch = headers.match(/name="([^"]+)"/);
            if (nameMatch) {
              const fieldName = nameMatch[1];
              
              // Check if it's a file
              const filenameMatch = headers.match(/filename="([^"]+)"/);
              if (filenameMatch) {
                parts[fieldName] = {
                  filename: filenameMatch[1],
                  data: content,
                  contentType: headers.match(/Content-Type: ([^\r\n]+)/)?.[1] || 'application/octet-stream'
                };
              } else {
                parts[fieldName] = content.toString();
              }
            }
          }
          
          position = nextBoundary;
        }
        
        resolve(parts);
      } catch (error) {
        reject(error);
      }
    });
    
    req.on('error', reject);
  });
}

/**
 * CORS Middleware
 */
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

/**
 * Send JSON Response
 */
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveStaticFile(res, baseDir, requestPath) {
  const relativePath = requestPath.replace(/^\/admin-portal\/?/, '') || 'index.html';
  const filePath = path.resolve(baseDir, relativePath);

  if (!filePath.startsWith(baseDir)) {
    return sendJSON(res, 403, {
      success: false,
      message: 'Forbidden'
    });
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      return sendJSON(res, 404, {
        success: false,
        message: 'Admin portal file not found'
      });
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream'
    });
    res.end(content);
  });
}

/**
 * Main Request Handler
 */
async function requestHandler(req, res) {
  // Set CORS headers
  setCORSHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);
  
  try {
    // Parse request body
    let body = {};
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      const boundary = contentType.split('boundary=')[1];
      body = await parseMultipartForm(req, boundary);
    } else if (method === 'POST' || method === 'PUT') {
      try {
        body = await parseBody(req);
      } catch (parseError) {
        return sendJSON(res, 400, {
          success: false,
          message: parseError.message.includes('too large')
            ? 'Request body too large. Maximum size is 10MB.'
            : 'Invalid JSON in request body.'
        });
      }
    }
    
    req.body = body;
    req.query = parsedUrl.query;
    
    // Route Handling
    if (pathname === '/' || pathname === '/api') {
      sendJSON(res, 200, {
        message: '🚁 Smart Vaccination System API',
        version: '1.0.0',
        status: 'active',
        endpoints: {
          auth: '/api/register, /api/login',
          vaccine: '/api/vaccine-request, /api/vaccine-status',
          ml: '/api/ml/verify-face, /api/ml/detect-deltoid',
          camera: '/api/camera/capture, /api/camera/verify-face'
        }
      });
    }
    else if (pathname === '/admin-portal') {
      res.writeHead(302, { Location: '/admin-portal/' });
      res.end();
    }
    else if (pathname.startsWith('/admin-portal/') && method === 'GET') {
      serveStaticFile(res, ADMIN_PORTAL_DIR, pathname);
    }
    // Authentication Routes
    else if (pathname === '/api/register' && method === 'POST') {
      await authRoutes.register(req, res);
    }
    else if (pathname === '/api/login' && method === 'POST') {
      await authRoutes.login(req, res);
    }
    else if (pathname === '/api/profile' && method === 'GET') {
      await authRoutes.getProfile(req, res);
    }
    // Vaccine Routes
    else if (pathname === '/api/vaccine-request' && method === 'POST') {
      await vaccineRoutes.createRequest(req, res);
    }
    else if (pathname === '/api/vaccine-status' && method === 'GET') {
      await vaccineRoutes.getStatus(req, res);
    }
    else if (pathname === '/api/vaccine-requests' && method === 'GET') {
      await vaccineRoutes.getAllRequests(req, res);
    }
    else if (pathname.startsWith('/api/vaccine-request/') && method === 'PUT') {
      await vaccineRoutes.updateRequest(req, res);
    }
    // ML Routes
    else if (pathname === '/api/ml/verify-face' && method === 'POST') {
      await mlRoutes.verifyFace(req, res);
    }
    else if (pathname === '/api/ml/detect-deltoid' && method === 'POST') {
      await mlRoutes.detectDeltoid(req, res);
    }
    // Camera Routes
    else if (pathname === '/api/camera/info' && method === 'GET') {
      await cameraRoutes.getCameraInfo(req, res);
    }
    else if (pathname === '/api/camera/capture' && method === 'POST') {
      await cameraRoutes.captureImage(req, res);
    }
    else if (pathname === '/api/camera/verify-face' && method === 'POST') {
      await cameraRoutes.verifyFaceWithML(req, res);
    }
    else if (pathname === '/api/camera/detect-deltoid' && method === 'POST') {
      await cameraRoutes.detectDeltoidWithML(req, res);
    }
    else if (pathname === '/api/camera/stream' && method === 'GET') {
      await cameraRoutes.streamProxy(req, res);
    }
    else if (pathname === '/api/camera/ml-health' && method === 'GET') {
      await cameraRoutes.checkMLHealth(req, res);
    }
    // 404 Not Found
    else {
      sendJSON(res, 404, {
        success: false,
        message: 'Endpoint not found',
        path: pathname
      });
    }
  } catch (error) {
    console.error('❌ Server Error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Create HTTP Server
const server = http.createServer(requestHandler);

// Start Server
server.listen(PORT, HOST, () => {
  console.log('=================================================');
  console.log('🚁  SMART VACCINATION SYSTEM - SERVER ACTIVE');
  console.log('=================================================');
  console.log(`🌐  Server running at: http://${HOST}:${PORT}`);
  console.log(`📅  Started at: ${new Date().toLocaleString()}`);
  console.log(`🔒  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================================');
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅  HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅  MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = server;
