@echo off
title Agri-Pulse Frontend
color 0B

echo ========================================
echo    AGRI-PULSE FRONTEND STARTUP
echo ========================================
echo.

echo [1/3] Navigating to frontend directory...
cd /d "c:\agri-pulse\frontend"
echo ✅ In frontend directory

echo.
echo [2/3] Installing dependencies...
call npm install
echo ✅ Dependencies installed

echo.
echo [3/3] Starting React development server...
echo.
echo 🚀 Starting frontend on http://localhost:3000
echo 🔗 Make sure backend is running on http://localhost:8080
echo.
echo ⚠️  DO NOT CLOSE THIS WINDOW!
echo.

call npm start

pause