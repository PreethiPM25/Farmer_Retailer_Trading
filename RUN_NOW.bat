@echo off
echo Starting Backend...
cd backend
start "Backend Server" cmd /k "mvn spring-boot:run"

echo Starting Frontend...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"

echo Both servers starting!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
pause