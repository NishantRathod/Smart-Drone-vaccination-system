"""
Smart Vaccination System - ML Microservice
Face Recognition & Deltoid Detection APIs
Using FastAPI and OpenCV

Author: Engineering Team
Date: March 2026
"""

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
from typing import Optional, Dict
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

# Import ML models
from face_model import FaceVerificationSystem
from deltoid_model import DeltoidDetectionModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Smart Vaccination ML Service",
    description="Machine Learning APIs for Face Recognition and Deltoid Detection",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML Models
face_verification_system = FaceVerificationSystem()
deltoid_model = DeltoidDetectionModel()

# Pydantic Models for Request/Response
class FaceVerificationRequest(BaseModel):
    registered_face: str  # Base64 encoded image or file path
    current_face: str     # Base64 encoded image from camera

class FaceVerificationResponse(BaseModel):
    success: bool
    verified: bool
    confidence: float
    message: str
    user_file: Optional[str] = None

class DeltoidDetectionRequest(BaseModel):
    image: str  # Base64 encoded image

class DeltoidDetectionResponse(BaseModel):
    detected: bool
    coordinates: Optional[Dict[str, float]]
    confidence: Optional[float]
    message: str

# Root Endpoint
@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "service": "Smart Vaccination ML Service",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "face_verification": "/verify-face (POST)",
            "deltoid_detection": "/detect-deltoid (POST)",
            "health_check": "/health (GET)"
        }
    }

# Health Check Endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models": {
            "face_verification": face_verification_system.is_loaded(),
            "deltoid_detection": deltoid_model.is_loaded()
        }
    }

# Face Verification Endpoint
@app.post("/verify-face", response_model=FaceVerificationResponse)
async def verify_face(request: FaceVerificationRequest):
    """
    Verify if current face matches registered face
    Uses LBPH Face Recognition
    """
    try:
        logger.info("Processing face verification request")
        
        # Train model with registered faces if not trained
        if not face_verification_system.is_trained:
            success = face_verification_system.train_model()
            if not success:
                return FaceVerificationResponse(
                    success=False,
                    verified=False,
                    confidence=0.0,
                    message="No registered faces found in system. Please register users first."
                )
        
        # Decode base64 current face image
        current_face_data = request.current_face
        if ',' in current_face_data:
            current_face_data = current_face_data.split(',')[1]
        
        # Decode and save temp image
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            tmp.write(base64.b64decode(current_face_data))
            tmp_path = tmp.name
        
        # Verify face
        result = face_verification_system.verify_face_image(tmp_path)
        
        # Clean up temp file
        import os
        os.unlink(tmp_path)
        
        return FaceVerificationResponse(
            success=result.get("success", False),
            verified=result.get("verified", False),
            confidence=result.get("confidence", 0.0),
            message=result.get("message", "Verification complete"),
            user_file=result.get("user_file")
        )
        
    except Exception as e:
        logger.error(f"Face verification error: {str(e)}")
        return FaceVerificationResponse(
            success=False,
            verified=False,
            confidence=0.0,
            message=f"Face verification failed: {str(e)}"
        )

# Deltoid Detection Endpoint
@app.post("/detect-deltoid", response_model=DeltoidDetectionResponse)
async def detect_deltoid(request: DeltoidDetectionRequest):
    """
    Detect deltoid muscle (shoulder injection point) in image
    Uses MediaPipe Pose Estimation
    """
    try:
        logger.info("Processing deltoid detection request")
        
        # Detect deltoid using the ML model
        result = deltoid_model.detect_deltoid(request.image)
        
        return DeltoidDetectionResponse(
            detected=result["detected"],
            coordinates=result.get("coordinates"),
            confidence=result.get("confidence"),
            message=result["message"]
        )
        
    except Exception as e:
        logger.error(f"Deltoid detection error: {str(e)}")
        return DeltoidDetectionResponse(
            detected=False,
            coordinates=None,
            confidence=0.0,
            message=f"Deltoid detection failed: {str(e)}"
        )

# Run Server
if __name__ == "__main__":
    logger.info("🚁 Starting Smart Vaccination ML Service...")
    logger.info("💉 Face Verification & Deltoid Detection Ready")
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
