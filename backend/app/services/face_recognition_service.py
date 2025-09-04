import cv2
import numpy as np
import base64
import os
import pickle
import time
from PIL import Image
from io import BytesIO
from typing import List, Tuple, Optional
from app.models.schemas import RecognitionResult

class FaceRecognitionService:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []
        self.face_database_path = "face_database"
        self.encodings_path = os.path.join(self.face_database_path, "encodings")
        os.makedirs(self.encodings_path, exist_ok=True)
        
        # Load OpenCV face detector
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        self.load_known_faces()
    
    def base64_to_image(self, base64_string: str) -> np.ndarray:
        """Convert base64 string to OpenCV image"""
        try:
            # Remove data URL prefix if present
            if "," in base64_string:
                base64_string = base64_string.split(",")[1]
            
            # Decode base64
            image_data = base64.b64decode(base64_string)
            
            # Convert to PIL Image
            pil_image = Image.open(BytesIO(image_data))
            
            # Convert to RGB if necessary
            if pil_image.mode != 'RGB':
                pil_image = pil_image.convert('RGB')
            
            # Convert to numpy array
            cv2_image = np.array(pil_image)
            
            # Convert RGB to BGR for OpenCV
            cv2_image = cv2.cvtColor(cv2_image, cv2.COLOR_RGB2BGR)
            
            return cv2_image
        except Exception as e:
            raise ValueError(f"Invalid image data: {str(e)}")
    
    def detect_faces(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """Detect faces using OpenCV"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
        
        # Convert to face_recognition format (top, right, bottom, left)
        face_locations = []
        for (x, y, w, h) in faces:
            face_locations.append((y, x + w, y + h, x))
        
        return face_locations
    
    def extract_face_encoding(self, image: np.ndarray, face_location: Tuple[int, int, int, int]) -> np.ndarray:
        """Extract a simple face encoding using image features"""
        top, right, bottom, left = face_location
        face_image = image[top:bottom, left:right]
        
        # Resize face to standard size
        face_image = cv2.resize(face_image, (100, 100))
        
        # Convert to grayscale and flatten as a simple encoding
        gray_face = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
        encoding = gray_face.flatten().astype(np.float32)
        
        # Normalize
        encoding = encoding / np.linalg.norm(encoding)
        
        return encoding
    
    def save_face_encoding(self, face_encoding: np.ndarray, name: str) -> str:
        """Save face encoding to file"""
        encoding_filename = f"{name}_{int(time.time())}.pkl"
        encoding_path = os.path.join(self.encodings_path, encoding_filename)
        
        with open(encoding_path, 'wb') as f:
            pickle.dump(face_encoding, f)
        
        return encoding_path
    
    def load_known_faces(self):
        """Load all known face encodings from database directory"""
        self.known_face_encodings = []
        self.known_face_names = []
        
        if os.path.exists(self.encodings_path):
            for filename in os.listdir(self.encodings_path):
                if filename.endswith('.pkl'):
                    filepath = os.path.join(self.encodings_path, filename)
                    try:
                        with open(filepath, 'rb') as f:
                            encoding = pickle.load(f)
                            self.known_face_encodings.append(encoding)
                            # Extract name from filename (remove timestamp and extension)
                            name = '_'.join(filename.split('_')[:-1])
                            self.known_face_names.append(name)
                    except Exception as e:
                        print(f"Error loading encoding {filename}: {e}")
    
    def compare_faces(self, known_encodings: List[np.ndarray], face_encoding: np.ndarray, tolerance: float = 0.6) -> List[bool]:
        """Compare face encodings using simple distance metric"""
        if len(known_encodings) == 0:
            return []
        
        distances = []
        for known_encoding in known_encodings:
            # Calculate cosine similarity
            similarity = np.dot(known_encoding, face_encoding)
            distances.append(1 - similarity)  # Convert to distance
        
        return [distance <= tolerance for distance in distances]
    
    def face_distance(self, known_encodings: List[np.ndarray], face_encoding: np.ndarray) -> List[float]:
        """Calculate distances between face encodings"""
        if len(known_encodings) == 0:
            return []
        
        distances = []
        for known_encoding in known_encodings:
            # Calculate cosine distance
            similarity = np.dot(known_encoding, face_encoding)
            distance = 1 - similarity
            distances.append(max(0, distance))
        
        return distances
    
    def enroll_face(self, image_data: str, name: str) -> Tuple[bool, str, Optional[str]]:
        """Enroll a new face"""
        try:
            # Convert base64 to image
            image = self.base64_to_image(image_data)
            
            # Detect faces
            face_locations = self.detect_faces(image)
            
            if len(face_locations) == 0:
                return False, "No face detected in the image", None
            
            if len(face_locations) > 1:
                return False, "Multiple faces detected. Please use an image with only one face", None
            
            # Extract face encoding
            face_encoding = self.extract_face_encoding(image, face_locations[0])
            
            # Save the image
            image_filename = f"{name}_{int(time.time())}.jpg"
            image_path = os.path.join(self.face_database_path, "uploads", image_filename)
            cv2.imwrite(image_path, image)
            
            # Save the encoding
            encoding_path = self.save_face_encoding(face_encoding, name)
            
            # Add to known faces
            self.known_face_encodings.append(face_encoding)
            self.known_face_names.append(name)
            
            return True, f"Face enrolled successfully for {name}", encoding_path
            
        except Exception as e:
            return False, f"Error enrolling face: {str(e)}", None
    
    def recognize_faces(self, image_data: str) -> Tuple[List[RecognitionResult], float]:
        """Recognize faces in an image"""
        start_time = time.time()
        results = []
        
        try:
            # Convert base64 to image
            image = self.base64_to_image(image_data)
            
            # Detect faces
            face_locations = self.detect_faces(image)
            
            # Process each detected face
            for face_location in face_locations:
                # Extract face encoding
                face_encoding = self.extract_face_encoding(image, face_location)
                
                name = "Unknown"
                confidence = 0.0
                
                if len(self.known_face_encodings) > 0:
                    # Compare with known faces
                    matches = self.compare_faces(self.known_face_encodings, face_encoding)
                    face_distances = self.face_distance(self.known_face_encodings, face_encoding)
                    
                    if len(face_distances) > 0:
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            name = self.known_face_names[best_match_index]
                            # Convert distance to confidence (lower distance = higher confidence)
                            confidence = max(0, (1 - face_distances[best_match_index]) * 100)
                
                # Convert face location format (top, right, bottom, left)
                top, right, bottom, left = face_location
                
                results.append(RecognitionResult(
                    name=name,
                    confidence=round(confidence, 2),
                    face_location=[top, right, bottom, left]
                ))
            
            processing_time = time.time() - start_time
            return results, processing_time
            
        except Exception as e:
            processing_time = time.time() - start_time
            print(f"Error in face recognition: {str(e)}")
            return [], processing_time
    
    def delete_face_encoding(self, encoding_path: str):
        """Delete a face encoding file"""
        try:
            if os.path.exists(encoding_path):
                os.remove(encoding_path)
                # Reload known faces
                self.load_known_faces()
                return True
        except Exception as e:
            print(f"Error deleting encoding: {e}")
        return False

# Global instance
face_recognition_service = FaceRecognitionService()
