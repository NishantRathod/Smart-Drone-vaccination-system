/**
 * Authentication Routes
 * Handles user registration and login (No Express.js)
 */

const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken, verifyToken, sendJSON } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

/**
 * User Registration
 * POST /api/register
 */
async function register(req, res) {
  try {
    const { name, email, password, phone, age, address, faceImage } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return sendJSON(res, 400, {
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendJSON(res, 400, {
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Handle face image upload
    let faceImagePath = null;
    if (faceImage) {
      // If base64 image provided
      if (typeof faceImage === 'string') {
        faceImagePath = faceImage;
      } else if (faceImage.data) {
        // If file uploaded
        const uploadsDir = path.join(__dirname, '../uploads/faces');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const filename = `face_${Date.now()}_${faceImage.filename}`;
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, faceImage.data);
        faceImagePath = `/uploads/faces/${filename}`;
      }
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      age,
      address,
      faceImage: faceImagePath,
      role: 'user'
    });
    
    await user.save();
    
    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });
    
    return sendJSON(res, 201, {
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        faceImage: user.faceImage
      }
    });
    
  } catch (error) {
    console.error('Registration Error:', error);
    return sendJSON(res, 500, {
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
}

/**
 * User Login
 * POST /api/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return sendJSON(res, 400, {
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return sendJSON(res, 401, {
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendJSON(res, 401, {
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return sendJSON(res, 403, {
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }
    
    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });
    
    return sendJSON(res, 200, {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        faceImage: user.faceImage,
        faceVerified: user.faceVerified
      }
    });
    
  } catch (error) {
    console.error('Login Error:', error);
    return sendJSON(res, 500, {
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
}

/**
 * Get User Profile
 * GET /api/profile
 */
async function getProfile(req, res) {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      
      if (!user) {
        return sendJSON(res, 404, {
          success: false,
          message: 'User not found'
        });
      }
      
      return sendJSON(res, 200, {
        success: true,
        user
      });
      
    } catch (error) {
      console.error('Get Profile Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Server error fetching profile',
        error: error.message
      });
    }
  });
}

module.exports = {
  register,
  login,
  getProfile
};
