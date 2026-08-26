/**
 * Footer Component
 */

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🚁 Smart Vaccination System</h3>
          <p>Revolutionizing healthcare delivery with drone technology and AI</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Project</a></li>
            <li><a href="/how-it-works">How It Works</a></li>
            <li><a href="/ml-models">ML Models</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Technology</h4>
          <ul>
            <li>React.js Frontend</li>
            <li>Node.js Backend</li>
            <li>MongoDB Database</li>
            <li>Python ML Service</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 support@smartvaccination.com</p>
          <p>📞 +1 (555) 123-4567</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Smart Vaccination System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
