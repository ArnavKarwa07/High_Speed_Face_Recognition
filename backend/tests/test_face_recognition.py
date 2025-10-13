"""
Tests for face recognition service
"""

import pytest
import numpy as np
import cv2
import base64
from app.services.face_recognition_service import FaceRecognitionService


@pytest.fixture
def face_service():
    """Create face recognition service instance"""
    return FaceRecognitionService()


def test_face_service_initialization(face_service):
    """Test face service initializes correctly"""
    assert face_service is not None
    assert hasattr(face_service, "known_face_encodings")
    assert hasattr(face_service, "known_face_names")
    assert isinstance(face_service.known_face_encodings, list)
    assert isinstance(face_service.known_face_names, list)


def test_base64_to_image_valid(face_service):
    """Test converting valid base64 to image"""
    # Create a simple test image
    img = np.ones((100, 100, 3), dtype=np.uint8) * 255
    _, buffer = cv2.imencode(".jpg", img)
    img_base64 = base64.b64encode(buffer).decode("utf-8")

    result = face_service.base64_to_image(img_base64)
    assert result is not None
    assert isinstance(result, np.ndarray)
    assert result.shape == (100, 100, 3)


def test_base64_to_image_with_data_url(face_service):
    """Test converting base64 with data URL prefix"""
    img = np.ones((100, 100, 3), dtype=np.uint8) * 255
    _, buffer = cv2.imencode(".jpg", img)
    img_base64 = base64.b64encode(buffer).decode("utf-8")
    data_url = f"data:image/jpeg;base64,{img_base64}"

    result = face_service.base64_to_image(data_url)
    assert result is not None
    assert isinstance(result, np.ndarray)


def test_base64_to_image_invalid(face_service):
    """Test converting invalid base64"""
    with pytest.raises(ValueError):
        face_service.base64_to_image("invalid_base64_string")


def test_compare_faces_empty(face_service):
    """Test comparing faces with empty known encodings"""
    face_encoding = np.random.rand(128)
    result = face_service.compare_faces([], face_encoding)
    assert result == []


def test_face_distance_empty(face_service):
    """Test calculating distance with empty known encodings"""
    face_encoding = np.random.rand(128)
    result = face_service.face_distance([], face_encoding)
    assert result == []
