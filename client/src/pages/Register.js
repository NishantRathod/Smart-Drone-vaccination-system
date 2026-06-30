/**
 * Register Page Component
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, fileToBase64 } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    address: ''
  });
  
  const [faceImage, setFaceImage] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFaceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaceImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFacePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert face image to base64 if provided
      let faceImageBase64 = null;
      if (faceImage) {
        faceImageBase64 = await fileToBase64(faceImage);
      }
      
      // Prepare registration data
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : undefined,
        address: formData.address,
        faceImage: faceImageBase64
      };
      
      // Call registration API
      const response = await authAPI.register(registrationData);
      
      if (response.data.success) {
        toast.success('Registration successful!');
        
        // Auto-login after registration
        login(response.data.token, response.data.user);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join the Smart Vaccination System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          {/* Face Image Upload */}
          <div className="form-section face-upload-section">
            <h3>📸 Face Recognition Setup</h3>
            <p className="section-note">Upload a clear photo of your face for identity verification</p>
            
            <div className="face-upload-container">
              {facePreview ? (
                <div className="face-preview">
                  <img src={facePreview} alt="Face preview" />
                  <button 
                    type="button" 
                    className="change-image-btn"
                    onClick={() => document.getElementById('faceImageInput').click()}
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label htmlFor="faceImageInput" className="face-upload-label">
                  <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span>Click to upload face image</span>
                    <span className="upload-note">JPEG, PNG (Max 5MB)</span>
                  </div>
                </label>
              )}
              
              <input
                type="file"
                id="faceImageInput"
                accept="image/*"
                onChange={handleFaceImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  min="0"
                  max="150"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>
          
          {/* Password */}
          <div className="form-section">
            <h3>Security</h3>
            
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
