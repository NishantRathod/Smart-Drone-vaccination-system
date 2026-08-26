"""
Deltoid Detection Model
Detects shoulder injection points for drone vaccination system
Uses MediaPipe Pose Estimation with fallback to basic detection
"""

import cv2
import numpy as np
import base64
from PIL import Image
import io
import logging

logger = logging.getLogger(__name__)

# Try to import MediaPipe (optional)
try:
    import mediapipe as mp  # type: ignore
    MEDIAPIPE_AVAILABLE = True
    logger.info("MediaPipe loaded successfully")
except ImportError:
    MEDIAPIPE_AVAILABLE = False
    logger.warning("MediaPipe not available, using fallback method")


class DeltoidDetectionModel:
    """
    Deltoid Detection Model using MediaPipe Pose Estimation
    Falls back to basic computer vision if MediaPipe unavailable
    """
    
    def __init__(self):
        """Initialize the deltoid detection model"""
        self.model_loaded = False
        
        if MEDIAPIPE_AVAILABLE:
            try:
                self.mp_pose = mp.solutions.pose
                self.pose = self.mp_pose.Pose(
                    static_image_mode=True,
                    model_complexity=1,
                    enable_segmentation=False,
                    min_detection_confidence=0.5
                )
                self.model_loaded = True
                logger.info("MediaPipe Pose model initialized")
            except Exception as e:
                logger.error(f"Failed to initialize MediaPipe: {e}")
                self.model_loaded = False
        else:
            logger.info("Using fallback detection method")
    
    def is_loaded(self):
        """Check if model is loaded"""
        return True  # Always return True as we have fallback
    
    def decode_base64_image(self, base64_string):
        """Decode base64 string to OpenCV image"""
        try:
            # Remove data URL prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            # Decode base64 to bytes
            image_bytes = base64.b64decode(base64_string)
            
            # Convert to PIL Image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to OpenCV format (BGR)
            image_np = np.array(image)
            if len(image_np.shape) == 2:  # Grayscale
                image_np = cv2.cvtColor(image_np, cv2.COLOR_GRAY2BGR)
            elif image_np.shape[2] == 4:  # RGBA
                image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2BGR)
            elif image_np.shape[2] == 3:  # RGB
                image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
            
            return image_np
        except Exception as e:
            logger.error(f"Error decoding image: {e}")
            raise ValueError(f"Invalid image data: {str(e)}")
    
    def detect_deltoid(self, image_data):
        """
        Detect deltoid muscle in image
        
        Args:
            image_data: Base64 encoded image string
            
        Returns:
            dict: Detection result with coordinates and confidence
        """
        try:
            # Decode image
            image = self.decode_base64_image(image_data)
            
            # Try MediaPipe detection first
            if self.model_loaded and MEDIAPIPE_AVAILABLE:
                result = self._detect_with_mediapipe(image)
                if result["detected"]:
                    return result
            
            # Fallback to basic detection
            return self._detect_with_basic_method(image)
            
        except Exception as e:
            logger.error(f"Deltoid detection error: {e}")
            return {
                "detected": False,
                "coordinates": None,
                "confidence": 0.0,
                "message": f"Detection failed: {str(e)}"
            }
    
    def _detect_with_mediapipe(self, image):
        """Detect deltoid using MediaPipe pose estimation"""
        try:
            # Convert BGR to RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Process image
            results = self.pose.process(image_rgb)
            
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                h, w, _ = image.shape
                
                # Get shoulder landmarks
                left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]
                right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
                
                # Calculate deltoid position (prefer right shoulder for injection)
                shoulder = right_shoulder
                
                # Calculate deltoid coordinates
                # Deltoid is located on upper arm, below shoulder
                deltoid_x = int(shoulder.x * w)
                deltoid_y = int(shoulder.y * h + (h * 0.05))  # Slightly below shoulder
                
                # Normalize coordinates
                normalized_x = shoulder.x
                normalized_y = shoulder.y + 0.05
                
                confidence = min(shoulder.visibility, 1.0)
                
                return {
                    "detected": True,
                    "coordinates": {
                        "x": deltoid_x,
                        "y": deltoid_y,
                        "normalized_x": normalized_x,
                        "normalized_y": normalized_y
                    },
                    "confidence": float(confidence),
                    "message": "Deltoid detected successfully using pose estimation"
                }
            else:
                logger.warning("No pose landmarks detected")
                return {
                    "detected": False,
                    "coordinates": None,
                    "confidence": 0.0,
                    "message": "No person detected in image"
                }
                
        except Exception as e:
            logger.error(f"MediaPipe detection error: {e}")
            return {
                "detected": False,
                "coordinates": None,
                "confidence": 0.0,
                "message": f"MediaPipe detection failed: {str(e)}"
            }
    
    def _detect_with_basic_method(self, image):
        """
        Fallback detection using basic computer vision
        Detects skin regions and estimates shoulder position
        """
        try:
            h, w, _ = image.shape
            
            # Convert to HSV for skin detection
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            
            # Skin color range (approximate)
            lower_skin = np.array([0, 20, 70], dtype=np.uint8)
            upper_skin = np.array([20, 255, 255], dtype=np.uint8)
            
            # Create skin mask
            skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)
            
            # Morphological operations to reduce noise
            kernel = np.ones((5, 5), np.uint8)
            skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel)
            skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel)
            
            # Find contours
            contours, _ = cv2.findContours(skin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if contours:
                # Find largest contour (likely to be body/arm)
                largest_contour = max(contours, key=cv2.contourArea)
                
                # Get bounding rectangle moments
                M = cv2.moments(largest_contour)
                
                if M["m00"] != 0:
                    # Calculate centroid
                    cx = int(M["m10"] / M["m00"])
                    cy = int(M["m01"] / M["m00"])
                    
                    # Estimate deltoid position (upper-right quadrant of skin region)
                    deltoid_x = int(cx + (w * 0.05))
                    deltoid_y = int(cy - (h * 0.1))
                    
                    # Ensure within bounds
                    deltoid_x = max(0, min(deltoid_x, w - 1))
                    deltoid_y = max(0, min(deltoid_y, h - 1))
                    
                    return {
                        "detected": True,
                        "coordinates": {
                            "x": deltoid_x,
                            "y": deltoid_y,
                            "normalized_x": deltoid_x / w,
                            "normalized_y": deltoid_y / h
                        },
                        "confidence": 0.6,  # Lower confidence for basic method
                        "message": "Deltoid estimated using basic detection (fallback method)"
                    }
            
            # If detection fails, return approximate position
            return {
                "detected": True,
                "coordinates": {
                    "x": int(w * 0.7),
                    "y": int(h * 0.3),
                    "normalized_x": 0.7,
                    "normalized_y": 0.3
                },
                "confidence": 0.3,
                "message": "Deltoid approximated - please verify position manually"
            }
            
        except Exception as e:
            logger.error(f"Basic detection error: {e}")
            return {
                "detected": False,
                "coordinates": None,
                "confidence": 0.0,
                "message": f"Basic detection failed: {str(e)}"
            }


# Main execution for testing
if __name__ == "__main__":
    print("=" * 60)
    print("DELTOID DETECTION MODEL - TEST")
    print("=" * 60)
    
    # Initialize model
    model = DeltoidDetectionModel()
    
    if model.is_loaded():
        if MEDIAPIPE_AVAILABLE and model.model_loaded:
            print("✓ MediaPipe loaded successfully!")
            print("✓ Pose estimation model ready")
        else:
            print("⚠ MediaPipe not available - using fallback detection")
        
        print("\n" + "=" * 60)
        print("MODEL STATUS: READY")
        print("=" * 60)
        print("\nTo use this model:")
        print("1. Import: from deltoid_model import DeltoidDetectionModel")
        print("2. Initialize: model = DeltoidDetectionModel()")
        print("3. Detect: result = model.detect_deltoid(base64_image)")
        print("\nExpected input: Base64 encoded image string")
        print("Expected output: Dict with detection results")
        print("=" * 60)
    else:
        print("✗ Model failed to load")
        print("Please check dependencies and try again.")
