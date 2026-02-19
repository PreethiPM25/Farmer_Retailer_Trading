@echo off
color 0A
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          FINAL FIX - RESTARTING EVERYTHING NOW!             ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [STEP 1] Killing all Java and Node processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak > nul

echo.
echo [STEP 2] Starting Backend...
start "Backend" cmd /k "cd backend && echo BACKEND STARTING... && mvn spring-boot:run"

echo.
echo Waiting 20 seconds for backend to fully start...
timeout /t 20 /nobreak > nul

echo.
echo [STEP 3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && echo FRONTEND STARTING... && npm start"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║                    SERVERS STARTING!                         ║
echo ║                                                              ║
echo ║  Wait 30 seconds then open: http://localhost:3000           ║
echo ║                                                              ║
echo ║  Test Registration:                                          ║
echo ║  1. Click "Register as Farmer"                               ║
echo ║  2. Fill all fields                                          ║
echo ║  3. Click Register                                           ║
echo ║  4. Should see SUCCESS!                                      ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
pause
