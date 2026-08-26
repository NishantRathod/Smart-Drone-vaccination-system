# 📡 API Documentation

## Smart Vaccination System - API Reference

Base URL: `http://localhost:5000/api`
ML Service URL: `http://localhost:8000`

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Vaccination Request APIs](#vaccination-request-apis)
3. [ML Integration APIs](#ml-integration-apis)
4. [Python ML Service APIs](#python-ml-service-apis)
5. [Error Handling](#error-handling)
6. [Authentication](#authentication)

---

## Authentication APIs

### Register User

Creates a new user account with optional face image.

**Endpoint:** `POST /api/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "age": 30,
  "address": "123 Main St, City, State",
  "faceImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Required Fields:**
- `name` (string, 2-100 chars)
- `email` (string, valid email)
- `password` (string, min 6 chars)

**Optional Fields:**
- `phone` (string)
- `age` (number, 0-150)
- `address` (string)
- `faceImage` (string, base64 encoded)

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "faceImage": "/uploads/faces/face_1234567890_photo.jpg"
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "success": false,
  "message": "Name, email, and password are required"
}

// 400 - User Exists
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### Login User

Authenticates user and returns JWT token.

**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "faceImage": "/uploads/faces/face_1234567890_photo.jpg",
    "faceVerified": false
  }
}
```

**Error Responses:**
```json
// 401 - Invalid Credentials
{
  "success": false,
  "message": "Invalid email or password"
}

// 403 - Account Inactive
{
  "success": false,
  "message": "Account is inactive. Please contact administrator."
}
```

---

### Get User Profile

Retrieves authenticated user's profile information.

**Endpoint:** `GET /api/profile`

**Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "age": 30,
    "address": "123 Main St, City, State",
    "role": "user",
    "faceImage": "/uploads/faces/face_1234567890_photo.jpg",
    "faceVerified": false,
    "isActive": true,
    "createdAt": "2026-03-01T10:00:00.000Z",
    "updatedAt": "2026-03-01T10:00:00.000Z"
  }
}
```

---

## Vaccination Request APIs

### Create Vaccination Request

Books a new vaccination appointment.

**Endpoint:** `POST /api/vaccine-request`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "vaccineType": "COVID-19",
  "location": "123 Main St, Springfield, IL 62701",
  "coordinates": {
    "latitude": 39.7817,
    "longitude": -89.6501
  },
  "scheduledDate": "2026-03-15T14:30:00.000Z",
  "notes": "Please call before arrival"
}
```

**Required Fields:**
- `location` (string)
- `scheduledDate` (ISO 8601 date string)

**Optional Fields:**
- `vaccineType` (string, default: "COVID-19")
- `coordinates` (object with latitude/longitude)
- `notes` (string)

**Response (201):**
```json
{
  "success": true,
  "message": "Vaccination request created successfully",
  "request": {
    "_id": "65a1b2c3d4e5f6789abcdef1",
    "userId": "65a1b2c3d4e5f6789abcdef0",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "vaccineType": "COVID-19",
    "location": "123 Main St, Springfield, IL 62701",
    "coordinates": {
      "latitude": 39.7817,
      "longitude": -89.6501
    },
    "scheduledDate": "2026-03-15T14:30:00.000Z",
    "status": "pending",
    "faceVerified": false,
    "deltoidDetected": false,
    "humanApprovalRequired": true,
    "humanApproved": false,
    "notes": "Please call before arrival",
    "createdAt": "2026-03-01T10:00:00.000Z",
    "updatedAt": "2026-03-01T10:00:00.000Z"
  }
}
```

---

### Get Vaccination Status

Retrieves all vaccination requests for the authenticated user.

**Endpoint:** `GET /api/vaccine-status`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "requests": [
    {
      "_id": "65a1b2c3d4e5f6789abcdef1",
      "vaccineType": "COVID-19",
      "location": "123 Main St, Springfield, IL",
      "scheduledDate": "2026-03-15T14:30:00.000Z",
      "status": "completed",
      "faceVerified": true,
      "deltoidDetected": true,
      "humanApproved": true,
      "completedAt": "2026-03-15T15:00:00.000Z",
      "createdAt": "2026-03-01T10:00:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6789abcdef2",
      "vaccineType": "Influenza",
      "location": "456 Oak Ave, Springfield, IL",
      "scheduledDate": "2026-03-20T10:00:00.000Z",
      "status": "pending",
      "faceVerified": false,
      "deltoidDetected": false,
      "humanApproved": false,
      "createdAt": "2026-03-03T12:00:00.000Z"
    }
  ]
}
```

---

### Get All Vaccination Requests (Admin)

Retrieves all vaccination requests with optional status filter.

**Endpoint:** `GET /api/vaccine-requests`

**Headers:**
```json
{
  "Authorization": "Bearer <admin-token>"
}
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, in-progress, completed, etc.)
- `limit` (optional, default: 100): Number of requests to return
- `skip` (optional, default: 0): Number of requests to skip

**Example:**
```
GET /api/vaccine-requests?status=pending&limit=50&skip=0
```

**Response (200):**
```json
{
  "success": true,
  "count": 50,
  "total": 150,
  "requests": [...]
}
```

---

### Update Vaccination Request (Admin)

Updates a vaccination request status and details.

**Endpoint:** `PUT /api/vaccine-request/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <admin-token>",
  "Content-Type": "application/json"
}
```

**Request Body (partial update):**
```json
{
  "status": "approved",
  "faceVerified": true,
  "deltoidDetected": true,
  "deltoidCoordinates": {
    "x": 320,
    "y": 180
  },
  "droneAssigned": "DRONE-001",
  "operatorName": "Dr. Smith",
  "humanApproved": true,
  "notes": "Vaccination completed successfully"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Vaccination request updated successfully",
  "request": {
    "_id": "65a1b2c3d4e5f6789abcdef1",
    "status": "approved",
    "faceVerified": true,
    "deltoidDetected": true,
    ...
  }
}
```

---

## ML Integration APIs

### Verify Face

Verifies patient's face against registered image.

**Endpoint:** `POST /api/ml/verify-face`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "userId": "65a1b2c3d4e5f6789abcdef0",
  "faceImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "requestId": "65a1b2c3d4e5f6789abcdef1"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Face verification successful",
  "verified": true,
  "confidence": 0.95,
  "mlResponse": {
    "status": "verified",
    "confidence": 0.95,
    "match": true,
    "message": "Face verified successfully"
  }
}
```

---

### Detect Deltoid

Detects injection point on patient's shoulder.

**Endpoint:** `POST /api/ml/detect-deltoid`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "requestId": "65a1b2c3d4e5f6789abcdef1"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Deltoid detected successfully",
  "detected": true,
  "coordinates": {
    "x": 320,
    "y": 180,
    "normalized_x": 0.75,
    "normalized_y": 0.35
  },
  "confidence": 0.92,
  "mlResponse": {
    "detected": true,
    "coordinates": {...},
    "confidence": 0.92,
    "message": "Deltoid detected successfully using pose estimation"
  }
}
```

