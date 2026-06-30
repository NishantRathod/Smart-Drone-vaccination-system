# Admin Portal - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Start All Services

```bash
# Terminal 1: Start MongoDB (if not running as service)
mongod

# Terminal 2: Start Backend Server
cd server
node server.js
# Expected output: Server running on port 5000

# Terminal 3: Start ML Service
cd ml-service
.venv\Scripts\activate
python app.py
# Expected output: Uvicorn running on http://127.0.0.1:8000

# Terminal 4: Power on ESP32-CAM
# Connect ESP32-CAM to power
# Note the IP address from serial monitor
```

### Step 2: Configure Admin Portal

Open `admin-portal/js/config.js` and update:

```javascript
const CONFIG = {
    API_URL: 'http://localhost:5000',           // Your backend
    ML_SERVICE_URL: 'http://localhost:8000',    // Your ML service
    CAMERA_URL: 'http://192.168.1.100',         // Your ESP32 IP (UPDATE THIS!)
    // ... rest of config
};
```

### Step 3: Run Admin Portal

```bash
# Option 1: VS Code Live Server (Easiest)
# Right-click on admin-portal/index.html
# Select "Open with Live Server"

# Option 2: Python HTTP Server
cd admin-portal
python -m http.server 3000
# Visit: http://localhost:3000

# Option 3: Node.js HTTP Server
npm install -g http-server
cd admin-portal
http-server -p 3000
# Visit: http://localhost:3000
```

### Step 4: Login

1. Open the admin portal in your browser
2. Login with admin credentials
3. **Important:** Only users with `role: 'admin'` can access

### Step 5: Create Admin User (If Needed)

If you don't have an admin user:

```javascript
// Method 1: Update existing user in MongoDB
db.users.updateOne(
    { email: "your@email.com" },
    { $set: { role: "admin" } }
);

// Method 2: Register normally, then update role via MongoDB Compass
// Connect to: mongodb://localhost:27017
// Database: vaccination_system (or your database name)
// Collection: users
// Find your user and change role to "admin"
```

---

## 📱 Basic Usage

### Dashboard Overview

1. **Statistics Cards** - Show request counts
2. **System Health** - Check all services status
3. **Recent Requests** - Latest 5 vaccination requests
4. **Activity Feed** - Live system activities

### Managing Requests

1. Go to **Requests** page
2. **Filter** by status (All, Pending, Approved, etc.)
3. **Approve** pending requests by clicking ✓
4. **Start Process**: Click play button → System opens camera page
5. **View Details**: Click eye icon for full information

### Camera & Verification Workflow

**Complete Workflow:**

1. Select a request from Requests page
2. Click **Start** button
3. Camera page opens automatically
4. **Capture Image**: Click "Capture" button
5. **Verify Face**: 
   - System compares with registration selfie
   - Green = Match, Red = No Match
6. **Detect Deltoid**:
   - Position shoulder in camera
   - Click "Detect Deltoid"
   - System highlights injection point
7. **Approve Injection**:
   - After both verifications pass
   - Click "Approve Injection"
   - Drone receives confirmation

---

## ⚡ Common Tasks

### Task 1: Approve New Vaccination Request

```
1. Dashboard/Requests → Find "Pending" request
2. Click ✓ (Approve) button
3. Confirmation → Request status = "Approved"
```

### Task 2: Complete Face Verification

```
1. Requests → Find approved request → Click "Start"
2. Camera page opens automatically
3. Click "Capture" button
4. Click "Verify Face" button
5. Check result (Green = Success)
```

### Task 3: Check System Health

```
1. Dashboard → Look at "System Health" section
2. Green dots = All good
3. Red dot = Service issue
4. Click "ML Monitor" for detailed ML stats
```

### Task 4: Export Data

```
1. Dashboard → Click "Export" button
2. Select date range
3. Download CSV/PDF report
```

---

## 🔧 Troubleshooting

### Problem: Login page shows but can't login

**Solution:**
```javascript
// Check user role in MongoDB
db.users.find({ email: "your@email.com" })
// If role is not "admin", update it:
db.users.updateOne(
    { email: "your@email.com" },
    { $set: { role: "admin" } }
);
```

