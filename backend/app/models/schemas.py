from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FaceEnrollRequest(BaseModel):
    name: str
    image_data: str  # Base64 encoded image

class FaceRecognitionRequest(BaseModel):
    image_data: str  # Base64 encoded image

class FaceData(BaseModel):
    id: int
    name: str
    image_path: str
    encoding_path: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class RecognitionResult(BaseModel):
    name: str
    confidence: float
    face_location: List[int]  # [top, right, bottom, left]

class RecognitionResponse(BaseModel):
    faces_detected: int
    results: List[RecognitionResult]
    processing_time: float

class EnrollmentResponse(BaseModel):
    success: bool
    message: str
    face_id: Optional[int] = None
