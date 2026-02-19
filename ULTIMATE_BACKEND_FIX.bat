@echo off
title BACKEND FIX AND START
color 0A

echo ========================================
echo    FIXING AND STARTING BACKEND
echo ========================================

cd /d "c:\agri-pulse\backend"

echo [1] Cleaning project...
call mvn clean > nul 2>&1

echo [2] Compiling...
call mvn compile > nul 2>&1

echo [3] Starting backend...
echo ⏳ Please wait 30 seconds...
echo 🚀 Backend will start on http://localhost:8080
echo.

start /B mvn spring-boot:run

echo [4] Waiting for startup...
timeout /t 30 /nobreak > nul

echo [5] Testing connection...
curl -s http://localhost:8080/api/products > nul
if %errorlevel% == 0 (
    echo ✅ SUCCESS! Backend is running!
    echo 🎉 You can now add products and see flashcards!
) else (
    echo ❌ Backend not responding yet...
    echo ⏳ Try waiting a bit more or restart
)

echo.
echo 📝 Next steps:
echo 1. Start frontend: npm start (in frontend folder)
echo 2. Login as murali@farmer.com / Murali@123
echo 3. Add products and see flashcards!
echo.
pause