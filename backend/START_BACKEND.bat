@echo off
echo ========================================
echo Starting AgriPulse Backend
echo ========================================

REM Change to backend directory
cd /d C:\agri-pulse\backend

REM Check if JAR file exists
if not exist target\agri-pulse-backend-1.0.0.jar (
    echo Building backend...
    call mvn clean package -DskipTests
)

REM Run the JAR file
echo.
echo Backend starting on port 8080...
echo Database will be stored in: C:\agri-pulse\backend\agripulse_db.*
echo.

java -jar target\agri-pulse-backend-1.0.0.jar

pause
