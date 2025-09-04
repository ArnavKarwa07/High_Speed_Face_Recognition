@echo off
echo Starting Face Recognition Backend Server...
echo.
echo Make sure you have installed the requirements:
echo pip install -r requirements.txt
echo.
cd /d "%~dp0"
python start_server.py
pause
