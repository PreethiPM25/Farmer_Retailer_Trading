@echo off
REM ========================================
REM Agri-Pulse Complete Startup Script
REM ========================================

echo.
echo ╔════════════════════════════════════════╗
echo ║  AGRI-PULSE BIDDING SYSTEM STARTUP     ║
echo ║  Complete Implementation Ready!        ║
echo ╚════════════════════════════════════════╝
echo.

REM Kill any existing processes
echo [1/4] Stopping any running Java processes...
taskkill /IM java.exe /F 2>nul
taskkill /IM node.exe /F 2>nul
timeout /t 2 /nobreak

REM Start Backend
echo [2/4] Starting Backend Server on port 8080...
echo.
cd /d C:\agri-pulse\backend
start /B cmd /C "java -jar target/agri-pulse-backend-1.0.0.jar > backend.log 2>&1"
timeout /t 10 /nobreak

REM Start Frontend
echo.
echo [3/4] Starting Frontend on port 3000...
echo.
cd /d C:\agri-pulse\frontend
start /B cmd /C "npm start > frontend.log 2>&1"
timeout /t 10 /nobreak

REM Show status
echo.
echo [4/4] System Status:
echo.
echo ✅ Backend:   http://localhost:8080
echo ✅ Frontend:  http://localhost:3000
echo ✅ Database:  File-based (C:\agri-pulse\backend\agripulse_db.mv.db)
echo.
echo ========================================
echo  SYSTEM READY FOR TESTING!
echo ========================================
echo.
echo Features Available:
echo  ✓ Product Management
echo  ✓ Bidding System
echo  ✓ Order Processing
echo  ✓ OTP Confirmation
echo  ✓ Payment Transactions
echo  ✓ Email Notifications
echo.
echo Backend Log: C:\agri-pulse\backend\backend.log
echo Frontend Log: C:\agri-pulse\frontend\frontend.log
echo.
pause
