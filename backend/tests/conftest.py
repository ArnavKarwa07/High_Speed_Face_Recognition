"""
Test configuration and fixtures
"""

import pytest
import os
import shutil
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.models.database import Base
from app.services.database import get_database

# Test database
TEST_DATABASE_URL = "sqlite:///./test_face_database.db"
TEST_FACE_DATABASE_PATH = "test_face_database"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_database():
    """Override database for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def test_db():
    """Create test database"""
    # Create test directories
    os.makedirs(TEST_FACE_DATABASE_PATH, exist_ok=True)
    os.makedirs(f"{TEST_FACE_DATABASE_PATH}/uploads", exist_ok=True)
    os.makedirs(f"{TEST_FACE_DATABASE_PATH}/encodings", exist_ok=True)

    # Create tables
    Base.metadata.create_all(bind=engine)

    yield TestingSessionLocal()

    # Cleanup
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("test_face_database.db"):
        os.remove("test_face_database.db")
    if os.path.exists(TEST_FACE_DATABASE_PATH):
        shutil.rmtree(TEST_FACE_DATABASE_PATH)


@pytest.fixture(scope="function")
def client(test_db):
    """Create test client"""
    app.dependency_overrides[get_database] = override_get_database
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_face_image():
    """Generate a sample face image as base64"""
    import cv2
    import numpy as np
    import base64

    # Create a simple test image (100x100 pixels)
    img = np.ones((100, 100, 3), dtype=np.uint8) * 255

    # Encode to JPEG
    _, buffer = cv2.imencode(".jpg", img)
    img_base64 = base64.b64encode(buffer).decode("utf-8")

    return f"data:image/jpeg;base64,{img_base64}"