### Problem: Camera shows "Camera not connected"

**Solution:**
1. Check ESP32-CAM is powered on
2. Find ESP32 IP address (from serial monitor)
3. Update `CONFIG.CAMERA_URL` in `config.js`
4. Test ESP32: Open `http://ESP32_IP/capture` in browser
5. Should see camera image

### Problem: ML Service Offline

**Solution:**
```bash
# Check if ML service is running
curl http://localhost:8000/health

# If not running, start it:
cd ml-service
.venv\Scripts\activate
python app.py
```

### Problem: Face verification always fails

**Solution:**
1. Check user has `faceImage` field in database
2. Verify registration photo was uploaded
3. Check ML service logs for errors
4. Try re-capturing image with better lighting

### Problem: "Backend not connecting"

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/api

# If not, start backend:
cd server
node server.js

# Check CORS is enabled in server.js
```

---

## 📊 System Status Indicators

| Indicator | Meaning | Action |
|-----------|---------|--------|
| 🟢 Green Circle | Service Online | No action needed |
| 🔴 Red Circle | Service Offline | Check service logs |
| 🟡 Yellow Circle | Warning/Slow | Check performance |
| ⏳ Hourglass | Processing | Wait for completion |
| ✅ Checkmark | Success | Continue workflow |
| ❌ X Mark | Failed | Retry or check logs |

---

## 🎯 Tips for Best Results

### Face Verification
- ✅ Good lighting (front-facing light)
- ✅ Face directly at camera
- ✅ Remove glasses if possible
- ✅ Neutral expression
- ❌ Avoid shadows on face
- ❌ Don't move during capture

### Deltoid Detection
- ✅ Expose shoulder area
- ✅ Person stands sideways to camera
- ✅ Good lighting
- ✅ Clear background
- ❌ Avoid cluttered background
- ❌ Don't wear thick clothing

### Camera Setup
- Position 1-2 meters from subject
- Mount at face/shoulder height
- Ensure stable mounting (no vibration)
- Check camera angle before each session

---

## 📞 Quick Reference

### Default Ports
- Admin Portal: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- ML Service: `http://localhost:8000`
- MongoDB: `mongodb://localhost:27017`

### Important Endpoints
```
# Backend
POST /api/login                    - Admin login
GET  /api/vaccine-requests         - Get all requests
PUT  /api/vaccine-request/:id      - Update request

# ML Service
POST /api/camera/verify-face       - Verify face
POST /api/camera/detect-deltoid    - Detect deltoid
GET  /api/camera/ml-health         - Health check

# ESP32-CAM
GET  http://ESP32_IP/capture       - Capture image
GET  http://ESP32_IP/stream        - Video stream
```

### Keyboard Shortcuts
- `F5` - Refresh page
- `Ctrl + R` - Refresh dashboard data
- `Esc` - Close modals
- `Ctrl + Click` - Open in new tab

---

## 🔐 Security Notes

### Production Deployment
1. ✅ Use HTTPS (not HTTP)
2. ✅ Implement proper CORS policies
3. ✅ Set secure token expiration
4. ✅ Use environment variables for config
5. ✅ Enable rate limiting
6. ✅ Regular security audits

### Development
- Keep admin credentials secure
- Don't commit credentials to git
- Use `.env` files for sensitive data
- Test in isolated network first

---

## 📖 Next Steps

After completing quick start:

1. Read full [README.md](README.md) for detailed features
2. Check [API.md](../API.md) for API documentation
3. Review [SETUP.md](../SETUP.md) for system setup
4. Test all features with dummy data
5. Configure for production use

---

## 🆘 Getting Help

**If stuck:**
1. Check browser console (F12) for errors
2. Check backend logs in terminal
3. Check ML service logs
4. Review this guide again
5. Check main project README

**Common Log Locations:**
- Browser Console: F12 → Console tab
- Backend: Terminal where `node server.js` runs
- ML Service: Terminal where `python app.py` runs
- MongoDB: MongoDB log files

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Status:** Production Ready
