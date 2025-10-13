from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import os
from typing import List
import time

from app.models.schemas import (
    FaceEnrollRequest,
    FaceRecognitionRequest,
    FaceData,
    RecognitionResponse,
    EnrollmentResponse,
)
from app.models.database import Face
from app.services.database import get_database as get_db
from app.services.face_recognition_service import face_recognition_service
from app.utils.performance import metrics

router = APIRouter()


@router.post("/faces/enroll", response_model=EnrollmentResponse)
async def enroll_face(request: FaceEnrollRequest, db: Session = Depends(get_db)):
    """Enroll a new face in the system"""
    start_time = time.time()
    try:
        # Use face recognition service to enroll face
        success, message, encoding_path = face_recognition_service.enroll_face(
            request.image_data, request.name
        )

        if not success:
            return EnrollmentResponse(success=False, message=message)

        # Save to database
        db_face = Face(
            name=request.name,
            image_path=f"face_database/uploads/{request.name}_{int(os.path.getmtime(encoding_path))}.jpg",
            encoding_path=encoding_path,
        )

        db.add(db_face)
        db.commit()
        db.refresh(db_face)

        # Track metrics
        duration = time.time() - start_time
        metrics.add_enrollment_time(duration)

        return EnrollmentResponse(success=True, message=message, face_id=db_face.id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/faces/recognize", response_model=RecognitionResponse)
async def recognize_faces(request: FaceRecognitionRequest):
    """Recognize faces in an image"""
    try:
        results, processing_time = face_recognition_service.recognize_faces(
            request.image_data
        )

        # Track metrics
        metrics.add_recognition_time(processing_time)

        return RecognitionResponse(
            faces_detected=len(results),
            results=results,
            processing_time=round(processing_time, 3),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/faces/", response_model=List[FaceData])
async def get_all_faces(db: Session = Depends(get_db)):
    """Get all enrolled faces"""
    try:
        faces = db.query(Face).all()
        return faces
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/faces/{face_id}")
async def delete_face(face_id: int, db: Session = Depends(get_db)):
    """Delete an enrolled face"""
    try:
        face = db.query(Face).filter(Face.id == face_id).first()
        if not face:
            raise HTTPException(status_code=404, detail="Face not found")

        # Delete encoding file
        face_recognition_service.delete_face_encoding(face.encoding_path)

        # Delete image file if exists
        if os.path.exists(face.image_path):
            os.remove(face.image_path)

        # Delete from database
        db.delete(face)
        db.commit()

        return {"message": f"Face {face.name} deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/faces/count")
async def get_faces_count(db: Session = Depends(get_db)):
    """Get total number of enrolled faces"""
    try:
        count = db.query(Face).count()
        return {"total_faces": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/faces/statistics")
async def get_faces_statistics():
    """Get detailed statistics about enrolled faces including grouped encodings"""
    try:
        stats = face_recognition_service.get_face_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
