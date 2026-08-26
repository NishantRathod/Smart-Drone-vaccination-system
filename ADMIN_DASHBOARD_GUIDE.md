# Admin Dashboard - Complete Guide

## Overview
The Admin Dashboard is a comprehensive control panel for managing the Smart Vaccination System with full ESP32-CAM integration, real-time face verification, and ML-powered deltoid detection.

## Features

### 📊 Real-Time Monitoring
- **Live Statistics Dashboard**
  - Total vaccination requests
  - Pending approvals
  - In-progress procedures
  - Completed vaccinations

- **Request Filtering**
  - Filter by status (all/pending/approved/in-progress/completed)
  - Search and sort capabilities
  - Real-time updates

### 📷 ESP32 Camera Integration
- **Live Camera Feed**
  - Real-time video streaming from ESP32-CAM
  - High-quality image capture
  - Adjustable camera settings

- **Image Capture**
  - One-click photo capture
  - Retake functionality
  - Automatic image quality optimization

### 👤 Face Verification System
- **Automated Face Recognition**
  - Compare live camera feed with registered selfies
  - LBPH (Local Binary Patterns Histograms) algorithm
  - Confidence scoring
  - Visual feedback (verified/not verified)

- **Verification Process**
  1. Capture image from ESP32-CAM
  2. ML service compares with registration photo
  3. Displays confidence score
  4. Updates request status automatically

### 💉 Deltoid Detection
- **ML-Powered Injection Point Detection**
  - MediaPipe Pose Estimation
  - Accurate shoulder landmark detection
  - Visual crosshair marker on injection point
  - Coordinate tracking

- **Detection Process**
  1. Capture shoulder/upper arm image
  2. ML model identifies deltoid muscle
  3. Displays detection confidence
  4. Marks exact injection coordinates

### 🔐 Security & Verification Steps
1. **Request Approval** - Admin reviews and approves requests
2. **Face Verification** - Confirms patient identity
3. **Deltoid Detection** - Identifies safe injection point
4. **Human Approval** - Final safety check before injection
5. **Completion** - Mark procedure as complete

## User Interface

### Main Dashboard
```
┌────────────────────────────────────────────────────┐
│  🔧 Admin Dashboard                                │
│  Manage and monitor all vaccination requests       │
│                                                     │
│  📊 Total: 24    ⏳ Pending: 5   🔄 Progress: 3   │
│  ✅ Completed: 16                                  │
│                                                     │
│  [Filter: All | Pending | Approved | Completed]    │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │ ID     | Patient  | Vaccine | Status | ...   │ │
│  │ 5f7d... | John Doe | COVID-19| Pending| [✓]  │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

### Camera Control Modal
```
┌─────────────────────────────────────────────────────┐
│  📷 Camera Control                              [×]  │
├─────────────────────────────────────────────────────┤
│  Patient: John Doe | Vaccine: COVID-19              │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │                                               │  │
│  │        [Live Camera Feed]                    │  │
│  │                                               │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  [📸 Capture Image]  [🔄 Retake]                   │
│                                                      │
│  Face Verification                                   │
│  ┌──────────────────────────────────────────────┐  │
│  │ ✅ Face Verified                             │  │
│  │ Confidence: 45.23                            │  │
│  │ Matched with: face_1234567890_user.jpg      │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  [🔍 Verify Face]                                   │
│                                                      │
│  Deltoid Detection                                   │
│  ┌──────────────────────────────────────────────┐  │
│  │ ✅ Deltoid Detected                          │  │
│  │ Position: X: 320, Y: 180                     │  │
│  │ Confidence: 87.5%                            │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  [🎯 Detect Deltoid]                                │
│                                                      │
│  [✅ Confirm & Update Status]  [Close]              │
└─────────────────────────────────────────────────────┘
```

## Workflow

### Complete Vaccination Process

1. **Patient Registration**
   - User registers with personal info
   - Uploads selfie during registration
   - Creates vaccination request

2. **Admin Review**
   - Admin views pending requests
   - Reviews patient information
   - Approves or rejects request

3. **Start Process**
   - Admin clicks "Start" button
   - Opens camera control modal
   - System is ready for verification

4. **Face Verification**
   - Capture live image from ESP32-CAM
   - Click "Verify Face"
   - System compares with registered photo
   - Shows verification result
   - Updates status if verified

5. **Deltoid Detection**
   - Capture shoulder/upper arm image
   - Click "Detect Deltoid"
   - ML model identifies injection point
   - Visual marker shows exact location
   - Updates status if detected

6. **Human Approval**
   - Admin reviews all verifications
   - Confirms deltoid position is safe
   - Approves or rejects for injection

7. **Complete Procedure**
   - After injection completion
   - Mark as "Complete"
   - System records timestamp
   - Patient receives confirmation

## API Endpoints

### Camera Endpoints
```javascript
GET  /api/camera/info          // Get camera info
POST /api/camera/capture       // Capture image
POST /api/camera/verify-face   // Verify face with ML
POST /api/camera/detect-deltoid// Detect deltoid with ML
GET  /api/camera/stream        // Live video stream
GET  /api/camera/ml-health     // Check ML service status
```

### Request Management
```javascript
GET  /api/vaccine-requests     // Get all requests
PUT  /api/vaccine-request/:id  // Update request status
```

## ML Service Integration

### Face Verification
- **Model**: LBPH Face Recognizer
- **Input**: Base64 encoded images
- **Output**: Verification result with confidence
- **Threshold**: Configurable (default: 60)

### Deltoid Detection
- **Model**: MediaPipe Pose Estimation
- **Input**: Base64 encoded image
- **Output**: Coordinates and confidence
- **Landmarks**: Shoulder landmarks for deltoid calculation

## Configuration

### Environment Variables (.env)
```env
# Server Configuration
PORT=5000
HOST=localhost
MONGODB_URI=mongodb://localhost:27017/smart-vaccination

