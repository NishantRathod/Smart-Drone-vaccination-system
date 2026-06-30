/**
 * Navigation Bar Component
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🚁 Smart Vaccination
        </Link>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link">About</Link>
          </li>
          <li className="navbar-item">
            <Link to="/how-it-works" className="navbar-link">How It Works</Link>
          </li>
          <li className="navbar-item">
            <Link to="/ml-models" className="navbar-link">ML Models</Link>
          </li>
          
          {isAuthenticated() ? (
            <>
              <li className="navbar-item">
                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              </li>
              <li className="navbar-item">
                <Link to="/book-vaccination" className="navbar-link">Book Vaccination</Link>
              </li>
              {user?.role === 'admin' && (
                <>
                  <li className="navbar-item">
                    <Link to="/admin" className="navbar-link">Admin</Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/live-camera" className="navbar-link">Live Camera</Link>
                  </li>
                </>
              )}
              <li className="navbar-item">
                <span className="navbar-user">👤 {user?.name}</span>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-button">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-button">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
