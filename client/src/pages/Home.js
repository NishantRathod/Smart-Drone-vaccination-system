/**
 * Home Page Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart Vaccination System using Drone Unified with Robotic Arm
          </h1>
          <p className="hero-subtitle">
            Revolutionizing healthcare delivery with AI-powered automation and precision
          </p>
          <div className="hero-buttons">
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                <Link to="/book-vaccination" className="btn btn-secondary">Book Vaccination</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
                <Link to="/how-it-works" className="btn btn-secondary">Learn More</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="drone-illustration">
            🚁
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Recognition</h3>
            <p>Advanced face recognition and deltoid detection using machine learning</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚁</div>
            <h3>Drone Delivery</h3>
            <p>Automated drone navigation to patient location with GPS tracking</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💉</div>
            <h3>Robotic Precision</h3>
            <p>High-precision robotic arm for safe and accurate vaccine administration</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👨‍⚕️</div>
            <h3>Human-in-the-Loop</h3>
            <p>Safety mechanism with mandatory human approval before injection</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Monitoring</h3>
            <p>Track vaccination status and receive instant updates</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>End-to-end encryption and HIPAA-compliant data storage</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics">
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-number">99.9%</h3>
            <p className="stat-label">Accuracy Rate</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">&lt; 15 min</h3>
            <p className="stat-label">Delivery Time</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">24/7</h3>
            <p className="stat-label">Availability</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">100%</h3>
            <p className="stat-label">Safety Record</p>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="process-preview">
        <h2 className="section-title">How It Works</h2>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <h4>Register & Book</h4>
            <p>Create account with face registration and book vaccination</p>
          </div>
          <div className="process-arrow">→</div>
          <div className="process-step">
            <div className="step-number">2</div>
            <h4>Face Verification</h4>
            <p>AI verifies identity using face recognition</p>
          </div>
          <div className="process-arrow">→</div>
          <div className="process-step">
            <div className="step-number">3</div>
            <h4>Deltoid Detection</h4>
            <p>ML model detects injection point on shoulder</p>
          </div>
          <div className="process-arrow">→</div>
          <div className="process-step">
            <div className="step-number">4</div>
            <h4>Human Approval</h4>
            <p>Operator reviews and approves injection</p>
          </div>
          <div className="process-arrow">→</div>
          <div className="process-step">
            <div className="step-number">5</div>
            <h4>Vaccination</h4>
            <p>Robotic arm administers vaccine safely</p>
          </div>
        </div>
        <div className="cta-section">
          <Link to="/how-it-works" className="btn btn-outline">View Detailed Process</Link>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated() && (
        <section className="cta">
          <div className="cta-content">
            <h2>Ready to Experience the Future of Healthcare?</h2>
            <p>Join thousands of patients who trust our smart vaccination system</p>
            <Link to="/register" className="btn btn-large">Register Now</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
