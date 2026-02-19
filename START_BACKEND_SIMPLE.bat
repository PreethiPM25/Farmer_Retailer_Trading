@echo off
REM =========================================
REM  AgriPulse Backend Startup Script
REM =========================================

title AgriPulse Backend - Running on http://localhost:8080

echo.
echo =========================================
echo   AgriPulse Backend Startup
echo =========================================
echo.

REM Change to backend directory
cd /d C:\agri-pulse\backend

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    echo.
    pause
    exit /b 1
)

REM Build if JAR doesn't exist
if not exist "target\agri-pulse-backend-1.0.0.jar" (
    color 0E
    echo Building backend (first time)...
    call mvn clean package -DskipTests
    if %errorlevel% neq 0 (
        color 0C
        echo Build failed!
        pause
        exit /b 1
    )
)

REM Clear any previous port binding
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080"') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Start the backend
color 0A
echo =========================================
echo   STARTING BACKEND...
echo =========================================
echo.
echo Port: 8080
echo Database: agripulse_db.mv.db
echo.
echo ⏳ Starting... (please wait 15-20 seconds)
echo.

java -jar target\agri-pulse-backend-1.0.0.jar

REM If we get here, the process exited
echo.
color 0C
echo Backend stopped
pause
