# 🚁 Smart Vaccination System using Drone Unified with Robotic Arm

## Project Overview

An innovative engineering project that combines autonomous drone navigation, artificial intelligence, computer vision, and robotic precision to revolutionize vaccine delivery in remote and underserved areas.

### Key Features

- 🤖 **AI-Powered Face Recognition** - Verifies patient identity using DeepFace
- 🎯 **Deltoid Detection ML Model** - Precisely identifies injection point using MediaPipe
- 🚁 **Autonomous Drone Delivery** - GPS-guided navigation to patient location
- 💉 **Robotic Arm Precision** - 6-DOF robotic arm for safe vaccine administration
- 👨‍⚕️ **Human-in-the-Loop Safety** - Mandatory operator approval before injection
- 📊 **Real-time Monitoring** - Complete tracking and status updates
- 🔒 **Secure & Private** - JWT authentication and encrypted data storage

## Technology Stack

### Frontend
- **React.js** - User interface and dashboard
- **React Router** - Client-side routing
- **Axios** - HTTP requests
- **JWT Decode** - Token management
- **React Toastify** - Notifications

### Backend
- **Node.js** - HTTP server (NO Express.js)
- **Native HTTP Module** - Custom routing and request handling
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication

### Machine Learning
- **Python** - ML service
- **FastAPI** - API framework
- **DeepFace** - Face recognition
- **MediaPipe** - Pose detection for deltoid
- **OpenCV** - Image processing
- **Pillow** - Image manipulation

## Project Structure

```
smart-vaccination-system/
│
├── client/                      # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── HowItWorks.js
│   │   │   ├── MLModels.js
│   │   │   ├── Register.js
│   │   │   ├── Login.js
│   │   │   ├── UserDashboard.js
│   │   │   ├── VaccinationBooking.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── server/                      # Node.js Backend (No Express)
│   ├── models/
│   │   ├── User.js
│   │   └── VaccinationRequest.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vaccineRoutes.js
│   │   └── mlRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── ml-service/                  # Python ML Microservice
│   ├── app.py
│   ├── face_model.py
│   ├── deltoid_model.py
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-vaccination-system
```

### 2. Setup Backend Server

```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Update MONGODB_URI, JWT_SECRET, etc.

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The server will run at `http://localhost:5000`

### 3. Setup Frontend Client

```bash
cd client
npm install

# Create .env file
cp .env.example .env

# Edit .env
# Set REACT_APP_API_URL=http://localhost:5000

# Start the React app
npm start
```

The app will run at `http://localhost:3000`

### 4. Setup ML Microservice

```bash
cd ml-service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Optional: Install advanced ML libraries
pip install deepface mediapipe

# Create .env file
cp .env.example .env

# Start the ML service
python app.py
```

The ML service will run at `http://localhost:8000`

### 5. Setup MongoDB

#### Option A: Local MongoDB

```bash
# Install MongoDB and start the service
mongod --dbpath /path/to/data
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `server/.env`

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-vaccination
```

## API Endpoints

### Authentication APIs

```
POST   /api/register          - Register new user with face image
POST   /api/login             - Login user
GET    /api/profile           - Get user profile (Protected)
```

### Vaccination APIs

```
POST   /api/vaccine-request   - Create vaccination booking (Protected)
GET    /api/vaccine-status    - Get user's vaccination requests (Protected)
GET    /api/vaccine-requests  - Get all requests (Admin only)
PUT    /api/vaccine-request/:id - Update request status (Admin only)
```

### ML APIs

```
POST   /api/ml/verify-face    - Verify face against registered image
POST   /api/ml/detect-deltoid - Detect injection point on shoulder
```

### Python ML Service APIs

```
POST   /verify-face           - Face recognition verification
POST   /detect-deltoid        - Deltoid muscle detection
POST   /verify-face-upload    - Face verification with file upload
POST   /detect-deltoid-upload - Deltoid detection with file upload
GET    /health                - Health check
```

## Usage Guide

### 1. User Registration

