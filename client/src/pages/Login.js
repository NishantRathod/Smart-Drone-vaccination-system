/**
 * Login Page Component
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const adminPortalUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/admin-portal/`;
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginMode, setLoginMode] = useState('user');
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      
      if (response.data.success) {
        const user = response.data.user;
        const isAdmin = user.role === 'admin';
        const isOperator = user.role === 'operator';

        if (loginMode === 'admin' && !isAdmin) {
          toast.error('Admin access required. Please use an admin account.');
          return;
        }

        toast.success('Login successful!');
        
        // Save token and user data
        login(response.data.token, user);
        
        // Redirect based on role
        if (isAdmin) {
          localStorage.setItem('adminToken', response.data.token);
          localStorage.setItem('adminUser', JSON.stringify(user));
          const adminSession = new URLSearchParams({
            token: response.data.token,
            user: JSON.stringify(user)
          });
          window.location.href = `${adminPortalUrl}#${adminSession.toString()}`;
        } else if (isOperator) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>{loginMode === 'admin' ? 'Admin Login' : 'Welcome Back'}</h1>
          <p>
            {loginMode === 'admin'
              ? 'Access the Smart Vaccination admin portal'
              : 'Login to your Smart Vaccination account'}
          </p>
        </div>

        <div className="login-mode-toggle" role="tablist" aria-label="Login type">
          <button
            type="button"
            className={loginMode === 'user' ? 'active' : ''}
            onClick={() => setLoginMode('user')}
          >
            User Login
          </button>
          <button
            type="button"
            className={loginMode === 'admin' ? 'active' : ''}
            onClick={() => setLoginMode('admin')}
          >
            Admin Login
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={loginMode === 'admin' ? 'admin@example.com' : 'your@email.com'}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-footer">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : loginMode === 'admin' ? 'Open Admin Portal' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          {loginMode === 'admin' ? (
            <p>Need a user account? <button type="button" className="link-button" onClick={() => setLoginMode('user')}>Switch to user login</button></p>
          ) : (
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          )}
        </div>
        
        {/* Demo Credentials */}
        <div className="demo-section">
          <h4>Demo Credentials</h4>
          <div className="demo-credentials">
            <div className="demo-account">
              <strong>User Account:</strong>
              <p>Email: user@example.com</p>
              <p>Password: user123</p>
            </div>
            <div className="demo-account">
              <strong>Admin Account:</strong>
              <p>Email: admin@example.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
