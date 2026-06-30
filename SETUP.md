# 📖 Detailed Setup Instructions

## Complete Step-by-Step Setup Guide

This guide will walk you through setting up the entire Smart Vaccination System from scratch.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installing Prerequisites](#installing-prerequisites)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [ML Service Setup](#ml-service-setup)
7. [Verification & Testing](#verification--testing)
8. [Common Issues](#common-issues)

---

## System Requirements

### Minimum Requirements

- **OS**: Windows 10/11, macOS 10.14+, Ubuntu 18.04+
- **RAM**: 8 GB
- **Storage**: 5 GB free space
- **Internet**: Stable connection for package installation

### Recommended Requirements

- **RAM**: 16 GB
- **CPU**: Intel Core i5 or equivalent
- **GPU**: Optional (for faster ML inference)

---

## Installing Prerequisites

### 1. Install Node.js

**Windows:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Run installer (LTS version recommended)
3. Verify installation:
```bash
node --version
npm --version
```

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install MongoDB

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/download-center/community)
2. Run installer
3. Install as Windows Service
4. MongoDB Compass (GUI) is optional but recommended

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 3. Install Python

**Windows:**
1. Download from [python.org](https://www.python.org/downloads/)
2. Run installer
3. ✅ Check "Add Python to PATH"
4. Verify:
```bash
python --version
pip --version
```

**macOS:**
```bash
brew install python@3.11
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install python3.11 python3-pip
```

### 4. Install Git (Optional)

```bash
# Windows: Download from git-scm.com
# macOS:
brew install git

# Linux:
sudo apt-get install git
```

---

## Database Setup

### Option 1: Local MongoDB

1. **Start MongoDB Service**

**Windows:**
- MongoDB should start automatically as a Windows Service
- If not, run:
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
mongod --dbpath /path/to/data
```

2. **Verify MongoDB is Running**
```bash
mongosh
# or
mongo
```

3. **Create Database**
```javascript
use smart-vaccination
db.createCollection("users")
db.createCollection("vaccinationrequests")
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (Free tier: M0)
4. Wait for cluster deployment (~5 minutes)
5. Click "Connect" → "Connect your application"
6. Copy connection string
7. Replace `<password>` with your password
8. Update in `server/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-vaccination?retryWrites=true&w=majority
```

---

## Backend Setup

### Step 1: Navigate to Server Directory

```bash
cd Smart-Drone-vaccination-system/server
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- mongoose
- bcrypt
- jsonwebtoken
- dotenv

### Step 3: Create Environment File

```bash
# Windows:
copy .env.example .env

# macOS/Linux:
cp .env.example .env
```

### Step 4: Configure Environment Variables

Edit `server/.env`:

```env
PORT=5000
HOST=localhost
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-vaccination
JWT_SECRET=change-this-to-random-secret-key-in-production
ML_SERVICE_URL=http://localhost:8000
```

**Important:** Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Create Uploads Directory

```bash
mkdir uploads
mkdir uploads/faces
```

### Step 6: Start the Server

```bash
npm start

# For development (auto-reload):
npm run dev
```

Expected output:
```
=================================================
🚁  SMART VACCINATION SYSTEM - SERVER ACTIVE
=================================================
🌐  Server running at: http://localhost:5000
📅  Started at: ...
🔒  Environment: development
=================================================
✅ MongoDB Connected Successfully
```

---

## Frontend Setup

### Step 1: Navigate to Client Directory

```bash
cd ../client
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- react
- react-router-dom
- axios
- jwt-decode
- react-toastify

### Step 3: Create Environment File

```bash
# Windows:
copy .env.example .env

# macOS/Linux:
cp .env.example .env
```

### Step 4: Configure Environment Variables

Edit `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_URL=http://localhost:8000
REACT_APP_NAME="Smart Vaccination System"
REACT_APP_VERSION=1.0.0
```

### Step 5: Start React App

```bash
npm start
```

Browser will automatically open at `http://localhost:3000`

Expected output:
```
Compiled successfully!

You can now view smart-vaccination-client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## ML Service Setup

### Step 1: Navigate to ML Service Directory

```bash
cd ../ml-service
```

### Step 2: Create Virtual Environment

```bash
# Windows:
python -m venv venv
venv\Scripts\activate

# macOS/Linux:
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install Base Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Install Optional ML Libraries

**For Face Recognition:**
```bash
pip install deepface
pip install tf-keras
pip install tensorflow
```

**For Pose Detection:**
```bash
pip install mediapipe
```

**Note:** These are large downloads (200MB+). You can skip them for basic functionality and the service will use fallback methods.

### Step 5: Create Environment File

```bash
# Windows:
copy .env.example .env

# macOS/Linux:
cp .env.example .env
```

### Step 6: Start ML Service

```bash
python app.py
```

Expected output:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## Verification & Testing

### 1. Test Backend API

Open browser or use curl:

```bash
# Test root endpoint
curl http://localhost:5000/api

# Expected response:
{
  "message": "🚁 Smart Vaccination System API",
  "version": "1.0.0",
  "status": "active"
}
```

### 2. Test Frontend

1. Open `http://localhost:3000`
2. You should see the homepage
3. Navigate to different pages
4. Try registration

### 3. Test ML Service

```bash
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "models": {
    "face_verification": true,
    "deltoid_detection": true
  }
}
```

### 4. Create Test User

Using MongoDB Compass or mongosh:

```javascript
use smart-vaccination

db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: admin123
  role: "admin",
  phone: "1234567890",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Now login with:
- Email: admin@example.com
- Password: admin123

---

## Common Issues

### Issue 1: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in .env:
PORT=5001
```

### Issue 2: MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is running:
```bash
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
```

2. Check MongoDB status:
```bash
sudo systemctl status mongod
```

3. Verify connection string in `.env`

### Issue 3: React Build Fails

**Error:** `Module not found: Error: Can't resolve '@emotion/react'`

**Solution:**
```bash
cd client
npm install
# If issues persist:
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Python Virtual Environment Issues

**Error:** `venv\Scripts\activate : cannot be loaded`

**Solution (Windows PowerShell):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 5: ML Dependencies Installation Failed

**Error:** Building wheel for dlib failed

**Solution:**
```bash
# Install build tools first:
# Windows: Install Visual Studio Build Tools
# macOS:
xcode-select --install

# Linux:
sudo apt-get install build-essential cmake
```

### Issue 6: CORS Errors

**Error:** `Access to fetch at 'http://localhost:5000' has been blocked by CORS`

**Solution:**
- Backend already has CORS configured
- Ensure `REACT_APP_API_URL` matches server URL
- Check server is running

---

## Quick Start Commands

Once everything is set up, use these commands to start the system:

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start

# Terminal 3 - ML Service
cd ml-service
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to secure random string
- [ ] Update MONGODB_URI to MongoDB Atlas
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up environment variables on hosting platform
- [ ] Configure proper logging
- [ ] Set up monitoring and alerts
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up backup system
- [ ] Configure firewall rules
- [ ] Set up CDN for static assets
- [ ] Enable compression
- [ ] Configure proper error handling

---

## Getting Help

If you encounter issues:

1. Check this SETUP.md guide
2. Review error messages carefully
3. Check logs in each service
4. Verify all prerequisites are installed
5. Ensure all services are running
6. Check firewall/antivirus settings
7. Review .env configuration

---

Happy Coding! 🚀
