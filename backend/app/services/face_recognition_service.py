import cv2
import numpy as np
import base64
import os
import pickle
import time
import face_recognition
from PIL import Image
from io import BytesIO
from typing import List, Tuple, Optional
import logging
from app.models.schemas import RecognitionResult
from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FaceRecognitionService:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []
        self.face_encodings_by_name = {}  # Dictionary to group encodings by name
        self.face_database_path = "face_database"
        self.encodings_path = os.path.join(self.face_database_path, "encodings")
        self.uploads_path = os.path.join(self.face_database_path, "uploads")
        os.makedirs(self.encodings_path, exist_ok=True)
        os.makedirs(self.uploads_path, exist_ok=True)

        # Use face_recognition library (dlib-based)
        logger.info("Initializing face recognition service with dlib models")

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
            if pil_image.mode != "RGB":
                pil_image = pil_image.convert("RGB")

            # Convert to numpy array (PIL uses RGB order)
            np_image = np.array(pil_image)

            logger.info(f"Image loaded: shape={np_image.shape}, dtype={np_image.dtype}")

            return np_image
        except Exception as e:
            logger.error(f"Error converting base64 to image: {str(e)}")
            raise ValueError(f"Invalid image data: {str(e)}")

    def detect_faces(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """Detect faces using dlib CNN or HOG model"""
        # face_recognition library expects RGB images
        # If image is BGR (from OpenCV), convert to RGB
        if len(image.shape) == 3 and image.shape[2] == 3:
            # Check if we need to convert BGR to RGB
            # Our base64_to_image now returns RGB directly
            rgb_image = image
        else:
            logger.warning(f"Unexpected image format: shape={image.shape}")
            rgb_image = image

        logger.info(f"Detecting faces in image: shape={rgb_image.shape}")

        # Use face_recognition library with HOG model (faster, good accuracy)
        # For even better accuracy, use model="cnn" (requires GPU support)
        face_locations = face_recognition.face_locations(rgb_image, model="hog")

        logger.info(f"Detected {len(face_locations)} faces")

        return face_locations

    def extract_face_encoding(
        self, image: np.ndarray, face_location: Tuple[int, int, int, int]
    ) -> np.ndarray:
        """Extract 128-dimensional face encoding using dlib's ResNet model"""
        # face_recognition expects RGB images
        rgb_image = image

        # Get face encoding (128-dimensional vector)
        encodings = face_recognition.face_encodings(rgb_image, [face_location])

        if len(encodings) > 0:
            return encodings[0]
        else:
            raise ValueError("Could not extract face encoding")

    def save_face_encoding(self, face_encoding: np.ndarray, name: str) -> str:
        """Save face encoding to file"""
        encoding_filename = f"{name}_{int(time.time())}.pkl"
        encoding_path = os.path.join(self.encodings_path, encoding_filename)

        with open(encoding_path, "wb") as f:
            pickle.dump(face_encoding, f)

        return encoding_path

    def load_known_faces(self):
        """Load all known face encodings from database directory and group by name"""
        self.known_face_encodings = []
        self.known_face_names = []
        self.face_encodings_by_name = {}

        if os.path.exists(self.encodings_path):
            for filename in os.listdir(self.encodings_path):
                if filename.endswith(".pkl"):
                    filepath = os.path.join(self.encodings_path, filename)
                    try:
                        with open(filepath, "rb") as f:
                            encoding = pickle.load(f)
                            self.known_face_encodings.append(encoding)
                            # Extract name from filename (remove timestamp and extension)
                            name = "_".join(filename.split("_")[:-1])
                            self.known_face_names.append(name)

                            # Group encodings by name for better recognition
                            if name not in self.face_encodings_by_name:
                                self.face_encodings_by_name[name] = []
                            self.face_encodings_by_name[name].append(encoding)
                    except Exception as e:
                        logger.error(f"Error loading encoding {filename}: {e}")

        # Log statistics about grouped faces
        for name, encodings in self.face_encodings_by_name.items():
            logger.info(f"Loaded {len(encodings)} encoding(s) for '{name}'")

    def compare_faces(
        self,
        known_encodings: List[np.ndarray],
        face_encoding: np.ndarray,
        tolerance: Optional[float] = None,
    ) -> List[bool]:
        """Compare face encodings using face_recognition library

        Args:
            tolerance: Lower values are more strict. If None, uses config value.
                      0.6 = loose matching, 0.4 = strict matching
        """
        if len(known_encodings) == 0:
            return []

        # Use config value if tolerance not specified
        if tolerance is None:
            tolerance = settings.face_recognition_tolerance

        # Use face_recognition's compare function (uses Euclidean distance)
        return face_recognition.compare_faces(
            known_encodings, face_encoding, tolerance=tolerance
        )

    def face_distance(
        self, known_encodings: List[np.ndarray], face_encoding: np.ndarray
    ) -> List[float]:
        """Calculate distances between face encodings using Euclidean distance"""
        if len(known_encodings) == 0:
            return []

        # Use face_recognition's distance function (Euclidean distance)
        distances = face_recognition.face_distance(known_encodings, face_encoding)
        return distances.tolist() if hasattr(distances, "tolist") else list(distances)

    def enroll_face(
        self, image_data: str, name: str
    ) -> Tuple[bool, str, Optional[str]]:
        """Enroll a new face"""
        try:
            # Convert base64 to image
            image = self.base64_to_image(image_data)

            # Detect faces
            face_locations = self.detect_faces(image)

            if len(face_locations) == 0:
                return False, "No face detected in the image", None

            if len(face_locations) > 1:
                return (
                    False,
                    "Multiple faces detected. Please use an image with only one face",
                    None,
                )

            # Extract face encoding
            face_encoding = self.extract_face_encoding(image, face_locations[0])

            # Save the image (convert RGB to BGR for OpenCV)
            image_filename = f"{name}_{int(time.time())}.jpg"
            image_path = os.path.join(self.uploads_path, image_filename)
            bgr_image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            cv2.imwrite(image_path, bgr_image)
            logger.info(f"Saved image to {image_path}")

            # Save the encoding
            encoding_path = self.save_face_encoding(face_encoding, name)

            # Add to known faces
            self.known_face_encodings.append(face_encoding)
            self.known_face_names.append(name)

            # Update grouped encodings
            if name not in self.face_encodings_by_name:
                self.face_encodings_by_name[name] = []
            self.face_encodings_by_name[name].append(face_encoding)

            # Check if this is an additional encoding for an existing person
            encoding_count = len(self.face_encodings_by_name[name])
            if encoding_count > 1:
                message = (
                    f"Face enrolled successfully for {name}. "
                    f"Now have {encoding_count} encodings for improved recognition accuracy."
                )
                logger.info(f"Added encoding #{encoding_count} for '{name}'")
            else:
                message = f"Face enrolled successfully for {name}"

            return True, message, encoding_path

        except Exception as e:
            return False, f"Error enrolling face: {str(e)}", None

    def recognize_faces(self, image_data: str) -> Tuple[List[RecognitionResult], float]:
        """Recognize faces in an image using grouped encodings for better accuracy"""
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
                    # Strategy 1: Compare with all individual encodings
                    face_distances = self.face_distance(
                        self.known_face_encodings, face_encoding
                    )

                    if len(face_distances) > 0:
                        best_match_index = np.argmin(face_distances)
                        distance = face_distances[best_match_index]
                        matches = self.compare_faces(
                            self.known_face_encodings, face_encoding
                        )

                        # Strategy 2: Use grouped encodings for verification
                        # Check if we have multiple encodings for the matched person
                        matched_name = self.known_face_names[best_match_index]

                        if matched_name in self.face_encodings_by_name:
                            person_encodings = self.face_encodings_by_name[matched_name]

                            # Compare with all encodings of this person
                            person_distances = self.face_distance(
                                person_encodings, face_encoding
                            )
                            person_matches = self.compare_faces(
                                person_encodings, face_encoding
                            )

                            # Calculate average distance and match rate
                            avg_distance = np.mean(person_distances)
                            match_rate = sum(person_matches) / len(person_matches)

                            # Use the best (minimum) distance from all encodings
                            best_person_distance = np.min(person_distances)

                            # Calculate confidence based on best match
                            confidence = max(0, (1 - best_person_distance) * 100)

                            logger.info(
                                f"Person '{matched_name}': {len(person_encodings)} encodings, "
                                f"match_rate={match_rate:.2f}, avg_dist={avg_distance:.3f}, "
                                f"best_dist={best_person_distance:.3f}, confidence={confidence:.1f}%"
                            )

                            # Enhanced matching criteria:
                            # - At least one encoding must match
                            # - Confidence must be above threshold
                            # - OR if multiple encodings available, require good match rate
                            if (
                                confidence
                                >= settings.face_recognition_confidence_threshold
                            ):
                                if len(person_encodings) == 1:
                                    # Single encoding: use standard matching
                                    if matches[best_match_index]:
                                        name = matched_name
                                        logger.info(
                                            f"Match found (single encoding): {name} with {confidence:.1f}% confidence"
                                        )
                                else:
                                    # Multiple encodings: use enhanced matching
                                    # Require at least 50% of encodings to match OR best distance is very good
                                    if match_rate >= 0.5 or best_person_distance < 0.4:
                                        name = matched_name
                                        logger.info(
                                            f"Match found (grouped encodings): {name} with {confidence:.1f}% confidence "
                                            f"({sum(person_matches)}/{len(person_matches)} encodings matched)"
                                        )
                                    else:
                                        logger.info(
                                            f"Match rejected: low match rate ({match_rate:.2f} < 0.5)"
                                        )
                                        name = "Unknown"
                                        confidence = 0.0
                            else:
                                name = "Unknown"
                                confidence = 0.0
                                logger.info(
                                    f"Low confidence match rejected: {matched_name} "
                                    f"({confidence:.1f}% < {settings.face_recognition_confidence_threshold}%)"
                                )
                        else:
                            # Fallback to original logic if grouping data not available
                            confidence = max(0, (1 - distance) * 100)
                            if (
                                matches[best_match_index]
                                and confidence
                                >= settings.face_recognition_confidence_threshold
                            ):
                                name = matched_name
                                logger.info(
                                    f"Match found: {name} with {confidence:.1f}% confidence"
                                )
                            else:
                                name = "Unknown"
                                confidence = 0.0

                # Convert face location format (top, right, bottom, left)
                top, right, bottom, left = face_location

                results.append(
                    RecognitionResult(
                        name=name,
                        confidence=round(confidence, 2),
                        face_location=[top, right, bottom, left],
                    )
                )

            processing_time = time.time() - start_time
            return results, processing_time

        except Exception as e:
            processing_time = time.time() - start_time
            logger.error(f"Error in face recognition: {str(e)}")
            return [], processing_time

    def delete_face_encoding(self, encoding_path: str):
        """Delete a face encoding file and update grouped encodings"""
        try:
            if os.path.exists(encoding_path):
                os.remove(encoding_path)
                # Reload known faces to update all data structures
                self.load_known_faces()
                logger.info(f"Deleted encoding: {encoding_path}")
                return True
        except Exception as e:
            logger.error(f"Error deleting encoding: {e}")
        return False

    def get_face_statistics(self):
        """Get statistics about enrolled faces including grouped information"""
        stats = {
            "total_encodings": len(self.known_face_encodings),
            "unique_people": len(self.face_encodings_by_name),
            "people_with_multiple_encodings": 0,
            "grouped_faces": {},
        }

        for name, encodings in self.face_encodings_by_name.items():
            encoding_count = len(encodings)
            stats["grouped_faces"][name] = encoding_count
            if encoding_count > 1:
                stats["people_with_multiple_encodings"] += 1

        return stats


# Global instance
face_recognition_service = FaceRecognitionService()