# ESP32 Camera
ESP32_CAM_URL=http://192.168.1.100

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Security
JWT_SECRET=your_jwt_secret_key
```

### Client Configuration
```javascript
// client/.env
REACT_APP_API_URL=http://localhost:5000
```

## Running the System

### 1. Start MongoDB
```bash
mongod --dbpath ./data/db
```

### 2. Start ML Service
```bash
cd ml-service
python app.py
```

### 3. Start Backend Server
```bash
cd server
npm start
```

### 4. Start Frontend
```bash
cd client
npm start
```

### 5. Configure ESP32-CAM
- Follow ESP32_CAMERA_SETUP.md
- Update IP address in .env

## Testing

### Manual Testing
1. Register a test user with selfie
2. Create vaccination request
3. Login as admin
4. Approve request
5. Test camera capture
6. Test face verification
7. Test deltoid detection

### API Testing
```bash
# Test camera capture
curl -X POST http://localhost:5000/api/camera/capture

# Test ML health
curl http://localhost:5000/api/camera/ml-health
```

## Security Best Practices

1. **Authentication**
   - All endpoints require JWT token
   - Admin-only endpoints verified

2. **Camera Access**
   - Restricted to admin users
   - Secure WiFi connection for ESP32

3. **Data Privacy**
   - Images not permanently stored
   - GDPR compliance

4. **ML Security**
   - Validate image inputs
   - Rate limiting on ML endpoints

## Troubleshooting

### Camera Not Working
- Check ESP32-CAM IP address
- Verify WiFi connection
- Test camera URL directly in browser

### Face Verification Fails
- Ensure registered face images exist in `server/uploads/faces/`
- Check ML service is running
- Verify image quality

### Deltoid Detection Not Accurate
- Improve lighting conditions
- Ensure clear view of shoulder
- Check MediaPipe installation

## Support

For issues or questions:
- Check logs in browser console
- Review server logs
- Check ML service logs
- Refer to ESP32_CAMERA_SETUP.md

## Future Enhancements

- [ ] Multi-camera support
- [ ] Real-time analytics dashboard
- [ ] Automated drone control integration
- [ ] Mobile app for admin
- [ ] Advanced face recognition with DeepFace
- [ ] 3D pose estimation for better accuracy
