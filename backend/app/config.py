"""Configuration management for the application"""

import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    # Database
    database_url: str = "sqlite:///./face_database/faces.db"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = False

    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Logging
    log_level: str = "INFO"

    # Face Recognition
    face_detection_model: str = "hog"  # hog or cnn
    face_recognition_tolerance: float = 0.45  # Lower = stricter (0.4-0.6 recommended)
    face_recognition_confidence_threshold: float = (
        60.0  # Minimum confidence % to consider valid
    )
    max_face_size_mb: int = 10

    # Performance
    workers: int = 4

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
