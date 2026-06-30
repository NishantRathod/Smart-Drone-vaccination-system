/**
 * Vaccination Booking Component
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaccineAPI } from '../services/api';
import { toast } from 'react-toastify';
import './VaccinationBooking.css';

const VaccinationBooking = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    vaccineType: 'COVID-19',
    location: '',
    latitude: '',
    longitude: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
          toast.success('Location detected successfully');
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const validateForm = () => {
    if (!formData.location) {
      toast.error('Please enter your location');
      return false;
    }
    
    if (!formData.scheduledDate || !formData.scheduledTime) {
      toast.error('Please select date and time');
      return false;
    }
    
    // Check if date is in the future
    const selectedDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
    if (selectedDateTime < new Date()) {
      toast.error('Please select a future date and time');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const bookingData = {
        vaccineType: formData.vaccineType,
        location: formData.location,
        coordinates: formData.latitude && formData.longitude ? {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        } : undefined,
        scheduledDate: `${formData.scheduledDate}T${formData.scheduledTime}`,
        notes: formData.notes
      };
      
      const response = await vaccineAPI.createRequest(bookingData);
      
      if (response.data.success) {
        toast.success('Vaccination booked successfully!');
        navigate('/dashboard');
      } else {
        toast.error(response.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 'Booking failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book Vaccination</h1>
          <p>Schedule your drone-delivered vaccination service</p>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Vaccine Selection */}
          <div className="form-section">
            <h3>💉 Vaccine Information</h3>
            
            <div className="form-group">
              <label htmlFor="vaccineType">Vaccine Type *</label>
              <select
                id="vaccineType"
                name="vaccineType"
                value={formData.vaccineType}
                onChange={handleChange}
                required
              >
                <option value="COVID-19">COVID-19</option>
                <option value="Influenza">Influenza (Flu)</option>
                <option value="Hepatitis-B">Hepatitis B</option>
                <option value="Measles">Measles</option>
                <option value="Polio">Polio</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          {/* Location */}
          <div className="form-section">
            <h3>📍 Location Details</h3>
            
            <div className="form-group">
              <label htmlFor="location">Address / Location Description *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., 123 Main St, Springfield, IL 62701"
                required
              />
              <small>Enter your complete address or a clear location description</small>
            </div>
            
            <div className="location-coordinates">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="latitude">Latitude</label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="37.774929"
                    readOnly
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="longitude">Longitude</label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="-122.419418"
                    readOnly
                  />
                </div>
              </div>
              
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={getLocation}
              >
                📍 Use My Current Location
              </button>
            </div>
          </div>
          
          {/* Date and Time */}
          <div className="form-section">
            <h3>📅 Schedule</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="scheduledDate">Preferred Date *</label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="scheduledTime">Preferred Time *</label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <small className="form-note">
              ⏰ Service available: 8:00 AM - 6:00 PM
            </small>
          </div>
          
          {/* Additional Notes */}
          <div className="form-section">
            <h3>📝 Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="notes">Special Instructions (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions, allergies, or requirements..."
                rows="4"
              ></textarea>
            </div>
          </div>
          
          {/* Process Information */}
          <div className="info-box">
            <h4>📋 What happens next?</h4>
            <ol>
              <li><strong>Request Submitted:</strong> Your booking will be reviewed by our team</li>
              <li><strong>Face Verification:</strong> AI will verify your identity on arrival</li>
              <li><strong>Deltoid Detection:</strong> ML model will locate injection point</li>
              <li><strong>Human Approval:</strong> Operator reviews and approves the process</li>
              <li><strong>Vaccination:</strong> Robotic arm administers vaccine safely</li>
            </ol>
          </div>
          
          {/* Safety Notice */}
          <div className="safety-notice">
            <h4>⚠️ Important Safety Information</h4>
            <ul>
              <li>Ensure you're available at the scheduled time</li>
              <li>Wear clothing that allows easy shoulder access</li>
              <li>Have a clear, well-lit space for the drone to operate</li>
              <li>Do not move during the vaccination process</li>
              <li>Operator can halt the process at any time for safety</li>
            </ul>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Booking...' : '✓ Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VaccinationBooking;
