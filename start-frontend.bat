@echo off
echo ========================================
echo Starting Agri-Pulse Frontend Server
echo ========================================
cd frontend
echo Installing dependencies...
call npm install
echo.
echo Starting React development server...
call npm start
pause
