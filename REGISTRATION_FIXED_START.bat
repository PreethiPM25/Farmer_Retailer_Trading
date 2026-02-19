@echo off
echo ========================================
echo REGISTRATION FIXED - STARTING NOW
echo ========================================
echo.

echo Killing all processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend...
cd backend
start "Backend" cmd /k "mvn spring-boot:run"

echo.
echo Waiting 20 seconds for backend...
timeout /t 20 /nobreak >nul

echo.
echo Starting Frontend...
cd ..\frontend
start "Frontend" cmd /k "npm start"

echo.
echo ========================================
echo SERVERS STARTED!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo TEST REGISTRATION:
echo 1. Go to: http://localhost:3000/register
echo 2. Fill all fields (document is optional)
echo 3. Click Register
echo 4. Should see success message!
echo.
echo ADMIN APPROVAL:
echo 1. Go to: http://localhost:3000/admin/dashboard
echo 2. Login: pmpreethi25@gmail.com / Admin@123
echo 3. Approve the user
echo.
pause
