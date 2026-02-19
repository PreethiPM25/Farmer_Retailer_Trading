@echo off
echo ========================================
echo   REBUILDING BACKEND WITH EMAIL FIX
echo ========================================
echo.

cd backend

echo Cleaning previous build...
call mvn clean

echo.
echo Building with new changes...
call mvn install -DskipTests

echo.
echo ========================================
echo   BUILD COMPLETE!
echo ========================================
echo.
echo Starting backend...
echo.

start "Agri-Pulse Backend" cmd /k "mvn spring-boot:run"

echo.
echo Backend is starting in new window...
echo Wait for "Tomcat started on port 8080"
echo.
echo Then test by placing a bid!
echo Email will be sent to: preeths.252005@gmail.com
echo.
pause
