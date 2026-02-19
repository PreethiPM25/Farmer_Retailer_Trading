@echo off
echo ========================================
echo    Starting Agri-Pulse Application
echo ========================================
echo.

echo [1/2] Starting Backend Server...
echo.
start cmd /k "cd backend && echo Starting Backend... && mvn spring-boot:run"

echo Waiting 10 seconds for backend to initialize...
timeout /t 10 /nobreak > nul

echo.
echo [2/2] Starting Frontend Server...
echo.
start cmd /k "cd frontend && echo Starting Frontend... && npm start"

echo.
echo ========================================
echo    Servers Starting!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Wait for both servers to fully start...
echo Then open: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
