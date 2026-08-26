/**
 * About Page Component
 */

import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <section className="about-hero">
        <h1>About the Smart Vaccination System</h1>
        <p className="subtitle">Engineering Innovation for Healthcare Accessibility</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Project Overview</h2>
          <p>
            The Smart Vaccination System using Drone Unified with Robotic Arm is an innovative 
            engineering project that combines cutting-edge technologies to revolutionize vaccine 
            delivery in remote and underserved areas.
          </p>
          <p>
            This system integrates autonomous drone navigation, artificial intelligence, computer 
            vision, and robotic precision to provide safe, accurate, and accessible vaccination 
            services to patients regardless of their geographic location.
          </p>
        </div>

        <div className="about-section">
          <h2>Problem Statement</h2>
          <div className="problem-points">
            <div className="problem-point">
              <span className="icon">❌</span>
              <p>Limited access to healthcare in rural and remote areas</p>
            </div>
            <div className="problem-point">
              <span className="icon">❌</span>
              <p>High cost and time delay in vaccine distribution</p>
            </div>
            <div className="problem-point">
              <span className="icon">❌</span>
              <p>Risk of human error in vaccine administration</p>
            </div>
            <div className="problem-point">
              <span className="icon">❌</span>
              <p>Shortage of trained healthcare professionals</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Our Solution</h2>
          <div className="solution-points">
            <div className="solution-point">
              <span className="icon">✅</span>
              <h3>Drone Delivery System</h3>
              <p>Autonomous drones navigate to patient locations using GPS coordinates</p>
            </div>
            <div className="solution-point">
              <span className="icon">✅</span>
              <h3>AI Face Recognition</h3>
              <p>Verifies patient identity to prevent mix-ups and ensure correct vaccination</p>
            </div>
            <div className="solution-point">
              <span className="icon">✅</span>
              <h3>Deltoid Detection ML</h3>
              <p>Precisely identifies the injection point on the patient's shoulder</p>
            </div>
            <div className="solution-point">
              <span className="icon">✅</span>
              <h3>Robotic Arm Precision</h3>
              <p>Administers vaccine with high accuracy and consistency</p>
            </div>
            <div className="solution-point">
              <span className="icon">✅</span>
              <h3>Human-in-the-Loop Safety</h3>
              <p>Requires operator approval before injection for maximum safety</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>React.js - User Interface</li>
                <li>JWT Authentication</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js (HTTP Module)</li>
                <li>MongoDB Database</li>
                <li>RESTful API</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>Machine Learning</h3>
              <ul>
                <li>Python FastAPI</li>
                <li>Face Recognition (DeepFace)</li>
                <li>Pose Detection (MediaPipe)</li>
                <li>OpenCV</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>Hardware</h3>
              <ul>
                <li>Autonomous Drone</li>
                <li>6-DOF Robotic Arm</li>
                <li>HD Camera System</li>
                <li>GPS Module</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Key Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h4>🌍 Accessibility</h4>
              <p>Reaches remote areas where traditional healthcare is unavailable</p>
            </div>
            <div className="benefit-card">
              <h4>⚡ Speed</h4>
              <p>Reduces vaccination time from hours to minutes</p>
            </div>
            <div className="benefit-card">
              <h4>🎯 Precision</h4>
              <p>AI-guided injection with millimeter accuracy</p>
            </div>
            <div className="benefit-card">
              <h4>💰 Cost-Effective</h4>
              <p>Lower operational costs compared to traditional methods</p>
            </div>
            <div className="benefit-card">
              <h4>🔒 Safety</h4>
              <p>Minimizes human contact and infection risk</p>
            </div>
            <div className="benefit-card">
              <h4>📊 Tracking</h4>
              <p>Real-time monitoring and comprehensive record-keeping</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Project Team</h2>
          <p>
            This project is developed by a multidisciplinary team of engineers specializing 
            in robotics, artificial intelligence, software development, and healthcare technology.
          </p>
        </div>

        <div className="about-section">
          <h2>Future Scope</h2>
          <ul className="future-list">
            <li>Integration with national vaccination databases</li>
            <li>Multi-vaccine administration capability</li>
            <li>Swarm drone coordination for mass vaccination campaigns</li>
            <li>Integration with telemedicine platforms</li>
            <li>AI-powered adverse reaction detection</li>
            <li>Blockchain-based vaccination records</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;
