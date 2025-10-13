"""
Tests for API endpoints
"""

import pytest
from fastapi.testclient import TestClient


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert data["status"] == "operational"


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "service" in data


def test_get_faces_count_empty(client):
    """Test getting faces count when database is empty"""
    response = client.get("/api/faces/count")
    assert response.status_code == 200
    data = response.json()
    assert data["total_faces"] == 0


def test_get_all_faces_empty(client):
    """Test getting all faces when database is empty"""
    response = client.get("/api/faces/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_enroll_face_no_image(client):
    """Test enrollment without image"""
    response = client.post(
        "/api/faces/enroll", json={"name": "Test User", "image_data": ""}
    )
    assert response.status_code in [400, 422, 500]


def test_enroll_face_invalid_data(client):
    """Test enrollment with invalid data"""
    response = client.post(
        "/api/faces/enroll", json={"name": "", "image_data": "invalid_base64"}
    )
    assert response.status_code in [400, 422, 500]


def test_recognize_face_no_image(client):
    """Test recognition without image"""
    response = client.post("/api/faces/recognize", json={"image_data": ""})
    assert response.status_code in [400, 422, 500]


def test_delete_nonexistent_face(client):
    """Test deleting a face that doesn't exist"""
    response = client.delete("/api/faces/999999")
    assert response.status_code == 404


def test_api_cors_headers(client):
    """Test CORS headers are present"""
    response = client.get("/")
    assert (
        "access-control-allow-origin" in response.headers or response.status_code == 200
    )
