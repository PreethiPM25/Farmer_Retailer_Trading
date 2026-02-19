@echo off
echo ========================================
echo STARTING AGRI-PULSE
echo ========================================
echo.

echo Killing old processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM node.exe 2>nul

echo.
echo Starting Backend...
cd backend
start "Agri-Pulse Backend" cmd /k "mvn spring-boot:run"

echo.
echo Starting Frontend...
cd ..\frontend
start "Agri-Pulse Frontend" cmd /k "npm start"

echo.
echo ========================================
echo SERVERS STARTING!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo Admin Dashboard: http://localhost:3000/admin/dashboard
echo.
echo Login: pmpreethi25@gmail.com / Admin@123
echo.
echo Wait 20 seconds for servers to fully start...
echo.
pause
