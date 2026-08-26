# Admin Portal - Smart Drone Vaccination System

A standalone admin website for monitoring and managing the Smart Drone Vaccination System. This portal provides real-time oversight of vaccination requests, camera controls, face verification, deltoid detection, and system health monitoring.

## 🚀 Features

### 1. **Dashboard**
- Real-time statistics (Total, Pending, In Progress, Completed requests)
- System health monitoring (Backend, ML Service, Database, Camera)
- Recent vaccination requests overview
- Activity feed with live updates
- Quick actions and controls

### 2. **Vaccination Requests Management**
- View all vaccination requests in a comprehensive table
- Filter by status (All, Pending, Approved, In Progress, Completed, Cancelled)
- Search functionality
- Request approval/cancellation
- Detailed request information modal
- Real-time status updates

### 3. **Camera Control**
- Live ESP32-CAM feed display
- Capture images for verification
- Face verification against registration selfies
- Deltoid muscle region detection
- Visual marking of detected injection points
- Human approval workflow

### 4. **ML Monitoring**
- Machine Learning service health status
- Model availability check (Face & Deltoid)
- Performance statistics tracking
- Model testing controls
- Service restart functionality

### 5. **User Management**
- User list with role-based filtering
- User details viewing
- Export user data to CSV
- (Backend API endpoints required)

## 📋 Prerequisites

Before running the admin portal, ensure you have:

1. **Main Backend Server** running on `http://localhost:5000`
2. **ML Service** running on `http://localhost:8000`
3. **ESP32-CAM** configured and accessible
4. **MongoDB** database connected
5. **Admin user account** with admin role

## 🛠️ Installation

### 1. File Structure

Ensure your admin portal has this structure:
```
admin-portal/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── config.js
    ├── api.js
    ├── auth.js
    ├── dashboard.js
    ├── requests.js
    ├── camera.js
    ├── ml-monitor.js
    ├── users.js
    └── main.js
```

### 2. Configuration

Edit `js/config.js` to match your setup:

```javascript
const CONFIG = {
    API_URL: 'http://localhost:5000',       // Your backend server
    ML_SERVICE_URL: 'http://localhost:8000', // Your ML service
    CAMERA_URL: 'http://192.168.1.100',     // Your ESP32-CAM IP
    
    DASHBOARD_REFRESH: 10000,  // Dashboard refresh interval (ms)
    ACTIVITY_REFRESH: 5000,     // Activity feed refresh (ms)
    HEALTH_CHECK: 15000,        // Health check interval (ms)
    
    REQUESTS_PER_PAGE: 10,
    AUTO_REFRESH: true
};
```

### 3. Running the Admin Portal

The admin portal is a static website. You can run it using:

