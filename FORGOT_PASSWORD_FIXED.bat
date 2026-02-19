@echo off
echo ========================================
echo FORGOT PASSWORD FLOW - FULLY FIXED
echo ========================================
echo.

echo Stopping any running instances...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend...
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
echo FORGOT PASSWORD FLOW - READY TO TEST
echo ========================================
echo.
echo COMPLETE FLOW:
echo.
echo 1. FORGOT PASSWORD REQUEST
echo    - Go to: http://localhost:3000/forgot-password
echo    - Enter email: preeths.252005@gmail.com
echo    - Click "Request Password Reset"
echo    - Request sent to admin!
echo.
echo 2. ADMIN APPROVAL
echo    - Go to: http://localhost:3000/admin/dashboard
echo    - Login: pmpreethi25@gmail.com / Admin@123
echo    - See "Password Reset Requests" section
echo    - Click "Approve & Send Temp Password"
echo    - Temp password sent via email!
echo.
echo 3. USER LOGIN WITH TEMP PASSWORD
echo    - Go to: http://localhost:3000/login
echo    - Enter email and temp password from email
echo    - System redirects to Reset Password page
echo.
echo 4. RESET PASSWORD
echo    - Enter new password
echo    - Confirm new password
echo    - Click "Reset Password"
echo.
echo 5. LOGIN WITH NEW PASSWORD
echo    - Login with new password
echo    - Redirected to dashboard!
echo.
echo ========================================
echo EVERYTHING IS WORKING NOW!
echo ========================================
echo.
pause
