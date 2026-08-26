/**
 * JWT Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smart-vaccination-secret-key-2026';

/**
 * Send JSON Response Helper
 */
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * Verify JWT Token Middleware
 */
function verifyToken(req, res, callback) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return sendJSON(res, 401, {
      success: false,
      message: 'Access denied. No token provided.'
    });
  }
  
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    callback();
  } catch (error) {
    return sendJSON(res, 401, {
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

/**
 * Generate JWT Token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d'
  });
}

/**
 * Verify Admin Role
 */
function verifyAdmin(req, res, callback) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin' && req.user.role !== 'operator') {
      return sendJSON(res, 403, {
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    callback();
  });
}

module.exports = {
  verifyToken,
  generateToken,
  verifyAdmin,
  sendJSON
};
