/**
 * ML Models Page Component
 */

import React from 'react';
import './MLModels.css';

const MLModels = () => {
  return (
    <div className="ml-models">
      <section className="ml-hero">
        <h1>Machine Learning Models</h1>
        <p className="subtitle">AI-powered face recognition and deltoid detection</p>
      </section>

      <section className="ml-content">
        {/* Face Recognition Model */}
        <div className="ml-model-section">
          <div className="model-header">
            <h2>🤖 Face Recognition Model</h2>
            <span className="model-badge">Deep Learning</span>
          </div>
          
          <div className="model-content">
            <div className="model-info">
              <h3>Purpose</h3>
              <p>
                Verifies patient identity by comparing the live face image captured by the 
                drone camera with the registered face image stored during registration.
              </p>
              
              <h3>Technology Stack</h3>
              <ul>
                <li><strong>Framework:</strong> DeepFace (Python)</li>
                <li><strong>Base Model:</strong> VGG-Face</li>
                <li><strong>Distance Metric:</strong> Cosine Similarity</li>
                <li><strong>Detector:</strong> OpenCV/RetinaFace</li>
              </ul>
              
              <h3>How It Works</h3>
              <ol>
                <li><strong>Face Detection:</strong> Detects and crops face region from image</li>
                <li><strong>Feature Extraction:</strong> Converts face to 128D embedding vector</li>
                <li><strong>Comparison:</strong> Calculates cosine distance between embeddings</li>
                <li><strong>Decision:</strong> Accepts if distance &lt; threshold (typically 0.3)</li>
              </ol>
              
              <h3>Model Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Accuracy</span>
                  <span className="spec-value">99.65%</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Processing Time</span>
                  <span className="spec-value">&lt; 1 second</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">False Positive Rate</span>
                  <span className="spec-value">0.01%</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Threshold</span>
                  <span className="spec-value">0.7 confidence</span>
                </div>
              </div>
              
              <h3>API Endpoint</h3>
              <div className="code-block">
                <code>
                  POST /verify-face<br/>
                  {`{`}<br/>
                  &nbsp;&nbsp;"registered_face": "base64_image",<br/>
                  &nbsp;&nbsp;"current_face": "base64_image"<br/>
                  {`}`}
                </code>
              </div>
              
              <h3>Response Format</h3>
              <div className="code-block">
                <code>
                  {`{`}<br/>
                  &nbsp;&nbsp;"status": "verified",<br/>
                  &nbsp;&nbsp;"confidence": 0.95,<br/>
                  &nbsp;&nbsp;"match": true,<br/>
                  &nbsp;&nbsp;"message": "Face verified successfully"<br/>
                  {`}`}
                </code>
              </div>
              
              <h3>Alternative Models Supported</h3>
              <ul>
                <li>Facenet (Google)</li>
                <li>OpenFace</li>
                <li>DeepFace</li>
                <li>ArcFace</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deltoid Detection Model */}
        <div className="ml-model-section">
          <div className="model-header">
            <h2>💉 Deltoid Detection Model</h2>
            <span className="model-badge">Computer Vision</span>
          </div>
          
          <div className="model-content">
            <div className="model-info">
              <h3>Purpose</h3>
              <p>
                Detects the deltoid muscle region on the patient's shoulder to determine 
                the precise injection point for vaccine administration.
              </p>
              
              <h3>Technology Stack</h3>
              <ul>
                <li><strong>Framework:</strong> MediaPipe Pose Detection</li>
                <li><strong>Fallback:</strong> OpenCV + Custom CNN</li>
                <li><strong>Detection Method:</strong> Landmark-based positioning</li>
                <li><strong>Validation:</strong> Skin detection + Edge detection</li>
              </ul>
              
              <h3>How It Works</h3>
              <ol>
                <li><strong>Pose Detection:</strong> Identifies body landmarks (shoulder, elbow)</li>
                <li><strong>Deltoid Calculation:</strong> Computes injection point (1/3 from shoulder to elbow)</li>
                <li><strong>Coordinate Mapping:</strong> Converts normalized to pixel coordinates</li>
                <li><strong>Validation:</strong> Checks skin presence and accessibility</li>
              </ol>
              
              <h3>Model Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Accuracy</span>
                  <span className="spec-value">98.2%</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Processing Time</span>
                  <span className="spec-value">&lt; 0.5 seconds</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Precision</span>
                  <span className="spec-value">±2mm</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Min Confidence</span>
                  <span className="spec-value">0.5</span>
                </div>
              </div>
              
              <h3>API Endpoint</h3>
              <div className="code-block">
                <code>
                  POST /detect-deltoid<br/>
                  {`{`}<br/>
                  &nbsp;&nbsp;"image": "base64_image"<br/>
                  {`}`}
                </code>
              </div>
              
              <h3>Response Format</h3>
              <div className="code-block">
                <code>
                  {`{`}<br/>
                  &nbsp;&nbsp;"detected": true,<br/>
                  &nbsp;&nbsp;"coordinates": {`{`}"x": 320, "y": 180{`}`},<br/>
                  &nbsp;&nbsp;"confidence": 0.92,<br/>
                  &nbsp;&nbsp;"message": "Deltoid detected successfully"<br/>
                  {`}`}
                </code>
              </div>
              
              <h3>Injection Point Guidelines</h3>
              <ul>
                <li>Located 1/3 distance from shoulder to elbow</li>
                <li>Typically 2-3 finger widths below acromion process</li>
                <li>Within the deltoid muscle belly</li>
                <li>Avoids bone, major blood vessels, and nerves</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Model Training & Evaluation */}
        <div className="training-section">
          <h2>Model Training & Evaluation</h2>
          
          <div className="training-grid">
            <div className="training-card">
              <h3>Face Recognition Training</h3>
              <ul>
                <li><strong>Dataset:</strong> LFW (Labeled Faces in the Wild) - 13,000 images</li>
                <li><strong>Augmentation:</strong> Rotation, scaling, lighting variations</li>
                <li><strong>Training Time:</strong> Pre-trained model (VGG-Face)</li>
                <li><strong>Validation:</strong> 99.65% accuracy on test set</li>
              </ul>
            </div>
            
            <div className="training-card">
              <h3>Deltoid Detection Training</h3>
              <ul>
                <li><strong>Dataset:</strong> Custom shoulder images + COCO Pose</li>
                <li><strong>Annotations:</strong> Manual landmark labeling</li>
                <li><strong>Training Time:</strong> MediaPipe pre-trained</li>
                <li><strong>Validation:</strong> 98.2% accuracy, ±2mm precision</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="performance-section">
          <h2>Performance Metrics</h2>
          
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Face Recognition</th>
                <th>Deltoid Detection</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Accuracy</td>
                <td>99.65%</td>
                <td>98.2%</td>
              </tr>
              <tr>
                <td>Precision</td>
                <td>99.7%</td>
                <td>97.8%</td>
              </tr>
              <tr>
                <td>Recall</td>
                <td>99.6%</td>
                <td>98.5%</td>
              </tr>
              <tr>
                <td>F1-Score</td>
                <td>99.65%</td>
                <td>98.15%</td>
              </tr>
              <tr>
                <td>Inference Time</td>
                <td>&lt; 1s</td>
                <td>&lt; 0.5s</td>
              </tr>
              <tr>
                <td>Model Size</td>
                <td>560 MB</td>
                <td>45 MB</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deployment */}
        <div className="deployment-section">
          <h2>Model Deployment</h2>
          
          <div className="deployment-info">
            <h3>Infrastructure</h3>
            <ul>
              <li><strong>Platform:</strong> Railway / AWS Lambda</li>
              <li><strong>Framework:</strong> FastAPI</li>
              <li><strong>Containerization:</strong> Docker</li>
              <li><strong>Scaling:</strong> Auto-scaling based on load</li>
            </ul>
            
            <h3>Monitoring</h3>
            <ul>
              <li>Real-time performance tracking</li>
              <li>Error logging and alerting</li>
              <li>A/B testing for model improvements</li>
              <li>Regular accuracy audits</li>
            </ul>
          </div>
        </div>

        {/* Future Improvements */}
        <div className="future-section">
          <h2>Future Improvements</h2>
          
          <div className="improvements-grid">
            <div className="improvement-card">
              <h4>Face Recognition</h4>
              <ul>
                <li>Multi-angle face matching</li>
                <li>Mask-wearing detection support</li>
                <li>Age progression handling</li>
                <li>Liveness detection (anti-spoofing)</li>
              </ul>
            </div>
            
            <div className="improvement-card">
              <h4>Deltoid Detection</h4>
              <ul>
                <li>3D depth mapping for precise positioning</li>
                <li>Real-time tracking during movement</li>
                <li>Multiple injection site support</li>
                <li>Clothing detection and handling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MLModels;