1. Navigate to `/register`
2. Fill in personal details
3. Upload a clear face image
4. Submit registration
5. System creates account and logs you in

### 2. Booking Vaccination

1. Login to your account
2. Go to "Book Vaccination"
3. Select vaccine type
4. Enter location details
5. Choose date and time
6. Submit booking request

### 3. Admin Operations

1. Login as admin
2. View all vaccination requests
3. Approve pending requests
4. Initiate face verification
5. Trigger deltoid detection
6. Review and approve injection
7. Mark as completed

## System Workflow

```
1. Patient Registration → Upload face image
                       ↓
2. Vaccination Booking → Select vaccine, location, date
                       ↓
3. Admin Approval → Review and approve request
                       ↓
4. Drone Dispatch → Navigate to patient location
                       ↓
5. Face Verification → ML verifies patient identity
                       ↓
6. Deltoid Detection → ML identifies injection point
                       ↓
7. Human Approval → Operator reviews and approves
                       ↓
8. Robotic Injection → Arm administers vaccine
                       ↓
9. Completion → Update status and notify patient
```

## Deployment

### Frontend (Vercel)

```bash
cd client
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend (Render)

1. Push code to GitHub
2. Connect Render to repository
3. Configure environment variables
4. Deploy

### ML Service (Railway)

1. Create `Dockerfile` for Python service
2. Push to GitHub
3. Connect Railway to repository
4. Deploy

### Database (MongoDB Atlas)

Already cloud-based, just update connection string

## Environment Variables

### Server (.env)

```
PORT=5000
HOST=localhost
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-vaccination
JWT_SECRET=your-secret-key-change-in-production
ML_SERVICE_URL=http://localhost:8000
```

### Client (.env)

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_URL=http://localhost:8000
```

### ML Service (.env)

```
ML_PORT=8000
ML_HOST=0.0.0.0
ENVIRONMENT=development
FACE_CONFIDENCE_THRESHOLD=0.7
```

## Testing

### Create Demo Users

In MongoDB, insert test users:

```javascript
// Admin user
{
  name: "Admin User",
  email: "admin@example.com",
  password: "$2b$10$hashed_password", // password: admin123
  role: "admin"
}

// Regular user
{
  name: "Test User",
  email: "user@example.com",
  password: "$2b$10$hashed_password", // password: user123
  role: "user"
}
```

## Security Considerations

1. **Change JWT Secret** in production
2. **Use HTTPS** for all communications
3. **Implement rate limiting** on APIs
4. **Validate all inputs** server-side
5. **Use secure password policies**
6. **Encrypt sensitive data** in database
7. **Implement CORS** properly
8. **Regular security audits**

## Future Enhancements

- [ ] Real-time video streaming from drone
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] Blockchain-based vaccination records
- [ ] Integration with national health databases
- [ ] Advanced ML models with higher accuracy
- [ ] Mobile app (React Native)
- [ ] Telemedicine consultation integration
- [ ] Emergency response system
- [ ] Weather-based scheduling

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` configuration
- Check port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running
- Check `REACT_APP_API_URL` in `.env`
- Check CORS configuration

### ML service errors
- Ensure Python dependencies installed
- Check if port 8000 is available
- Verify ML models are downloaded

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Contact

Engineering Team - smart-vaccination@example.com

Project Link: [https://github.com/yourorg/smart-vaccination-system](https://github.com/yourorg/smart-vaccination-system)

## Acknowledgments

- DeepFace library for face recognition
- MediaPipe for pose detection
- MongoDB for database solutions
- Healthcare professionals for requirements
- Open-source community

---

**⚠️ IMPORTANT DISCLAIMER**

This is an engineering project demonstration. For actual medical use:
- Obtain proper medical licenses and certifications
- Comply with healthcare regulations (HIPAA, FDA, etc.)
- Conduct extensive testing and validation
- Get approval from medical authorities
- Ensure proper insurance coverage
- Implement comprehensive safety protocols

**DO NOT DEPLOY TO PRODUCTION WITHOUT PROPER MEDICAL APPROVAL**

---

Made with ❤️ by the Engineering Team - March 2026
