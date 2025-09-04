# High Speed Face Recognition Based on Neural Networks

A complete face recognition system built with FastAPI backend and React.js frontend, featuring real-time face detection and recognition using deep learning models.

## 🚀 Features

- **Real-time face detection and recognition**
- **Face enrollment and management**
- **High-speed processing using optimized neural networks**
- **Modern React.js frontend with Material-UI design**
- **RESTful API with FastAPI backend**
- **Image upload and webcam capture support**
- **Face database management with SQLite**
- **Responsive web interface**

## 🛠 Tech Stack

### Backend

- **FastAPI** - Modern Python web framework
- **OpenCV** - Computer vision library
- **face_recognition** - Face recognition library
- **NumPy** - Numerical computing
- **SQLite** - Database for face metadata
- **Uvicorn** - ASGI server

### Frontend

- **React.js** - Frontend framework
- **Vite** - Build tool and development server
- **Material-UI (MUI)** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **react-webcam** - Webcam integration

## 📁 Project Structure

```
High_Speed_Face_Recognition/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI application
│   │   ├── models/            # Data models
│   │   ├── routers/           # API routes
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utility functions
│   ├── face_database/         # Face data storage
│   ├── requirements.txt       # Python dependencies
│   ├── start_server.py        # Server startup script
│   └── start_backend.bat      # Windows batch file
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   ├── package.json          # Node.js dependencies
│   ├── vite.config.js        # Vite configuration
│   └── start_frontend.bat    # Windows batch file
├── README.md                  # This file
├── SETUP.md                  # Detailed setup guide
└── check_requirements.py     # Requirements checker
```

## 🚀 Quick Start

### Prerequisites Check

```bash
python check_requirements.py
```

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python start_server.py
```

**Windows users can simply run:**

```bash
start_backend.bat
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Windows users can simply run:**

```bash
start_frontend.bat
```

### 3. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 📱 Application Features

### 🏠 Home Page

- System overview and statistics
- Quick access to all features
- Real-time face count display

### 👤 Enroll Page (`/enroll`)

- Add new faces to the database
- Support for image upload and webcam capture
- Real-time face validation

### 🔍 Recognize Page (`/recognize`)

- Identify faces in uploaded images or webcam feed
- Confidence scores and processing time
- Face location visualization

### ⚙️ Manage Page (`/manage`)

- View all enrolled faces
- Delete face records
- Database statistics and management

## 🔌 API Endpoints

| Method   | Endpoint               | Description              |
| -------- | ---------------------- | ------------------------ |
| `POST`   | `/api/faces/enroll`    | Enroll a new face        |
| `POST`   | `/api/faces/recognize` | Recognize faces in image |
| `GET`    | `/api/faces/`          | Get all enrolled faces   |
| `DELETE` | `/api/faces/{face_id}` | Delete enrolled face     |
| `GET`    | `/api/faces/count`     | Get total faces count    |

## 🎯 Usage

1. **Start both servers** (backend and frontend)
2. **Open browser** to `http://localhost:3000`
3. **Enroll faces** by uploading images or using webcam
4. **Test recognition** with new images or live webcam feed

## 🔧 Development

For detailed setup instructions, see [SETUP.md](SETUP.md)

---

**Built with ❤️ using FastAPI and React.js**
