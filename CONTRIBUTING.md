# Contributing to High Speed Face Recognition

First off, thank you for considering contributing to this project! 🎉

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🐛 Found a Bug?

If you find a bug in the source code, you can help us by submitting an issue to our GitHub Repository. Even better, you can submit a Pull Request with a fix.

**Before submitting a bug report:**

- Check if the bug has already been reported in the Issues section
- Try to reproduce the bug with the latest version
- Collect relevant information (OS, Python/Node version, error messages, logs)

**Submitting a good bug report:**

```markdown
## Bug Description

[Clear description of the bug]

## Steps to Reproduce

1. [First step]
2. [Second step]
3. [...]

## Expected Behavior

[What you expected to happen]

## Actual Behavior

[What actually happened]

## Environment

- OS: [e.g., Windows 11, macOS 13, Ubuntu 22.04]
- Python: [e.g., 3.11.5]
- Node: [e.g., 18.17.0]
- Docker: [e.g., 24.0.5]

## Additional Context

[Any other relevant information, screenshots, logs]
```

## 💡 Feature Requests

We love feature requests! Before submitting one:

- Check if it's already been requested
- Explain why this feature would be useful
- Provide examples of how it would work

## 🔧 Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (optional but recommended)
- CMake (for dlib)
- Git

### Local Development Setup

1. **Fork and Clone**

```bash
git clone https://github.com/YOUR_USERNAME/High_Speed_Face_Recognition.git
cd High_Speed_Face_Recognition
```

2. **Backend Setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

3. **Frontend Setup**

```bash
cd frontend
npm install
cp .env.example .env
```

4. **Run Tests**

```bash
# Backend
cd backend
pytest -v

# Frontend
cd frontend
npm run lint
npm run build
```

### Docker Development

```bash
docker-compose -f docker-compose.dev.yml up
```

## 📝 Pull Request Process

1. **Create a Branch**

```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
```

2. **Make Your Changes**

   - Follow the code style guidelines (below)
   - Write or update tests
   - Update documentation if needed
   - Keep commits focused and atomic

3. **Test Your Changes**

```bash
# Backend tests
cd backend
pytest -v --cov=app

# Frontend build
cd frontend
npm run lint
npm run build
```

4. **Commit Your Changes**

```bash
git add .
git commit -m "feat: add amazing feature"
```

**Commit Message Convention:**

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding tests
- `refactor:` Code refactoring
- `style:` Formatting changes
- `perf:` Performance improvements
- `chore:` Maintenance tasks

5. **Push and Create PR**

```bash
git push origin feature/amazing-feature
```

Then create a Pull Request on GitHub with:

- Clear title and description
- Reference any related issues
- Screenshots/GIFs for UI changes
- List of changes made

## 🎨 Code Style Guidelines

### Python (Backend)

Follow PEP 8 and use these tools:

```bash
# Format code
black app/

# Sort imports
isort app/

# Lint
flake8 app/
```

**Key conventions:**

- Use type hints
- Write docstrings for functions/classes
- Keep functions focused and small
- Use meaningful variable names
- Handle exceptions properly

**Example:**

```python
def recognize_face(image_data: str) -> Tuple[List[RecognitionResult], float]:
    """
    Recognize faces in the given image.

    Args:
        image_data: Base64 encoded image string

    Returns:
        Tuple of (recognition results, processing time)

    Raises:
        ValueError: If image_data is invalid
    """
    # Implementation
```

### JavaScript/React (Frontend)

```bash
# Lint
npm run lint

# Format (if using prettier)
npm run format
```

**Key conventions:**

- Use functional components with hooks
- Destructure props
- Use descriptive component names
- Keep components focused
- Handle loading and error states
- Use proper PropTypes or TypeScript

**Example:**

```jsx
const FaceCard = ({ face, onDelete, loading }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(face.id);
    } finally {
      setDeleting(false);
    }
  };

  return <Card>{/* Component JSX */}</Card>;
};
```

## 🧪 Testing Guidelines

### Backend Tests

Location: `backend/tests/`

```python
def test_enrollment_success(client, sample_image):
    """Test successful face enrollment"""
    response = client.post(
        "/api/faces/enroll",
        json={"name": "Test User", "image_data": sample_image}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
```

**Test categories:**

- Unit tests for services
- Integration tests for API endpoints
- Edge cases and error handling

### Frontend Tests

Consider adding tests for:

- Component rendering
- User interactions
- API integration
- Error handling

## 📚 Documentation

When adding new features:

- Update README.md if it affects setup/usage
- Add API docs for new endpoints
- Update CHANGELOG.md
- Add inline code comments for complex logic
- Update .env.example if adding config options

## 🏗️ Architecture Guidelines

### Backend Structure

```
app/
├── models/         # Database models, Pydantic schemas
├── routers/        # API route handlers
├── services/       # Business logic (face recognition, database)
├── utils/          # Helper functions, middleware
└── config.py       # Configuration management
```

### Adding New Features

**New API Endpoint:**

1. Add schema to `models/schemas.py`
2. Add route handler to appropriate router
3. Add business logic to service
4. Write tests
5. Update API documentation

**New Service:**

1. Create service file in `services/`
2. Add to `services/__init__.py`
3. Write unit tests
4. Document usage

## 🔍 Review Process

All PRs go through review:

1. Automated checks (tests, linting)
2. Code review by maintainer
3. Requested changes (if any)
4. Approval and merge

**Tips for faster review:**

- Keep PRs focused and reasonably sized
- Write clear descriptions
- Respond to feedback promptly
- Keep your branch updated with main

## 🎯 Priority Areas

We especially welcome contributions in these areas:

- [ ] Performance optimizations
- [ ] Additional tests
- [ ] Documentation improvements
- [ ] UI/UX enhancements
- [ ] Accessibility improvements
- [ ] Mobile responsiveness
- [ ] Error handling improvements

## 📞 Questions?

- Open a GitHub Discussion
- Comment on relevant issues
- Check existing documentation

## 🌟 Recognition

Contributors will be:

- Listed in README.md
- Mentioned in release notes
- Forever appreciated! 🙏

Thank you for contributing! 🚀
