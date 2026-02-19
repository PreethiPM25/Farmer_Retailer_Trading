@echo off
echo ========================================
echo    TESTING BACKEND CONNECTION
echo ========================================

echo Testing if backend is running on port 8080...
curl -s http://localhost:8080/api/products > nul
if %errorlevel% == 0 (
    echo ✅ Backend is running!
    echo Testing product API...
    curl -X GET http://localhost:8080/api/products
) else (
    echo ❌ Backend is NOT running!
    echo Please start backend first with START_BACKEND_FIXED.bat
)

pause