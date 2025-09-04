# Setup Instructions

## Prerequisites

### Python Requirements (Backend)

- Python 3.8 or higher
- pip (Python package installer)

### Node.js Requirements (Frontend)

- Node.js 16 or higher
- npm or yarn

## Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv face_recognition_env

# Activate virtual environment
# On Windows:
face_recognition_env\Scripts\activate
# On macOS/Linux:
source face_recognition_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python start_server.py
```

**Alternative for Windows:**

```bash
# Simply run the batch file
start_backend.bat
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

**Alternative for Windows:**

```bash
# Simply run the batch file
start_frontend.bat
```

## Running the Application

1. **Start Backend First:**

   - Backend runs on: `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`

2. **Start Frontend:**
   - Frontend runs on: `http://localhost:3000`
   - Access the application at: `http://localhost:3000`

## Features Available

### 1. Face Enrollment (`/enroll`)

- Upload images or use webcam to enroll new faces
- Automatic face detection and validation
- Secure storage of face encodings

### 2. Face Recognition (`/recognize`)

- Real-time face recognition from images or webcam
- Confidence scores and face location detection
- Processing time display

### 3. Face Management (`/manage`)

- View all enrolled faces
- Delete face records
- Database statistics

## API Endpoints

- `POST /api/faces/enroll` - Enroll a new face
- `POST /api/faces/recognize` - Recognize faces in image
- `GET /api/faces/` - Get all enrolled faces
- `DELETE /api/faces/{face_id}` - Delete enrolled face
- `GET /api/faces/count` - Get faces count

## Troubleshooting

### Common Issues

1. **dlib installation fails:**

   ```bash
   # Install Visual Studio Build Tools or use pre-compiled wheels
   pip install dlib-binary
   ```

2. **OpenCV camera access:**

   - Ensure camera permissions are granted
   - Close other applications using the camera

3. **CORS errors:**

   - Backend includes CORS middleware for localhost:3000
   - Check that both servers are running

4. **Face detection issues:**
   - Ensure good lighting conditions
   - Use high-quality images
   - Face should be clearly visible and facing forward

### Performance Tips

1. **For faster recognition:**

   - Use smaller image sizes (max 800x600)
   - Ensure good lighting
   - Minimize background noise

2. **For better accuracy:**
   - Enroll multiple images per person
   - Use different angles and lighting conditions
   - Ensure face is at least 100x100 pixels

## Development

### Backend Development

- FastAPI with automatic API documentation
- SQLite database for face metadata
- Face encodings stored as pickle files
- Hot reload enabled for development

### Frontend Development

- Vite for fast development and building
- Material-UI for consistent design
- React Router for navigation
- Axios for API communication

## Production Deployment

### Backend

```bash
# Use production ASGI server
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

```bash
# Build for production
npm run build

# Serve with a static file server
npm install -g serve
serve -s dist
```
