@echo off
echo ========================================
echo    RESTARTING AGRI-PULSE APPLICATION
echo ========================================
echo.
echo This will restart both backend and frontend
echo.
echo Step 1: Killing existing processes...
echo.

REM Kill existing Java processes (backend)
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak > nul

REM Kill existing Node processes (frontend)
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo Step 2: Starting Backend...
echo.
start "Agri-Pulse Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak > nul

echo.
echo Step 3: Starting Frontend...
echo.
start "Agri-Pulse Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo    SERVERS RESTARTING!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Wait 30 seconds, then open: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
