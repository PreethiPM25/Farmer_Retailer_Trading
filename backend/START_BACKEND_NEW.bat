@echo off
REM Start Agri-Pulse Backend
cd /d C:\agri-pulse\backend
echo ========================================
echo Starting Agri-Pulse Backend Server...
echo ========================================
java -jar target/agri-pulse-backend-1.0.0.jar
pause
