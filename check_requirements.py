#!/usr/bin/env python3
"""
System requirements checker for Face Recognition project
"""

import sys
import subprocess
import importlib.util

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} (OK)")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor}.{version.micro} (Requires 3.8+)")
        return False

def check_package(package_name, import_name=None):
    """Check if a package is installed"""
    if import_name is None:
        import_name = package_name
    
    try:
        spec = importlib.util.find_spec(import_name)
        if spec is not None:
            print(f"✓ {package_name}")
            return True
        else:
            print(f"✗ {package_name} (Not installed)")
            return False
    except ImportError:
        print(f"✗ {package_name} (Import error)")
        return False

def check_node_npm():
    """Check Node.js and npm installation"""
    try:
        # Check Node.js
        node_result = subprocess.run(['node', '--version'], 
                                   capture_output=True, text=True)
        if node_result.returncode == 0:
            print(f"✓ Node.js {node_result.stdout.strip()}")
            node_ok = True
        else:
            print("✗ Node.js (Not installed)")
            node_ok = False
        
        # Check npm
        npm_result = subprocess.run(['npm', '--version'], 
                                  capture_output=True, text=True)
        if npm_result.returncode == 0:
            print(f"✓ npm {npm_result.stdout.strip()}")
            npm_ok = True
        else:
            print("✗ npm (Not installed)")
            npm_ok = False
            
        return node_ok and npm_ok
        
    except FileNotFoundError:
        print("✗ Node.js/npm (Not found in PATH)")
        return False

def main():
    """Main requirements check"""
    print("Face Recognition System - Requirements Check")
    print("=" * 50)
    
    # Check Python
    print("\nPython Environment:")
    python_ok = check_python_version()
    
    # Check Python packages
    print("\nPython Packages:")
    packages = [
        ('fastapi', 'fastapi'),
        ('uvicorn', 'uvicorn'),
        ('opencv-python', 'cv2'),
        ('face-recognition', 'face_recognition'),
        ('numpy', 'numpy'),
        ('Pillow', 'PIL'),
        ('sqlalchemy', 'sqlalchemy'),
        ('pydantic', 'pydantic'),
    ]
    
    packages_ok = True
    for package_name, import_name in packages:
        if not check_package(package_name, import_name):
            packages_ok = False
    
    # Check Node.js environment
    print("\nNode.js Environment:")
    node_ok = check_node_npm()
    
    # Summary
    print("\n" + "=" * 50)
    print("SUMMARY:")
    
    if python_ok and packages_ok and node_ok:
        print("✓ All requirements met! You can run the application.")
        print("\nNext steps:")
        print("1. Start backend: cd backend && python start_server.py")
        print("2. Start frontend: cd frontend && npm run dev")
        print("3. Open http://localhost:3000 in your browser")
    else:
        print("✗ Some requirements are missing.")
        print("\nTo install missing components:")
        if not python_ok:
            print("- Install Python 3.8+ from https://python.org")
        if not packages_ok:
            print("- Install Python packages: pip install -r backend/requirements.txt")
        if not node_ok:
            print("- Install Node.js from https://nodejs.org")
            print("- Then run: cd frontend && npm install")

if __name__ == "__main__":
    main()
