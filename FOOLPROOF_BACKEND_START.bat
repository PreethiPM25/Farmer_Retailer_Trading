@echo off
title Agri-Pulse Backend Startup
color 0A

echo ========================================
echo    AGRI-PULSE BACKEND STARTUP
echo ========================================
echo.

echo [1/6] Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java not found! Please install Java 17 or higher.
    pause
    exit /b 1
)
echo ✅ Java found

echo.
echo [2/6] Navigating to backend directory...
cd /d "c:\agri-pulse\backend"
if %errorlevel% neq 0 (
    echo ❌ Backend directory not found!
    pause
    exit /b 1
)
echo ✅ In backend directory

echo.
echo [3/6] Killing any existing processes on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    echo Killing process %%a
    taskkill /PID %%a /F >nul 2>&1
)
echo ✅ Port 8080 cleared

echo.
echo [4/6] Cleaning previous build...
call mvn clean >nul 2>&1
echo ✅ Build cleaned

echo.
echo [5/6] Deleting old database files...
if exist "agripulse_db.mv.db" del "agripulse_db.mv.db"
if exist "agripulse_db.trace.db" del "agripulse_db.trace.db"
echo ✅ Database reset

echo.
echo [6/6] Starting Spring Boot application...
echo ⏳ This may take 30-60 seconds...
echo.
echo 🚀 Starting backend on http://localhost:8080
echo 📊 H2 Console: http://localhost:8080/h2-console
echo 🔗 API Base: http://localhost:8080/api
echo.
echo ⚠️  DO NOT CLOSE THIS WINDOW!
echo ⚠️  Backend must stay running for frontend to work!
echo.

call mvn spring-boot:run

echo.
echo ❌ Backend stopped or failed to start!
pause