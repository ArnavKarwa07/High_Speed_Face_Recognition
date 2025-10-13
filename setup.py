#!/usr/bin/env python3
"""
Quick setup script for Face Recognition System
This script checks prerequisites and sets up the development environment
"""

import os
import sys
import subprocess
import platform
import shutil
from pathlib import Path


def print_header(text):
    """Print formatted header"""
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")


def check_command(command):
    """Check if a command exists"""
    return shutil.which(command) is not None


def run_command(command, cwd=None):
    """Run a shell command"""
    try:
        result = subprocess.run(
            command, shell=True, cwd=cwd, check=True, capture_output=True, text=True
        )
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr


def main():
    print_header("Face Recognition System - Quick Setup")

    project_root = Path(__file__).parent
    backend_dir = project_root / "backend"
    frontend_dir = project_root / "frontend"

    # Check prerequisites
    print("📋 Checking prerequisites...")

    prerequisites = {
        "Python": check_command("python") or check_command("python3"),
        "pip": check_command("pip") or check_command("pip3"),
        "Node.js": check_command("node"),
        "npm": check_command("npm"),
        "Git": check_command("git"),
    }

    for name, available in prerequisites.items():
        status = "✓" if available else "✗"
        print(f"{status} {name}: {'Available' if available else 'Not found'}")

    if not all(prerequisites.values()):
        print("\n❌ Some prerequisites are missing. Please install them first.")
        print("Visit: https://github.com/ArnavKarwa07/High_Speed_Face_Recognition")
        sys.exit(1)

    print("\n✅ All prerequisites are available!")

    # Ask user preference
    print("\n🚀 Setup Options:")
    print("1. Docker setup (Recommended)")
    print("2. Manual setup")
    print("3. Development setup (Docker with hot reload)")

    choice = input("\nSelect option (1-3): ").strip()

    if choice == "1":
        print_header("Docker Setup")
        if not check_command("docker-compose") and not check_command("docker compose"):
            print("❌ Docker Compose not found. Please install Docker Desktop.")
            sys.exit(1)

        print("🐳 Starting services with Docker Compose...")
        success, output = run_command("docker-compose up -d", cwd=project_root)

        if success:
            print("\n✅ Services started successfully!")
            print("\n📍 Access points:")
            print("   Frontend: http://localhost:3000")
            print("   Backend:  http://localhost:8000")
            print("   API Docs: http://localhost:8000/docs")
        else:
            print(f"\n❌ Failed to start services:\n{output}")
            sys.exit(1)

    elif choice == "2":
        print_header("Manual Setup")

        # Backend setup
        print("🔧 Setting up backend...")

        # Create virtual environment
        venv_path = backend_dir / "venv"
        if not venv_path.exists():
            print("Creating Python virtual environment...")
            success, output = run_command("python -m venv venv", cwd=backend_dir)
            if not success:
                print(f"❌ Failed to create venv:\n{output}")
                sys.exit(1)

        # Determine pip command based on OS
        if platform.system() == "Windows":
            pip_cmd = str(venv_path / "Scripts" / "pip.exe")
            python_cmd = str(venv_path / "Scripts" / "python.exe")
        else:
            pip_cmd = str(venv_path / "bin" / "pip")
            python_cmd = str(venv_path / "bin" / "python")

        # Install backend dependencies
        print("Installing backend dependencies...")
        success, output = run_command(
            f"{pip_cmd} install -r requirements.txt", cwd=backend_dir
        )
        if not success:
            print(f"❌ Failed to install dependencies:\n{output}")
            sys.exit(1)

        # Copy .env file
        env_example = backend_dir / ".env.example"
        env_file = backend_dir / ".env"
        if env_example.exists() and not env_file.exists():
            shutil.copy(env_example, env_file)
            print("✓ Created .env file from template")

        # Frontend setup
        print("\n🔧 Setting up frontend...")

        print("Installing frontend dependencies...")
        success, output = run_command("npm install", cwd=frontend_dir)
        if not success:
            print(f"❌ Failed to install dependencies:\n{output}")
            sys.exit(1)

        # Copy .env file
        env_example = frontend_dir / ".env.example"
        env_file = frontend_dir / ".env"
        if env_example.exists() and not env_file.exists():
            shutil.copy(env_example, env_file)
            print("✓ Created .env file from template")

        print("\n✅ Setup complete!")
        print("\n📍 To start the application:")
        print(f"\n   Backend:")
        if platform.system() == "Windows":
            print(f"   cd backend && venv\\Scripts\\activate && python start_server.py")
        else:
            print(
                f"   cd backend && source venv/bin/activate && python start_server.py"
            )
        print(f"\n   Frontend:")
        print(f"   cd frontend && npm run dev")

    elif choice == "3":
        print_header("Development Setup")
        if not check_command("docker-compose") and not check_command("docker compose"):
            print("❌ Docker Compose not found. Please install Docker Desktop.")
            sys.exit(1)

        print("🐳 Starting development services with Docker Compose...")
        success, output = run_command(
            "docker-compose -f docker-compose.dev.yml up", cwd=project_root
        )

        if success:
            print("\n✅ Development services started!")
        else:
            print(f"\n❌ Failed to start services:\n{output}")
            sys.exit(1)

    else:
        print("❌ Invalid option selected")
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ An error occurred: {str(e)}")
        sys.exit(1)
