# 🚀 High Speed Face Recognition System# High Speed Face Recognition Based on Neural Networks

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)A complete face recognition system built with FastAPI backend and React.js frontend, featuring real-time face detection and recognition using deep learning models.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)

[![React](https://img.shields.io/badge/React-19.1+-61DAFB.svg)](https://reactjs.org/)## 🚀 Features

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)- **Real-time face detection and recognition**

- **Face enrollment and management**

A production-ready face recognition system built with FastAPI and React, featuring real-time detection and recognition using state-of-the-art deep learning models (dlib + face_recognition library).- **High-speed processing using optimized neural networks**

- **Modern React.js frontend with Material-UI design**

## ✨ Features- **RESTful API with FastAPI backend**

- **Image upload and webcam capture support**

### Core Functionality- **Face database management with SQLite**

- 🎯 **Real-time Face Detection** - Detect faces using dlib's HOG or CNN models- **Responsive web interface**

- 👤 **High-Accuracy Recognition** - 128-dimensional face encodings for robust matching

- 📸 **Multiple Input Methods** - Upload images or capture via webcam## 🛠 Tech Stack

- 💾 **Face Database Management** - Enroll, view, and delete faces with ease

- 🚀 **High Performance** - Optimized for speed with async processing### Backend

- 📊 **Performance Metrics** - Real-time monitoring of system performance

- **FastAPI** - Modern Python web framework

### Technical Features- **OpenCV** - Computer vision library

- ⚡ **FastAPI Backend** - Modern, fast Python web framework- **face_recognition** - Face recognition library

- ⚛️ **React Frontend** - Responsive Material-UI interface- **NumPy** - Numerical computing

- 🐳 **Docker Ready** - One-command deployment with Docker Compose- **SQLite** - Database for face metadata

- 🧪 **Comprehensive Tests** - pytest suite with coverage reporting- **Uvicorn** - ASGI server

- 📈 **Monitoring** - Built-in performance tracking and metrics

- 🔒 **Secure** - CORS protection and input validation### Frontend

- 📝 **API Documentation** - Auto-generated Swagger/ReDoc docs

- **React.js** - Frontend framework

## 🎯 Quick Start (5 Minutes)- **Vite** - Build tool and development server

- **Material-UI (MUI)** - UI component library

### Option 1: Docker (Recommended)- **React Router** - Client-side routing

- **Axios** - HTTP client

**Production:**- **react-webcam** - Webcam integration

```bash

docker-compose up -d## 📁 Project Structure

```

````

**Development (with hot reload):**High_Speed_Face_Recognition/

```bash├── backend/                    # FastAPI backend

docker-compose -f docker-compose.dev.yml up│   ├── app/

```│   │   ├── main.py            # FastAPI application

│   │   ├── models/            # Data models

Access the application:│   │   ├── routers/           # API routes

- Frontend: http://localhost:3000│   │   ├── services/          # Business logic

- Backend API: http://localhost:8000│   │   └── utils/             # Utility functions

- API Docs: http://localhost:8000/docs│   ├── face_database/         # Face data storage

│   ├── requirements.txt       # Python dependencies

### Option 2: Manual Setup│   ├── start_server.py        # Server startup script

│   └── start_backend.bat      # Windows batch file

**Prerequisites:**├── frontend/                   # React frontend

- Python 3.11+│   ├── src/

- Node.js 18+│   │   ├── components/        # React components

- CMake (for dlib installation)│   │   ├── pages/            # Page components

│   │   ├── services/         # API services

**Backend:**│   │   └── utils/            # Utility functions

```bash│   ├── package.json          # Node.js dependencies

cd backend│   ├── vite.config.js        # Vite configuration

python -m venv venv│   └── start_frontend.bat    # Windows batch file

source venv/bin/activate  # Windows: venv\Scripts\activate├── README.md                  # This file

pip install -r requirements.txt├── SETUP.md                  # Detailed setup guide

cp .env.example .env└── check_requirements.py     # Requirements checker

python start_server.py```

````

## 🚀 Quick Start

**Frontend:**

````bash### Prerequisites Check

cd frontend

npm install```bash

cp .env.example .envpython check_requirements.py

npm run dev```

````

### 1. Backend Setup

## 📁 Project Structure

````bash

```cd backend

High_Speed_Face_Recognition/pip install -r requirements.txt

├── backend/                    # FastAPI backendpython start_server.py

│   ├── app/```

│   │   ├── main.py            # FastAPI app entry

│   │   ├── config.py          # Configuration management**Windows users can simply run:**

│   │   ├── models/            # Database models & schemas

│   │   ├── routers/           # API endpoints```bash

│   │   ├── services/          # Business logicstart_backend.bat

│   │   │   └── face_recognition_service.py  # Core ML service```

│   │   └── utils/             # Utilities & middleware

│   │       └── performance.py  # Performance monitoring### 2. Frontend Setup

│   ├── tests/                 # pytest test suite

│   ├── face_database/         # Face data storage```bash

│   ├── Dockerfile             # Backend containercd frontend

│   ├── requirements.txt       # Python dependenciesnpm install

│   └── pytest.ini             # Test configurationnpm run dev

├── frontend/                   # React frontend```

│   ├── src/

│   │   ├── components/        # Reusable components**Windows users can simply run:**

│   │   ├── pages/            # Page components

│   │   │   ├── HomePage.jsx  # Dashboard with metrics```bash

│   │   │   ├── EnrollPage.jsxstart_frontend.bat

│   │   │   ├── RecognizePage.jsx```

│   │   │   └── ManagePage.jsx

│   │   ├── services/         # API client### 3. Access the Application

│   │   └── utils/            # Helper functions

│   ├── Dockerfile            # Frontend container- **Frontend:** http://localhost:3000

│   ├── nginx.conf           # Production web server config- **Backend API:** http://localhost:8000

│   ├── package.json         # Node dependencies- **API Documentation:** http://localhost:8000/docs

│   └── vite.config.js       # Build configuration

├── docker-compose.yml        # Production orchestration## 📱 Application Features

├── docker-compose.dev.yml    # Development orchestration

└── README.md                # This file### 🏠 Home Page

````

- System overview and statistics

## 🏗️ Architecture- Quick access to all features

- Real-time face count display

```

┌─────────────┐      ┌──────────────┐      ┌─────────────┐### 👤 Enroll Page (`/enroll`)

│   Browser   │ ───> │  React SPA   │ ───> │  FastAPI    │

│  (Client)   │ <─── │   (Port 3000)│ <─── │ (Port 8000) │- Add new faces to the database

└─────────────┘      └──────────────┘      └─────────────┘- Support for image upload and webcam capture

                                                   │- Real-time face validation

                                                   v

                     ┌─────────────────────────────────┐### 🔍 Recognize Page (`/recognize`)

                     │    Face Recognition Service     │

                     │  ┌───────────┐  ┌─────────────┐│- Identify faces in uploaded images or webcam feed

                     │  │   dlib    │  │face_recognition││- Confidence scores and processing time

                     │  │ HOG/CNN   │  │  128-D Encodings││- Face location visualization

                     │  └───────────┘  └─────────────┘│

                     └─────────────────────────────────┘### ⚙️ Manage Page (`/manage`)

                                    │

                                    v- View all enrolled faces

                     ┌─────────────────────────────────┐- Delete face records

                     │      SQLite Database            │- Database statistics and management

                     │  + Face Encodings (pkl files)   │

                     └─────────────────────────────────┘## 🔌 API Endpoints

```

| Method | Endpoint | Description |

## 🧪 Testing| -------- | ---------------------- | ------------------------ |

| `POST` | `/api/faces/enroll` | Enroll a new face |

Run the test suite:| `POST` | `/api/faces/recognize` | Recognize faces in image |

| `GET` | `/api/faces/` | Get all enrolled faces |

```bash| `DELETE`|`/api/faces/{face_id}` | Delete enrolled face |

cd backend| `GET` | `/api/faces/count` | Get total faces count |

pytest # Run all tests

pytest -v # Verbose output## 🎯 Usage

pytest --cov=app # With coverage report

pytest tests/test_api.py # Specific test file1. **Start both servers** (backend and frontend)

```2. **Open browser** to `http://localhost:3000`

3. **Enroll faces** by uploading images or using webcam

Test coverage report is generated in `htmlcov/index.html`.4. **Test recognition** with new images or live webcam feed

## 📊 API Endpoints## 🔧 Development

### Core EndpointsFor detailed setup instructions, see [SETUP.md](SETUP.md)

- `POST /api/faces/enroll` - Enroll a new face

- `POST /api/faces/recognize` - Recognize faces in image---

- `GET /api/faces/` - Get all enrolled faces

- `DELETE /api/faces/{id}` - Delete a face**Built with ❤️ using FastAPI and React.js**

- `GET /api/faces/count` - Get total enrolled faces

### Monitoring

- `GET /health` - Health check
- `GET /api/metrics` - Performance metrics
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation

### Example: Enroll Face

```bash
curl -X POST http://localhost:8000/api/faces/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "image_data": "data:image/jpeg;base64,/9j/4AAQ..."
  }'
```

## ⚙️ Configuration

### Backend (.env)

```env
DATABASE_URL=sqlite:///./face_database/faces.db
FACE_DETECTION_MODEL=hog  # Options: hog (faster) or cnn (more accurate)
FACE_RECOGNITION_TOLERANCE=0.6  # Lower = stricter matching
LOG_LEVEL=INFO
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
VITE_ENABLE_WEBCAM=true
VITE_MAX_FILE_SIZE_MB=10
```

## 🚀 Performance

- **Face Detection**: ~100-200ms (HOG), ~300-500ms (CNN)
- **Face Recognition**: ~50-100ms per face
- **Enrollment**: ~200-400ms
- **Throughput**: 10-20 requests/second (single worker)

Performance metrics are tracked and accessible via `/api/metrics` endpoint.

## 🔧 Troubleshooting

### dlib installation fails

```bash
# Install CMake first
# Windows: choco install cmake
# macOS: brew install cmake
# Linux: sudo apt-get install cmake

pip install dlib
```

### Port already in use

```bash
# Change ports in docker-compose.yml or .env files
# Backend: PORT=8001
# Frontend: expose different port in docker-compose.yml
```

### Face not detected

- Ensure good lighting
- Face should be clearly visible and front-facing
- Image quality should be reasonable (not too blurry)
- Try adjusting FACE_RECOGNITION_TOLERANCE (lower = stricter)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Roadmap

- [ ] GPU acceleration support (CUDA)
- [ ] Real-time video stream recognition
- [ ] Multiple face database support
- [ ] Face clustering and analytics
- [ ] Mobile app (React Native)
- [ ] Distributed processing
- [ ] Advanced anti-spoofing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [face_recognition](https://github.com/ageitgey/face_recognition) - Face recognition library
- [dlib](http://dlib.net/) - Modern C++ toolkit
- [FastAPI](https://fastapi.tiangolo.com/) - Web framework
- [React](https://reactjs.org/) - Frontend library
- [Material-UI](https://mui.com/) - React UI framework

## 👥 Authors

- [ArnavKarwa07](https://github.com/ArnavKarwa07)

## 📞 Support

For issues and questions:

- Open an [issue](https://github.com/ArnavKarwa07/High_Speed_Face_Recognition/issues)
- Check the documentation

---

⭐ Star this repository if you find it helpful!
