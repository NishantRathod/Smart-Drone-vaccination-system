import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-v2">
      <div className="navbar-inner">

        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>

          <span className="brand-text">
            <strong>SMART</strong>
            <small>VACCINATION SYSTEM</small>
          </span>
        </Link>

        <button
          className={`mobile-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>

          <Link
            to="/"
            onClick={closeMenu}
            className={isActive('/') ? 'active' : ''}
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={closeMenu}
            className={isActive('/about') ? 'active' : ''}
          >
            About
          </Link>

          <Link
            to="/how-it-works"
            onClick={closeMenu}
            className={isActive('/how-it-works') ? 'active' : ''}
          >
            How it works
          </Link>

          <Link
            to="/ml-models"
            onClick={closeMenu}
            className={isActive('/ml-models') ? 'active' : ''}
          >
            AI & ML
          </Link>

          {isAuthenticated() && (
            <>
              <span className="nav-divider" />

              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={isActive('/dashboard') ? 'active' : ''}
              >
                Dashboard
              </Link>

              <Link
                to="/book-vaccination"
                onClick={closeMenu}
                className="nav-book"
              >
                Book vaccination
              </Link>

              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className={isActive('/admin') ? 'active' : ''}
                  >
                    Admin
                  </Link>

                  <Link
                    to="/live-camera"
                    onClick={closeMenu}
                    className={isActive('/live-camera') ? 'active' : ''}
                  >
                    Live camera
                  </Link>
                </>
              )}

              <div className="nav-user">
                <span className="user-avatar">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>

                <span className="user-name">
                  {user?.name || 'User'}
                </span>
              </div>

              <button
                className="nav-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated() && (
            <>
              <span className="nav-divider" />

              <Link
                to="/login"
                onClick={closeMenu}
                className="nav-login"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="nav-register"
              >
                Get started
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Navbar;