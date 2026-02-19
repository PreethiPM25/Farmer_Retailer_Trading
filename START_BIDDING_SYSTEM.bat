@echo off
echo ========================================
echo   AGRI-PULSE BIDDING SYSTEM STARTUP
echo ========================================
echo.

echo Starting Backend...
cd backend
start "Agri-Pulse Backend" cmd /k "mvn spring-boot:run"
echo Backend starting in new window...
echo.

timeout /t 5 /nobreak >nul

echo Starting Frontend...
cd ..\frontend
start "Agri-Pulse Frontend" cmd /k "npm start"
echo Frontend starting in new window...
echo.

echo ========================================
echo   SYSTEM STARTING...
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Wait for both windows to show "Started" messages
echo Then open http://localhost:3000 in your browser
echo.
echo Press any key to close this window...
pause >nul