---

## Python ML Service APIs

### Verify Face (ML Service)

Direct face verification through ML service.

**Endpoint:** `POST http://localhost:8000/verify-face`

**Request Body:**
```json
{
  "registered_face": "data:image/jpeg;base64,...",
  "current_face": "data:image/jpeg;base64,..."
}
```

**Response (200):**
```json
{
  "status": "verified",
  "confidence": 0.95,
  "message": "Face verified successfully",
  "match": true
}
```

---

### Detect Deltoid (ML Service)

Direct deltoid detection through ML service.

**Endpoint:** `POST http://localhost:8000/detect-deltoid`

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response (200):**
```json
{
  "detected": true,
  "coordinates": {
    "x": 320,
    "y": 180,
    "normalized_x": 0.75,
    "normalized_y": 0.35
  },
  "confidence": 0.92,
  "message": "Deltoid detected successfully using pose estimation"
}
```

---

### Health Check

Checks ML service health and model status.

**Endpoint:** `GET http://localhost:8000/health`

**Response (200):**
```json
{
  "status": "healthy",
  "models": {
    "face_verification": true,
    "deltoid_detection": true
  }
}
```

---

### Root Endpoint

Returns ML service information.

**Endpoint:** `GET http://localhost:8000/`

**Response (200):**
```json
{
  "service": "Smart Vaccination ML Service",
  "version": "1.0.0",
  "status": "active",
  "endpoints": {
    "face_verification": "/verify-face (POST)",
    "deltoid_detection": "/detect-deltoid (POST)",
    "health_check": "/health (GET)"
  }
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - ML service unavailable

### Common Error Scenarios

#### 1. Authentication Errors

```json
// 401 - No token provided
{
  "success": false,
  "message": "Access denied. No token provided."
}

// 401 - Invalid token
{
  "success": false,
  "message": "Invalid or expired token"
}

// 403 - Insufficient permissions
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

#### 2. Validation Errors

```json
// 400 - Missing required fields
{
  "success": false,
  "message": "Name, email, and password are required"
}

// 400 - Invalid email format
{
  "success": false,
  "message": "Please enter a valid email address"
}
```

#### 3. ML Service Errors

```json
// 503 - ML service unavailable
{
  "success": false,
  "message": "ML service unavailable. Using fallback verification.",
  "verified": false,
  "error": "Connection refused"
}
```

---

## Authentication

### JWT Token Structure

Tokens are issued upon successful login/registration and must be included in the `Authorization` header for protected routes.

**Header:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token Payload:**
```json
{
  "id": "65a1b2c3d4e5f6789abcdef0",
  "email": "john@example.com",
  "role": "user",
  "iat": 1709290800,
  "exp": 1709895600
}
```

**Token Expiration:** 7 days

### Protected Routes

Routes requiring authentication:
- `GET /api/profile`
- `POST /api/vaccine-request`
- `GET /api/vaccine-status`
- `POST /api/ml/verify-face`
- `POST /api/ml/detect-deltoid`

Admin-only routes:
- `GET /api/vaccine-requests`
- `PUT /api/vaccine-request/:id`

---

## Rate Limiting

To prevent abuse, implement rate limiting:

- **Authentication:** 5 requests per minute per IP
- **ML APIs:** 10 requests per minute per user
- **Other APIs:** 100 requests per minute per user

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer <your-token>"
```

### Create Vaccination Request
```bash
curl -X POST http://localhost:5000/api/vaccine-request \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "vaccineType": "COVID-19",
    "location": "123 Main St",
    "scheduledDate": "2026-03-15T14:30:00.000Z"
  }'
```

---

## Postman Collection

Import this JSON to test all endpoints in Postman:

Create a collection with the following structure:
1. Authentication folder
   - Register
   - Login
   - Get Profile
2. Vaccination folder
   - Create Request
   - Get Status
   - Get All (Admin)
   - Update (Admin)
3. ML folder
   - Verify Face
   - Detect Deltoid

---

## WebSocket Support (Future)

For real-time updates, WebSocket support can be added:

```javascript
// Connection
const ws = new WebSocket('ws://localhost:5000');

// Listen for status updates
ws.on('vaccination-status-update', (data) => {
  console.log('Status updated:', data);
});
```

---

**Last Updated:** March 2026  
**API Version:** 1.0.0
