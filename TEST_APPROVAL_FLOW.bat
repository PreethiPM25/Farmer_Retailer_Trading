@echo off
echo ========================================
echo TESTING APPROVAL FLOW
echo ========================================
echo.

echo Step 1: Checking if backend is running...
curl -s http://localhost:8080/api/admin/dashboard-stats >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Backend is not running!
    echo Please start backend first: cd backend ^&^& mvn spring-boot:run
    pause
    exit /b 1
)
echo SUCCESS: Backend is running!
echo.

echo Step 2: Checking pending users...
curl -s http://localhost:8080/api/admin/pending-users
echo.
echo.

echo Step 3: Registering a test farmer...
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"testfarmer%random%@test.com\",\"fullName\":\"Test Farmer\",\"phone\":\"9876543210\",\"address\":\"Test Farm\",\"role\":\"FARMER\",\"documentPath\":\"test.pdf\"}"
echo.
echo.

echo Step 4: Checking pending users again...
curl -s http://localhost:8080/api/admin/pending-users
echo.
echo.

echo ========================================
echo TEST COMPLETE
echo ========================================
echo.
echo Now:
echo 1. Open http://localhost:3000/admin/dashboard
echo 2. Login with: pmpreethi25@gmail.com / Admin@123
echo 3. You should see the pending user
echo 4. Click "Approve User" button
echo 5. Check console logs for temp password
echo.
pause
