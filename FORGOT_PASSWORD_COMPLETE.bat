@echo off
color 0A
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     FORGOT PASSWORD FLOW - RESTART SERVERS NOW!             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

taskkill /F /IM java.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak > nul

echo Starting Backend...
start "Backend" cmd /k "cd backend && mvn spring-boot:run"
timeout /t 20 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  FORGOT PASSWORD FLOW READY!                                 ║
echo ║  Wait 30 seconds then test:                                  ║
echo ║  1. Forgot Password → Enter email                            ║
echo ║  2. Admin approves in dashboard                              ║
echo ║  3. User enters token + new password                         ║
echo ║  4. Password reset successful!                               ║
echo ╚══════════════════════════════════════════════════════════════╝
pause
