from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
from app.routers import face_recognition
from app.services.database import init_database
from app.config import settings
from app.utils.performance import PerformanceMiddleware, metrics

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI instance
app = FastAPI(
    title="High Speed Face Recognition API",
    description="A high-performance face recognition system using neural networks",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add performance monitoring
app.add_middleware(PerformanceMiddleware)

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
    logger.info("Starting Face Recognition API...")
    init_database()
    logger.info("Database initialized")
    logger.info(f"API running at http://{settings.host}:{settings.port}")


@app.on_event("shutdown")
def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Face Recognition API...")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "High Speed Face Recognition API",
        "version": "2.0.0",
        "docs": "/docs",
        "status": "operational",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "2.0.0", "service": "face-recognition-api"}


@app.get("/api/metrics")
async def get_metrics():
    """Get performance metrics"""
    return metrics.get_stats()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
