/**
 * Vaccination Request Routes
 * Handles vaccination booking and tracking (No Express.js)
 */

const VaccinationRequest = require('../models/VaccinationRequest');
const User = require('../models/User');
const { verifyToken, verifyAdmin, sendJSON } = require('../middleware/auth');

/**
 * Create Vaccination Request
 * POST /api/vaccine-request
 */
async function createRequest(req, res) {
  verifyToken(req, res, async () => {
    try {
      const {
        vaccineType,
        location,
        coordinates,
        scheduledDate,
        notes
      } = req.body;
      
      // Validation
      if (!location || !scheduledDate) {
        return sendJSON(res, 400, {
          success: false,
          message: 'Location and scheduled date are required'
        });
      }
      
      // Get user details
      const user = await User.findById(req.user.id);
      if (!user) {
        return sendJSON(res, 404, {
          success: false,
          message: 'User not found'
        });
      }
      
      // Create vaccination request
      const vaccinationRequest = new VaccinationRequest({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        vaccineType,
        location,
        coordinates,
        scheduledDate: new Date(scheduledDate),
        status: 'pending',
        notes
      });
      
      await vaccinationRequest.save();
      
      return sendJSON(res, 201, {
        success: true,
        message: 'Vaccination request created successfully',
        request: vaccinationRequest
      });
      
    } catch (error) {
      console.error('Create Request Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Server error creating vaccination request',
        error: error.message
      });
    }
  });
}

/**
 * Get Vaccination Status (User's own requests)
 * GET /api/vaccine-status
 */
async function getStatus(req, res) {
  verifyToken(req, res, async () => {
    try {
      const requests = await VaccinationRequest.find({ userId: req.user.id })
        .sort({ createdAt: -1 });
      
      return sendJSON(res, 200, {
        success: true,
        count: requests.length,
        requests
      });
      
    } catch (error) {
      console.error('Get Status Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Server error fetching vaccination status',
        error: error.message
      });
    }
  });
}

/**
 * Get All Vaccination Requests (Admin)
 * GET /api/vaccine-requests
 */
async function getAllRequests(req, res) {
  verifyAdmin(req, res, async () => {
    try {
      const { status, limit = 100, skip = 0 } = req.query;
      
      const query = status ? { status } : {};
      
      const requests = await VaccinationRequest.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));
      
      const total = await VaccinationRequest.countDocuments(query);
      
      return sendJSON(res, 200, {
        success: true,
        count: requests.length,
        total,
        requests
      });
      
    } catch (error) {
      console.error('Get All Requests Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Server error fetching vaccination requests',
        error: error.message
      });
    }
  });
}

/**
 * Update Vaccination Request (Admin/Operator)
 * PUT /api/vaccine-request/:id
 */
async function updateRequest(req, res) {
  verifyAdmin(req, res, async () => {
    try {
      const url = require('url');
      const parsedUrl = url.parse(req.url);
      const pathParts = parsedUrl.pathname.split('/');
      const requestId = pathParts[pathParts.length - 1];
      
      const {
        status,
        faceVerified,
        deltoidDetected,
        deltoidCoordinates,
        droneAssigned,
        operatorName,
        humanApproved,
        notes
      } = req.body;
      
      const updateData = {};
      
      if (status) updateData.status = status;
      if (faceVerified !== undefined) {
        updateData.faceVerified = faceVerified;
        updateData.faceVerificationDate = new Date();
      }
      if (deltoidDetected !== undefined) {
        updateData.deltoidDetected = deltoidDetected;
        updateData.deltoidDetectionDate = new Date();
      }
      if (deltoidCoordinates) updateData.deltoidCoordinates = deltoidCoordinates;
      if (droneAssigned) updateData.droneAssigned = droneAssigned;
      if (operatorName) {
        updateData.operatorName = operatorName;
        updateData.operatorId = req.user.id;
      }
      if (humanApproved !== undefined) {
        updateData.humanApproved = humanApproved;
        updateData.humanApprovalDate = new Date();
      }
      if (notes) updateData.notes = notes;
      if (status === 'completed') updateData.completedAt = new Date();
      
      updateData.updatedAt = new Date();
      
      const request = await VaccinationRequest.findByIdAndUpdate(
        requestId,
        updateData,
        { new: true }
      );
      
      if (!request) {
        return sendJSON(res, 404, {
          success: false,
          message: 'Vaccination request not found'
        });
      }
      
      return sendJSON(res, 200, {
        success: true,
        message: 'Vaccination request updated successfully',
        request
      });
      
    } catch (error) {
      console.error('Update Request Error:', error);
      return sendJSON(res, 500, {
        success: false,
        message: 'Server error updating vaccination request',
        error: error.message
      });
    }
  });
}

module.exports = {
  createRequest,
  getStatus,
  getAllRequests,
  updateRequest
};
