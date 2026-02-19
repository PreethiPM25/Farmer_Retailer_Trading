@echo off
echo ========================================
echo FIXING ADMIN DASHBOARD LOADING ISSUE
echo ========================================
echo.

echo Killing all Java and Node processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul

echo.
echo Starting Backend FIRST...
cd backend
start "Backend" cmd /k "mvn spring-boot:run"

echo.
echo Waiting 20 seconds for backend to fully start...
timeout /t 20 /nobreak

echo.
echo Testing backend...
curl http://localhost:8080/api/admin/dashboard-stats

echo.
echo.
echo Starting Frontend...
cd ..\frontend
start "Frontend" cmd /k "npm start"

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo Admin: http://localhost:3000/admin/dashboard
echo.
echo Login: pmpreethi25@gmail.com / Admin@123
echo.
pause
