@echo off
echo ========================================
echo Starting Agri-Pulse Backend Server
echo ========================================
cd backend
echo Building project...
call mvn clean install
echo.
echo Starting Spring Boot application...
call mvn spring-boot:run
pause
