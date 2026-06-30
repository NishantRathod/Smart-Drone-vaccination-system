/**
 * Vaccination Request Model - MongoDB Schema
 * Stores vaccination booking and status tracking
 */

const mongoose = require('mongoose');

const vaccinationRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  vaccineType: {
    type: String,
    enum: ['COVID-19', 'Influenza', 'Hepatitis-B', 'Measles', 'Polio', 'Other'],
    default: 'COVID-19'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: false
    },
    longitude: {
      type: Number,
      required: false
    }
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'in-progress', 'face-verification', 'injection-ready', 'completed', 'cancelled', 'failed'],
    default: 'pending'
  },
  faceVerified: {
    type: Boolean,
    default: false
  },
  faceVerificationDate: {
    type: Date,
    required: false
  },
  deltoidDetected: {
    type: Boolean,
    default: false
  },
  deltoidCoordinates: {
    x: Number,
    y: Number
  },
  deltoidDetectionDate: {
    type: Date,
    required: false
  },
  droneAssigned: {
    type: String,
    required: false
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  operatorName: {
    type: String,
    required: false
  },
  humanApprovalRequired: {
    type: Boolean,
    default: true
  },
  humanApproved: {
    type: Boolean,
    default: false
  },
  humanApprovalDate: {
    type: Date,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  completedAt: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
vaccinationRequestSchema.index({ userId: 1, createdAt: -1 });
vaccinationRequestSchema.index({ status: 1 });
vaccinationRequestSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('VaccinationRequest', vaccinationRequestSchema);
