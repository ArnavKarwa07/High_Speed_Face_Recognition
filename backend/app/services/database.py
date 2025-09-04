import sqlalchemy
from sqlalchemy.orm import sessionmaker
from app.models.database import Base
import os

DATABASE_URL = "sqlite:///./face_database/faces.db"

engine = sqlalchemy.create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_database():
    """Initialize database tables"""
    # Create face_database directory if it doesn't exist
    os.makedirs("face_database", exist_ok=True)
    # Create all tables
    Base.metadata.create_all(bind=engine)

def get_database():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
