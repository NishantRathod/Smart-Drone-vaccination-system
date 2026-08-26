import cv2
import numpy as np
import os
import base64
from pathlib import Path

# Config
UPLOADS_DIR = "../server/uploads/faces"  # Directory where registration selfies are stored
CONF_THRESHOLD = 60  # Lower = stricter matching (0-100, lower is better match)
HAAR = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

# Load face detector
face_cascade = cv2.CascadeClassifier(HAAR)

# Create LBPH face recognizer
recognizer = cv2.face.LBPHFaceRecognizer_create()

class FaceVerificationSystem:
    def __init__(self, uploads_dir=UPLOADS_DIR):
        self.uploads_dir = uploads_dir
        self.face_cascade = face_cascade
        self.recognizer = cv2.face.LBPHFaceRecognizer_create()
        self.label_map = {}  # Maps label IDs to user info
        self.is_trained = False
    
    def is_loaded(self):
        """Check if the face verification system is ready"""
        return True  # Always return True as cascade is loaded
        
    def load_registered_faces(self):
        """Load all registered user face images from uploads directory"""
        faces = []
        labels = []
        current_label = 0
        
        uploads_path = Path(self.uploads_dir)
        if not uploads_path.exists():
            print(f"[WARNING] Uploads directory not found: {self.uploads_dir}")
            return faces, labels
        
        # Load all face images from uploads/faces directory
        for img_file in uploads_path.glob("face_*.*"):
            img_path = str(img_file)
            img = cv2.imread(img_path)
            
            if img is None:
                print(f"[WARNING] Could not read image: {img_file.name}")
                continue
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Detect faces in the image
            detected_faces = self.face_cascade.detectMultiScale(
                gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30)
            )
            
            if len(detected_faces) == 0:
                print(f"[WARNING] No face detected in: {img_file.name}")
                continue
            
            # Use the first (largest) detected face
            (x, y, w, h) = detected_faces[0]
            face_roi = gray[y:y+h, x:x+w]
            
            # Resize face for consistency
            face_roi = cv2.resize(face_roi, (200, 200))
            
            faces.append(face_roi)
            labels.append(current_label)
            
            # Store mapping: label -> filename/user identifier
            self.label_map[current_label] = {
                'filename': img_file.name,
                'filepath': img_path
            }
            
            current_label += 1
            print(f"[INFO] Loaded face {current_label}: {img_file.name}")
        
        return faces, labels
    
    def train_model(self):
        """Train the face recognition model with registered faces"""
        print("[INFO] Loading registered faces from uploads directory...")
        faces, labels = self.load_registered_faces()
        
        if len(faces) == 0:
            print("[ERROR] No registered faces found in uploads directory!")
            print(f"[INFO] Please ensure face images exist in: {self.uploads_dir}")
            return False
        
        print(f"[INFO] Training on {len(faces)} registered face(s)...")
        self.recognizer.train(faces, np.array(labels))
        self.is_trained = True
        print(f"[SUCCESS] Training complete! Recognizing {len(self.label_map)} users.")
        return True
    
    def verify_face_webcam(self):
        """Real-time face verification using webcam"""
        if not self.is_trained:
            print("[ERROR] Model not trained. Call train_model() first.")
            return
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("[ERROR] Could not open webcam.")
            return
        
        print("[INFO] Starting webcam face verification...")
        print("[INFO] Press 'q' to quit, 's' to save a verified match")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            gray_live = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces_live = self.face_cascade.detectMultiScale(
                gray_live, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30)
            )
            
            for (x, y, w, h) in faces_live:
                roi_live = gray_live[y:y+h, x:x+w]
                roi_live = cv2.resize(roi_live, (200, 200))
                
                # Predict identity
                label_id, confidence = self.recognizer.predict(roi_live)
                
                if confidence < CONF_THRESHOLD:
                    # Face matched with a registered user
                    user_info = self.label_map[label_id]
                    filename = user_info['filename']
                    label_text = f"VERIFIED: {filename[:20]}... ({int(confidence)})"
                    color = (0, 255, 0)  # Green for verified
                    status = "✓ MATCH"
                else:
                    # Face not recognized
                    label_text = f"NOT VERIFIED ({int(confidence)})"
                    color = (0, 0, 255)  # Red for unknown
                    status = "✗ NO MATCH"
                
                # Draw rectangle and label
                cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                cv2.putText(frame, label_text, (x, y-10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                cv2.putText(frame, status, (x, y+h+25),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
            
            # Display instructions
            cv2.putText(frame, "Press 'q' to quit", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            cv2.imshow("Face Verification - Smart Vaccination System", frame)
            
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()
        print("[INFO] Face verification stopped.")
    
    def verify_face_image(self, image_path):
        """Verify a face from an uploaded image file"""
        if not self.is_trained:
            print("[ERROR] Model not trained. Call train_model() first.")
            return None
        
        img = cv2.imread(image_path)
        if img is None:
            return {"success": False, "message": "Could not read image"}
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5, minSize=(30, 30))
        
        if len(faces) == 0:
            return {"success": False, "message": "No face detected in image"}
        
        # Verify the first detected face
        (x, y, w, h) = faces[0]
        face_roi = gray[y:y+h, x:x+w]
        face_roi = cv2.resize(face_roi, (200, 200))
        
        label_id, confidence = self.recognizer.predict(face_roi)
        
        if confidence < CONF_THRESHOLD:
            user_info = self.label_map[label_id]
            return {
                "success": True,
                "verified": True,
                "confidence": float(confidence),
                "user_file": user_info['filename'],
                "message": "Face verified successfully"
            }
        else:
            return {
                "success": True,
                "verified": False,
                "confidence": float(confidence),
                "message": "Face not recognized"
            }


# Main execution
if __name__ == "__main__":
    print("=" * 60)
    print("SMART VACCINATION SYSTEM - FACE VERIFICATION")
    print("=" * 60)
    
    # Initialize the face verification system
    fvs = FaceVerificationSystem()
    
    # Train the model with registered faces
    if fvs.train_model():
        # Start webcam verification
        fvs.verify_face_webcam()
    else:
        print("\n[INFO] To use this system:")
        print("1. Users must register with face images via the web app")
        print("2. Face images will be saved to server/uploads/faces/")
        print("3. Run this script again to verify faces")
        print(f"\n[INFO] Expected directory: {os.path.abspath(UPLOADS_DIR)}")
