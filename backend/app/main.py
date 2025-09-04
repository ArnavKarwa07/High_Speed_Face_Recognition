from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.routers import face_recognition
from app.services.database import init_database

# Create FastAPI instance
app = FastAPI(
    title="High Speed Face Recognition API",
    description="A high-performance face recognition system using neural networks",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create face_database directory if it doesn't exist
os.makedirs("face_database", exist_ok=True)
os.makedirs("face_database/uploads", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="face_database"), name="static")

# Include routers
app.include_router(face_recognition.router, prefix="/api", tags=["face_recognition"])

@app.on_event("startup")
def startup_event():
    """Initialize database on startup"""
    init_database()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "High Speed Face Recognition API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
