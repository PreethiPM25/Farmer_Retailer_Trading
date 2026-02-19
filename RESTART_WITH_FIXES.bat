@echo off
echo ========================================
echo RESTARTING AGRI-PULSE WITH FIXES
echo ========================================
echo.

echo Stopping any running instances...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend with Enhanced Logging...
cd backend
start "Agri-Pulse Backend" cmd /k "mvn spring-boot:run"

echo Waiting for backend to start (15 seconds)...
timeout /t 15 /nobreak

echo.
echo Starting Frontend...
cd ..\frontend
start "Agri-Pulse Frontend" cmd /k "npm start"

echo.
echo ========================================
echo APPLICATION STARTED!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo Admin Dashboard: http://localhost:3000/admin/dashboard
echo.
echo Admin Login:
echo   Email: pmpreethi25@gmail.com
echo   Password: Admin@123
echo.
echo FIXES APPLIED:
echo - Enhanced logging for registrations
echo - Detailed approval logs with temp password
echo - Email error handling
echo - Temp password shown in admin dashboard
echo.
echo TO TEST:
echo 1. Register a new farmer/retailer at http://localhost:3000
echo 2. Login to admin dashboard
echo 3. Approve the pending user
echo 4. Check the success message for temp password
echo 5. Check backend console for detailed logs
echo.
pause
