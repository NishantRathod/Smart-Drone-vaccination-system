/**
 * How It Works Page Component
 */

import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="how-it-works">
      <section className="hiw-hero">
        <h1>How the System Works</h1>
        <p className="subtitle">Step-by-step process of automated vaccination</p>
      </section>

      <section className="hiw-content">
        {/* Step 1 */}
        <div className="hiw-step">
          <div className="step-header">
            <div className="step-number">Step 1</div>
            <h2>Patient Registration</h2>
          </div>
          <div className="step-content">
            <div className="step-description">
              <h3>What Happens:</h3>
              <ul>
                <li>Patient creates an account on the web platform</li>
                <li>Uploads a clear photo of their face for identity verification</li>
                <li>Provides personal information and medical history</li>
                <li>Face image is securely stored and processed by AI</li>
              </ul>
              <h3>Technology Used:</h3>
              <p>React.js frontend, MongoDB database, bcrypt password hashing, JWT authentication</p>
            </div>
            <div className="step-diagram">
              <div className="diagram-box">📝 Registration Form → 📸 Face Upload → 🔐 Secure Storage</div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="hiw-step">
          <div className="step-header">
            <div className="step-number">Step 2</div>
            <h2>Vaccination Booking</h2>
          </div>
          <div className="step-content">
            <div className="step-description">
              <h3>What Happens:</h3>
              <ul>
                <li>Patient selects vaccine type and preferred date/time</li>
                <li>Enters location coordinates or address</li>
                <li>System confirms booking and generates request ID</li>
                <li>Notification sent to patient and admin dashboard</li>
              </ul>
              <h3>Technology Used:</h3>
              <p>Node.js backend API, MongoDB for storing requests, Real-time status updates</p>
            </div>
            <div className="step-diagram">
              <div className="diagram-box">📅 Select Date → 📍 Set Location → ✅ Confirm Booking</div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="hiw-step">
          <div className="step-header">
            <div className="step-number">Step 3</div>
            <h2>Face Verification</h2>
          </div>
          <div className="step-content">
            <div className="step-description">
              <h3>What Happens:</h3>
              <ul>
                <li>Drone-mounted camera captures patient's face at location</li>
                <li>Image sent to ML service for verification</li>
                <li>AI compares current face with registered face image</li>
                <li>Returns confidence score (match if &gt; 70%)</li>
              </ul>
              <h3>Technology Used:</h3>
              <p>Python FastAPI, DeepFace library, VGG-Face model, Cosine similarity matching</p>
              <div className="tech-detail">
                <strong>Algorithm:</strong> Deep learning face recognition using Siamese networks
              </div>
            </div>
            <div className="step-diagram">
              <div className="diagram-box">📸 Capture Face → 🤖 ML Analysis → ✅ Verify Identity</div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="hiw-step">
          <div className="step-header">
            <div className="step-number">Step 4</div>
            <h2>Deltoid Detection</h2>
          </div>
          <div className="step-content">
            <div className="step-description">
              <h3>What Happens:</h3>
              <ul>
                <li>Camera captures patient's shoulder region</li>
                <li>ML model detects deltoid muscle (injection site)</li>
                <li>Returns precise X,Y coordinates for injection</li>
                <li>Validates injection point safety and visibility</li>
              </ul>
              <h3>Technology Used:</h3>
              <p>MediaPipe Pose Detection, OpenCV, Custom CNN model, Shoulder landmark detection</p>
              <div className="tech-detail">
                <strong>Precision:</strong> ±2mm accuracy in injection point detection
              </div>
            </div>
            <div className="step-diagram">
              <div className="diagram-box">📸 Capture Shoulder → 🎯 Detect Deltoid → 📍 Get Coordinates</div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="hiw-step">
          <div className="step-header">
            <div className="step-number">Step 5</div>
            <h2>Human-in-the-Loop Approval</h2>
          </div>
          <div className="step-content">
            <div className="step-description">
              <h3>What Happens:</h3>
              <ul>
                <li>All verification data sent to operator dashboard</li>
                <li>Trained operator reviews face match and injection point</li>
                <li>Checks for any anomalies or safety concerns</li>
                <li>Approves or rejects the injection</li>
              </ul>
              <h3>Safety Mechanism:</h3>
              <p>
                <strong>Critical:</strong> No injection can proceed without human approval. 
                This ensures safety and prevents any AI errors from causing harm.
              </p>
            </div>
            <div className="step-diagram">
              <div className="diagram-box">👨‍⚕️ Operator Review → 🔍 Verify Data → ✅/❌ Approve/Reject</div>
            </div>
          </div>
        </div>

        {/* Step 6 */}
        <div className="hiw-step">
          <div className="step-header">
            <div className="step-number">Step 6</div>
            <h2>Robotic Injection</h2>
          </div>
          <div className="step-content">
            <div className="step-description">
              <h3>What Happens:</h3>
              <ul>
                <li>Robotic arm moves to calculated injection coordinates</li>
                <li>Performs pre-injection safety checks</li>
                <li>Administers vaccine with precise depth and angle</li>
                <li>Retracts safely after injection</li>
              </ul>
              <h3>Technology Used:</h3>
              <p>6-DOF robotic arm, Stepper motors, Force sensors, Real-time positioning feedback</p>
              <div className="tech-detail">
                <strong>Injection Parameters:</strong> 15° angle, 25mm depth, 0.5ml/sec rate
              </div>
            </div>
            <div className="step-diagram">
              <div className="diagram-box">🦾 Position Arm → 💉 Inject → ✅ Complete</div>
            </div>
          </div>
        </div>

        {/* Step 7 */}
        <div className="hiw-step">
          <div className="step-header">
            <div className="step-number">Step 7</div>
            <h2>Confirmation & Tracking</h2>
          </div>
          <div className="step-content">
            <div className="step-description">
              <h3>What Happens:</h3>
              <ul>
                <li>System updates vaccination status to "Completed"</li>
                <li>Confirmation sent to patient via email and dashboard</li>
                <li>Digital vaccination certificate generated</li>
                <li>Data saved to permanent medical records</li>
              </ul>
              <h3>Post-Vaccination:</h3>
              <p>Patient receives follow-up instructions and can report any adverse reactions through the platform</p>
            </div>
            <div className="step-diagram">
              <div className="diagram-box">📝 Update Status → 📧 Send Confirmation → 🎫 Generate Certificate</div>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="architecture-section">
        <h2>System Architecture</h2>
        <div className="architecture-diagram">
          <div className="arch-layer">
            <h3>Frontend Layer</h3>
            <p>React.js → User Interface & Dashboard</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <h3>Backend Layer</h3>
            <p>Node.js HTTP Server → API & Authentication</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <h3>Database Layer</h3>
            <p>MongoDB → User Data & Vaccination Records</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <h3>ML Service Layer</h3>
            <p>Python FastAPI → Face Recognition & Deltoid Detection</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <h3>Hardware Layer</h3>
            <p>Drone + Robotic Arm → Physical Vaccination</p>
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="safety-section">
        <h2>Safety Features</h2>
        <div className="safety-grid">
          <div className="safety-feature">
            <span className="safety-icon">🔒</span>
            <h3>Identity Verification</h3>
            <p>AI face recognition prevents patient mix-ups</p>
          </div>
          <div className="safety-feature">
            <span className="safety-icon">👨‍⚕️</span>
            <h3>Human Oversight</h3>
            <p>Mandatory operator approval before injection</p>
          </div>
          <div className="safety-feature">
            <span className="safety-icon">🎯</span>
            <h3>Precision Targeting</h3>
            <p>ML-guided injection point detection</p>
          </div>
          <div className="safety-feature">
            <span className="safety-icon">⚡</span>
            <h3>Emergency Stop</h3>
            <p>Instant shutdown capability at any point</p>
          </div>
          <div className="safety-feature">
            <span className="safety-icon">📊</span>
            <h3>Real-time Monitoring</h3>
            <p>Continuous system status tracking</p>
          </div>
          <div className="safety-feature">
            <span className="safety-icon">🔄</span>
            <h3>Fallback Systems</h3>
            <p>Multiple redundancy layers for safety</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
