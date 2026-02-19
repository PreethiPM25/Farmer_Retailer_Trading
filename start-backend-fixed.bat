@echo off
echo Starting Agri-Pulse Backend...
echo.

cd /d "C:\agri-pulse\backend"

echo Checking if port 8080 is in use...
netstat -ano | findstr :8080 > nul
if %errorlevel% == 0 (
    echo Port 8080 is in use. Killing existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        taskkill /PID %%a /F > nul 2>&1
    )
    timeout /t 2 > nul
)

echo Starting Spring Boot application...
mvn spring-boot:run

pause