#### Option A: Live Server (Recommended)
```bash
# If you have VS Code with Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

#### Option B: Python HTTP Server
```bash
cd admin-portal
python -m http.server 3000
# Visit http://localhost:3000
```

#### Option C: Node.js HTTP Server
```bash
npm install -g http-server
cd admin-portal
http-server -p 3000
# Visit http://localhost:3000
```

## 🔐 Login

1. Navigate to the admin portal URL
2. Login with admin credentials:
   - Email: Your admin email
   - Password: Your admin password
3. **Note:** Only users with `role: 'admin'` can access the portal

### Creating an Admin User

If you don't have an admin user, register normally and update the database:

```javascript
// In MongoDB or via backend API
db.users.updateOne(
    { email: "admin@example.com" },
    { $set: { role: "admin" } }
);
```

## 📖 Usage Guide

### Managing Vaccination Requests

1. **Navigate to "Requests" page**
2. **Filter requests** by status using the dropdown
3. **View details** by clicking the eye icon
4. **Approve pending requests** by clicking the check icon
5. **Start process** for approved requests:
   - Click "Start" button
   - System redirects to camera page
   - Perform face verification
   - Detect deltoid region
   - Approve injection

### Using Camera Controls

1. **Navigate to "Camera" page** or start a request process
2. **Capture Image**: Click "Capture" button
3. **Verify Face**:
   - Ensure a request is selected
   - Click "Verify Face" button
   - System compares with registration selfie
   - Results displayed in real-time
4. **Detect Deltoid**:
   - Capture image of shoulder area
   - Click "Detect Injection Point" button
   - System highlights deltoid region
   - Visual marker appears on image
5. **Approve Injection**:
   - After successful face and deltoid verification
   - Click "Approve Injection"
   - Request status updates to "injection-ready"

### Monitoring System Health

1. **Dashboard** shows overall system status indicator
2. **ML Monitor page** provides detailed ML service information
3. **Status indicators**:
   - 🟢 Green: Online/Healthy
   - 🔴 Red: Offline/Issues
4. **Auto-refresh** keeps data current (configurable interval)

### Activity Feed

- Located on the dashboard
- Shows recent system activities
- Updates automatically
- Displays:
  - Request approvals
  - Verification results
  - System events
  - Errors and warnings

## 🔧 API Integration

The admin portal communicates with your backend via REST APIs:

### Authentication Endpoints
- `POST /api/login` - Admin login
- `GET /api/profile` - Get user profile

### Vaccination Request Endpoints
- `GET /api/vaccine-requests` - Get all requests (with filters)
- `GET /api/vaccine-request/:id` - Get single request
- `PUT /api/vaccine-request/:id` - Update request status

### Camera Endpoints
- `GET /api/camera/info` - Camera information
- `POST /api/camera/capture` - Capture image
- `POST /api/camera/verify-face` - Verify face
- `POST /api/camera/detect-deltoid` - Detect deltoid
- `GET /api/camera/ml-health` - ML service health

## 🎨 Customization

### Changing Theme Colors

Edit `css/style.css`:

```css
:root {
    --primary: #667eea;      /* Primary color */
    --secondary: #764ba2;    /* Secondary color */
    --success: #10b981;      /* Success color */
    --warning: #f59e0b;      /* Warning color */
    --danger: #ef4444;       /* Danger color */
}
```

### Adjusting Refresh Intervals

Edit `js/config.js`:

```javascript
const CONFIG = {
    DASHBOARD_REFRESH: 10000,  // Change to desired ms
    AUTO_REFRESH: false        // Disable auto-refresh
};
```

## 🐛 Troubleshooting

### Issue: "Backend not connecting"
**Solution:**
- Check if backend server is running on port 5000
- Verify CORS is enabled on backend
- Check browser console for errors
- Ensure `API_URL` in config.js is correct

### Issue: "ML Service offline"
**Solution:**
- Start ML service: `.venv\Scripts\python.exe ml-service/app.py`
- Check port 8000 is available
- Verify ML models are loaded correctly

### Issue: "Camera not connecting"
**Solution:**
- Check ESP32-CAM is powered on
- Verify IP address in config.js
- Ensure ESP32 code is uploaded
- Check network connectivity

### Issue: "Login fails despite correct credentials"
**Solution:**
- Verify user has `role: 'admin'` in database
- Check token expiration settings
- Clear browser localStorage
- Check backend authentication logic

### Issue: "Notifications not appearing"
**Solution:**
- Check browser console for JavaScript errors
- Verify all JS files are loaded
- Clear browser cache
- Check notification container exists in DOM

## 📊 Performance Optimization

### Reduce API Calls
```javascript
// In config.js
const CONFIG = {
    AUTO_REFRESH: false,  // Disable auto-refresh
    // Or increase intervals
    DASHBOARD_REFRESH: 30000,  // 30 seconds instead of 10
};
```

### Optimize Image Sizes
- Configure ESP32-CAM for appropriate image quality
- Consider image compression before transmission
- Use thumbnail previews where possible

## 🔒 Security Considerations

1. **HTTPS**: Deploy over HTTPS in production
2. **Token Storage**: Tokens stored in localStorage (consider security implications)
3. **Admin Role**: Always verify admin role on backend
4. **CORS**: Configure proper CORS policies
5. **Input Validation**: Validate all user inputs
6. **Rate Limiting**: Implement rate limiting on backend APIs

## 📱 Mobile Responsiveness

The admin portal is responsive and works on:
- Desktop (1920x1080+)
- Laptops (1366x768+)
- Tablets (768x1024)
- Mobile devices (375x667+, limited functionality)

## 🚧 Future Enhancements

### Planned Features
- [ ] WebSocket integration for real-time updates
- [ ] Advanced analytics dashboard
- [ ] Export reports (PDF, Excel)
- [ ] Notification center with history
- [ ] User activity logs
- [ ] System configuration panel
- [ ] Multi-language support
- [ ] Dark mode toggle

### Backend Requirements
- [ ] User management API endpoints
- [ ] Advanced filtering and pagination
- [ ] Real-time WebSocket server
- [ ] Analytics and reporting APIs
- [ ] System configuration APIs

## 📝 Development Notes

### Adding New Features

1. **Add navigation item** in `index.html`
2. **Create page section** in `index.html`
3. **Create JavaScript file** in `js/` folder
4. **Add styles** to `css/style.css`
5. **Include script** in `index.html` before `main.js`
6. **Update navigation** handler in `main.js`

### Code Structure

- **config.js**: Configuration constants
- **api.js**: API service layer (all HTTP requests)
- **auth.js**: Authentication logic
- **dashboard.js**: Dashboard functionality
- **requests.js**: Request management
- **camera.js**: Camera and ML controls
- **ml-monitor.js**: ML service monitoring
- **users.js**: User management (placeholder)
- **main.js**: Application entry point

## 🤝 Integration with Main System

This admin portal integrates with:

1. **Main Backend** (`server/server.js`)
   - Authentication endpoints
   - Vaccination request management
   - Camera control routes

2. **ML Service** (`ml-service/app.py`)
   - Face verification model
   - Deltoid detection model
   - Health check endpoints

3. **React Client** (Shared backend)
   - Uses same API endpoints
   - Separate user interface
   - Shared database

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review browser console for errors
3. Check backend server logs
4. Verify all services are running
5. Ensure configuration is correct

## 📄 License

Part of the Smart Drone Vaccination System project.

---

**Admin Portal Version**: 1.0.0  
**Last Updated**: 2024  
**Compatible With**: Backend v1.0.0, ML Service v1.0.0
